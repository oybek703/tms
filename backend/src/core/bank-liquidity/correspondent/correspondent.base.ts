import { Base } from '../../base'
import { OwnQuery } from '../../core.interface'
import { ICorrespondentDbData, ICorrespondentRow } from './correspondent.interface'

export class CorrespondentBase extends Base {
  currencyNames = ['uzs', 'cny', 'jpy', 'kzt', 'rub', 'chf', 'gbp', 'usd', 'eur']

  formatQuery(role: string): string {
    return `SELECT 
                UZS AS "uzs", 
                CNY AS "cny", 
                JPY AS "jpy", 
                KZT AS "kzt", 
                RUB AS "rub", 
                CHF AS "chf", 
                GBP AS "gbp", 
                USD AS "usd",
                EUR AS "eur"
            FROM (SELECT * FROM CORRESPONDENT ORDER BY OPER_DAY DESC)
            WHERE OPER_DAY<DATE '${this.date}' AND CODE_COA='${role}'
            AND ROWNUM=1`
  }

  createData = (
    count: string,
    indicatorName: string,
    uzs: number,
    cny: number,
    jpy: number,
    kzt: number,
    rub: number,
    chf: number,
    gbp: number,
    usd: number,
    eur: number,
    isTableHead: boolean,
    isNegative?: boolean
  ) => ({
    count,
    indicatorName,
    uzs: isNegative ? uzs : Math.abs(uzs),
    cny: isNegative ? cny : Math.abs(cny),
    jpy: isNegative ? jpy : Math.abs(jpy),
    kzt: isNegative ? kzt : Math.abs(kzt),
    rub: isNegative ? rub : Math.abs(rub),
    chf: isNegative ? chf : Math.abs(chf),
    gbp: isNegative ? gbp : Math.abs(gbp),
    usd: isNegative ? usd : Math.abs(usd),
    eur: isNegative ? eur : Math.abs(eur),
    isTableHead
  })

  getTotal(propertyName: string, ...args: ICorrespondentRow[]) {
    let total = 0.0
    args.forEach((arg: any) => {
      total += Number(arg[propertyName])
    })
    return Number(total.toFixed(2))
  }

  async getOneRow(
    count: string,
    indicatorName: string,
    whereQuery: string | undefined,
    ownQuery?: OwnQuery | undefined,
    isTableHead = false,
    isNegative = false
  ) {
    let data: ICorrespondentDbData
    if (whereQuery) {
      data = await this.getDataInDates<ICorrespondentDbData>(whereQuery, undefined)
    } else {
      data = await this.getDataInDates<ICorrespondentDbData>(undefined, ownQuery)
    }
    return this.createData(
      count,
      indicatorName,
      data.uzs,
      data.cny,
      data.jpy,
      data.kzt,
      data.rub,
      data.chf,
      data.gbp,
      data.usd,
      data.eur,
      isTableHead,
      isNegative
    )
  }
}
