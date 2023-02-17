import { Base } from '../../base'

export class IncomeAnalysisBase extends Base {
  protected formatQuery(whereQuery: string): string {
    return `SELECT ROUND(SUM(SALDO_EQUIVAL_OUT) / POWER(10, 5), 2) AS "saldoEquivalOut"
            FROM (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                 SALDO_EQUIVAL_OUT
                          FROM IBS.SALDO@IABS SL
                          WHERE SL.ACCOUNT_CODE = AC.CODE
                            AND SL.OPER_DAY < DATE '${this.date}'
                            AND ROWNUM = 1) AS SALDO_EQUIVAL_OUT
                  FROM IBS.ACCOUNTS@IABS AC
                  WHERE ${whereQuery})`
  }

  async getRows(): Promise<string[]> {
    return ['data from IncomeAnalysisBase']
  }
}
