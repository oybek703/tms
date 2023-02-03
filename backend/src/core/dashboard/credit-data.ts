import { Base } from '../base'
import { OwnQuery } from '../core.interface'

export class CreditData extends Base {
  // ADDED TOXIC(Токсич.) AND DELAYED(Просрочка) CREDITS
  private queries = [`AND CREDIT_STATUS IN (0, 1, 2)`, `AND CREDIT_STATUS = 2`]
  private currencyCodes = ['000', '840', '978']

  protected formatQuery(whereQuery = '') {
    return `SELECT TRUNC(SUM(TOTAL_LOAN) / POWER(10, 6), 2) AS "sum"
            FROM CR.VIEW_CREDITS_DWH@RISK
            WHERE OPER_DAY = DATE '${this.date}' ${whereQuery}`
  }

  private delayedAndToxicQuery = () => {
    return `SELECT (DELAYED + TOXIC) AS "sum"
            FROM ((SELECT TRUNC(SUM(TOTAL_LOAN) / POWER(10, 6), 2) TOXIC
                   FROM CR.VIEW_CREDITS_DWH@RISK
                   WHERE OPER_DAY = DATE '${this.date}'
                     AND CREDIT_STATUS = 1)),
                 (SELECT TRUNC(SUM(OVERDUE_SALDO) / POWER(10, 6), 2) DELAYED
                  FROM CR.VIEW_CREDITS_DWH@RISK
                  WHERE OPER_DAY = DATE '${this.date}')`
  }

  private disaggregatedQuery = (termType: number) => {
    return `SELECT TRUNC(SUM(TOTAL_LOAN) / POWER(10, 6), 2) AS "sum"
            FROM CR.VIEW_CREDITS_DWH@RISK
            WHERE OPER_DAY = DATE '${this.date}'
              AND TERM_LOAN_TYPE = ${termType}`
  }

  private getMaxOperDayQuery = () => {
    return `SELECT TO_CHAR(DECODE((DATE '${this.date}'), TRUNC(SYSDATE, 'DD'),
                                  (SELECT MAX(OPER_DAY) FROM IBS.DAY_OPERATIONAL@IABS WHERE DAY_STATUS = 1),
                                  DATE '${this.date}'), 'YYYY-MM-DD') AS "maxOperDay"
            FROM DUAL`
  }

  private issuedCreditsQuery = (codeCurrency: string, maxOperDay: Date) => {
    const power = codeCurrency === '000' ? 9 : 10
    return `SELECT ROUND(NVL(SUM(DEBIT_EQUIVAL) / POWER(10, ${power}), 0), 2) AS "sum"
            FROM CR.LOANS_ISSUED_DWH@RISK
            WHERE OPER_DAY = DATE '${maxOperDay}'
              AND CODE_CURRENCY = ${codeCurrency}`
  }

  private async getOneRow(whereQuery: string, ownQuery?: OwnQuery) {
    const { sum } = await this.getDataInDates<{ sum: number }>(whereQuery, ownQuery)
    return Number(sum).toFixed(2)
  }

  private async issued_credits() {
    const { maxOperDay } = await this.getDataInDates<{ maxOperDay: Date }>(
      undefined,
      this.getMaxOperDayQuery
    )
    return await Promise.all(
      this.currencyCodes.map(c =>
        this.getOneRow(undefined, this.issuedCreditsQuery.bind(this, c, maxOperDay))
      )
    )
  } /* Выдача кредитов */

  private async standard_credits() {
    return this.getOneRow(`AND CREDIT_STATUS=0`)
  } /* Стандартние  кредиты */

  private async delayed_and_toxic() {
    return await this.getOneRow(undefined, this.delayedAndToxicQuery)
  } /* Просрочка & Токсич. */

  private async disaggregated_by_time() {
    return await Promise.all(
      [1, 3].map(t => this.getOneRow(undefined, this.disaggregatedQuery.bind(this, t)))
    )
  } /* В разбивке по срокам */

  async getRows() {
    try {
      const mappedPromises = this.queries.map(where => this.getOneRow(where))
      const [disaggregatedByTime, issuedCredits] = await Promise.all([
        this.disaggregated_by_time(),
        this.issued_credits()
      ])
      const creditPart = await Promise.all([
        ...mappedPromises,
        this.delayed_and_toxic(),
        this.standard_credits()
      ])
      return [creditPart, disaggregatedByTime, issuedCredits]
    } catch (e) {
      console.log(e)
      return new Array(3).fill([])
    }
  }
}
