import MainClass from '../mainClass'
import { getData } from '../../models/db_apis'

class ReportLiabilitiesMainClass extends MainClass {
	constructor(date: string) {
		super(date)
	}

	formatQuery(date: string) {
		return `BEGIN
                LIABILITIES_PACKAGE.LIABILITIES_PROCEDURE(
                    TO_DATE('${date}', 'DD.MM.YYYY')
                );
            END;`
	}

	async fillTable() {
		await getData(this.formatQuery(this.date))
	}

	reportLiabilitiesQuery() {
		return `SELECT SUBSTR(ACCOUNT_CODE, 8, 20) ACCOUNT_CODE, 
                      NAME_LINE     NAME,
                      CURRENCY_TYPE CURRENCY,
                      SALDO_NOMINAL,
                      SALDO_EQUIVAL,
                      DAY_7_SALDO_NOMINAL,
                      DAY_7_SALDO_EQUIVAL,
                      MONTH_1_SALDO_NOMINAL,
                      MONTH_1_SALDO_EQUIVAL,
                      MONTH_2_SALDO_NOMINAL,
                      MONTH_2_SALDO_EQUIVAL,
                      MONTH_3_SALDO_NOMINAL,
                      MONTH_3_SALDO_EQUIVAL,
                      MONTH_4_SALDO_NOMINAL,
                      MONTH_4_SALDO_EQUIVAL,
                      MONTH_5_SALDO_NOMINAL,
                      MONTH_5_SALDO_EQUIVAL,
                      MONTH_6_SALDO_NOMINAL,
                      MONTH_6_SALDO_EQUIVAL,
                      MONTH_7_SALDO_NOMINAL,
                      MONTH_7_SALDO_EQUIVAL,
                      MONTH_8_SALDO_NOMINAL,
                      MONTH_8_SALDO_EQUIVAL,
                      MONTH_9_SALDO_NOMINAL,
                      MONTH_9_SALDO_EQUIVAL,
                      MONTH_10_SALDO_NOMINAL,
                      MONTH_10_SALDO_EQUIVAL,
                      MONTH_11_SALDO_NOMINAL,
                      MONTH_11_SALDO_EQUIVAL,
                      MONTH_12_SALDO_NOMINAL,
                      MONTH_12_SALDO_EQUIVAL,
                      BETWEEN_1_2_YEAR_NOMINAL,
                      BETWEEN_1_2_YEAR_EQUIVAL,
                      GREAT_2_YEAR_NOMINAL,
                      GREAT_2_YEAR_EQUIVAL
                FROM LIABILITIES`
	}

	async getTableData() {
		return await this.getDataInDates('', this.reportLiabilitiesQuery, true)
	}

	async getRows() {
		await this.fillTable()
		return await this.getTableData()
	}
}

export default ReportLiabilitiesMainClass
