import { Injectable } from '@nestjs/common'
import { OracleService } from '../oracle/oracle.service'
import getLiquidityData, { getLiquidityCurrentData } from '../core/bank-liquidity/liquidity'
import getMainIndicatorsData from '../core/key-indicators/main-indicators'
import getCapitalData from '../core/key-indicators/capital'
import getProfitAndLostData from '../core/key-indicators/profit-lost'
import getCorrespondentData, {
  getCorrespondentCurrentData
} from '../core/bank-liquidity/correspondent'
import { ILastUpdate } from '../core/core.interface'
import getCalcFor from '../core/bank-liquidity/calc-for'
import getCurrencyPositionData from '../core/bank-liquidity/currency-position'
import { getVlaBufferData } from '../core/bank-liquidity/vla-buffer'
import getPlacedAttractedData from '../core/actives-and-passives/placed-attracted'
import { getInterbankDepositsData } from '../core/actives-and-passives/interbank-deposits'
import getTopDepositsData from '../core/actives-and-passives/top-deposits'
import getTimeDepoClientsData from '../core/actives-and-passives/time-depo-clients'
import getTimeDepositsData from '../core/actives-and-passives/time-deposits'
import getDepositsByDeadlineData from '../core/actives-and-passives/deposits-by-deadline'
import getReportLiabilitiesData, {
  getReportLiabilities216Data
} from '../core/actives-and-passives/report-liabilities'
import getFilialEffectivenessData from '../core/actives-and-passives/filial-effectiveness'
import getGmData from '../core/actives-and-passives/gm'
import getGapData, { getGapManualData } from '../core/gap'
import { GapColNames, UpdateGapDto } from './dto/update-gap.dto'
import getDashboardData, { getCreditData, getDashboardMonthlyData } from '../core/dashboard'
import { ConfigService } from '@nestjs/config'
import { HttpService } from '@nestjs/axios'
import getCompetitiveAnalysisData from '../core/actives-and-passives/competitive-analysis'
import getCorrAccountsAnalyzeData from '../core/dealing-operations/corr-accounts-anaylze'
import { CAAColNames, UpdateCAADto } from './dto/update-caa.dto'
import {
  CAAChangeHistory,
  CAAColLabelNames,
  ICbnUpdateBody,
  ICorrOperationsOptions
} from './reports.interfaces'
import { getCorrOperationsData } from '../core/dealing-operations/corr-operations'
import { getFilialCpData } from '../core/dealing-operations/filial-cp'
import getIncomeAnalysisData from '../core/key-indicators/income-analysis'
import { getVlaAndForData } from '../core/bank-liquidity/vla-and-for'
import { IFlowsRow } from '../core/bank-liquidity/vla-and-for/vla-and-for.interface'

@Injectable()
export class ReportsService {
  constructor(
    private readonly oracleService: OracleService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {}

  async operDays() {
    const res = await this.oracleService.executeQueryInStream<{
      operDay: Date
    }>(`SELECT TO_CHAR(OPER_DAY, 'YYYY-MM-DD') AS "operDay"
        FROM IBS.DAY_OPERATIONAL@IABS
        WHERE OPER_DAY >= DATE '2006-01-01'
        ORDER BY OPER_DAY DESC`)
    const dates = res.map(({ operDay }) => operDay)
    return { dates }
  }

  async dashboardLastUpdate() {
    const { lastUpdate } = await this.oracleService
      .executeQuery<ILastUpdate>(`SELECT TO_CHAR(LOG_DATE, 'fmDD-month, HH24:fmMI:SS',
                                                                                              'NLS_DATE_LANGUAGE = RUSSIAN') AS "lastUpdate"
                                                                               FROM (SELECT LOG_DATE
                                                                                     FROM USER_SCHEDULER_JOB_LOG
                                                                                     WHERE JOB_NAME = 'DASHBOARD_JOB'
                                                                                     ORDER BY LOG_DATE DESC)
                                                                               WHERE ROWNUM = 1`)
    return { lastUpdate }
  }

  async gapLastUpdate() {
    const { lastUpdate } = await this.oracleService
      .executeQuery<ILastUpdate>(`SELECT TO_CHAR(MAX(LAST_START_DATE), 'fmDD-month, HH24:fmMI:SS',
                                                                                              'NLS_DATE_LANGUAGE = RUSSIAN')
                                                                                          AS "lastUpdate"
                                                                               FROM USER_SCHEDULER_JOBS
                                                                               WHERE JOB_NAME = UPPER('GAP_Analysis')`)
    return { lastUpdate }
  }

  async incomeAnalysis(date: Date) {
    return await getIncomeAnalysisData(date, this.oracleService)
  }

  async mainIndicators(date: Date) {
    return await getMainIndicatorsData(date, this.oracleService)
  }

  async capital(date: Date) {
    return await getCapitalData(date, this.oracleService)
  }

  async profitAndLost(date: Date) {
    return await getProfitAndLostData(date, this.oracleService)
  }

  async liquidity(date: Date) {
    return await getLiquidityData(date, this.oracleService)
  }

  async liquidityCurrent() {
    return await getLiquidityCurrentData(this.oracleService)
  }

  async correspondent(date: Date) {
    return await getCorrespondentData(date, this.oracleService)
  }

  async correspondentCurrent() {
    return await getCorrespondentCurrentData(this.oracleService)
  }

  async calcFor(date: Date) {
    return await getCalcFor(date, this.oracleService)
  }

  async calcForUpdateCbn(body: ICbnUpdateBody) {
    const { toDate, fromDate, cbNorm } = body
    const existingDataQuery = `SELECT *
                               FROM FOR_STANDARD
                               WHERE FROM_DATE = DATE '${fromDate}'
                                 AND END_DATE = DATE '${toDate}'`
    const existingData = await this.oracleService.executeQuery(existingDataQuery)
    if (existingData) {
      await this.oracleService.executeQuery(
        `UPDATE FOR_STANDARD
         SET CB_STANDARD='${cbNorm}'
         WHERE FROM_DATE = DATE '${fromDate}'
           AND END_DATE = DATE '${toDate}'`
      )
      return { success: true, message: 'Existing normative successfully updated.' }
    }
    await this.oracleService.executeQuery(
      `INSERT INTO FOR_STANDARD(CB_STANDARD, FROM_DATE, END_DATE)
       VALUES ('${cbNorm}', DATE '${fromDate}', DATE '${toDate}')`
    )
    return { success: true, message: 'Central bank normative added successfully.' }
  }

  async currencyPosition(date: Date) {
    return await getCurrencyPositionData(date, this.oracleService)
  }

  async vlaBuffer(date: Date) {
    return await getVlaBufferData(date, this.oracleService)
  }

  async vlaAndFor(date: Date) {
    return await getVlaAndForData(date, this.oracleService)
  }

  async updateVlaAndFor(body: IFlowsRow) {
    const { uzs, eur, rub, usd, indicatorId, indicatorType } = body
    const updateQuery = `
        UPDATE LIQUIDITY_SIMULATION
        SET UZS=${uzs},
            EUR = ${eur},
            RUB = ${rub},
            USD = ${usd}
        WHERE INDICATOR_ID = ${indicatorId}
          AND INDICATOR_TYPE = ${indicatorType}
    `
    const updatePackageQuery = `
        BEGIN
            LIQUIDITY_SIMULATION_PACKAGE.RUN_SIMULATION();
        EXCEPTION WHEN OTHERS THEN
            DBMS_OUTPUT.PUT_LINE(sqlcode);
            DBMS_OUTPUT.PUT_LINE(sqlerrm);
        END;
    `
    await this.oracleService.executeQuery(updateQuery)
    await this.oracleService.executeQuery(updatePackageQuery)
    return { success: true }
  }

  async placedAttracted(date: Date) {
    return await getPlacedAttractedData(date, this.oracleService)
  }

  async interbankDeposits(date: Date) {
    return await getInterbankDepositsData(date, this.oracleService)
  }

  async topDeposits(date: Date) {
    return await getTopDepositsData(date, this.oracleService)
  }

  async timeDepoClients(date: Date) {
    return await getTimeDepoClientsData(date, this.oracleService)
  }

  async timeDeposits(date: Date) {
    return await getTimeDepositsData(date, this.oracleService)
  }

  async depositsByDeadline(date: Date) {
    return await getDepositsByDeadlineData(date, this.oracleService)
  }

  async reportLiabilities(date: Date) {
    return await getReportLiabilitiesData(date, this.oracleService)
  }

  async reportLiabilities216(date: Date) {
    return await getReportLiabilities216Data(date, this.oracleService)
  }

  async filialEffectiveness(date: Date) {
    return await getFilialEffectivenessData(date, this.oracleService)
  }

  async gm(date: Date) {
    return await getGmData(date, this.oracleService)
  }

  async gap() {
    return await getGapData(this.oracleService)
  }

  async gapManual(forEditing: boolean | string) {
    const booleanForEditing = forEditing === 'true'
    if (!booleanForEditing) {
      await this.oracleService.executeQuery(`BEGIN
                       DELETE FROM GAP_SIMULATION_AUTO WHERE 1=1;
                       DELETE FROM GAP_SIMULATION_MANUAL WHERE 1=1;
                       INSERT INTO GAP_SIMULATION_AUTO (SELECT * FROM GAP_ANALYSIS_AUTO);
                       INSERT INTO GAP_SIMULATION_MANUAL (SELECT * FROM GAP_ANALYSIS_MANUAL);
                   END;`)
    }
    return await getGapManualData(booleanForEditing, this.oracleService)
  }

  async updateGapManual({ date, role, newValue, source, colName }: UpdateGapDto) {
    const tableColName = GapColNames[colName]
    let updateQuery = `UPDATE GAP_SIMULATION_MANUAL
                       SET ${tableColName}=${+newValue}
                       WHERE ROLE = '${role}'
                         AND OPER_DAY = ${date}`
    if (source === 'AUTO') {
      updateQuery = `UPDATE GAP_SIMULATION_AUTO
                     SET ${tableColName}=${+newValue}
                     WHERE ROLE = '${role}'
                       AND OPER_DAY = (WITH CTE AS (SELECT OPER_DAY,
                                                           ROW_NUMBER() OVER (ORDER BY OPER_DAY) AS ROW_NUMBER
                                                    FROM (SELECT * FROM GAP_SIMULATION_AUTO ORDER BY OPER_DAY)
                                                    WHERE ROLE = '${role}')
                                       SELECT OPER_DAY
                                       FROM CTE
                                       WHERE ROW_NUMBER = ${date})`
    }
    await this.oracleService.executeQuery(updateQuery)
    await this.oracleService.executeQuery(`BEGIN GAP_MANUAL_REWRITER(); END;`)
    return { success: true, message: 'updated' }
  }

  async saveGapManualChanges() {
    await this.oracleService.executeQuery(`BEGIN
            DELETE FROM GAP_ANALYSIS_MANUAL WHERE 1=1;
            INSERT INTO GAP_ANALYSIS_MANUAL (SELECT * FROM GAP_SIMULATION_MANUAL);
            DELETE FROM GAP_SIMULATION_AUTO WHERE 1=1;
            INSERT INTO GAP_SIMULATION_AUTO (SELECT * FROM GAP_ANALYSIS_AUTO);
        END;`)
    return { success: true, message: 'changes saved' }
  }

  async dashboard(date: Date) {
    const configOptions = {
      username: this.configService.get('CURRENCY_LOGIN'),
      password: this.configService.get('CURRENCY_PASSWORD')
    }
    return await getDashboardData(date, this.oracleService, configOptions, this.httpService)
  }

  async creditData(date: Date) {
    return await getCreditData(date, this.oracleService)
  }

  async dashboardMonthly(firstDate: Date, secondDate: Date) {
    return await getDashboardMonthlyData(firstDate, secondDate, this.oracleService)
  }

  async competitiveAnalysis(date: Date) {
    return await getCompetitiveAnalysisData(date, this.oracleService)
  }

  async corrAccountsAnalyze() {
    return await getCorrAccountsAnalyzeData(this.oracleService)
  }

  async caaUpdateHistory() {
    return await this.oracleService.executeQueryInStream<CAAChangeHistory>(`
        SELECT FIRST_NAME || ' ' || LAST_NAME         AS "userName",
               TO_CHAR(DATE_MODIFY, 'fmDD-month, HH24:fmMI:SS',
                       'NLS_DATE_LANGUAGE = RUSSIAN') AS "dateModify",
               SHORT_NAME                             AS "bankName",
               MODIFY_COLUMN                          AS "colName",
               DESCRIPTIONS                           AS "description"
        FROM MATRIX_CHANGE_HISTORY
                 JOIN MATRIX_CORR_ACC MCA on MCA.ID = MATRIX_CHANGE_HISTORY.MATRIX_ROW_ID
                 JOIN TRS_USERS ON TRS_USERS.ID = MATRIX_CHANGE_HISTORY.EDITOR_ID
                 JOIN BANK_INFO_RATING BIR on BIR.ID = MCA.BANK_ID
        WHERE ROWNUM < 300
        ORDER BY DATE_MODIFY DESC
    `)
  }

  async updateCorrAccountsAnalyze({ colName, value, matrixId }: UpdateCAADto, userId: number) {
    const mappedColName = CAAColNames[colName]
    const mappedColLabelName = CAAColLabelNames[colName]
    const updateQuery =
      value === null
        ? `UPDATE MATRIX_CORR_ACC
           SET ${mappedColName}=${value}
           WHERE ID = ${matrixId}`
        : `UPDATE MATRIX_CORR_ACC
           SET ${mappedColName}='${value}'
           WHERE ID = ${matrixId}`
    const { oldValue = null } = await this.oracleService.executeQuery<{ oldValue: string | null }>(
      `SELECT ${mappedColName} AS "oldValue"
       FROM MATRIX_CORR_ACC
       WHERE ID = ${matrixId}`
    )
    await this.oracleService.executeQuery(updateQuery)
    const description = `${oldValue} => ${value}`
    await this.oracleService.executeQuery(`
        INSERT INTO MATRIX_CHANGE_HISTORY (EDITOR_ID, DATE_MODIFY, MODIFY_COLUMN, MATRIX_ROW_ID, DESCRIPTIONS)
        VALUES (${userId}, SYSDATE, '${mappedColLabelName}', ${matrixId}, '${description}')`)
    return { updated: true }
  }

  async corrOperations(options: ICorrOperationsOptions) {
    return await getCorrOperationsData(
      options.firstDate,
      options.secondDate,
      options.currencyCode,
      this.oracleService,
      options.clientCode
    )
  }

  async filialCp(options: ICorrOperationsOptions) {
    return await getFilialCpData(
      options.firstDate,
      options.secondDate,
      options.currencyCode,
      this.oracleService
    )
  }
}
