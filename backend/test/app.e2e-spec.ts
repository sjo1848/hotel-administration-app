import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, RequestMethod } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import cookieParser from 'cookie-parser';

describe('Hotel API (e2e)', () => {
  jest.setTimeout(20000);
  let app: INestApplication<App>;
  let adminToken = '';
  let staffToken = '';
  let createdRoomId = '';
  const createdRoomIds: string[] = [];
  let prisma: PrismaService;
  const metricsToken = 'test_metrics_token';

  beforeAll(async () => {
    process.env.METRICS_TOKEN = metricsToken;
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.setGlobalPrefix('api/v1', {
      exclude: [{ path: 'metrics', method: RequestMethod.GET }],
    });
    await app.init();
    prisma = app.get(PrismaService);

    const adminLogin = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'admin@paloalto.com', password: 'admin_password_123' });
    adminToken = adminLogin.body.accessToken;

    const staffLogin = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'staff@paloalto.com', password: 'staff_password_123' });
    staffToken = staffLogin.body.accessToken;
  });

  afterAll(async () => {
    if (createdRoomIds.length > 0) {
      await prisma.stay.deleteMany({
        where: { roomId: { in: createdRoomIds } },
      });
      await prisma.room.deleteMany({
        where: { id: { in: createdRoomIds } },
      });
    }
    await app.close();
  });

  it('rejects rooms without auth', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/rooms')
      .expect(401);
  });

  it('allows admin to create room', async () => {
    const roomNumber = `E2E-${Date.now()}`;
    const response = await request(app.getHttpServer())
      .post('/api/v1/rooms')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        number: roomNumber,
        type: 'Simple',
        price: 80,
        status: 'AVAILABLE',
      })
      .expect(201);

    createdRoomId = response.body.id;
    createdRoomIds.push(createdRoomId);
    expect(response.body.number).toBe(roomNumber);
  });

  it('prevents staff from creating room', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/rooms')
      .set('Authorization', `Bearer ${staffToken}`)
      .send({
        number: `E2E-${Date.now()}`,
        type: 'Simple',
        price: 80,
        status: 'AVAILABLE',
      })
      .expect(403);
  });

  it('check-in and check-out flow works', async () => {
    await request(app.getHttpServer())
      .post(`/api/v1/rooms/${createdRoomId}/check-in`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ guestName: 'E2E Guest' })
      .expect(201);

    await request(app.getHttpServer())
      .post(`/api/v1/rooms/${createdRoomId}/check-out`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
  });

  it('blocks deleting a room with stays', async () => {
    const roomNumber = `E2E-DEL-${Date.now()}`;
    const createResponse = await request(app.getHttpServer())
      .post('/api/v1/rooms')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        number: roomNumber,
        type: 'Simple',
        price: 90,
        status: 'AVAILABLE',
      })
      .expect(201);

    const roomId = createResponse.body.id;
    createdRoomIds.push(roomId);

    await request(app.getHttpServer())
      .post(`/api/v1/rooms/${roomId}/check-in`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ guestName: 'Delete Guard' })
      .expect(201);

    const deleteResponse = await request(app.getHttpServer())
      .delete(`/api/v1/rooms/${roomId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(400);

    expect(deleteResponse.body.message).toContain('estadías asociadas');
  });

  it('protects metrics endpoint with token', async () => {
    await request(app.getHttpServer())
      .get('/metrics')
      .expect(403);

    const response = await request(app.getHttpServer())
      .get('/metrics')
      .set('Authorization', `Bearer ${metricsToken}`)
      .expect(200);

    expect(response.text).toContain('http_requests_total');
  });

  it('refreshes access token using HttpOnly cookie', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'admin@paloalto.com', password: 'admin_password_123' })
      .expect(201);

    const cookies = loginResponse.headers['set-cookie'];
    expect(cookies).toBeDefined();

    const refreshResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/refresh')
      .set('Cookie', cookies)
      .expect(201);

    expect(refreshResponse.body.accessToken).toBeDefined();
  });
});
