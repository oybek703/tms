import { Base } from '../base'

export class Deposits extends Base {
  protected formatQuery(whereQuery: string): string {
    return ''
  }

  protected timeDepositsQuery = () => {
    return `SELECT TRUNC((USD + EUR + JPY) / POWER(10, 11), 2) AS "others",
                   TRUNC(UZS / POWER(10, 11), 2)                  "uzs"
            FROM (SELECT * FROM DASHBOARD_DEPOSIT ORDER BY OPER_DAY DESC)
            WHERE ROLE = 'T_D'
              AND OPER_DAY <= DATE '${this.date}'
              AND ROWNUM = 1`
  }

  protected currencyMfiQuery = () => {
    return `SELECT TRUNC(SUM(UZS) / POWER(10, 11), 2) "uzs",
                   TRUNC(SUM(USD) / POWER(10, 11), 2) "usd",
                   TRUNC(SUM(EUR) / POWER(10, 11), 2) "eur",
                   TRUNC(SUM(JPY) / POWER(10, 11), 2) "jpy"
            FROM DASHBOARD_DEPOSIT
            WHERE OPER_DAY = DATE '${this.date}'
              AND ROLE IN ('IFI_short', 'IFI_long')`
  }

  protected currencyTimeDepositsQuery = () => {
    return `SELECT TRUNC(UZS / POWER(10, 11), 2) "uzs",
                   TRUNC(USD / POWER(10, 11), 2) "usd",
                   TRUNC(EUR / POWER(10, 11), 2) "eur"
            FROM (SELECT * FROM DASHBOARD_DEPOSIT ORDER BY OPER_DAY DESC)
            WHERE ROLE = 'T_D'
              AND OPER_DAY <= DATE '${this.date}'
              AND ROWNUM = 1`
  }

  protected interbankDepositsQuery = () => {
    return `SELECT (SELECT ROUND((UZS + USD + EUR + JPY) / POWER(10, 9), 2)
                    FROM (SELECT * FROM DASHBOARD_DEPOSIT ORDER BY OPER_DAY DESC)
                    WHERE ROLE = 'Land'
                      AND OPER_DAY <= DATE '${this.date}'
                      AND ROWNUM = 1) AS "borrow",
                   (SELECT ROUND((UZS + USD + EUR + JPY) / POWER(10, 9), 2)
                    FROM (SELECT * FROM DASHBOARD_DEPOSIT ORDER BY OPER_DAY DESC)
                    WHERE ROLE = 'Borrow'
                      AND OPER_DAY <= DATE '${this.date}'
                      AND ROWNUM = 1) AS "land"
            FROM DUAL`
  }

  protected fundingStructureQuery = () => {
    return `SELECT ((SELECT ROUND((UZS + USD + EUR + JPY) / POWER(10, 9), 2)
                     FROM (SELECT * FROM DASHBOARD_DEPOSIT ORDER BY OPER_DAY DESC)
                     WHERE ROLE = 'Land'
                       AND OPER_DAY <= DATE '${this.date}'
                       AND ROWNUM = 1) + (SELECT ROUND((UZS + USD + EUR + JPY) / POWER(10, 9), 2)
                                          FROM (SELECT * FROM DASHBOARD_DEPOSIT ORDER BY OPER_DAY DESC)
                                          WHERE ROLE = 'Borrow'
                                            AND OPER_DAY <= DATE '${this.date}'
                                            AND ROWNUM = 1)) AS "mbd",
                   (SELECT TRUNC((USD + EUR + JPY + UZS) / POWER(10, 11), 2)
                    FROM (SELECT * FROM DASHBOARD_DEPOSIT ORDER BY OPER_DAY DESC)
                    WHERE ROLE = 'T_D'
                      AND OPER_DAY <= DATE '${this.date}'
                      AND ROWNUM = 1)                        AS "td",
                   (SELECT TRUNC(SUM(UZS + USD + EUR + JPY) / POWER(10, 11), 2)
                    FROM DASHBOARD_DEPOSIT
                    WHERE OPER_DAY = DATE '${this.date}'
                      AND ROLE = 'IFI_short')                AS "mfiShort",
                   (SELECT TRUNC(SUM(UZS + USD + EUR + JPY) / POWER(10, 11), 2)
                    FROM DASHBOARD_DEPOSIT
                    WHERE OPER_DAY = DATE '${this.date}'
                      AND ROLE = 'IFI_long')                 AS "mfiLong"
            FROM DUAL`
  }

  protected currencyMBDQuery = () => {
    return `SELECT (SELECT ROUND(UZS / POWER(10, 9), 2)
                    FROM (SELECT * FROM DASHBOARD_DEPOSIT ORDER BY OPER_DAY DESC)
                    WHERE ROLE = 'Borrow'
                      AND OPER_DAY <= DATE '${this.date}'
                      AND ROWNUM = 1) AS "uzs",
                   (SELECT ROUND(USD / POWER(10, 9), 2)
                    FROM (SELECT * FROM DASHBOARD_DEPOSIT ORDER BY OPER_DAY DESC)
                    WHERE ROLE = 'Borrow'
                      AND OPER_DAY <= DATE '${this.date}'
                      AND ROWNUM = 1) AS "usd",
                   (SELECT ROUND(EUR / POWER(10, 9), 2)
                    FROM (SELECT * FROM DASHBOARD_DEPOSIT ORDER BY OPER_DAY DESC)
                    WHERE ROLE = 'Borrow'
                      AND OPER_DAY <= DATE '${this.date}'
                      AND ROWNUM = 1) AS "eur"
            FROM DUAL`
  }

  protected async time_deposits() {
    const { others, uzs } = await this.getDataInDates<{ others: number; uzs: number }>(
      undefined,
      this.timeDepositsQuery
    )
    return [others, uzs].map(v => Number(v || 0).toFixed(2))
  }

  protected async currency_mfi() {
    const { uzs, jpy, usd, eur } = await this.getDataInDates<{
      uzs: number
      usd: number
      eur: number
      jpy: number
    }>(undefined, this.currencyMfiQuery)
    return [uzs, usd, eur, jpy].map(v => Number(v || 0).toFixed(2))
  }

  protected async currency_time_deposits() {
    const { uzs, usd, eur } = await this.getDataInDates<{ uzs: number; usd: number; eur: number }>(
      undefined,
      this.currencyTimeDepositsQuery
    )
    return [uzs, usd, eur].map(v => Number(v || 0).toFixed(2))
  }

  protected async interbank_deposits() {
    const { land, borrow } = await this.getDataInDates<{ land: number; borrow: number }>(
      undefined,
      this.interbankDepositsQuery
    )
    return [land, borrow].map(v => Number(v || 0).toFixed(2))
  }

  protected async funding_structure() {
    const { mbd, td, mfiLong, mfiShort } = await this.getDataInDates<{
      mbd: number
      td: number
      mfiShort: number
      mfiLong: number
    }>(undefined, this.fundingStructureQuery)
    return [mbd, td, mfiLong, mfiShort].map(v => Number(v || 0).toFixed(2))
  }

  protected async currency_mbd() {
    const { uzs, usd, eur } = await this.getDataInDates<{ uzs: number; usd: number; eur: number }>(
      undefined,
      this.currencyMBDQuery
    )
    return [uzs, usd, eur].map(v => Number(v || 0).toFixed(2))
  }

  async getRows() {
    const [
      timeDeposits,
      currencyMfi,
      currencyTimeDeposits,
      interbankDeposits,
      fundingStructure,
      currencyMBD
    ] = await Promise.all([
      this.time_deposits(),
      this.currency_mfi(),
      this.currency_time_deposits(),
      this.interbank_deposits(),
      this.funding_structure(),
      this.currency_mbd()
    ])
    return [
      timeDeposits,
      currencyMfi,
      currencyTimeDeposits,
      interbankDeposits,
      fundingStructure,
      currencyMBD
    ]
  }
}
