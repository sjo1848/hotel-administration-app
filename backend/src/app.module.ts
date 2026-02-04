import { Module } from '@nestjs/common'
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PrismaModule } from './prisma/prisma.module'
import { RoomsModule } from './rooms/rooms.module'
import { StaysModule } from './stays/stays.module'
import { ReservationsModule } from './reservations/reservations.module'
import { AuthModule } from './auth/auth.module'
import { MetricsModule } from './metrics/metrics.module'
import { MetricsInterceptor } from './common/interceptors/metrics.interceptor'

@Module({
  imports: [
    MetricsModule,
    PrismaModule,
    RoomsModule,
    StaysModule,
    ReservationsModule,
    AuthModule,
    ThrottlerModule.forRoot([
      {
        ttl: Number(process.env.THROTTLE_TTL ?? 60_000),
        limit: Number(process.env.THROTTLE_LIMIT ?? 120),
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: MetricsInterceptor,
    },
  ],
})
export class AppModule { }
