import { Base } from '../base'
import { format } from 'date-fns'
import { IDashboardLiquidity, IDashboardLiquidityData } from './dashboard.interface'

export class DashboardLiquidity extends Base {
  protected formatQuery(liquidityCategory: string): string {
    return `SELECT SUBSTR(TRIM(INITCAP(TO_CHAR(OPER_DAY, 'month', 'NLS_DATE_LANGUAGE=RUSSIAN'))), 0,
                          3) AS      "monthName",
                   ROUND(PERCENT, 2) "percent"
            FROM (SELECT * FROM DASHBOARD_LIQUIDITY ORDER BY OPER_DAY DESC)
            WHERE ROLE = '${liquidityCategory}'
              AND OPER_DAY <= DATE '${this.date}'
              AND ROWNUM < 7
            ORDER BY OPER_DAY`
  }

  protected instantLiquidityQuery = () => {
    return `WITH DATES AS
                     (SELECT EXTRACT(MONTH FROM OPER_DAY) MONTH_NUM,
                             MAX(OPER_DAY) AS             MAX_OPER_DAYS
                      FROM IBS.DAY_OPERATIONAL@IABS
                      WHERE OPER_DAY BETWEEN TRUNC(DATE '2022-12-30', 'YYYY') AND DATE '2022-12-30'
                        AND DAY_STATUS = 1
                      GROUP BY EXTRACT(MONTH FROM OPER_DAY),
                               EXTRACT(YEAR FROM OPER_DAY)
                      ORDER BY EXTRACT(MONTH FROM OPER_DAY) DESC
                          FETCH FIRST 6 ROWS ONLY)
            SELECT SUBSTR(TRIM(INITCAP(TO_CHAR(TRUNC(MAX_OPER_DAYS, 'MM'), 'month', 'NLS_DATE_LANGUAGE=RUSSIAN'))), 0,
                          3)                                                 AS "monthName",
                   ROUND((SELECT ABS(SUM(SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ))
                          FROM IBS.SVOD_SALDO_DUMP@IABS
                          WHERE (
                                      BAL LIKE '101%'
                                  OR (
                                                  BAL LIKE '103%'
                                              AND BAL != '10309')
                                  OR BAL LIKE '107%')
                            AND DAT = MAX_OPER_DAYS
                            AND VAL = '000') / (SELECT ABS(SUM(SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ))
                                                FROM IBS.SVOD_SALDO_DUMP@IABS
                                                WHERE (BAL LIKE '202%'
                                                    OR BAL IN ('21002', '21008', '22402', '22403', '22405', '22406', '22476')
                                                    OR (BAL LIKE '226%' AND BAL NOT IN ('22602', '22628'))
                                                    OR BAL LIKE '231%'
                                                    OR (BAL LIKE '232%' AND BAL != '23206')
                                                    OR BAL LIKE '234%'
                                                    OR BAL LIKE '175%'
                                                    OR BAL LIKE '235%'
                                                    OR BAL LIKE '174%'
                                                    OR (BAL LIKE '298%' AND
                                                        BAL NOT IN ('29822', '29826', '29830', '29842', '29846')))
                                                  AND DAT = MAX_OPER_DAYS
                                                  AND VAL = '000') * 100, 2) AS "percent"
            FROM DATES
            ORDER BY MAX_OPER_DAYS`
  }

  protected vlaCurrentStateQuery = () => {
    if ((format(new Date(), 'yyyy-MM-dd') as unknown as Date) === this.date) {
      return `SELECT VLA AS "vla", VLA_NAT AS "vlaNat", VLA_FOR AS "vlaFor"
              FROM DASHBOARD_LIQUIDITY_CURRENT
                  PIVOT (MAX(PERCENT) FOR ROLE IN ('VLA' AS VLA, 'VLA_NAT' AS VLA_NAT, 'VLA_FOR' AS VLA_FOR))`
    }
    return `WITH CTE AS (SELECT * FROM DASHBOARD_LIQUIDITY_DAILY WHERE OPER_DAY = DATE '${this.date}')
            SELECT VLA AS "vla", VLA_NAT AS "vlaNat", VLA_FOR AS "vlaFor"
            FROM CTE PIVOT (MAX(PERCENT) FOR ROLE IN ('VLA' AS VLA, 'VLA_NAT' AS VLA_NAT, 'VLA_FOR' AS VLA_FOR))`
  }

  getCategoryAndMonthData<K extends boolean = false>(
    res: IDashboardLiquidityData[],
    withCategory = false
  ): K extends true ? number[] : { values: number[]; categories: string[] } {
    const categories: string[] = []
    const values: number[] = []
    res.map(v => {
      if (withCategory) categories.push(v['monthName'])
      values.push(+v['percent'].toFixed(2))
    })
    if (withCategory) {
      return { values, categories } as K extends true
        ? number[]
        : { values: number[]; categories: string[] }
    }
    return values as K extends true ? number[] : { values: number[]; categories: string[] }
  }

  protected async liquidity_by_category(liquidityCategory: string, withCategory = false) {
    const res = await this.getDataInDates<IDashboardLiquidityData, true>(
      liquidityCategory,
      undefined,
      true
    )
    return this.getCategoryAndMonthData(res, withCategory)
  }

  protected async instant_liquidity() {
    const res = await this.getDataInDates<IDashboardLiquidityData, true>(
      undefined,
      this.instantLiquidityQuery,
      true
    )
    return this.getCategoryAndMonthData(res, true)
  }

  protected async vla_current_state() {
    const [data] = await this.getDataInDates<IDashboardLiquidity, true>(
      undefined,
      this.vlaCurrentStateQuery,
      true
    )
    return Object.values(data)
  }

  async getRows() {
    const vlaTotal = await this.liquidity_by_category('VLA', true)
    const vlaNat = await this.liquidity_by_category('VLA_NAT')
    const vlaForeign = await this.liquidity_by_category('VLA_FOR')
    const lcrTotal = await this.liquidity_by_category('LCR', true)
    const lcrNat = await this.liquidity_by_category('LCR_NAT')
    const lcrForeign = await this.liquidity_by_category('LCR_FOR')
    const nsfrTotal = await this.liquidity_by_category('NSFR', true)
    const nsfrNat = await this.liquidity_by_category('NSFR_NAT')
    const nsfrForeign = await this.liquidity_by_category('NSFR_FOR')
    const vlaCurrent = await this.vla_current_state()
    const instantLiquidity = await this.instant_liquidity()
    const vla = {
      total: vlaTotal.values,
      nat: vlaNat,
      foreign: vlaForeign,
      categories: vlaTotal.categories,
      vlaCurrent
    }
    const lcr = {
      total: lcrTotal.values,
      nat: lcrNat,
      foreign: lcrForeign,
      categories: lcrTotal.categories
    }
    const nsfr = {
      total: nsfrTotal.values,
      nat: nsfrNat,
      foreign: nsfrForeign,
      categories: nsfrTotal.categories
    }
    const il = {
      total: instantLiquidity.values,
      categories: instantLiquidity.categories
    }
    return [vla, lcr, nsfr, il]
  }
}
