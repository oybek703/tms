import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ReportsModule } from './reports/reports.module'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { OracleModule } from './oracle/oracle.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    OracleModule,
    AuthModule,
    UsersModule,
    ReportsModule
  ]
})
export class AppModule {}
