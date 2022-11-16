import { Base } from '../../base'
import { ICADbData, ICARow, IQuarterDates, RiskBalances } from './ca.interface'
import { OwnQuery } from '../../core.interface'

export class CompetitiveAnalysis extends Base {
  private quarterDates: [string, string, string, string]

  private createDates() {
    const [firstDate, secondDate, thirdDate, fourthDate] = this.quarterDates
    return `DATE '${firstDate}',
            DATE '${secondDate}',
            DATE '${thirdDate}',
            DATE '${fourthDate}'`
  }

  protected formatQuery(): string {
    return `SELECT TO_CHAR(END_QUARTER, 'D mon YYYY', 'NLS_DATE_LANGUAGE = RUSSIAN') AS "quarterDates",
                   TO_CHAR(LAST_OPER_DAY_IN_QUARTER, 'YYYY-MM-DD')                   AS "date"
            FROM (SELECT MAX(OPER_DAY)                       AS LAST_OPER_DAY_IN_QUARTER,
                         ADD_MONTHS(TRUNC(OPER_DAY, 'Q'), 3) AS END_QUARTER
                  FROM IABS.DAY_OPERATIONAL@IABS
                  WHERE OPER_DAY < TRUNC(DATE '${this.date}', 'Q')
                  GROUP BY TRUNC(OPER_DAY, 'Q')
                  ORDER BY LAST_OPER_DAY_IN_QUARTER DESC FETCH FIRST 4 ROW ONLY)
            ORDER BY END_QUARTER`
  }

  private riskDataQuery = (balanceType: RiskBalances) => {
    return `SELECT ROUND(SUM(${balanceType}) / POWER(10, 6), 2) AS "value"
            FROM CR.DWH_INDICATORS@RISK
            WHERE OPER_DAY IN (${this.createDates()})
            GROUP BY OPER_DAY
            ORDER BY OPER_DAY`
  }

  private activesQuery = () => {
    return `SELECT ABS(TOTAL) as "value"
            FROM LIQUIDITY
            WHERE ROLE = 'T_A'
              AND OPER_DAY IN (${this.createDates()})
            ORDER BY OPER_DAY`
  }

  private liabilitiesQuery = () => {
    return `SELECT ROUND(ABS(SUM(SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ) / POWER(10, 8)), 2) AS
                       "value"
            FROM IBS.SVOD_SALDO_DUMP@IABS
            WHERE DAT IN (${this.createDates()})
              AND ((BAL LIKE '2%'
                AND BAL NOT LIKE '222%')
                OR BAL LIKE '175%')
            GROUP BY DAT`
  }

  private roaQuery = () => {
    return `SELECT ROUND((100 * 365 * CURRENT_PPROFIT) / (COUNT_DAY * TOTAL_ASSETS), 2) AS "value"
            FROM (SELECT DAT,
                         ROUND(ABS(SUM(SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ) / POWER(10, 8)), 2)   AS CURRENT_PPROFIT,
                         DECODE(TO_NUMBER(TRUNC(ADD_MONTHS(DAT, 1), 'MM') - TRUNC(DAT, 'YYYY')),
                                366, 365,
                                TO_NUMBER(TRUNC(ADD_MONTHS(DAT, 1), 'MM') - TRUNC(DAT, 'YYYY'))) AS COUNT_DAY,
                         (SELECT ROUND(ABS(SUM(SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ) / POWER(10, 8)), 2)
                          FROM IBS.SVOD_SALDO_DUMP@IABS
                          WHERE BAL LIKE '1%'
                            AND SUBSTR(BAL, 1, 3) NOT IN ('161',
                                                          '175')
                            AND DAT = SSD.DAT)                                                   AS TOTAL_ASSETS
                  FROM IBS.SVOD_SALDO_DUMP@IABS SSD
                  WHERE DAT IN (${this.createDates()})
                    AND (SUBSTR(BAL, 1, 1) IN ('4', '5') OR BAL = '31206')
                  GROUP BY DAT)`
  }

  async getOneRow(indicatorName: string, query: OwnQuery): Promise<ICARow> {
    const data = await this.getDataInDates<ICADbData, true>(undefined, query, true)
    return {
      indicatorName,
      firstDate: data[0].value,
      secondDate: data[1].value,
      thirdDate: data[2].value,
      fourthDate: data[3].value
    }
  }

  private async getQuarterDates() {
    const quarterDates = await this.getDataInDates<IQuarterDates, true>('1=1', undefined, true)
    this.quarterDates = quarterDates.map(({ date }) => date) as typeof this.quarterDates
    return quarterDates.map(({ quarterDates }) => quarterDates.replace(/\d/, '1'))
  }

  private async risk_data(balanceType: RiskBalances, indicatorName: string) {
    return await this.getOneRow(indicatorName, this.riskDataQuery.bind(this, balanceType))
  } /* Кредитный портфель, NPL, Резервы   */

  private async actives() {
    return await this.getOneRow('Активы', this.activesQuery)
  } /* Активы */

  private async liabilities() {
    return await this.getOneRow('Обязательства', this.liabilitiesQuery)
  } /* Обязательства */

  private async roa() {
    return await this.getOneRow('ROA', this.roaQuery)
  } /* ROA */

  async getRows() {
    const formattedQuarterDates = await this.getQuarterDates()
    const [creditPortfolio, npl, reserve, actives, liabilities, roa] = await Promise.all([
      this.risk_data('PFL_BALANCE', 'Кредитный портфель'),
      this.risk_data('NPL_BALANCE', 'NPL'),
      this.risk_data('RES_BALANCE', 'Резервы'),
      this.actives(),
      this.liabilities(),
      this.roa()
    ])
    const totalData = { creditPortfolio, npl, reserve, actives, liabilities, roa }
    return [formattedQuarterDates, totalData]
  }
}
