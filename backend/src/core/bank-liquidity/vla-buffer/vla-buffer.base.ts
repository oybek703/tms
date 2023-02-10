import { Base } from '../../base'
import { IVlaBufferDbData } from './vla-buffer.interface'

export class VlaBufferBase extends Base {
  protected formatQuery(whereQuery: string): string {
    return `SELECT 'INDICATOR_NAME' AS "indicatorName",
                   0                AS "percentVlaTotal",
                   PERCENT_TOTAL    AS "percentTotal",
                   SALDO_TOTAL      AS "saldoTotal",
                   0                AS "percentVlaUzs",
                   PERCENT_UZS      AS "percentUzs",
                   SALDO_UZS        AS "saldoUzs",
                   0                AS "percentVlaUsd",
                   PERCENT_USD      AS "percentUsd",
                   SALDO_USD        AS "saldoUsd"
            FROM (SELECT NVL(ROUND(SUM(SALDO_EQUIVAL_OUT) * 100 / AVG(TOTAL_ASSETS), 2), 0) AS PERCENT_TOTAL,
                         ABS(NVL(ROUND(SUM(SALDO_EQUIVAL_OUT) / POWER(10, 8), 2), 0))       AS SALDO_TOTAL
                  FROM (SELECT BAL,
                               SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ              AS SALDO_EQUIVAL_OUT,
                               SUM(SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ) OVER () AS TOTAL_ASSETS
                        FROM IBS.SVOD_SALDO_DUMP@IABS
                        WHERE DAT = DATE '${this.date}'
                          AND (BAL LIKE '1%' AND SUBSTR(BAL, 1, 3) NOT IN ('161', '175')))
                  WHERE (${whereQuery})),
                 (SELECT NVL(ROUND(SUM(SALDO_EQUIVAL_OUT) * 100 / AVG(TOTAL_ASSETS), 2), 0) AS PERCENT_UZS,
                         ABS(NVL(ROUND(SUM(SALDO_EQUIVAL_OUT) / POWER(10, 8), 2), 0))       AS SALDO_UZS
                  FROM (SELECT BAL,
                               SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ              AS SALDO_EQUIVAL_OUT,
                               SUM(SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ) OVER () AS TOTAL_ASSETS
                        FROM IBS.SVOD_SALDO_DUMP@IABS
                        WHERE DAT = DATE '${this.date}'
                          AND (BAL LIKE '1%' AND SUBSTR(BAL, 1, 3) NOT IN ('161', '175'))
                          AND VAL = '000')
                  WHERE (${whereQuery})),
                 (SELECT PERCENT_TOTAL                                      AS PERCENT_USD,
                         ROUND(SALDO_EQUIVAL_OUT / (SELECT EQUIVAL
                                                    FROM IBS.S_RATE_CUR@IABS
                                                    WHERE DATE_CROSS = DATE '${this.date}'
                                                      AND CODE = '840'), 2) AS SALDO_USD
                  FROM (SELECT NVL(ROUND(SUM(SALDO_EQUIVAL_OUT) * 100 / AVG(TOTAL_ASSETS), 2), 0) AS PERCENT_TOTAL,
                               ABS(NVL(ROUND(SUM(SALDO_EQUIVAL_OUT) / POWER(10, 8), 2), 0))       AS SALDO_EQUIVAL_OUT
                        FROM (SELECT BAL,
                                     SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ              AS SALDO_EQUIVAL_OUT,
                                     SUM(SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ) OVER () AS TOTAL_ASSETS
                              FROM IBS.SVOD_SALDO_DUMP@IABS
                              WHERE DAT = DATE '${this.date}'
                                AND (BAL LIKE '1%' AND SUBSTR(BAL, 1, 3) NOT IN ('161', '175'))
                                AND VAL != '000')
                        WHERE (${whereQuery})))`
  }

  addValuesByProperty(indicatorName: string, ...args: IVlaBufferDbData[]) {
    const data = args.reduce((acc: IVlaBufferDbData, val: IVlaBufferDbData) => {
      for (const valKey in val) {
        if (valKey !== 'indicatorName') {
          if (!acc[valKey]) acc[valKey] = 0
          acc[valKey] += val[valKey]
        }
      }
      return acc
    }, {} as IVlaBufferDbData)
    return {
      indicatorName,
      ...data
    }
  }

  private async getOneRow(whereQuery: string, indicatorName: string) {
    await this.getBeforeDate()
    const res = await this.getDataInDates<IVlaBufferDbData>(whereQuery)
    return { ...res, indicatorName }
  }

  private async government_bills() {
    return await this.getOneRow(`BAL LIKE '107%'`, 'ГЦБ')
  } /* ГЦБ */

  private async overnight() {
    return await this.getOneRow(`BAL='10521'`, 'Овернайт(USD)')
  } /* Овернайт(USD) */

  private async cb_deposits() {
    return await this.getOneRow(`BAL IN ('10321', '10331')`, 'Депозиты в ЦБ Руз')
  } /* Депозиты в ЦБ Руз */

  private income_bringing(args: IVlaBufferDbData[]) {
    return this.addValuesByProperty('Доходприносяюший', ...args)
  } /* Доходприносяюший */

  private async nostro_in_cb() {
    return await this.getOneRow(`BAL='10301'`, 'Ностро счет в ЦБ Руз')
  } /* Ностро счет в ЦБ Руз */

  private async receivable_funds() {
    return await this.getOneRow(`BAL='10311'`, 'Средства к получению ЦБ')
  } /* Средства к получению ЦБ */

  private async cliring_in_cb() {
    return await this.getOneRow(`BAL='10315'`, 'Клиринг ЦБ')
  } /* Клиринг ЦБ */

  // TODO Ностро(-востро)

  // TODO Востро(локальных банки)

  private async cash() {
    return await this.getOneRow(`BAL LIKE '101%'`, 'Касса')
  } /* Касса */

  private non_profitable(args: IVlaBufferDbData[]) {
    return this.addValuesByProperty('Доходнеприносяюший', ...args)
  } /* Доходнеприносяюший */

  private high_liquidity_assets(...args: IVlaBufferDbData[]) {
    return this.addValuesByProperty('ИТОГО ВЫСОКО ликвидных активов', ...args)
  } /* ИТОГО ВЫСОКО ликвидных активов */

  async getRows() {
    const incomes = await Promise.all([
      this.government_bills(),
      this.overnight(),
      this.cb_deposits()
    ])
    let incomeBringing = this.income_bringing(incomes)
    const nonProfits = await Promise.all([
      this.nostro_in_cb(),
      this.receivable_funds(),
      this.cliring_in_cb(),
      this.cash()
    ])
    let nonProfitable = this.non_profitable(nonProfits)
    let highLiquidityAssets = this.high_liquidity_assets(incomeBringing, nonProfitable)
    // Calculate vla percentages
    incomes.forEach(income => {
      income.percentVlaTotal = (income.saldoTotal * 100) / highLiquidityAssets.saldoTotal
      income.percentVlaUzs = (income.saldoUzs * 100) / highLiquidityAssets.saldoUzs
      income.percentVlaUsd = (income.saldoUsd * 100) / highLiquidityAssets.saldoUsd
    })
    nonProfits.forEach(nonProfit => {
      nonProfit.percentVlaTotal = (nonProfit.saldoTotal * 100) / highLiquidityAssets.saldoTotal
      nonProfit.percentVlaUzs = (nonProfit.saldoUzs * 100) / highLiquidityAssets.saldoUzs
      nonProfit.percentVlaUsd = (nonProfit.saldoUsd * 100) / highLiquidityAssets.saldoUsd
    })
    incomeBringing = this.income_bringing(incomes)
    nonProfitable = this.non_profitable(nonProfits)
    highLiquidityAssets = this.high_liquidity_assets(incomeBringing, nonProfitable)
    return [incomes, incomeBringing, nonProfits, nonProfitable, highLiquidityAssets]
  }
}
