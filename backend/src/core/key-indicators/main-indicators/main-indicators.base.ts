import { Base } from '../../base'
import { OwnQuery } from '../../core.interface'
import { format } from 'date-fns'
import { DBData, MainIndicatorRow } from './main-indicators.interfaces'

export class MainIndicatorsBase extends Base {
  private yearFirstDate = format(new Date(this.date), 'yyyy-01-01')
  private monthFirstDate = format(new Date(this.date), 'yyyy-MM-01')

  protected formatQuery(whereQuery: string) {
    return `SELECT YEAR_BEGIN                                          AS "yearBegin",
                   MONTH_BEGIN                                         AS "monthBegin",
                   SELECTED_DATE                                       AS "selectedDate",
                   (SELECTED_DATE - MONTH_BEGIN)                       AS "differ",
                   (ROUND((SELECTED_DATE / MONTH_BEGIN) - 1, 3) * 100) AS "differPercent"
            FROM (SELECT (SELECT ABS(ROUND(SUM(SALDO_EQUIVAL_OUT) / POWER(10, 11), 1))
                          FROM (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                               SALDO_EQUIVAL_OUT
                                        FROM IBS.SALDO@IABS SL
                                        WHERE SL.ACCOUNT_CODE = AC.CODE
                                          AND SL.OPER_DAY < DATE '${this.date}'
                                          AND ROWNUM = 1) AS SALDO_EQUIVAL_OUT
                                FROM IBS.ACCOUNTS@IABS AC
                                WHERE ${whereQuery})) AS SELECTED_DATE,
                         (SELECT ABS(ROUND(SUM(SALDO_EQUIVAL_OUT) / POWER(10, 11), 1))
                          FROM (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                               SALDO_EQUIVAL_OUT
                                        FROM IBS.SALDO@IABS SL
                                        WHERE SL.ACCOUNT_CODE = AC.CODE
                                          AND SL.OPER_DAY < DATE '${this.monthFirstDate}'
                                          AND ROWNUM = 1) AS SALDO_EQUIVAL_OUT
                                FROM IBS.ACCOUNTS@IABS AC
                                WHERE ${whereQuery})) AS MONTH_BEGIN,
                         (SELECT ABS(ROUND(SUM(SALDO_EQUIVAL_OUT) / POWER(10, 11), 1))
                          FROM (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                               SALDO_EQUIVAL_OUT
                                        FROM IBS.SALDO@IABS SL
                                        WHERE SL.ACCOUNT_CODE = AC.CODE
                                          AND SL.OPER_DAY < DATE '${this.yearFirstDate}'
                                          AND ROWNUM = 1) AS SALDO_EQUIVAL_OUT
                                FROM IBS.ACCOUNTS@IABS AC
                                WHERE ${whereQuery})) AS YEAR_BEGIN
                  FROM DUAL)`
  }

  protected mainIndicatorsQuery = (role: string) => {
    return () => {
      return `SELECT YEAR_BEGIN     AS "yearBegin",
                     MONTH_BEGIN    AS "monthBegin",
                     SELECTED_DATE  AS "selectedDate",
                     DIFFER         AS "differ",
                     DIFFER_PERCENT AS "differPercent"
              FROM (SELECT * FROM MAININDICATORS ORDER BY OPER_DAY DESC)
              WHERE OPER_DAY < DATE '${this.date}'
                AND ROLE = '${role}'
                AND ROWNUM = 1`
    }
  }

  private createData = (
    count: string,
    indicatorName: string,
    yearBegin: number,
    monthBegin: number,
    selectedDate: number,
    differ: number,
    differPercent: string,
    isTableHead: boolean
  ) => ({
    count,
    indicatorName,
    yearBegin,
    monthBegin,
    selectedDate,
    differ,
    differPercent,
    isTableHead
  })

  protected getTotalData(...args: DBData[]) {
    let yearBegin = 0
    let monthBegin = 0
    let selectedDate = 0
    args.forEach(arg => {
      yearBegin += Math.abs(arg['yearBegin'])
      monthBegin += Math.abs(arg['monthBegin'])
      selectedDate += Math.abs(arg['selectedDate'])
    })
    return {
      yearBegin: isNaN(yearBegin) ? 'no_data' : yearBegin,
      monthBegin: isNaN(monthBegin) ? 'no_data' : monthBegin,
      selectedDate: isNaN(selectedDate) ? 'no_data' : selectedDate,
      differ: isNaN(selectedDate) ? 'no_data' : selectedDate - monthBegin,
      differPercent: isNaN(selectedDate) ? 'no_data' : `${(selectedDate / monthBegin - 1) * 100}`
    }
  }

  protected async getOneRow(
    count: string,
    indicatorName: string,
    whereQuery: string,
    ownQuery?: OwnQuery,
    isTableHead = false
  ): Promise<MainIndicatorRow> {
    let data: DBData
    if (!whereQuery) {
      data = await this.getDataInDates<DBData>(undefined, ownQuery)
    } else {
      data = await this.getDataInDates<DBData>(whereQuery, undefined)
    }
    const { yearBegin, monthBegin, selectedDate, differ, differPercent } = data
    return this.createData(
      count,
      indicatorName,
      yearBegin,
      monthBegin,
      selectedDate,
      differ,
      differPercent,
      isTableHead
    )
  }
}
