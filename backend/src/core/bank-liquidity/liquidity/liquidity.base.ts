import { Base } from '../../base'
import { OwnQuery } from '../../core.interface'
import { ILiquidityDbData, ILiquidityRow } from './liquidity.interface'

export class LiquidityBase extends Base {
  protected columns = ['total', 'natCurr', 'forCurr', 'usaDollar', 'evro']
  protected formatQuery(whereQuery: string): string {
    return `SELECT TOTAL AS "total",
                   NAT_CURR AS "natCurr",
                   ROUND((TOTAL - NAT_CURR) / (SELECT EQUIVAL
                                               FROM IBS.S_RATE_CUR@IABS
                                               WHERE DATE_CROSS = (SELECT MAX(DATE_CROSS)
                                                                   FROM IBS.S_RATE_CUR@IABS
                                                                   WHERE CODE = '840' AND DATE_CROSS < DATE '${this.date}')
                                                 AND CODE = '840'), 2) AS "forCurr",
                   USA_DOLLAR AS "usaDollar",
                   EVRO AS "evro"
            FROM (SELECT (SELECT ROUND(ABS(SUM((SELECT
                                                    /*+index_desc(s UK_SALDO_ACCOUNT_DAY)*/
                                                    SALDO_EQUIVAL_OUT
                                                FROM IBS.SALDO@IABS S
                                                WHERE S.ACCOUNT_CODE = AC.CODE
                                                  AND OPER_DAY < DATE '${this.date}'
                                                  AND ROWNUM = 1))) / POWER(10, 8), 2) AS SALDO_OUT
                          FROM IBS.ACCOUNTS@IABS AC
                          WHERE ${whereQuery})  AS TOTAL,
                         (SELECT ROUND(ABS(SUM((SELECT
                                                    /*+index_desc(s UK_SALDO_ACCOUNT_DAY)*/
                                                    SALDO_OUT
                                                FROM IBS.SALDO@IABS S
                                                WHERE S.ACCOUNT_CODE = AC.CODE
                                                  AND OPER_DAY < DATE '${this.date}'
                                                  AND ROWNUM = 1))) / POWER(10, 8), 2 ) AS SALDO_OUT
                          FROM IBS.ACCOUNTS@IABS AC
                          WHERE ${whereQuery}
                            AND CODE_CURRENCY = '000') AS NAT_CURR,
                         (SELECT ROUND(ABS(SUM((SELECT
                                                      /*+index_desc(s UK_SALDO_ACCOUNT_DAY)*/
                                                      SALDO_OUT
                                                  FROM IBS.SALDO@IABS S
                                                  WHERE S.ACCOUNT_CODE = AC.CODE
                                                    AND OPER_DAY < DATE '${this.date}' 
                                                    AND ROWNUM = 1))) / POWER(10, 8), 2) AS SALDO_OUT
                            FROM IBS.ACCOUNTS@IABS AC
                            WHERE ${whereQuery}
                              AND CODE_CURRENCY = '840') AS USA_DOLLAR,
                           (SELECT ROUND(ABS(SUM((SELECT
                                                      /*+index_desc(s UK_SALDO_ACCOUNT_DAY)*/
                                                      SALDO_OUT
                                                  FROM IBS.SALDO@IABS S
                                                  WHERE S.ACCOUNT_CODE = AC.CODE
                                                    AND OPER_DAY < DATE '${this.date}' 
                                                    AND ROWNUM = 1))) / POWER(10, 8), 2 ) AS SALDO_OUT
                            FROM IBS.ACCOUNTS@IABS AC
                            WHERE ${whereQuery}
                              AND CODE_CURRENCY = '978') AS EVRO
                    FROM DUAL)`
  }

  protected liquidityQuery(role: string) {
    return () => {
      return `SELECT TOTAL AS "total",
                     NAT_CURR AS "natCurr", 
                     FOR_CURR AS "forCurr",
                     USA_DOLLAR AS "usaDollar",
                     EVRO AS "evro"
              FROM (SELECT * FROM LIQUIDITY ORDER BY OPER_DAY DESC)
              WHERE OPER_DAY<DATE '${this.date}' AND ROLE='${role}' AND ROWNUM=1`
    }
  }

  private createData = (
    count: string,
    indicatorName: string,
    total: number,
    natCurr: number,
    forCurr: number,
    usaDollar: number,
    evro: number,
    isTableHead: boolean
  ) => ({
    count,
    indicatorName,
    total: Math.abs(total),
    natCurr: Math.abs(natCurr),
    forCurr: Math.abs(forCurr),
    usaDollar: Math.abs(usaDollar),
    evro: Math.abs(evro),
    isTableHead
  })

  protected getEmptyRow = (): ILiquidityRow => ({
    count: '',
    indicatorName: 'в том числе:',
    total: 0,
    natCurr: 0,
    forCurr: 0,
    usaDollar: 0,
    evro: 0,
    isTableHead: false
  })

  protected getTotal = (propertyName: keyof ILiquidityRow, ...args: ILiquidityRow[]) => {
    let total = 0.0
    args.forEach((arg: ILiquidityRow) => {
      total += Number(arg[propertyName])
    })
    return Number(total.toFixed(2))
  }
  protected async getOneRow(
    count: string,
    indicatorName: string,
    whereQuery: string | undefined,
    ownQuery?: OwnQuery | undefined,
    isTableHead = false
  ) {
    let data: ILiquidityDbData
    if (whereQuery) {
      data = await this.getDataInDates<ILiquidityDbData>(whereQuery, undefined)
    } else {
      data = await this.getDataInDates<ILiquidityDbData>(undefined, ownQuery)
    }
    return this.createData(
      count,
      indicatorName,
      data.total,
      data.natCurr,
      data.forCurr,
      data.usaDollar,
      data.evro,
      isTableHead
    )
  }
}
