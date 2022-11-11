import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ReportsModule } from './reports/reports.module'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, UsersModule, ReportsModule]
})
export class AppModule {}
