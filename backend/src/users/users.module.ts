import { Module } from '@nestjs/common'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { OracleModule } from '../oracle/oracle.module'

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [OracleModule],
  exports: [UsersService]
})
export class UsersModule {}
