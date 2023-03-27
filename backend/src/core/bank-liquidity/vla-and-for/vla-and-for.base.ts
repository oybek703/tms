import { Base } from '../../base'
import { IVlaAndForDbData, IVlaAndForRow } from './vla-and-for.interface'
import { IFlowsRow } from '../liquidity/liquidity.interface'

export class VlaAndForBase extends Base {
  protected formatQuery(whereQuery: string): string {
    return `SELECT INDICATOR_NAME AS "indicatorName",
                   UZS            AS "uzs",
                   USD            AS "usd",
                   EUR            AS "eur",
                   RUB            AS "rub"
            FROM LIQUIDITY_SIMULATION
            WHERE INDICATOR_TYPE = ${whereQuery}`
  }

  interbankDepositsQuery = () => {
    return `SELECT TOTAL                                               AS "total",
                   NAT_CURR                                            AS "natCurr",
                   ROUND((TOTAL - NAT_CURR) / (SELECT EQUIVAL
                                               FROM IBS.S_RATE_CUR@IABS
                                               WHERE DATE_CROSS = (SELECT MAX(DATE_CROSS)
                                                                   FROM IBS.S_RATE_CUR@IABS
                                                                   WHERE CODE = '840'
                                                                     AND DATE_CROSS < DATE '${this.date}')
                                                 AND CODE = '840'), 2) AS "forCurr",
                   USA_DOLLAR                                          AS "usaDollar",
                   EVRO                                                AS "evro"
            FROM (SELECT (SELECT ROUND(ABS(SUM((SELECT
                                                    /*+index_desc(s UK_SALDO_ACCOUNT_DAY)*/
                                                    SALDO_EQUIVAL_OUT
                                                FROM IBS.SALDO@IABS S
                                                WHERE S.ACCOUNT_CODE = AC.CODE
                                                  AND OPER_DAY < DATE '${this.date}'
                                                  AND ROWNUM = 1))) / POWER(10, 8), 2) AS SALDO_OUT
                          FROM IBS.ACCOUNTS@IABS AC
                          WHERE CODE_COA IN ('10521', '10531', '10541')) AS TOTAL,
                         (SELECT ROUND(ABS(SUM((SELECT
                                                    /*+index_desc(s UK_SALDO_ACCOUNT_DAY)*/
                                                    SALDO_OUT
                                                FROM IBS.SALDO@IABS S
                                                WHERE S.ACCOUNT_CODE = AC.CODE
                                                  AND OPER_DAY < DATE '${this.date}'
                                                  AND ROWNUM = 1))) / POWER(10, 8), 2) AS SALDO_OUT
                          FROM IBS.ACCOUNTS@IABS AC
                          WHERE CODE_COA IN ('10521', '10531', '10541')
                            AND CODE_CURRENCY = '000')                   AS NAT_CURR,
                         (SELECT ROUND(ABS(SUM((SELECT
                                                    /*+index_desc(s UK_SALDO_ACCOUNT_DAY)*/
                                                    SALDO_OUT
                                                FROM IBS.SALDO@IABS S
                                                WHERE S.ACCOUNT_CODE = AC.CODE
                                                  AND OPER_DAY < DATE '${this.date}'
                                                  AND ROWNUM = 1))) / POWER(10, 8), 2) AS SALDO_OUT
                          FROM IBS.ACCOUNTS@IABS AC
                          WHERE CODE_COA IN ('10521', '10531', '10541')
                            AND CODE_CURRENCY = '840')                   AS USA_DOLLAR,
                         (SELECT ROUND(ABS(SUM((SELECT
                                                    /*+index_desc(s UK_SALDO_ACCOUNT_DAY)*/
                                                    SALDO_OUT
                                                FROM IBS.SALDO@IABS S
                                                WHERE S.ACCOUNT_CODE = AC.CODE
                                                  AND OPER_DAY < DATE '${this.date}'
                                                  AND ROWNUM = 1))) / POWER(10, 8), 2) AS SALDO_OUT
                          FROM IBS.ACCOUNTS@IABS AC
                          WHERE CODE_COA IN ('10521', '10531', '10541')
                            AND CODE_CURRENCY = '978')                   AS EVRO
                  FROM DUAL)`
  }

  protected activesCurrentQuery() {
    return `SELECT INDICATOR_NAME AS "indicatorName",
                   TOTAL          AS "total",
                   NAT_CURR       AS "natCurr",
                   FOR_CURR       AS "forCurr"
            FROM LIQUIDITY_SIMULATION_CURRENT`
  }

  async interbank_deposits(): Promise<IVlaAndForRow> {
    const data = await this.getDataInDates<IVlaAndForRow>(undefined, this.interbankDepositsQuery)
    return { ...data, indicatorName: 'Межбанковские депозиты', isTableHead: true }
  }

  async actives_current() {
    return this.getDataInDates<Omit<IVlaAndForDbData, 'evro' | 'usaDollar'>, true>(
      undefined,
      this.activesCurrentQuery,
      true
    )
  }

  async getFlow(flowType: '1' | '2' | string) {
    return this.getDataInDates<IFlowsRow, true>(flowType, undefined, true)
  }

  async getRows() {
    const interbankDeposits = await this.interbank_deposits()
    const activesCurrent = await this.actives_current()
    const [inFlow, outFlow] = await Promise.all(['1', '2'].map(v => this.getFlow(v)))
    return [interbankDeposits, activesCurrent, inFlow, outFlow]
  }
}
