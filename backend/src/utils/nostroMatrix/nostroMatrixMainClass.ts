import MainClass from '../mainClass'

class NostroMatrixMainClass extends MainClass {
  currencyCodes: { code: string, title: string, data?: [] }[]

  constructor(_date: string) {
    super(_date)
    this.currencyCodes = [
      { code: '840', title: 'Доллары США' },
      { code: '978', title: 'Евро' },
      { code: '826', title: 'Фунт стерлингов' },
      { code: '756', title: 'Швейсцарский франк' },
      { code: '398', title: 'Казахский тенге' },
      { code: '392', title: 'Японский иена' },
      { code: '643', title: 'Российский рубль' },
      { code: '156', title: 'Китайский юань' }
    ]
  }

  formatQuery(_date: string, currencyCode: string = '840') {
    return `SELECT MX.NAME                                                                   AS "name",
                   BI."MORE_OPERATIONS"                                                      AS "moreOperations",
                   BI."QUICK"                                                                AS "quick",
                   BI."SAFETY"                                                               AS "safe",
                   BI."EXPENSIVE"                                                            AS "expensiveOrCheap",
                   MX.SALDO_OUT                                                              AS "saldoOut",
                   MX.TURNOVER_ALL_DEBIT                                                     AS "turnoverDebit",
                   ROUND(100 * MX.TURNOVER_ALL_DEBIT / SUM(MX.TURNOVER_ALL_DEBIT) OVER (),2) AS "percentDebit",
                   TURNOVER_ALL_CREDIT                                                       AS "turnoverCredit",
                   ROUND(100 * TURNOVER_ALL_CREDIT / SUM(TURNOVER_ALL_CREDIT) OVER (), 2)    AS "percentCredit",
                   BI."IMPORT"                                                               AS "import",
                   BI."EXPORT"                                                               AS "export",
                   BI."LETTER_OF_CREDIT"                                                     AS "accredetiv",
                   BI."INTERBANK_DEPOSIT"                                                    AS "interbankDeposit",
                   BI."FX"                                                                   AS "forex",
                   BI."CREDIT_LINE"                                                          AS "creditLine",
                   BI."VOSTRO"                                                               AS "vostro",
                   USE_FOR_PAYMENT                                                           AS "useForPayment"
            FROM (SELECT AC.CLIENT_CODE,
                         CC.NAME,
                         ROUND(ABS(SUM(SALDO_OUT / DECODE(CODE_CURRENCY, '392', 1, 100))), 2) AS SALDO_OUT,
                         SUM(TURNOVER_ALL_DEBIT / DECODE(CODE_CURRENCY, '392', 1, 100))  AS TURNOVER_ALL_DEBIT,
                         SUM(TURNOVER_ALL_CREDIT / DECODE(CODE_CURRENCY, '392', 1, 100)) AS TURNOVER_ALL_CREDIT
                  FROM IBS.ACCOUNTS@IABS AC
                           JOIN IBS.CLIENT_CURRENT@IABS CC
                                ON CC.CODE = AC.CLIENT_CODE
                  WHERE CODE_COA = '10501'
                    AND AC.CODE_CURRENCY = '${currencyCode}'
                    AND AC.CONDITION = 'A'
                  GROUP BY AC.CLIENT_CODE, CC.NAME) MX
                     JOIN BANK_INFO_MATRIX BI
                          ON BI.BANK_CODE = MX.CLIENT_CODE
            WHERE BI.CODE_CURRENCY = '${currencyCode}'`
  }

  async getRows(): Promise<any> {
    return await Promise.all(
        this.currencyCodes.map(async ({ code, title }) => {
          const currencyRowsData = await this.getDataInDates(code, null, true)
          return { code, title, data: currencyRowsData }
        }))
  }
}

export default NostroMatrixMainClass
