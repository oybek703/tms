import { Base } from '../../base'

export class ReportLiabilities216 extends Base {
  protected formatQuery() {
    return `SELECT CODE_CURRENCY                                             AS "codeCurrency",
                   AC.CODE_FILIAL                                            AS "mfo",
                   ACC_EXTERNAL                                              AS "accExternal",
                   CC.NAME                                                   AS "name",
                   (SELECT /*+index_desc(s UK_SALDO_ACCOUNT_DAY)*/ SALDO_OUT
                    FROM IBS.SALDO@IABS S
                    WHERE S.ACCOUNT_CODE = AC.CODE
                      AND OPER_DAY < DATE '${this.date}'
                      AND ROWNUM = 1) / DECODE(CODE_CURRENCY, '392', 1, 100) AS "saldoOut",
                   TO_CHAR(DEP_CON.CONTRACT_DATE, 'YYYY-MM-DD')                                     AS "contractDate",
                   TO_CHAR(DEP_CON.DATE_BEGIN, 'YYYY-MM-DD')                                        AS "beginDate",
                   TO_CHAR(DEP_CON.DATE_END, 'YYYY-MM-DD')                                          AS "endDate",
                   TO_CHAR(F.DATE_VALIDATE, 'YYYY-MM-DD')                                           AS "dateValidate",
                   F.AMOUNT / DECODE(CODE_CURRENCY, '392', 1, 100)           AS "amount"
            FROM IBS.ACCOUNTS@IABS AC
                     JOIN IBS.DEP_ACCOUNTS@IABS DEP_AC
                          ON DEP_AC.ACC_ID = AC.ID
                     JOIN IBS.DEP_CONTRACTS@IABS DEP_CON
                          ON DEP_AC.CONTRACT_ID = DEP_CON.ID
                     JOIN IBS.DEP_SCHEDULES_FORECAST@IABS F
                          ON F.CONTRACT_ID = DEP_CON.ID
                     JOIN IBS.CLIENT_CURRENT@IABS CC
                          ON CC.CODE = AC.CLIENT_CODE
            WHERE AC.CODE_COA IN ('21602', '21604', '21605', '21606',
                                  '21610', '21612', '21613', '21624',
                                  '21696', '22002', '22004', '22005',
                                  '22006', '22010', '22012', '22013',
                                  '22024', '22026', '22096')
              AND DEP_CON.STATE NOT IN ('DELETE', 'CLOSE')
              AND F.TYPE = 1`
  }

  async getRows(): Promise<unknown[]> {
    return await this.getDataInDates<unknown[], true>('1=1', undefined, true)
  }
}
