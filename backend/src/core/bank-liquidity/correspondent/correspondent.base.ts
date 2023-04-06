import { Base } from '../../base'
import { OwnQuery } from '../../core.interface'
import { ICorrespondentDbData, ICorrespondentRow } from './correspondent.interface'

export class CorrespondentBase extends Base {
  currencyNames = ['uzs', 'cny', 'jpy', 'kzt', 'rub', 'chf', 'gbp', 'usd', 'eur']

  formatQuery(whereQuery = '1=1'): string {
    return `SELECT ROUND(NVL(UZS, 0), 2) AS "uzs",
                   ROUND(NVL(JPY, 0), 2) AS "jpy",
                   ROUND(NVL(KZT, 0), 2) AS "kzt",
                   ROUND(NVL(RUB, 0), 2) AS "rub",
                   ROUND(NVL(CHF, 0), 2) AS "chf",
                   ROUND(NVL(GBP, 0), 2) AS "gbp",
                   ROUND(NVL(USD, 0), 2) AS "usd",
                   ROUND(NVL(EUR, 0), 2) AS "eur",
                   ROUND(NVL(CNY, 0), 2) AS "cny"
            FROM (SELECT VAL,
                         ROUND(SUM(SALDO_ACTIVE + SALDO_PASSIVE) / POWER(10, 6), 2) AS SALDO_OUT
                  FROM IBS.SVOD_SALDO_DUMP@IABS
                  WHERE DAT = DATE '${this.date}'
                    AND ${whereQuery}
                  GROUP BY VAL) PIVOT (
                SUM(DECODE(VAL, '392', SALDO_OUT, SALDO_OUT / 100)) FOR (VAL) IN (
                    '000' AS UZS,
                    '392' AS JPY,
                    '398' AS KZT,
                    '643' AS RUB,
                    '756' AS CHF,
                    '826' AS GBP,
                    '840' AS USD,
                    '978' AS EUR,
                    '156' CNY )
                )`
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
