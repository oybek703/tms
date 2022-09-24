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

  passivesQuery(whereQuery = '1=1') {
    return function(date: string) {
      return `SELECT 'INDICATOR_NAME'        AS "indicatorName",
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
                            AND BAL LIKE '2%'
                            AND SUBSTR(BAL, 1, 3) NOT IN ('222', '175'))
                    WHERE (${whereQuery})),
                   (SELECT NVL(ABS(ROUND(SUM(SALDO_EQUIVAL_OUT) * 100 / AVG(TOTAL_ASSETS), 2)), 0) AS PERCENT_UZS,
                           NVL(ABS(ROUND(SUM(SALDO_EQUIVAL_OUT) / 100, 2)), 0)                     AS SALDO_EQUIVAL_OUT_UZS
                    FROM (SELECT BAL,
                                 SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ              AS SALDO_EQUIVAL_OUT,
                                 SUM(SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ) OVER () AS TOTAL_ASSETS
                          FROM IBS.SVOD_SALDO_DUMP@IABS
                          WHERE DAT = TO_DATE('${date}', 'DD.MM.YYYY')
                            AND BAL LIKE '2%'
                            AND SUBSTR(BAL, 1, 3) NOT IN ('222', '175')
                            AND VAL = '000')
                    WHERE (${whereQuery})),
                   (SELECT NVL(ABS(ROUND(SUM(SALDO_EQUIVAL_OUT) * 100 / AVG(TOTAL_ASSETS), 2)), 0) AS PERCENT_FORIEGN,
                           NVL(ABS(ROUND(SUM(SALDO_EQUIVAL_OUT) / 100, 2)), 0)                     AS SALDO_EQUIVAL_OUT_FOREIGN
                    FROM (SELECT BAL,
                                 SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ              AS SALDO_EQUIVAL_OUT,
                                 SUM(SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ) OVER () AS TOTAL_ASSETS
                          FROM IBS.SVOD_SALDO_DUMP@IABS
                          WHERE DAT = TO_DATE('${date}', 'DD.MM.YYYY')
                            AND BAL LIKE '2%'
                            AND SUBSTR(BAL, 1, 3) NOT IN ('222', '175')
                            AND VAL != '000')
                    WHERE (${whereQuery}))`
    }
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
                          AND BAL LIKE '1%' AND BAL NOT LIKE '161%' AND BAL NOT LIKE '175%')),
                 (SELECT NVL(ABS(ROUND(AVG(TOTAL_ASSETS) / 100, 2)), 0) AS TOTAL_ASSETS_UZS
                  FROM (SELECT BAL,
                               SUM(SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ) OVER () AS TOTAL_ASSETS
                        FROM IBS.SVOD_SALDO_DUMP@IABS
                        WHERE DAT = TO_DATE('${date}', 'DD.MM.YYYY')
                          AND BAL LIKE '1%' AND BAL NOT LIKE '161%' AND BAL NOT LIKE '175%' AND VAL = '000')),
                 (SELECT NVL(ABS(ROUND(AVG(TOTAL_ASSETS) / 100, 2)), 0) AS TOTAL_ASSETS_FOREIGN
                  FROM (SELECT BAL,
                               SUM(SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ) OVER () AS TOTAL_ASSETS
                        FROM IBS.SVOD_SALDO_DUMP@IABS
                        WHERE DAT = TO_DATE('${date}', 'DD.MM.YYYY')
                          AND BAL LIKE '1%' AND BAL NOT LIKE '161%' AND BAL NOT LIKE '175%' AND VAL != '000'))`
  }

  totalPassivesQuery(date: string) {
    return `SELECT ROUND(NATIONAL_CURRENCY + FOREIGN_CURRENCY, 2) AS "total",
                 ROUND(NATIONAL_CURRENCY, 2) AS "uzs",
                 ROUND(FOREIGN_CURRENCY, 2) AS "foreign"
            FROM   (SELECT ROUND(SUM(SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ) / 100, 2) AS
                             NATIONAL_CURRENCY
                  FROM   IBS.SVOD_SALDO_DUMP@IABS
                  WHERE  ( BAL LIKE'2%'
                      OR SUBSTR(BAL, 1, 3) = '175' )
                    AND SUBSTR(BAL, 1, 3) != '222'
                    AND DAT = TO_DATE('${date}', 'DD.MM.YYYY')
                    AND VAL = '000'),
                 (SELECT ROUND(SUM(SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ) / 100, 2) AS
                             FOREIGN_CURRENCY
                  FROM   IBS.SVOD_SALDO_DUMP@IABS
                  WHERE  ( BAL LIKE'2%'
                      OR SUBSTR(BAL, 1, 3) = '175' )
                    AND SUBSTR(BAL, 1, 3) != '222'
                    AND DAT = TO_DATE('${date}', 'DD.MM.YYYY')
                    AND VAL != '000')`
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

  high_liquidity_assets(...args: VlaBufferCellInterface[]) {/* ИТОГО ВЫСОКО ликвидных активов */
    return this.addValuesByProperty('ИТОГО ВЫСОКО ликвидных активов', ...args)
  } /* ИТОГО ВЫСОКО ликвидных активов */

  async total_assets() {/* Все активы(чистые) */
    return await this.getOneRow(
        '',
        'Все активы(чистые)',
        this.totalAssetsQuery
    )
  } /* Все активы(чистые) */

  async demand_deposits() {/* Депозиты до востребования */
    return await this.getOneRow(
        '',
        'Депозиты до востребования',
        this.passivesQuery(`BAL LIKE '202%'`)
    )
  } /* Депозиты до востребования */

  async other_client_deposits() {/* Другие депозиты клиентов */
    return await this.getOneRow(
        '',
        'Другие депозиты клиентов',
        this.passivesQuery(`BAL LIKE '226%'`)
    )
  } /* Другие депозиты клиентов */

  async other_liabilities() {/* Другие обязателства */
    return await this.getOneRow(
        '',
        'Другие обязателства',
        this.passivesQuery(`BAL LIKE '298%'`)
    )
  } /* Другие обязателства */

  total_demand_liabilities(...args: VlaBufferCellInterface[]) {/* ИТОГО обязательства до востребования */
    return this.addValuesByProperty('ИТОГО обязательства до востребования', ...args)
  } /* ИТОГО обязательства до востребования */

  async total_passives() {/* ИТОГО пассивов */
    return await this.getOneRow(
        '',
        'ИТОГО пассивов',
        this.totalPassivesQuery
    )
  } /* ИТОГО пассивов */

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
    const liquidityAssets = [
      correspondentAccount, cash, incomeGeneratingAssets,
      governmentBills, overnight, highLiquidityAssets, totalAssets
    ]
    const [
      demandDeposits,
      otherClientDeposits,
      otherLiabilities,
      totalPassives
    ] = await Promise.all([
      this.demand_deposits(),
      this.other_client_deposits(),
      this.other_liabilities(),
      this.total_passives()
    ])
    const totalDemandLiabilities = this.total_demand_liabilities(demandDeposits, otherClientDeposits, otherLiabilities)
    const liabilitiesOnDemand = [demandDeposits, otherClientDeposits, otherLiabilities, totalDemandLiabilities, totalPassives]
    return { liquidityAssets, liabilitiesOnDemand }
  }
}

export default VlaBufferMainClass
