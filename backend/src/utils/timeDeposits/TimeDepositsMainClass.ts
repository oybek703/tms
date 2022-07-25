import MainClass from '../mainClass'
import TimeDepoClients from '../timeDepoClients/TimeDepoClients'

class TimeDepositsMainClass extends MainClass {
  constructor(date: string) {
    super(date)
  }

  async getSumByCurrency(array = []) {
    const usdCurrency = await this.getCurrencyRate('840', true)
    const eurCurrency = await this.getCurrencyRate('978', true)
    const [uzs, usd, eur] = ['000', '840', '978']
        .map((currency) => array.reduce((acc, val) => {
          if (val['CURRENCY_CODE'] === currency) {
            acc+=val['SALDO_OUT']
          }
          return acc
        }, 0))
    return [uzs, usd*usdCurrency, eur*eurCurrency]
  }

  formatQuery(date: string) {
    /* eslint-disable max-len */
    return `SELECT FILIAL_NAME,
                   NVL(YEAR_BEGIN, 0)                                        YEAR_BEGIN,
                   NVL(MONTH_BEGIN, 0)                                       MONTH_BEGIN,
                   NVL(SELECTED_DATE, 0)                                     SELECTED_DATE,
                   NVL(SELECTED_DATE - YEAR_BEGIN, 0)                        CHANGE_FROM_YB,
                   NVL(TRUNC(SELECTED_DATE / YEAR_BEGIN, 2) * 100 - 100, 0)  CHANGE_FROM_YB_PERCENT,
                   NVL(SELECTED_DATE - MONTH_BEGIN, 0)                       CHANGE_FROM_MB,
                   NVL(TRUNC(SELECTED_DATE / MONTH_BEGIN, 2) * 100 - 100, 0) CHANGE_FROM_MB_PERCENT,
                   COUNT_IN_DATE,
                   NVL(SUM_IN_DATE, 0)                                       SUM_IN_DATE,
                   COUNT_IN_MONTH,
                   NVL(SUM_IN_MONTH, 0)                                      SUM_IN_MONTH
            FROM (SELECT FLS.FILIAL_NAME                                         FILIAL_NAME,
                         YEAR_BEGIN,
                         MONTH_BEGIN,
                         SELECTED_DATE,
                         (SELECT COUNT(*)
                          FROM TIME_DEPO_CLIENTS
                          WHERE TO_DATE(DATE_END, 'DD.MM.YYYY') = TO_DATE('${date}', 'DD.MM.YYYY')
                            AND FILIAL_NAME = FLS.FILIAL_NAME
                            AND OPER_DAY = (SELECT MAX(OPER_DAY)
                          FROM TIME_DEPO_CLIENTS
                          WHERE OPER_DAY < TO_DATE('${date}', 'DD.MM.YYYY'))) COUNT_IN_DATE,
                         (SELECT TRUNC(SUM(SALDO_EQUIVALENT_OUT / POWER(10, 6)), 1)
                          FROM TIME_DEPO_CLIENTS
                          WHERE TO_DATE(DATE_END, 'DD.MM.YYYY') = TO_DATE('${date}', 'DD.MM.YYYY')
                            AND FILIAL_NAME = FLS.FILIAL_NAME
                            AND OPER_DAY = (SELECT MAX(OPER_DAY)
                          FROM TIME_DEPO_CLIENTS
                          WHERE OPER_DAY < TO_DATE('${date}', 'DD.MM.YYYY'))) SUM_IN_DATE,
                         (SELECT COUNT(*)
                          FROM TIME_DEPO_CLIENTS
                          WHERE TO_CHAR(DATE_END, 'MM.YYYY') = TO_CHAR(TO_DATE('${date}', 'DD.MM.YYYY'), 'MM.YYYY')
                            AND FILIAL_NAME = FLS.FILIAL_NAME
                            AND OPER_DAY = (SELECT MAX(OPER_DAY)
                          FROM TIME_DEPO_CLIENTS
                          WHERE OPER_DAY < TO_DATE('${date}', 'DD.MM.YYYY'))) COUNT_IN_MONTH,
                         (SELECT TRUNC(SUM(SALDO_EQUIVALENT_OUT) / POWER(10, 6), 1)
                          FROM TIME_DEPO_CLIENTS
                          WHERE TO_CHAR(DATE_END, 'MM.YYYY') = TO_CHAR(TO_DATE('${date}', 'DD.MM.YYYY'), 'MM.YYYY')
                            AND FILIAL_NAME = FLS.FILIAL_NAME
                            AND OPER_DAY = (SELECT MAX(OPER_DAY)
                          FROM TIME_DEPO_CLIENTS
                          WHERE OPER_DAY < TO_DATE('${date}', 'DD.MM.YYYY'))) SUM_IN_MONTH
                  FROM (SELECT UNIQUE FILIAL_NAME FROM TIME_DEPO_CLIENTS) FLS
                           LEFT JOIN (SELECT FILIAL_NAME, ROUND(SUM(SALDO_EQUIVALENT_OUT) / POWER(10, 6), 1) YEAR_BEGIN
                                      FROM (SELECT * FROM TIME_DEPO_CLIENTS ORDER BY OPER_DAY DESC)
                                      WHERE OPER_DAY = (SELECT MIN(OPER_DAY) YEAR_BEGIN
                                                        FROM TIME_DEPO_CLIENTS
                                                        WHERE TO_CHAR(OPER_DAY, 'YYYY') = TO_CHAR(TO_DATE('${date}', 'DD.MM.YYYY'), 'YYYY'))
                                      GROUP BY FILIAL_NAME) YB ON FLS.FILIAL_NAME = YB.FILIAL_NAME
                           LEFT JOIN (SELECT FILIAL_NAME,
                                             ROUND(SUM(SALDO_EQUIVALENT_OUT) / POWER(10, 6), 1) MONTH_BEGIN
                                      FROM (SELECT * FROM TIME_DEPO_CLIENTS ORDER BY OPER_DAY DESC)
                                      WHERE OPER_DAY = (SELECT MIN(OPER_DAY) MONTH_BEGIN
                                                        FROM TIME_DEPO_CLIENTS
                                                        WHERE TO_CHAR(OPER_DAY, 'YYYY.MM') = TO_CHAR(TO_DATE('${date}', 'DD.MM.YYYY'), 'YYYY.MM'))
                                      GROUP BY FILIAL_NAME) MB ON FLS.FILIAL_NAME = MB.FILIAL_NAME
                           LEFT JOIN (SELECT FILIAL_NAME, ROUND(SUM(SALDO_EQUIVALENT_OUT) / POWER(10, 6), 1) SELECTED_DATE
                                      FROM (SELECT * FROM TIME_DEPO_CLIENTS ORDER BY OPER_DAY DESC)
                                      WHERE OPER_DAY = (SELECT MAX(OPER_DAY)
                                                        FROM TIME_DEPO_CLIENTS
                                                        WHERE OPER_DAY < TO_DATE('${date}', 'DD.MM.YYYY'))
                                      GROUP BY FILIAL_NAME) SD ON FLS.FILIAL_NAME = SD.FILIAL_NAME)`
    /* eslint-disable max-len */
  }

  // @ts-ignore
  async getRows(date: string) {
    const { monthFirstDate } = this.dates
    const TdcInDate = await new TimeDepoClients(date).getRows()
    const TdcInMonthBegin = await new TimeDepoClients(monthFirstDate).getRows()
    const currentBalance = await this.getSumByCurrency(TdcInDate)
    const balanceInMonthBegin = await this.getSumByCurrency(TdcInMonthBegin)
    const tableData = await this.getDataInDates('1=1', null, true)
    return { tableData, currentBalance, balanceInMonthBegin }
  }
}

export default TimeDepositsMainClass
