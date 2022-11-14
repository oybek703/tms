import { Base } from '../../base'
import { IVlaBufferDbData } from './vla-buffer.interface'
import { OwnQuery } from '../../core.interface'

export class VlaBufferBase extends Base {
  protected formatQuery(whereQuery: string): string {
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
                        WHERE DAT = DATE '${this.date}'
                          AND BAL LIKE '1%'
                          AND SUBSTR(BAL, 1, 3) NOT IN ('161', '175'))
                  WHERE (${whereQuery})),
                 (SELECT NVL(ABS(ROUND(SUM(SALDO_EQUIVAL_OUT) * 100 / AVG(TOTAL_ASSETS), 2)), 0) AS PERCENT_UZS,
                         NVL(ABS(ROUND(SUM(SALDO_EQUIVAL_OUT) / 100, 2)), 0)                     AS SALDO_EQUIVAL_OUT_UZS
                  FROM (SELECT BAL,
                               SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ              AS SALDO_EQUIVAL_OUT,
                               SUM(SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ) OVER () AS TOTAL_ASSETS
                        FROM IBS.SVOD_SALDO_DUMP@IABS
                        WHERE DAT = DATE '${this.date}'
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
                        WHERE DAT = DATE '${this.date}'
                          AND BAL LIKE '1%'
                          AND SUBSTR(BAL, 1, 3) NOT IN ('161', '175')
                          AND VAL != '000')
                  WHERE (${whereQuery}))`
  }

  private passivesQuery = (whereQuery = '1=1') => {
    return () => {
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
                          WHERE DAT = DATE '${this.date}'
                            AND BAL LIKE '2%'
                            AND SUBSTR(BAL, 1, 3) NOT IN ('222', '175'))
                    WHERE (${whereQuery})),
                   (SELECT NVL(ABS(ROUND(SUM(SALDO_EQUIVAL_OUT) * 100 / AVG(TOTAL_ASSETS), 2)), 0) AS PERCENT_UZS,
                           NVL(ABS(ROUND(SUM(SALDO_EQUIVAL_OUT) / 100, 2)), 0)                     AS SALDO_EQUIVAL_OUT_UZS
                    FROM (SELECT BAL,
                                 SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ              AS SALDO_EQUIVAL_OUT,
                                 SUM(SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ) OVER () AS TOTAL_ASSETS
                          FROM IBS.SVOD_SALDO_DUMP@IABS
                          WHERE DAT = DATE '${this.date}'
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
                          WHERE DAT = DATE '${this.date}'
                            AND BAL LIKE '2%'
                            AND SUBSTR(BAL, 1, 3) NOT IN ('222', '175')
                            AND VAL != '000')
                    WHERE (${whereQuery}))`
    }
  }

  private totalAssetsQuery = () => {
    return `SELECT TOTAL_ASSETS_TOTAL   AS "total",
                   TOTAL_ASSETS_UZS     AS "uzs",
                   TOTAL_ASSETS_FOREIGN AS "foreign"
            FROM (SELECT NVL(ABS(ROUND(AVG(TOTAL_ASSETS) / 100, 2)), 0) AS TOTAL_ASSETS_TOTAL
                  FROM (SELECT BAL,
                               SUM(SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ) OVER () AS TOTAL_ASSETS
                        FROM IBS.SVOD_SALDO_DUMP@IABS
                        WHERE DAT = DATE '${this.date}'
                          AND BAL LIKE '1%' AND BAL NOT LIKE '161%' AND BAL NOT LIKE '175%')),
                 (SELECT NVL(ABS(ROUND(AVG(TOTAL_ASSETS) / 100, 2)), 0) AS TOTAL_ASSETS_UZS
                  FROM (SELECT BAL,
                               SUM(SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ) OVER () AS TOTAL_ASSETS
                        FROM IBS.SVOD_SALDO_DUMP@IABS
                        WHERE DAT = DATE '${this.date}'
                          AND BAL LIKE '1%' AND BAL NOT LIKE '161%' AND BAL NOT LIKE '175%' AND VAL = '000')),
                 (SELECT NVL(ABS(ROUND(AVG(TOTAL_ASSETS) / 100, 2)), 0) AS TOTAL_ASSETS_FOREIGN
                  FROM (SELECT BAL,
                               SUM(SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ) OVER () AS TOTAL_ASSETS
                        FROM IBS.SVOD_SALDO_DUMP@IABS
                        WHERE DAT = DATE '${this.date}'
                          AND BAL LIKE '1%' AND BAL NOT LIKE '161%' AND BAL NOT LIKE '175%' AND VAL != '000'))`
  }

  private totalPassivesQuery = () => {
    return `SELECT ROUND(NATIONAL_CURRENCY + FOREIGN_CURRENCY, 2) AS "total",
                 ROUND(NATIONAL_CURRENCY, 2) AS "uzs",
                 ROUND(FOREIGN_CURRENCY, 2) AS "foreign"
            FROM   (SELECT ROUND(SUM(SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ) / 100, 2) AS
                             NATIONAL_CURRENCY
                  FROM   IBS.SVOD_SALDO_DUMP@IABS
                  WHERE  ( BAL LIKE'2%'
                      OR SUBSTR(BAL, 1, 3) = '175' )
                    AND SUBSTR(BAL, 1, 3) != '222'
                    AND DAT = DATE '${this.date}'
                    AND VAL = '000'),
                 (SELECT ROUND(SUM(SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ) / 100, 2) AS
                             FOREIGN_CURRENCY
                  FROM   IBS.SVOD_SALDO_DUMP@IABS
                  WHERE  ( BAL LIKE'2%'
                      OR SUBSTR(BAL, 1, 3) = '175' )
                    AND SUBSTR(BAL, 1, 3) != '222'
                    AND DAT = DATE '${this.date}'
                    AND VAL != '000')`
  }

  private addValuesByProperty(indicatorName: string, ...args: IVlaBufferDbData[]) {
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

  private async getOneRow(
    whereQuery: string,
    indicatorName: string,
    ownQuery?: OwnQuery | undefined
  ) {
    await this.getBeforeDate()
    const res = ownQuery
      ? await this.getDataInDates<IVlaBufferDbData>('', ownQuery)
      : await this.getDataInDates<IVlaBufferDbData>(whereQuery, undefined)
    return { ...res, indicatorName }
  }

  private async correspondent_account() {
    return await this.getOneRow(`BAL LIKE '103%' OR BAL='10501'`, 'Корреспондентский счет')
  } /* Корреспондентский счет */

  private async cash() {
    return await this.getOneRow(`BAL LIKE '101%'`, 'Касса')
  } /* Касса */

  private income_generating_assets(governBills: IVlaBufferDbData, overnight: IVlaBufferDbData) {
    return this.addValuesByProperty('Доходприносяюший активы', governBills, overnight)
  } /* Доходприносяюший активы */

  private async government_bills() {
    return await this.getOneRow(`BAL LIKE '107%'`, 'Гос. ценные бумаги')
  } /* Гос. ценные бумаги */

  private async overnight() {
    return await this.getOneRow(`BAL='10521'`, 'Овернайт')
  } /* Овернайт */

  private high_liquidity_assets(...args: IVlaBufferDbData[]) {
    return this.addValuesByProperty('ИТОГО ВЫСОКО ликвидных активов', ...args)
  } /* ИТОГО ВЫСОКО ликвидных активов */

  private async total_assets() {
    return await this.getOneRow('', 'Все активы(чистые)', this.totalAssetsQuery)
  } /* Все активы(чистые) */

  private async demand_deposits() {
    return await this.getOneRow(
      '',
      'Депозиты до востребования',
      this.passivesQuery(`BAL LIKE '202%'`)
    )
  } /* Депозиты до востребования */

  private async other_client_deposits() {
    return await this.getOneRow(
      '',
      'Другие депозиты клиентов',
      this.passivesQuery(`BAL LIKE '226%'`)
    )
  } /* Другие депозиты клиентов */

  private async other_liabilities() {
    return await this.getOneRow('', 'Другие обязателства', this.passivesQuery(`BAL LIKE '298%'`))
  } /* Другие обязателства */

  private total_demand_liabilities(...args: IVlaBufferDbData[]) {
    return this.addValuesByProperty('ИТОГО обязательства до востребования', ...args)
  } /* ИТОГО обязательства до востребования */

  private async total_passives() {
    return await this.getOneRow('', 'ИТОГО пассивов', this.totalPassivesQuery)
  } /* ИТОГО пассивов */

  async getRows() {
    const [correspondentAccount, cash, governmentBills, overnight, totalAssets] = await Promise.all(
      [
        this.correspondent_account(),
        this.cash(),
        this.government_bills(),
        this.overnight(),
        this.total_assets()
      ]
    )
    const incomeGeneratingAssets = this.income_generating_assets(governmentBills, overnight)
    const highLiquidityAssets = this.high_liquidity_assets(
      correspondentAccount,
      cash,
      incomeGeneratingAssets
    )
    const liquidityAssets = [
      correspondentAccount,
      cash,
      incomeGeneratingAssets,
      governmentBills,
      overnight,
      highLiquidityAssets,
      totalAssets
    ]
    const [demandDeposits, otherClientDeposits, otherLiabilities, totalPassives] =
      await Promise.all([
        this.demand_deposits(),
        this.other_client_deposits(),
        this.other_liabilities(),
        this.total_passives()
      ])
    const totalDemandLiabilities = this.total_demand_liabilities(
      demandDeposits,
      otherClientDeposits,
      otherLiabilities
    )
    const liabilitiesOnDemand = [
      demandDeposits,
      otherClientDeposits,
      otherLiabilities,
      totalDemandLiabilities,
      totalPassives
    ]
    return [liquidityAssets, liabilitiesOnDemand]
  }
}
