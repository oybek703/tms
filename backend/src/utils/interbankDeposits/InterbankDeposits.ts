import InterBankDepositsMainClass from './InterBankDepositsMainClass'

class InterbankDeposits extends InterBankDepositsMainClass {
  constructor(date: string) {
    super(date)
  }

  // @ts-ignore
  formatQuery(date: string, { currencyCode, codeCoa }: {currencyCode: string, codeCoa: string}) {
    return `SELECT
                       MAX(NAME_BANK) NAME_BANK,
                       SUM(SALDO_OUT) SALDO_OUT,
                       MIN(BEGIN_DATE) BEGIN_DATE,
                       MAX(END_DATE) END_DATE,
                       ROUND(AVG(PERCENT_RATE)) PERCENT_RATE,
                       SUM(FOR_DAY) FOR_DAY,
                       SUM(FOR_PERIOD) FOR_PERIOD,
                       SUM(DAY_COUNT) DAY_COUNT,
                       0 PERCENT_RATE
                FROM (SELECT
                           NAME_BANK,
                           SALDO_OUT,
                           BEGIN_DATE,
                           END_DATE,
                           PERCENT_RATE,
                           FOR_DAY,
                           (TRUNC(((SALDO_OUT*DAY_COUNT*(PERCENT_RATE/100)/365)), 2)) FOR_PERIOD,
                           DAY_COUNT,
                           SUBSTR(ACCOUNT_CODE, 17, 8) BANK_CODE
                       FROM (SELECT
                                 NAME_BANK,
                                 SALDO_OUT,
                                 (SELECT DECODE(
                                     TO_CHAR(DATE_BEGIN, 'YYYY'), 
                                     '2099', 
                                     TO_CHAR(NULL), 
                                     TO_CHAR(DATE_BEGIN, 'YYYY.MM.DD')
                                     ) FROM DUAL) BEGIN_DATE,
                                 (SELECT DECODE(TO_CHAR(DATE_END, 'YYYY'), '2099', TO_CHAR(0), TO_CHAR(DATE_END, 'YYYY.MM.DD')) FROM DUAL) END_DATE,
                                 PERCENT_RATE,
                                 (TRUNC(SALDO_OUT*(PERCENT_RATE/100)/365, 2)) FOR_DAY,
                                 (SELECT DECODE(TO_CHAR(DATE_END, 'YYYY'), '2099', 0, DATE_END-DATE_BEGIN) FROM DUAL) DAY_COUNT,
                                 ACCOUNT_CODE
                             FROM (SELECT * FROM INTERBANKDEPOSIT ORDER BY OPER_DAY DESC)
                             WHERE OPER_DAY=(SELECT MAX(OPER_DAY) FROM INTERBANKDEPOSIT WHERE OPER_DAY<TO_DATE('${date}', 'DD.MM.YYYY'))
                               AND ${codeCoa} AND CURRENCY_CODE='${currencyCode}'
                             ORDER BY SALDO_OUT DESC)) GROUP BY BANK_CODE`
  }

  // @ts-ignore
  async mapBanks(currencyCode: string, codeCoa: string) {
    const allMappedBanks = await this.getDataInDates(
        // @ts-ignore
        { currencyCode, codeCoa },
        true,
        true
    )
    return this.formatMappedBanks(allMappedBanks)
  }

  // @ts-ignore
  async getRows(date: string) {
    const currencyCodes = ['000', '840', '978']
    const land = await Promise.all(currencyCodes.map((currencyCode) => this.mapBanks(
        currencyCode,
        `CODE_COA IN ('10597', '10397', '10521', '10531', '10541', '10321', '10331')`
    )))
    const borrow = await Promise.all(currencyCodes.map((currencyCode) => this.mapBanks(
        currencyCode,
        `CODE_COA IN ('21010', '21022', '21032', '21042')`
    )))
    const fullBorrowData = await new InterBankDepositsMainClass(date, 'borrow').getRows()
    const fullLandData = await new InterBankDepositsMainClass(date, 'land').getRows()
    return { land, borrow, fullBorrowData, fullLandData }
  }
}

export default InterbankDeposits
