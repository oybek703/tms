import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { OracleModule } from '../oracle/oracle.module'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './jwt.strategy'
import { UsersModule } from '../users/users.module'

@Module({
  imports: [OracleModule, UsersModule, JwtModule.register({})],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
