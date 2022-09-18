import MainClass, { OwnQuery } from '../mainClass'

interface VlaBufferCellInterface {
  indicatorName?: string
  percentTotal: number
  total: number
  percentUzs: number
  uzs: number
  percentForeign: number
  foreign: number
}

/* eslint-disable camelcase */
class VlaBufferMainClass extends MainClass {
  constructor(date: string) {
    super(date)
  }

  addValuesByProperty(indicatorName: string, ...args: VlaBufferCellInterface[]) {
    const data = args.reduce((acc: VlaBufferCellInterface, val: VlaBufferCellInterface) => {
      // eslint-disable-next-line guard-for-in
      for (const valKey in val) {
        if (valKey !== 'indicatorName') { // @ts-ignore
          if (!acc[valKey]) acc[valKey] = 0
          // @ts-ignore
          acc[valKey]+= val[valKey]
        }
      }
      return acc
    }, {} as VlaBufferCellInterface)
    return {
      indicatorName,
      ...data
    }
  }

  formatQuery(date: string, whereQuery = '1=1') {
    return `SELECT 'INDICATOR_NAME'          AS "indicatorName",
                   PERCENT_TOTAL             AS "totalPercent",
                   SALDO_EQUIVAL_OUT_TOTAL   AS "total",
                   PERCENT_UZS               AS "uzsPercent",
                   SALDO_EQUIVAL_OUT_UZS     AS "uzs",
                   PERCENT_FORIEGN           AS "foreignPercent",
                   SALDO_EQUIVAL_OUT_FOREIGN AS "foreign"
            FROM (SELECT NVL(ABS(ROUND(SUM(SALDO_EQUIVAL_OUT) * 100 / AVG(TOTAL_ASSETS), 2)), 0) AS PERCENT_TOTAL,
                         NVL(ABS(ROUND(SUM(SALDO_EQUIVAL_OUT) / 100, 2)), 0)                     AS SALDO_EQUIVAL_OUT_TOTAL
                  FROM (SELECT BAL,
                               SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ              AS SALDO_EQUIVAL_OUT,
                               SUM(SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ) OVER () AS TOTAL_ASSETS
                        FROM IBS.SVOD_SALDO_DUMP@IABS
                        WHERE DAT = TO_DATE('${date}', 'DD.MM.YYYY')
                          AND BAL LIKE '1%'
                          AND SUBSTR(BAL, 1, 3) NOT IN ('161', '175'))
                  WHERE (${whereQuery})),
                 (SELECT NVL(ABS(ROUND(SUM(SALDO_EQUIVAL_OUT) * 100 / AVG(TOTAL_ASSETS), 2)), 0) AS PERCENT_UZS,
                         NVL(ABS(ROUND(SUM(SALDO_EQUIVAL_OUT) / 100, 2)), 0)                     AS SALDO_EQUIVAL_OUT_UZS
                  FROM (SELECT BAL,
                               SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ              AS SALDO_EQUIVAL_OUT,
                               SUM(SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ) OVER () AS TOTAL_ASSETS
                        FROM IBS.SVOD_SALDO_DUMP@IABS
                        WHERE DAT = TO_DATE('${date}', 'DD.MM.YYYY')
                          AND BAL LIKE '1%'
                          AND SUBSTR(BAL, 1, 3) NOT IN ('161', '175')
                          AND VAL = '000')
                  WHERE (${whereQuery})),
                 (SELECT NVL(ABS(ROUND(SUM(SALDO_EQUIVAL_OUT) * 100 / AVG(TOTAL_ASSETS), 2)), 0) AS PERCENT_FORIEGN,
                         NVL(ABS(ROUND(SUM(SALDO_EQUIVAL_OUT) / 100, 2)), 0)                     AS SALDO_EQUIVAL_OUT_FOREIGN
                  FROM (SELECT BAL,
                               SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ              AS SALDO_EQUIVAL_OUT,
                               SUM(SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ) OVER () AS TOTAL_ASSETS
                        FROM IBS.SVOD_SALDO_DUMP@IABS
                        WHERE DAT = TO_DATE('${date}', 'DD.MM.YYYY')
                          AND BAL LIKE '1%'
                          AND SUBSTR(BAL, 1, 3) NOT IN ('161', '175')
                          AND VAL != '000')
                  WHERE (${whereQuery}))`
  }

  totalAssetsQuery(date: string) {
    return `SELECT TOTAL_ASSETS_TOTAL   AS "total",
                   TOTAL_ASSETS_UZS     AS "uzs",
                   TOTAL_ASSETS_FOREIGN AS "foreign"
            FROM (SELECT NVL(ABS(ROUND(AVG(TOTAL_ASSETS) / 100, 2)), 0) AS TOTAL_ASSETS_TOTAL
                  FROM (SELECT BAL,
                               SUM(SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ) OVER () AS TOTAL_ASSETS
                        FROM IBS.SVOD_SALDO_DUMP@IABS
                        WHERE DAT = TO_DATE('${date}', 'DD.MM.YYYY')
                          AND BAL LIKE '1%'
                          AND BAL NOT LIKE '161%'
                          AND BAL NOT LIKE '175%')),
                 (SELECT NVL(ABS(ROUND(AVG(TOTAL_ASSETS) / 100, 2)), 0) AS TOTAL_ASSETS_UZS
                  FROM (SELECT BAL,
                               SUM(SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ) OVER () AS TOTAL_ASSETS
                        FROM IBS.SVOD_SALDO_DUMP@IABS
                        WHERE DAT = TO_DATE('${date}', 'DD.MM.YYYY')
                          AND BAL LIKE '1%'
                          AND BAL NOT LIKE '161%'
                          AND BAL NOT LIKE '175%'
                          AND VAL = '000')),
                 (SELECT NVL(ABS(ROUND(AVG(TOTAL_ASSETS) / 100, 2)), 0) AS TOTAL_ASSETS_FOREIGN
                  FROM (SELECT BAL,
                               SUM(SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ) OVER () AS TOTAL_ASSETS
                        FROM IBS.SVOD_SALDO_DUMP@IABS
                        WHERE DAT = TO_DATE('${date}', 'DD.MM.YYYY')
                          AND BAL LIKE '1%'
                          AND BAL NOT LIKE '161%'
                          AND BAL NOT LIKE '175%'
                          AND VAL != '000'))`
  }

  async getOneRow(whereQuery: string, indicatorName: string, ownQuery: OwnQuery = null) {
    await this.getBeforeDate()
    const res = ownQuery ? await this.getDataInDates('', ownQuery) : await this.getDataInDates(whereQuery)
    return { ...res, indicatorName }
  }

  async correspondent_account() {/* Корреспондентский счет */
    return await this.getOneRow(
        `BAL LIKE '103%' OR BAL='10501'`,
        'Корреспондентский счет'
    )
  } /* Корреспондентский счет */

  async cash() {/* Касса */
    return await this.getOneRow(
        `BAL LIKE '101%'`,
        'Касса'
    )
  } /* Касса */

  income_generating_assets(governBills: VlaBufferCellInterface, overnight: VlaBufferCellInterface) {/* Доходприносяюший активы */
    return this.addValuesByProperty('Доходприносяюший активы', governBills, overnight)
  } /* Доходприносяюший активы */

  async government_bills() {/* Гос. ценные бумаги */
    return await this.getOneRow(
        `BAL LIKE '107%'`,
        'Гос. ценные бумаги'
    )
  } /* Гос. ценные бумаги */

  async overnight() {/* Овернайт */
    return await this.getOneRow(
        `BAL='10521'`,
        'Овернайт'
    )
  } /* Овернайт */

  high_liquidity_assets(corrAccount: VlaBufferCellInterface, cash: VlaBufferCellInterface, incGenAssets: VlaBufferCellInterface) {/* ИТОГО ВЫСОКО ликвидных активов */
    return this.addValuesByProperty('ИТОГО ВЫСОКО ликвидных активов', corrAccount, cash, incGenAssets)
  } /* ИТОГО ВЫСОКО ликвидных активов */

  async total_assets() {/* Все активы(чистые) */
    return await this.getOneRow(
        '',
        'Все активы(чистые)',
        this.totalAssetsQuery
    )
  } /* Все активы(чистые) */

  async getRows() {
    const [
      correspondentAccount,
      cash, governmentBills,
      overnight, totalAssets
    ] = await Promise.all([
      this.correspondent_account(),
      this.cash(), this.government_bills(),
      this.overnight(), this.total_assets()
    ])
    const incomeGeneratingAssets = this.income_generating_assets(governmentBills, overnight)
    const highLiquidityAssets = this.high_liquidity_assets(correspondentAccount, cash, incomeGeneratingAssets)
    return [
      correspondentAccount,
      cash, incomeGeneratingAssets,
      governmentBills, overnight,
      highLiquidityAssets, totalAssets
    ]
  }
}

export default VlaBufferMainClass
