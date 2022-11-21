import { Base } from '../../base'
import {
  ActivesCols,
  CASaldoQueries,
  ICADbData,
  ICARow,
  ICARowOptions,
  IQuarterDates,
  LiquidityRoles,
  QuarterDatesArray,
  RiskBalances,
  RoaRoeQueries
} from './ca.interface'
import { OwnQuery } from '../../core.interface'

export class CompetitiveAnalysis extends Base {
  private quarterDates: QuarterDatesArray
  private monthFirstDates: QuarterDatesArray

  private createDates(dates: QuarterDatesArray = this.quarterDates) {
    const [firstDate, secondDate, thirdDate, fourthDate] = dates
    return `DATE '${firstDate}',
            DATE '${secondDate}',
            DATE '${thirdDate}',
            DATE '${fourthDate}'`
  }

  private static getRowNums(data: ICARow): number[] {
    const nums = []
    for (const dataKey in data) {
      if (typeof data[dataKey] === 'number') {
        nums.push(data[dataKey])
      }
    }
    return nums
  }

  protected formatQuery(): string {
    return `SELECT TO_CHAR(END_QUARTER, 'D mon YYYY', 'NLS_DATE_LANGUAGE = RUSSIAN') AS "quarterDates",
                   TO_CHAR(LAST_OPER_DAY_IN_QUARTER, 'YYYY-MM-DD')                   AS "date",
                   TO_CHAR(END_QUARTER, 'YYYY-MM-DD')                                AS "monthFirstDate"
            FROM (SELECT MAX(OPER_DAY)                       AS LAST_OPER_DAY_IN_QUARTER,
                         ADD_MONTHS(TRUNC(OPER_DAY, 'Q'), 3) AS END_QUARTER
                  FROM IABS.DAY_OPERATIONAL@IABS
                  WHERE OPER_DAY < TRUNC(DATE '${this.date}', 'Q')
                  GROUP BY TRUNC(OPER_DAY, 'Q')
                  ORDER BY LAST_OPER_DAY_IN_QUARTER DESC FETCH FIRST 4 ROW ONLY)
            ORDER BY END_QUARTER`
  }

  private riskDataQuery = (balanceType: RiskBalances) => {
    return () => {
      return `SELECT ROUND(SUM(${balanceType}) / POWER(10, 6), 2) AS "value"
              FROM CR.DWH_INDICATORS@RISK
              WHERE OPER_DAY IN (${this.createDates()})
              GROUP BY OPER_DAY
              ORDER BY OPER_DAY`
    }
  }

  private activesQuery = (col: ActivesCols) => {
    return () => {
      return `SELECT ABS(${col === 'FOR_CURR' ? `TOTAL-NAT_CURR` : col}) as "value"
              FROM LIQUIDITY
              WHERE ROLE = 'T_A'
                AND OPER_DAY IN (${this.createDates()})
              ORDER BY OPER_DAY`
    }
  }

  private saldoQuery = (whereQuery: CASaldoQueries, currency?: 'national' | 'foreign') => {
    return () => {
      return `SELECT ROUND(ABS(SUM(SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ) / POWER(10, 8)), 2) AS
                         "value"
              FROM IBS.SVOD_SALDO_DUMP@IABS
              WHERE DAT IN (${this.createDates()})
                AND (${whereQuery}) ${
        currency ? (currency === 'foreign' ? `AND VAL!='000'` : `AND VAL='000'`) : ''
      }
              GROUP BY DAT`
    }
  }

  private liquidityQuery = (role: LiquidityRoles) => {
    return () => {
      return `SELECT PERCENT AS "value"
              FROM DASHBOARD_LIQUIDITY
              WHERE OPER_DAY IN (${this.createDates(this.monthFirstDates)})
                AND ROLE = '${role}'`
    }
  }

  private roaRoeQuery = (whereQuery: RoaRoeQueries) => {
    return () => {
      return `SELECT ROUND((100 * 365 * CURRENT_PPROFIT) / (COUNT_DAY * TOTAL_ASSETS), 2) AS "value"
              FROM (SELECT DAT,
                           ROUND(ABS(SUM(SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ) / POWER(10, 8)), 2)   AS CURRENT_PPROFIT,
                           DECODE(TO_NUMBER(TRUNC(ADD_MONTHS(DAT, 1), 'MM') - TRUNC(DAT, 'YYYY')),
                                  366, 365,
                                  TO_NUMBER(TRUNC(ADD_MONTHS(DAT, 1), 'MM') - TRUNC(DAT, 'YYYY'))) AS COUNT_DAY,
                           (SELECT ROUND(ABS(SUM(SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ) / POWER(10, 8)), 2)
                            FROM IBS.SVOD_SALDO_DUMP@IABS
                            WHERE ${whereQuery}
                              AND DAT = SSD.DAT)                                                   AS TOTAL_ASSETS
                    FROM IBS.SVOD_SALDO_DUMP@IABS SSD
                    WHERE DAT IN (${this.createDates()})
                      AND (SUBSTR(BAL, 1, 1) IN ('4', '5') OR BAL = '31206')
                    GROUP BY DAT)`
    }
  }

  private cirQuery = () => {
    return `SELECT BI.VALUE AS "value"
            FROM INDICATOR_BANKS BI
                     JOIN BANKS B
                          ON BI.BANK_ID = B.ID
                     JOIN INDICATORS I
                          ON BI.INDICATOR_ID = I.ID
            WHERE BI.BANK_ID = 3
              AND OPER_DAY IN (${this.createDates(this.monthFirstDates)})`
  }

  async getOneRow(
    indicatorName: string,
    query: OwnQuery,
    options?: ICARowOptions
  ): Promise<ICARow> {
    let data = await this.getDataInDates<ICADbData, true>(undefined, query, true)
    if (data.length === 0) data = Array(4).fill({ value: 0 })
    return {
      indicatorName,
      firstDate: data[0].value,
      secondDate: data[1].value,
      thirdDate: data[2].value,
      fourthDate: data[3].value,
      tabbed: options?.tabbed,
      redBold: options?.redBold
    }
  }

  private async getQuarterDates() {
    const quarterDates = await this.getDataInDates<IQuarterDates, true>('1=1', undefined, true)
    this.quarterDates = quarterDates.map(({ date }) => date) as typeof this.quarterDates
    this.monthFirstDates = quarterDates.map(
      ({ monthFirstDate }) => monthFirstDate
    ) as typeof this.monthFirstDates
    return quarterDates.map(({ quarterDates }) => quarterDates.replace(/\d/, '1'))
  }

  private async risk_data(
    balanceType: RiskBalances,
    indicatorName: string,
    options?: ICARowOptions
  ) {
    return await this.getOneRow(indicatorName, this.riskDataQuery(balanceType), options)
  } /* Кредитный портфель, NPL, Резервы   */

  private async credit_types(
    indicatorName: string,
    query: CASaldoQueries,
    options?: ICARowOptions
  ) {
    return await this.getOneRow(indicatorName, this.saldoQuery(query), options)
  } /* Корпоративный, Розничный */

  private async actives(col: ActivesCols) {
    return await this.getOneRow('Активы', this.activesQuery(col), { redBold: true })
  } /* Активы */

  private async client_deposits(
    indicatorName: string,
    clientType: CASaldoQueries,
    options?: ICARowOptions
  ) {
    return await this.getOneRow(indicatorName, this.saldoQuery(clientType), options)
  } /* Депозиты клиентов, Корпоративный, Розничный */

  private async credit_lines() {
    return this.getOneRow('Кредитные линии', this.saldoQuery(CASaldoQueries.creditLines))
  } /* Кредитные линии */

  private async liabilities(type: CASaldoQueries, currency?: 'foreign' | 'national') {
    return await this.getOneRow('Обязательства', this.saldoQuery(type, currency), {
      redBold: true
    })
  } /* Обязательства */

  private async capital() {
    return this.getOneRow('Капитал', this.saldoQuery(CASaldoQueries.capital))
  } /* Капитал */

  private async clean_profit() {
    return this.getOneRow('Чистая прибыль', this.saldoQuery(CASaldoQueries.cleanProfit))
  } /* Чистая прибыль */

  private liquidity(indicatorName: string, role: LiquidityRoles) {
    return this.getOneRow(indicatorName, this.liquidityQuery(role), { redBold: true })
  } /* ВЛА, LCR, NSFR */

  private async roa_roe(query: RoaRoeQueries) {
    return await this.getOneRow('ROA', this.roaRoeQuery(query), { redBold: true })
  } /* ROA, ROE */

  private async cir() {
    return this.getOneRow('CIR(cost to income ratio)', this.cirQuery)
  }

  async getRows() {
    const formattedQuarterDates = await this.getQuarterDates()
    const [
      creditPortfolio,
      corporate,
      retail,
      npl,
      reserve,
      actives,
      totalDeposits,
      corporateDeposits,
      retailDeposits,
      creditLines,
      liabilities,
      capital,
      cleanProfit,
      vla,
      lcr,
      nsfr,
      roa,
      roe,
      cir,
      activesNational,
      activesForeign,
      liabilitiesNational,
      liabilitiesForeign
    ] = await Promise.all([
      this.risk_data('PFL_BALANCE', 'Кредитный портфель'),
      this.credit_types('Корпоративный', CASaldoQueries.corporateCredits, { tabbed: true }),
      this.credit_types('Розничный', CASaldoQueries.retailCredits, { tabbed: true }),
      this.risk_data('NPL_BALANCE', 'NPL', { tabbed: true, redBold: true }),
      this.risk_data('RES_BALANCE', 'Резервы'),
      this.actives('TOTAL'),
      this.client_deposits('Депозиты клиентов', CASaldoQueries.totalClientDeposits),
      this.client_deposits('Корпоративный', CASaldoQueries.corporateClientDeposits, {
        tabbed: true
      }),
      this.client_deposits('Розничный', CASaldoQueries.retailClientDeposits, { tabbed: true }),
      this.credit_lines(),
      this.liabilities(CASaldoQueries.liabilities),
      this.capital(),
      this.clean_profit(),
      this.liquidity('ВЛА', 'VLA'),
      this.liquidity('LCR', 'LCR'),
      this.liquidity('NSFR', 'NSFR'),
      this.roa_roe(RoaRoeQueries.ROA),
      this.roa_roe(RoaRoeQueries.ROE),
      this.cir(),
      this.actives('NAT_CURR'),
      this.actives('FOR_CURR'),
      this.liabilities(CASaldoQueries.liabilities, 'national'),
      this.liabilities(CASaldoQueries.liabilities, 'foreign')
    ])
    const totalData = {
      creditPortfolio,
      corporate,
      retail,
      npl,
      reserve,
      actives,
      totalDeposits,
      corporateDeposits,
      retailDeposits,
      creditLines,
      liabilities,
      capital,
      cleanProfit,
      vla,
      lcr,
      nsfr,
      roa,
      roe,
      cir
    }
    const chartData = {
      creditPortfolioGrow: {
        corporate: CompetitiveAnalysis.getRowNums(corporate),
        retail: CompetitiveAnalysis.getRowNums(retail)
      },
      depositGrow: {
        corporate: CompetitiveAnalysis.getRowNums(corporateDeposits),
        retail: CompetitiveAnalysis.getRowNums(retailDeposits)
      },
      actives: {
        national: CompetitiveAnalysis.getRowNums(activesNational),
        foreign: CompetitiveAnalysis.getRowNums(activesForeign)
      },
      liabilities: {
        national: CompetitiveAnalysis.getRowNums(liabilitiesNational),
        foreign: CompetitiveAnalysis.getRowNums(liabilitiesForeign)
      }
    }
    return [formattedQuarterDates, totalData, chartData]
  }
}
