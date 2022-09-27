import MainClass from '../mainClass'

class TimeDepoClients extends MainClass {
	constructor(date: string) {
		super(date)
	}

	formatQuery(date: string) {
		return `SELECT
                FILIAL_NAME AS "filialName",
                CODE_COA AS "codeCoa",
                CLIENT_NAME AS "clientName",
                TO_CHAR(DATE_BEGIN, 'DD.MM.YYYY') AS "dateBegin",
                TO_CHAR(DATE_END, 'DD.MM.YYYY') AS "dateEnd",
                CURRENCY_CODE AS "currencyCode",
                SALDO_OUT AS "saldoOut",
                SALDO_EQUIVALENT_OUT AS "saldoEquivalentOut",
                PERCENT AS "percent"
            FROM (SELECT * FROM TIME_DEPO_CLIENTS ORDER BY OPER_DAY DESC)
            WHERE OPER_DAY = (SELECT MAX(OPER_DAY)
                              FROM TIME_DEPO_CLIENTS WHERE OPER_DAY<TO_DATE('${date}', 'DD.MM.YYYY'))`
	}

	async getRows() {
		return await this.getDataInDates('1=1', null, true)
	}
}

export default TimeDepoClients
