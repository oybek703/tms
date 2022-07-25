import MainClass, { OwnQuery } from '../mainClass'
import { createMainIndicatorsData } from './mi_pure_functions'

class MainIndicatorsMainClass extends MainClass {
  constructor(date: string) {
    super(date)
  }

  formatQuery(date: string, whereQuery: string) {
    const { monthFirstDate, yearFirstDate } = this.dates
    return `SELECT YEAR_BEGIN,
                   MONTH_BEGIN,
                   SELECTED_DATE,
                   (SELECTED_DATE - MONTH_BEGIN)                       AS DIFFER,
                   (ROUND((SELECTED_DATE / MONTH_BEGIN) - 1, 3) * 100) AS DIFFER_PERCENT
            FROM (SELECT (SELECT ABS(ROUND(SUM(SALDO_EQUIVAL_OUT) / POWER(10, 11), 1))
                          FROM (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                               SALDO_EQUIVAL_OUT
                                        FROM IBS.SALDO@IABS SL
                                        WHERE SL.ACCOUNT_CODE = AC.CODE
                                          AND SL.OPER_DAY < TO_DATE('${this.date}', 'DD-MM-YYYY')
                                          AND ROWNUM = 1) AS SALDO_EQUIVAL_OUT
                                FROM IBS.ACCOUNTS@IABS AC
                                WHERE ${whereQuery})) AS SELECTED_DATE,
                         (SELECT ABS(ROUND(SUM(SALDO_EQUIVAL_OUT) / POWER(10, 11), 1))
                          FROM (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                               SALDO_EQUIVAL_OUT
                                        FROM IBS.SALDO@IABS SL
                                        WHERE SL.ACCOUNT_CODE = AC.CODE
                                      AND SL.OPER_DAY < TO_DATE('${monthFirstDate}', 'DD.MM.YYYY')
                                          AND ROWNUM = 1) AS SALDO_EQUIVAL_OUT
                                FROM IBS.ACCOUNTS@IABS AC
                                WHERE ${whereQuery})) AS MONTH_BEGIN,
                         (SELECT ABS(ROUND(SUM(SALDO_EQUIVAL_OUT) / POWER(10, 11), 1))
                          FROM (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                               SALDO_EQUIVAL_OUT
                                        FROM IBS.SALDO@IABS SL
                                        WHERE SL.ACCOUNT_CODE = AC.CODE
                                      AND SL.OPER_DAY < TO_DATE('${yearFirstDate}', 'DD.MM.YYYY')
                                          AND ROWNUM = 1) AS SALDO_EQUIVAL_OUT
                                FROM IBS.ACCOUNTS@IABS AC
                                WHERE ${whereQuery})) AS YEAR_BEGIN
                  FROM DUAL)`
  }

  mainIndicatorsQuery(role: string) {
    return function(date: string) {
      return `SELECT 
                           YEAR_BEGIN, 
                           MONTH_BEGIN, 
                           SELECTED_DATE, 
                           DIFFER, 
                           DIFFER_PERCENT 
                    FROM (SELECT * FROM MAININDICATORS ORDER BY OPER_DAY DESC) 
                    WHERE OPER_DAY<TO_DATE('${date}', 'DD-MM-YYYY') AND ROLE='${role}' AND ROWNUM=1`
    }
  }

  async getOneRow(count: string, indicatorName: string,
      codeCoa: string, ownQuery?: OwnQuery, isTableHead: boolean = false) {
    if (!Boolean(codeCoa)) {
      const { YEAR_BEGIN, MONTH_BEGIN,
        SELECTED_DATE, DIFFER, DIFFER_PERCENT } = await this.getDataInDates(
          '',
          ownQuery
      )
      return createMainIndicatorsData(
          count,
          indicatorName,
          YEAR_BEGIN, MONTH_BEGIN,
          SELECTED_DATE, DIFFER,
          DIFFER_PERCENT, isTableHead
      )
    }
    const { YEAR_BEGIN, MONTH_BEGIN,
      SELECTED_DATE, DIFFER, DIFFER_PERCENT } = await this.getDataInDates(codeCoa)
    return createMainIndicatorsData(
        count, indicatorName, YEAR_BEGIN,
        MONTH_BEGIN, SELECTED_DATE, DIFFER,
        DIFFER_PERCENT, isTableHead
    )
  }
}

export default MainIndicatorsMainClass
