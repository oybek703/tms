import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ReportsModule } from './reports/reports.module'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { OracleModule } from './oracle/oracle.module'
import { ThrottlerModule } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core'
import { RateThrottlerGuard } from './guards/rate-limiter.guard'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10
    }),
    OracleModule,
    AuthModule,
    UsersModule,
    ReportsModule
  ],
  providers: [{ provide: APP_GUARD, useClass: RateThrottlerGuard }]
})
export class AppModule {}
