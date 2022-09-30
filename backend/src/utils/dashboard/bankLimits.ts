import DashboardMainClass from './dashboardMainClass'

class BankLimits extends DashboardMainClass {
	constructor(_date?: string) {
		super('')
	}

	formatQuery(_date: '', whereQuery = '1=1') {
		return `SELECT
                NAME AS "bankName",
                SALDO AS "saldo",
                LIMIT_22 AS "limit22",
                ROUND(LIMIT_22 - SALDO, 2) AS "differ",
                CASE
                    WHEN LIMIT_22 = 0 AND SALDO = 0
                        THEN 'no_limit'
                    WHEN LIMIT_22 = 0 AND SALDO != 0
                        THEN 'exceeded'
                    ELSE TO_CHAR(ROUND(SALDO * 100 / LIMIT_22, 2))
                    END                                                           AS "limitPercent22",
                CASE
                    WHEN LIMIT_24 = 0 AND SALDO = 0
                        THEN 'no_limit'
                    WHEN LIMIT_24 = 0 AND SALDO != 0
                        THEN 'exceeded'
                    ELSE TO_CHAR(ROUND(SALDO * 100 / LIMIT_24, 2))
                    END                                                           AS "limitPercent24",
                NVL(LIMIT_24, 0)                                       AS "limit24"
            FROM LIMITS WHERE CLIENT_CODE != '00000194' AND  ${whereQuery}`
	}

	async getBankLimits(localBanks = false) {
		if (localBanks) {
			return await this.getDataInDates(`COUNTRY_CODE='860'`, null, true)
		}
		return await this.getDataInDates(`COUNTRY_CODE!='860'`, null, true)
	}

	async getRows() {
		const foreignBanks = await this.getBankLimits()
		const localBanks = await this.getBankLimits(true)
		return { foreignBanks, localBanks }
	}
}

export default BankLimits
