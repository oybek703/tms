import { BadRequestException, Body, Controller, Post, Put, Query } from '@nestjs/common'
import { ReportsService } from './reports.service'
import { UpdateGapDto } from './dto/update-gap.dto'
import {
  Report,
  ReportBetweenDates,
  ReportGapManual,
  ReportLastUpdate,
  ReportOperDays,
  ReportWithoutDate
} from './reports.decorator'
import { ReportsPaths } from './reports-paths'

@Controller()
export class ReportsController {
  dateBadRequestException = new BadRequestException('Date is not provided in query params!')
  constructor(private readonly reportsService: ReportsService) {}

  @ReportLastUpdate('Dashboard', ReportsPaths.dashboardLastUpdate)
  async dashboardLastUpdate() {
    return await this.reportsService.dashboardLastUpdate()
  }

  @Report('Dashboard', ReportsPaths.dashboard, true)
  async dashboard(@Query('date') date: Date) {
    if (!date) throw this.dateBadRequestException
    return await this.reportsService.dashboard(date)
  }

  @Report('Dashboard', ReportsPaths.fcrb, true)
  async fcrb(@Query('date') date: Date) {
    if (!date) throw this.dateBadRequestException
    return await this.reportsService.fcrb(date)
  }

  @Report('Dashboard', ReportsPaths.creditData, true)
  async creditData(@Query('date') date: Date) {
    if (!date) throw this.dateBadRequestException
    return await this.reportsService.creditData(date)
  }

  @ReportBetweenDates('Dashboard', ReportsPaths.dashboardMonthly, true)
  async dashboardMonthly(@Query() query: { firstDate: Date; secondDate: Date }) {
    if (!query.firstDate || !query.secondDate)
      throw new BadRequestException('Two dates are required!')
    return await this.reportsService.dashboardMonthly(query.firstDate, query.secondDate)
  }

  @Report('Key indicators', ReportsPaths.mainIndicators)
  async mainIndicators(@Query('date') date: Date) {
    if (!date) throw this.dateBadRequestException
    return await this.reportsService.mainIndicators(date)
  }

  @Report('Key indicators', ReportsPaths.capital)
  async capital(@Query('date') date: Date) {
    if (!date) throw this.dateBadRequestException
    return await this.reportsService.capital(date)
  }

  @Report('Key indicators', ReportsPaths.profitAndLost)
  async profitAndLost(@Query('date') date: Date) {
    if (!date) throw this.dateBadRequestException
    return await this.reportsService.profitAndLost(date)
  }

  @Report('Bank liquidity', ReportsPaths.liquidity)
  async liquidity(@Query('date') date: Date) {
    if (!date) throw this.dateBadRequestException
    return await this.reportsService.liquidity(date)
  }

  @ReportWithoutDate('Bank liquidity', ReportsPaths.liquidityCurrentState, true)
  async liquidityCurrent() {
    return await this.reportsService.liquidityCurrent()
  }

  @Report('Bank liquidity', ReportsPaths.correspondent)
  async correspondent(@Query('date') date: Date) {
    if (!date) throw this.dateBadRequestException
    return await this.reportsService.correspondent(date)
  }

  @ReportWithoutDate('Bank liquidity', ReportsPaths.correspondentCurrentState, true)
  async correspondentCurrent() {
    return await this.reportsService.correspondentCurrent()
  }

  @Report('Bank liquidity', ReportsPaths.calcFor, true)
  async calcFor(@Query('date') date: Date) {
    if (!date) throw this.dateBadRequestException
    return await this.reportsService.calcFor(date)
  }

  @Report('Bank liquidity', ReportsPaths.currencyPosition)
  async currencyPosition(@Query('date') date: Date) {
    if (!date) throw this.dateBadRequestException
    return await this.reportsService.currencyPosition(date)
  }

  @ReportBetweenDates('Bank liquidity', ReportsPaths.nostroMatrix)
  async nostroMatrix(@Query() query: { firstDate: Date; secondDate: Date }) {
    if (!query.firstDate || !query.secondDate)
      throw new BadRequestException('Two dates are required!')
    return await this.reportsService.nostroMatrix(query.firstDate, query.secondDate)
  }

  @Report('Bank liquidity', ReportsPaths.vlaBuffer)
  async vlaBuffer(@Query('date') date: Date) {
    if (!date) throw this.dateBadRequestException
    return await this.reportsService.vlaBuffer(date)
  }

  @Report('Actives, passives', ReportsPaths.placedAttracted, true)
  async placedAttracted(@Query('date') date: Date) {
    if (!date) throw this.dateBadRequestException
    return await this.reportsService.placedAttracted(date)
  }

  @Report('Actives, passives', ReportsPaths.interbankDeposits)
  async interbankDeposits(@Query('date') date: Date) {
    if (!date) throw this.dateBadRequestException
    return await this.reportsService.interbankDeposits(date)
  }

  @Report('Actives, passives', ReportsPaths.topDeposits)
  async topDeposits(@Query('date') date: Date) {
    if (!date) throw this.dateBadRequestException
    return await this.reportsService.topDeposits(date)
  }

  @Report('Actives, passives', ReportsPaths.timeDepoClients)
  async timeDepoClients(@Query('date') date: Date) {
    if (!date) throw this.dateBadRequestException
    return await this.reportsService.timeDepoClients(date)
  }

  @Report('Actives, passives', ReportsPaths.timeDeposits)
  async timeDeposits(@Query('date') date: Date) {
    if (!date) throw this.dateBadRequestException
    return await this.reportsService.timeDeposits(date)
  }

  @Report('Actives, passives', ReportsPaths.depositsByDeadline)
  async depositsByDeadline(@Query('date') date: Date) {
    if (!date) throw this.dateBadRequestException
    return await this.reportsService.depositsByDeadline(date)
  }

  @Report('Actives, passives', ReportsPaths.reportLiabilities)
  async reportLiabilities(@Query('date') date: Date) {
    if (!date) throw this.dateBadRequestException
    return await this.reportsService.reportLiabilities(date)
  }

  @Report('Actives, passives', ReportsPaths.filialEffectiveness)
  async filialEffectiveness(@Query('date') date: Date) {
    if (!date) throw this.dateBadRequestException
    return await this.reportsService.filialEffectiveness(date)
  }

  @Report('Actives, passives', ReportsPaths.gm)
  async gm(@Query('date') date: Date) {
    if (!date) throw this.dateBadRequestException
    return await this.reportsService.gm(date)
  }

  @ReportWithoutDate('Gap analyze', ReportsPaths.gap)
  async gap() {
    return await this.reportsService.gap()
  }

  @ReportWithoutDate('Gap analyze', ReportsPaths.gapManual)
  async gapManual(@Query('forEditing') forEditing: boolean) {
    if (forEditing === undefined) throw new BadRequestException('forEditing param is required!')
    return await this.reportsService.gapManual(forEditing)
  }

  @ReportGapManual(202)
  @Post('gapManual')
  async updateGapManual(@Body() dto: UpdateGapDto) {
    return await this.reportsService.updateGapManual(dto)
  }

  @ReportGapManual(200)
  @Put('gapManual')
  async saveGapManualChanges() {
    return await this.reportsService.saveGapManualChanges()
  }

  @ReportLastUpdate('Gap analyze', ReportsPaths.gapLastUpdate)
  async gapLastUpdate() {
    return await this.reportsService.gapLastUpdate()
  }

  @ReportOperDays()
  async operDays() {
    return await this.reportsService.operDays()
  }
}
