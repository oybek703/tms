import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Post,
  Put,
  Query,
  Req
} from '@nestjs/common'
import { ReportsService } from './reports.service'
import { UpdateGapDto } from './dto/update-gap.dto'
import {
  Report,
  ReportBetweenDates,
  ReportLastUpdate,
  ReportOperDays,
  ReportUpdate,
  ReportWithoutDate
} from './reports.decorator'
import { ICbnUpdateBody, IReportTwoDates, ReportsPaths } from './reports.interfaces'
import { UpdateCAADto } from './dto/update-caa.dto'
import { Request } from 'express'
import { User } from '../auth/auth.interface'
import { AdminUserGuard } from '../users/users.decorator'

@Controller()
export class ReportsController {
  dateBadRequestException = new BadRequestException('Date is not provided in query params!')
  constructor(private readonly reportsService: ReportsService) {}

  @ReportLastUpdate('dashboard', ReportsPaths.dashboardLastUpdate)
  async dashboardLastUpdate() {
    return await this.reportsService.dashboardLastUpdate()
  }

  @ReportOperDays()
  async operDays() {
    return await this.reportsService.operDays()
  }

  @Report('dashboard', ReportsPaths.dashboard, true)
  async dashboard(@Query('date') date: Date) {
    if (!date) throw this.dateBadRequestException
    return await this.reportsService.dashboard(date)
  }

  @Report('dashboard', ReportsPaths.creditData, true)
  async creditData(@Query('date') date: Date) {
    if (!date) throw this.dateBadRequestException
    return await this.reportsService.creditData(date)
  }

  @ReportBetweenDates('dashboard', ReportsPaths.dashboardMonthly, true)
  async dashboardMonthly(@Query() query: IReportTwoDates) {
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

  @Report('Key indicators', ReportsPaths.incomeAnalysis)
  async incomeAnalysis(@Query('date') date: Date) {
    if (!date) throw this.dateBadRequestException
    return await this.reportsService.incomeAnalysis(date)
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

  @AdminUserGuard()
  @Put(ReportsPaths.calcForUpdateCbn)
  async calcForUpdateCbn(@Body() body: ICbnUpdateBody) {
    return await this.reportsService.calcForUpdateCbn(body)
  }

  @Report('Bank liquidity', ReportsPaths.currencyPosition)
  async currencyPosition(@Query('date') date: Date) {
    if (!date) throw this.dateBadRequestException
    return await this.reportsService.currencyPosition(date)
  }

  @ReportBetweenDates('Bank liquidity', ReportsPaths.nostroMatrix)
  async nostroMatrix(@Query() query: IReportTwoDates) {
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

  @Report('Actives, passives', ReportsPaths.competitiveAnalysis)
  async competitiveAnalysis(@Query('date') date: Date) {
    if (!date) throw this.dateBadRequestException
    return await this.reportsService.competitiveAnalysis(date)
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

  @ReportUpdate('Gap analyze', HttpStatus.OK)
  @Post('gapManual')
  async updateGapManual(@Body() dto: UpdateGapDto) {
    return await this.reportsService.updateGapManual(dto)
  }

  @ReportUpdate('Gap analyze', HttpStatus.OK)
  @Put('gapManual')
  async saveGapManualChanges() {
    return await this.reportsService.saveGapManualChanges()
  }

  @ReportLastUpdate('Gap analyze', ReportsPaths.gapLastUpdate)
  async gapLastUpdate() {
    return await this.reportsService.gapLastUpdate()
  }

  @ReportWithoutDate('Dealing operations', ReportsPaths.corrAccountsAnalyze)
  async corrAccountsAnalyze() {
    return await this.reportsService.corrAccountsAnalyze()
  }

  @ReportWithoutDate('Dealing operations', ReportsPaths.caaManual)
  async corrAccountsAnalyzeManual() {
    const corrAccountsAnalyze = await this.reportsService.corrAccountsAnalyze()
    const caaUpdateHistory = await this.reportsService.caaUpdateHistory()
    return { corrAccountsAnalyze, caaUpdateHistory }
  }

  @ReportUpdate('Dealing operations', HttpStatus.ACCEPTED)
  @Put(ReportsPaths.caaManual)
  async updateCorrAccountsAnalyze(@Body() dto: UpdateCAADto, @Req() req: Request) {
    const user: User = req.user as User
    return await this.reportsService.updateCorrAccountsAnalyze(dto, user.id)
  }

  @ReportBetweenDates('Dealing operations', ReportsPaths.corrOperations)
  async corrOperations(
    @Query() query: IReportTwoDates & { currencyCode: string; clientCode?: string | undefined }
  ) {
    if (!query.firstDate || !query.secondDate)
      throw new BadRequestException('Two dates are required!')
    return await this.reportsService.corrOperations(query)
  }

  @ReportBetweenDates('Dealing operations', ReportsPaths.filialCp)
  async filialCp(@Query() query: IReportTwoDates & { currencyCode: string }) {
    if (!query.firstDate || !query.secondDate)
      throw new BadRequestException('Two dates are required!')
    return await this.reportsService.filialCp(query)
  }
}
