import MainClass from '../mainClass'
import { formatDate } from '../dateFormatter'

class NostroMatrixMainClass extends MainClass {
	currencyCodes: { code: string; title: string; data?: [] }[]

	constructor(protected firstDate: string, protected secondDate: string) {
		super(firstDate)
		const { selectedDate: formattedFirstDate } = formatDate(firstDate)
		const { selectedDate: formattedSecondDate } = formatDate(secondDate)
		this.firstDate = formattedFirstDate
		this.secondDate = formattedSecondDate
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

	formatQuery(_date: string, currencyCode = '840') {
		return `SELECT
                CC.NAME                                                                AS "name",
                SALDO_OUT                                                              AS "saldoOut",
                TURNOVER_ALL_DEBIT                                                     AS "turnoverDebit",
                DECODE(TURNOVER_ALL_DEBIT, 0, 0, ROUND(100 * TURNOVER_ALL_DEBIT / SUM(TURNOVER_ALL_DEBIT) OVER (), 2))   AS "percentDebit",
                TURNOVER_ALL_CREDIT                                                    AS "turnoverCredit",
                DECODE(TURNOVER_ALL_CREDIT, 0, 0, ROUND(TURNOVER_ALL_CREDIT * 100 / SUM(TURNOVER_ALL_CREDIT) OVER (), 2)) AS "percentCredit",
                BX.MORE_OPERATIONS                                                     AS "moreOperations",
                BX.QUICK                                                               AS "quick",
                BX.SAFETY                                                              AS "safe",
                BX.EXPENSIVE                                                           AS "expensiveOrCheap",
                BX.IMPORT                                                              AS "import",
                BX.EXPORT                                                              AS "export",
                LETTER_OF_CREDIT                                                       AS "creditLine",
                BX.INTERBANK_DEPOSIT                                                   AS "interbankDeposit",
                BX.FX                                                                  AS "forex",
                BX.CREDIT_LINE                                                         AS "creditLine",
                BX.VOSTRO                                                              AS "vostro",
                BX.USE_FOR_PAYMENT                                                     AS "useForPayment",
                DESCRIPTION
            FROM (SELECT CODE_CURRENCY,
                         CLIENT_CODE,
                         NVL(ABS(SUM(SALDO_OUT)), 0)  AS SALDO_OUT,
                         NVL(SUM(TURNOVER_CREDIT), 0) AS TURNOVER_ALL_CREDIT,
                         NVL(SUM(TURNOVER_DEBIT), 0)  AS TURNOVER_ALL_DEBIT
                  FROM (SELECT CODE_CURRENCY,
                               CLIENT_CODE,
                               (SELECT /*+index_desc(s UK_SALDO_ACCOUNT_DAY)*/
                                    SALDO_OUT
                                FROM IBS.SALDO@IABS S
                                WHERE S.ACCOUNT_CODE = AC.CODE
                                  AND OPER_DAY <= TO_DATE('${this.secondDate}', 'DD.MM.YYYY')
                                  AND ROWNUM = 1)
                                   AS
                                   SALDO_OUT,
                               (SELECT SUM(TURNOVER_CREDIT)
                                FROM IBS.SALDO@IABS
                                WHERE ACCOUNT_CODE = AC.CODE
                                  AND OPER_DAY BETWEEN TO_DATE('${this.firstDate}', 'DD.MM.YYYY')
                                    AND
                                    TO_DATE('${this.secondDate}', 'DD.MM.YYYY')
                               )   AS
                                   TURNOVER_CREDIT,
                               (SELECT SUM(TURNOVER_DEBIT)
                                FROM IBS.SALDO@IABS
                                WHERE ACCOUNT_CODE = AC.CODE
                                  AND OPER_DAY BETWEEN TO_DATE('${this.firstDate}', 'DD.MM.YYYY')
                                    AND
                                    TO_DATE('${this.secondDate}', 'DD.MM.YYYY')
                               )   AS
                                   TURNOVER_DEBIT
                        FROM IBS.ACCOUNTS@IABS AC
                        WHERE CODE_COA = '10501'
                          AND CODE_CURRENCY = '${currencyCode}')
                  GROUP BY CODE_CURRENCY,
                           CLIENT_CODE) S
                     JOIN IBS.CLIENT_CURRENT@IABS CC
                          ON CC.CODE = S.CLIENT_CODE
                     LEFT JOIN BANK_INFO_MATRIX BX
                               ON (BX.BANK_CODE = S.CLIENT_CODE
                                   AND S.CODE_CURRENCY = BX.CODE_CURRENCY)`
	}

	async getRows(): Promise<any> {
		return await Promise.all(
			this.currencyCodes.map(async ({ code, title }) => {
				const currencyRowsData = await this.getDataInDates(code, null, true)
				return { code, title, data: currencyRowsData }
			})
		)
	}
}

export default NostroMatrixMainClass
