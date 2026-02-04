import { Test, TestingModule } from '@nestjs/testing';
import { RoomsService } from './rooms.service';
import { PrismaService } from '../prisma/prisma.service';
import { StaysService } from '../stays/stays.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { RoomStatus } from '@prisma/client';

const mockPrismaService = {
    room: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
        update: jest.fn(),
    },
    stay: {
        count: jest.fn(),
    },
};

const mockStaysService = {
    checkIn: jest.fn(),
    checkOut: jest.fn(),
};

describe('RoomsService', () => {
    let service: RoomsService;
    let prisma: typeof mockPrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RoomsService,
                { provide: PrismaService, useValue: mockPrismaService },
                { provide: StaysService, useValue: mockStaysService },
            ],
        }).compile();

        service = module.get<RoomsService>(RoomsService);
        prisma = module.get(PrismaService);

        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return an array of rooms', async () => {
            const result = [{ id: '1', number: 101 }];
            prisma.room.findMany.mockResolvedValue(result);

            expect(await service.findAll()).toBe(result);
            expect(prisma.room.findMany).toHaveBeenCalledWith({ orderBy: { number: 'asc' } });
        });
    });

    describe('findOne', () => {
        it('should return a room if found', async () => {
            const room = { id: '1', number: 101 };
            prisma.room.findUnique.mockResolvedValue(room);

            expect(await service.findOne('1')).toBe(room);
        });

        it('should throw NotFoundException if room not found', async () => {
            prisma.room.findUnique.mockResolvedValue(null);

            await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
        });
    });

    describe('create', () => {
        it('should create a room if number does not exist', async () => {
            const dto = { number: 102, type: 'SINGLE', price: 100 };
            prisma.room.findUnique.mockResolvedValue(null);
            prisma.room.create.mockResolvedValue({ id: '2', ...dto, status: RoomStatus.AVAILABLE });

            const result = await service.create(dto as any);

            expect(result).toHaveProperty('id', '2');
            expect(prisma.room.create).toHaveBeenCalled();
        });

        it('should throw BadRequestException if room number exists', async () => {
            const dto = { number: 101, type: 'SINGLE', price: 100 };
            prisma.room.findUnique.mockResolvedValue({ id: '1', number: 101 });

            await expect(service.create(dto as any)).rejects.toThrow(BadRequestException);
        });
    });

    describe('updateStatus', () => {
        it('should update status if transition is allowed (AVAILABLE -> OCCUPIED)', async () => {
            const room = { id: '1', status: RoomStatus.AVAILABLE };
            prisma.room.findUnique.mockResolvedValue(room);
            prisma.room.update.mockResolvedValue({ ...room, status: RoomStatus.OCCUPIED });

            const result = await service.updateStatus('1', RoomStatus.OCCUPIED);
            expect(result.status).toBe(RoomStatus.OCCUPIED);
        });

        it('should throw BadRequestException for invalid transition (AVAILABLE -> DIRTY)', async () => {
            const room = { id: '1', status: RoomStatus.AVAILABLE };
            prisma.room.findUnique.mockResolvedValue(room);

            await expect(service.updateStatus('1', RoomStatus.DIRTY)).rejects.toThrow(BadRequestException);
        });
    });
});
