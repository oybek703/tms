const MainClass = require('../mainClass')

class BankLimits extends MainClass {
  constructor (date) {
    super(date)
  }

  formatQuery (date, where_query) {
    return `SELECT NAME,
                   SALDO_EQUIVAL_OUT,
                   NVL(FOREIGN_CURRENCY_22, 0)                                       AS FOREIGN_CURRENCY_22,
                   ROUND(NVL(FOREIGN_CURRENCY_22, 0) - NVL(SALDO_EQUIVAL_OUT, 0), 2) AS DIFFER,
                   CASE
                       WHEN FOREIGN_CURRENCY_22=0 THEN 100
                       ELSE ROUND(SALDO_EQUIVAL_OUT * 100 / FOREIGN_CURRENCY_22, 2)
                   END AS PROGRESS_PERCENT,
                   NVL(FOREIGN_CURRENCY_24, 0)                                       AS FOREIGN_CURRENCY_24
            FROM LIMIT_OF_FOREIGN_BANKS_VIEW`
  }

  async getLimits () {
    return await this.getDataInDates(
      '',
      true,
      false,
      true
    )
  }

  async getRows () {
    return await this.getLimits()
  }
}

module.exports = BankLimits