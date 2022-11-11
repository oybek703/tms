import { TotalCash } from './total-cash'
import { OracleService } from '../../../oracle/oracle.service'
import { ICorrespondentDbData, ICorrespondentRow } from './correspondent.interface'
import { format } from 'date-fns'

export class TotalCashCurrent extends TotalCash {
  constructor(oracleService: OracleService) {
    super(new Date(), oracleService)
    this.date = format(new Date(), 'yyyy-MM-dd') as unknown as Date
  }

  formatQuery(whereQuery = `CODE_COA = '10301'`) {
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
                FROM   dual`
  }

  corrAccountsWithOtherBanksQuery = () => {
    return `SELECT NAME as "name",
                       NVL(ROUND(ABS(UZS) / POWER(10, 8), 2), 0) AS "uzs",
                       NVL(ROUND(ABS(CNY) / POWER(10, 6), 2), 0) AS "cny",
                       NVL(ROUND(ABS(JPY) / POWER(10, 6), 2), 0) AS "jpy",
                       NVL(ROUND(ABS(KZT) / POWER(10, 8), 2), 0) AS "kzt",
                       NVL(ROUND(ABS(RUB) / POWER(10, 8), 2), 0) AS "rub",
                       NVL(ROUND(ABS(CHF) / POWER(10, 8), 2), 0) AS "chf",
                       NVL(ROUND(ABS(GBP) / POWER(10, 8), 2), 0) AS "gbp",
                       NVL(ROUND(ABS(USD) / POWER(10, 8), 2), 0) AS "usd",
                       NVL(ROUND(ABS(EUR) / POWER(10, 8), 2), 0) AS "eur"
                FROM (
                    SELECT CC.NAME,
                           AC.SALDO_OUT,
                           AC.CODE_CURRENCY
                    FROM ibs.ACCOUNTS@IABS AC,
                         ibs.CLIENT_CURRENT@IABS CC
                    WHERE AC.CODE_COA = '10501'
                      AND AC.SALDO_OUT <> 0
                      AND CC.CODE = SUBSTR(AC.CODE, 17, 8)) PIVOT ( SUM(SALDO_OUT) FOR CODE_CURRENCY IN ('000' AS UZS,
                    '840' AS USD,
                    '826' AS GBP,
                    '643' AS RUB,
                    '756' AS CHF,
                    '978' AS EUR,
                    '392' AS JPY,
                    '156' AS CNY,
                    '398' AS KZT) )`
  }

  async cash_on_road() {
    return await this.getOneRow(
      '1.2',
      'Денежная наличность в обменных пунктах, банкоматах и деньги в пути',
      `CODE_COA IN ('10103', '10107', '10111', '10109')`
    )
  } /* Денежная наличность в обменных пунктах, банкоматах и деньги в пути */

  async nostro() {
    return await this.getOneRow('-', 'Ностро', `CODE_COA = '10301'`)
  } /* Ностро */

  async f_o_r() {
    return await this.getOneRow('-', 'ФОР', `CODE_COA = '10309'`)
  } /* ФОР */

  async corr_accounts_with_other_banks(): Promise<ICorrespondentRow[]> {
    const data = await this.getDataInDates<ICorrespondentDbData & { name: string }, true>(
      '',
      this.corrAccountsWithOtherBanksQuery,
      true
    )
    return data.map(b => ({
      ...b,
      count: '-',
      indicatorName: b['name']
    }))
  }

  async getRows(): Promise<[[ICorrespondentRow, ICorrespondentRow], ICorrespondentRow[]]> {
    const [totalCashOnHand, cashOnRoad, nostro, F_O_R, corrAccountsWithOtherBanks] =
      await Promise.all([
        this.total_cash_on_hand(),
        this.cash_on_road(),
        this.nostro(),
        this.f_o_r(),
        this.corr_accounts_with_other_banks()
      ])
    const cashAtCheckout = this.cash_at_checkout(totalCashOnHand, cashOnRoad)
    const obNostro = this.ob_nostro(...corrAccountsWithOtherBanks)
    const totalCorrespondentAccounts = this.total_correspondent_accounts(nostro, obNostro)
    const corresAccountsInCB = this.corres_accounts_inCB()
    const corresAccountsInOB = this.corres_accounts_inOB()
    return [
      [totalCashOnHand, totalCorrespondentAccounts],
      [
        totalCashOnHand,
        cashAtCheckout,
        cashOnRoad,
        totalCorrespondentAccounts,
        corresAccountsInCB,
        nostro,
        F_O_R,
        corresAccountsInOB,
        obNostro,
        ...corrAccountsWithOtherBanks
      ]
    ]
  }
}
