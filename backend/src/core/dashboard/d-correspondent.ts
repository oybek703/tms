import { Base } from '../base'
import { IDashboardCorrespondent } from './dashboard.interface'

export class DashboardCorrespondent extends Base {
  protected terms = [
    { code: '000', image: 'uzs' },
    { code: '840', image: 'usd' },
    { code: '978', image: 'eur' },
    { code: '643', image: 'rub' }
  ]

  protected formatQuery(whereQuery: string) {
    return `SELECT EQUIVAL   AS "value",
                   DIFFRENCE AS "differ"
            FROM (SELECT * FROM DASHBOARD_CORRESPONDENT ORDER BY OPER_DAY DESC)
            WHERE CURRENCY_CODE = ${whereQuery}
              AND OPER_DAY <= DATE '${this.date}'
              AND ROWNUM = 1`
  }

  protected async getOneRow(whereQuery: string, image: string) {
    const { value, differ } = await this.getDataInDates<IDashboardCorrespondent>(whereQuery)
    return {
      value: Number(value || 0).toFixed(2),
      differ: Number(differ || 0).toFixed(2),
      image
    }
  }

  async getRows() {
    const termsData = this.terms.map(({ code, image }) => this.getOneRow(code, image))
    return await Promise.all(termsData)
  }
}
