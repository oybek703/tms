import { Module } from '@nestjs/common'
import { OracleModule } from '../oracle/oracle.module'
import { ReportsController } from './reports.controller'
import { ReportsService } from './reports.service'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [OracleModule, HttpModule],
  controllers: [ReportsController],
  providers: [ReportsService]
})
export class ReportsModule {}
