import { InterbankDeposits } from './interbank-deposits'
import { OracleService } from '../../../oracle/oracle.service'
import { ICorrespondentRow } from './correspondent.interface'
import { format } from 'date-fns'

export class InterbankDepositsCurrent extends InterbankDeposits {
  constructor(oracleService: OracleService) {
    super(new Date(), oracleService)
    this.date = format(new Date(), 'yyyy-MM-dd') as unknown as Date
  }

  formatQuery(whereQuery = '') {
    return `SELECT ROUND((SELECT ABS(SUM(SALDO_OUT))
                              from IBS.ACCOUNTS@IABS
                              WHERE ${whereQuery}
                                AND CODE_CURRENCY = '000') / POWER(10, 8), 2) AS "uzs",
                       ROUND(NVL((SELECT ABS(SUM(SALDO_OUT))
                                  from IBS.ACCOUNTS@IABS
                                  WHERE ${whereQuery}
                                    AND CODE_CURRENCY = '156'), 0) / POWER(10, 8), 2) AS "cny",
                       ROUND(NVL((SELECT ABS(SUM(SALDO_OUT))
                                  from IBS.ACCOUNTS@IABS
                                  WHERE ${whereQuery}
                                    AND CODE_CURRENCY = '392'), 0) / POWER(10, 8), 2) AS "jpy",
                       ROUND(NVL((SELECT ABS(SUM(SALDO_OUT))
                                  from IBS.ACCOUNTS@IABS
                                  WHERE ${whereQuery}
                                    AND CODE_CURRENCY = '398'), 0) / POWER(10, 8), 2) AS "kzt",
                       ROUND(NVL((SELECT ABS(SUM(SALDO_OUT))
                                  from IBS.ACCOUNTS@IABS
                                  WHERE ${whereQuery}
                                    AND CODE_CURRENCY = '643'), 0) / POWER(10, 8), 2) AS "rub",
                       ROUND(NVL((SELECT ABS(SUM(SALDO_OUT))
                                  from IBS.ACCOUNTS@IABS
                                  WHERE ${whereQuery}
                                    AND CODE_CURRENCY = '756'), 0) / POWER(10, 8), 2) AS "chf",
                       ROUND(NVL((SELECT ABS(SUM(SALDO_OUT))
                                  from IBS.ACCOUNTS@IABS
                                  WHERE ${whereQuery}
                                    AND CODE_CURRENCY = '826'), 0) / POWER(10, 8), 2) AS "gbp",
                       ROUND(NVL((SELECT ABS(SUM(SALDO_OUT))
                                  from IBS.ACCOUNTS@IABS
                                  WHERE ${whereQuery}
                                    AND CODE_CURRENCY = '840'), 0) / POWER(10, 8), 2) AS "usd",
                       ROUND(NVL((SELECT ABS(SUM(SALDO_OUT))
                                  from IBS.ACCOUNTS@IABS
                                  WHERE ${whereQuery}
                                    AND CODE_CURRENCY = '978'), 0) / POWER(10, 8), 2) AS "eur"
                FROM   DUAL`
  }

  innerBanksQuery = () => {
    return `SELECT
                    CONCAT(SUBSTR(REPLACE(NAME, 'ТОШКЕНТ Ш.,', ''), 0, 44), '.') AS "name",
                    NVL(ROUND(ABS(UZS) / POWER(10, 8), 2), 0) AS "uzs",
                    NVL(ROUND(ABS(CNY) / POWER(10, 6), 2), 0) AS "cny",
                    NVL(ROUND(ABS(JPY) / POWER(10, 6), 2), 0) AS "jpy",
                    NVL(ROUND(ABS(KZT) / POWER(10, 8), 2), 0) AS "kzt",
                    NVL(ROUND(ABS(RUB) / POWER(10, 8), 2), 0) AS "rub",
                    NVL(ROUND(ABS(CHF) / POWER(10, 8), 2), 0) AS "chf",
                    NVL(ROUND(ABS(GBP) / POWER(10, 8), 2), 0) AS "gbp",
                    NVL(ROUND(ABS(USD) / POWER(10, 8), 2), 0) AS "usd",
                    NVL(ROUND(ABS(EUR) / POWER(10, 8), 2), 0) AS "eur"
                FROM (SELECT CC.NAME,
                             AC.SALDO_OUT,
                             AC.CODE_CURRENCY
                      FROM IBS.ACCOUNTS@IABS AC,
                           IBS.CLIENT_CURRENT@IABS CC
                      WHERE AC.CODE_COA IN ('10597', '10521', '10531', '10541')
                        AND AC.SALDO_OUT <> 0
                        AND CC.CODE = SUBSTR(AC.CODE, 17, 8)) PIVOT (SUM(SALDO_OUT)
                    FOR CODE_CURRENCY IN ('000' AS UZS,
                    '840' AS USD,
                    '826' AS GBP,
                    '643' AS RUB,
                    '756' AS CHF,
                    '978' AS EUR,
                    '392' AS JPY,
                    '156' AS CNY,
                    '398' AS KZT))`
  }

  liq_assets_total(...args: ICorrespondentRow[]) {
    const [uzs, cny, jpy, kzt, rub, chf, gbp, usd, eur] = this.currencyNames.map(c =>
      this.getTotal(c, ...args)
    )
    return {
      count: '-',
      indicatorName: 'Всего ликвидные средства',
      uzs,
      cny,
      jpy,
      kzt,
      rub,
      chf,
      gbp,
      usd,
      eur,
      isTableHead: true
    }
  } /* Всего ликвидные средства */

  async accounts_settlement() {
    return await this.getOneRow('-', 'Расчеты с клиентами - 29801', `CODE_COA='29801'`)
  } /* Расчеты с клиентами - 29801 */

  async customer_funds() {
    return await this.getOneRow(
      '-',
      'Cредства клиентов для конвертации - 22613',
      `CODE_COA='22613'`
    )
  } /* Cредства клиентов для конвертации - 22613 */

  async inner_banks_data(): Promise<ICorrespondentRow[]> {
    return (
      await this.getDataInDates<ICorrespondentRow & { name: string }, true>(
        '',
        this.innerBanksQuery,
        true
      )
    ).map(b => ({
      ...b,
      count: '-',
      indicatorName: b['name']
    }))
  }

  inter_bank_deposits(...args: ICorrespondentRow[]): ICorrespondentRow {
    const [uzs, cny, jpy, kzt, rub, chf, gbp, usd, eur] = this.currencyNames.map(c =>
      this.getTotal(c, ...args)
    )
    return {
      count: '-',
      indicatorName: 'Межбанковские депозиты (10521, 10531, 10541)',
      uzs,
      cny,
      jpy,
      kzt,
      rub,
      chf,
      gbp,
      usd,
      eur,
      isTableHead: true
    }
  } /* Межбанковские депозиты (10521, 10531, 10541) */

  async getRows(others?: ICorrespondentRow[]): Promise<ICorrespondentRow[]> {
    const [innerBanks, customerFunds, accountsSettlement] = await Promise.all([
      this.inner_banks_data(),
      this.customer_funds(),
      this.accounts_settlement()
    ])
    const interBankDeposits = this.inter_bank_deposits(...innerBanks)
    const liqAssetsTotal = this.liq_assets_total(interBankDeposits, ...others)
    return [interBankDeposits, ...innerBanks, liqAssetsTotal, accountsSettlement, customerFunds]
  }
}
