import { Base } from '../base'
import { format } from 'date-fns'
import { IDashboardLiquidity } from './dashboard.interface'

export class DashboardLiquidity extends Base {
  protected formatQuery(whereQuery: string): string {
    return ''
  }

  protected dashboardLiquidityQuery = (liquidityCategory: string) => {
    return () => {
      return `SELECT SUBSTR(TRIM(INITCAP(TO_CHAR(OPER_DAY, 'month', 'NLS_DATE_LANGUAGE=RUSSIAN'))), 0,
                            3) AS      "monthName",
                     ROUND(PERCENT, 2) "percent"
              FROM (SELECT * FROM DASHBOARD_LIQUIDITY ORDER BY OPER_DAY DESC)
              WHERE ROLE = '${liquidityCategory}'
                AND OPER_DAY <= DATE '${this.date}'
                AND ROWNUM < 7
              ORDER BY OPER_DAY`
    }
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

  protected async liquidityByCategory<K extends boolean = false>(
    liquidityCategory: string,
    withCategory = false
  ): Promise<K extends true ? number[] : { values: number[]; categories: string[] }> {
    const res = await this.getDataInDates<{ monthName: string; percent: number }, true>(
      undefined,
      this.dashboardLiquidityQuery(liquidityCategory),
      true
    )
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

  protected async vlaCurrentState() {
    const [data] = await this.getDataInDates<IDashboardLiquidity, true>(
      undefined,
      this.vlaCurrentStateQuery,
      true
    )
    return Object.values(data)
  }

  async getRows() {
    const vlaTotal = await this.liquidityByCategory('VLA', true)
    const vlaNat = await this.liquidityByCategory('VLA_NAT')
    const vlaForeign = await this.liquidityByCategory('VLA_FOR')
    const lcrTotal = await this.liquidityByCategory('LCR', true)
    const lcrNat = await this.liquidityByCategory('LCR_NAT')
    const lcrForeign = await this.liquidityByCategory('LCR_FOR')
    const nsfrTotal = await this.liquidityByCategory('NSFR', true)
    const nsfrNat = await this.liquidityByCategory('NSFR_NAT')
    const nsfrForeign = await this.liquidityByCategory('NSFR_FOR')
    const vlaCurrent = await this.vlaCurrentState()
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
    return [vla, lcr, nsfr]
  }
}
