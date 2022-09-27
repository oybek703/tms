import MainClass from '../mainClass'

class InterBankDepositsMainClass extends MainClass {
	type: string

	constructor(date: string, type = 'borrow') {
		super(date)
		this.type = type
	}

	formatQuery(date: string, currencyCode: string) {
		return `SELECT
                    NAME_BANK,
                    SALDO_OUT,
                    BEGIN_DATE,
                    END_DATE,
                    PERCENT_RATE,
                    FOR_DAY,
                    (TRUNC(((SALDO_OUT*DAY_COUNT*(PERCENT_RATE/100)/365)), 2)) FOR_PERIOD,
                    DAY_COUNT,
                    0 PERCENT_SHARE
                FROM (SELECT
                          NAME_BANK,
                          SALDO_OUT,
                          (SELECT DECODE(TO_CHAR(DATE_BEGIN, 'YYYY'), '2099', TO_CHAR(0), TO_CHAR(DATE_BEGIN, 'DD.MM.YYYY')) FROM DUAL) BEGIN_DATE,
                          (SELECT DECODE(TO_CHAR(DATE_END, 'YYYY'), '2099', TO_CHAR(0), TO_CHAR(DATE_END, 'DD.MM.YYYY')) FROM DUAL) END_DATE,
                          PERCENT_RATE,
                          (TRUNC(SALDO_OUT*(PERCENT_RATE/100)/365, 2)) FOR_DAY,
                          (SELECT DECODE(TO_CHAR(DATE_END, 'YYYY'), '2099', 0, DATE_END-DATE_BEGIN) FROM DUAL) DAY_COUNT
                      FROM (SELECT * FROM INTERBANKDEPOSIT ORDER BY OPER_DAY DESC)
                      WHERE OPER_DAY=(SELECT MAX(OPER_DAY) FROM INTERBANKDEPOSIT WHERE OPER_DAY<TO_DATE('${date}', 'DD.MM.YYYY')) 
                        AND ${
													this.type === 'borrow'
														? "CODE_COA IN ('21010', '21022', '21032', '21042')"
														: "CODE_COA IN ('10597', '10397', '10521', '10531', '10541', '10321', '10331')"
												} 
                        AND CURRENCY_CODE='${currencyCode}'
                      ORDER BY SALDO_OUT DESC)`
	}

	formatMappedBanks(allMappedBanks: any = []) {
		const mappedBanksSum = [...allMappedBanks].reduce((acc, val) => (acc += val['SALDO_OUT']), 0)
		allMappedBanks = allMappedBanks.map((b: any) => {
			b['PERCENT_SHARE'] = +((b['SALDO_OUT'] * 100) / mappedBanksSum).toFixed(1)
			return b
		})
		const percents = allMappedBanks.map(
			(b: any) => +((b['SALDO_OUT'] * b['PERCENT_RATE']) / mappedBanksSum).toFixed(1)
		)
		const percentSum = +[...percents].reduce((a, b) => a + b, 0).toFixed(1)
		const forDaySum = +[...allMappedBanks]
			.reduce((acc, val) => (acc += val['FOR_DAY']), 0)
			.toFixed(2)
		const forPeriodSum = +[...allMappedBanks]
			.reduce((acc, val) => (acc += val['FOR_PERIOD']), 0)
			.toFixed(2)
		return {
			allMappedBanks,
			sumRow: ['Итого', mappedBanksSum, percentSum, forDaySum, forPeriodSum, '100%']
		}
	}

	async mapBanks(currencyCode: string) {
		const allMappedBanks = await this.getDataInDates(currencyCode, null, true)
		return this.formatMappedBanks(allMappedBanks)
	}

	async getRows() {
		const currencyCodes = ['000', '840', '978']
		if (this.type === 'land') currencyCodes.push('643')
		return await Promise.all(currencyCodes.map(this.mapBanks.bind(this)))
	}
}

export default InterBankDepositsMainClass
