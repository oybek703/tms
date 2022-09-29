import { formatDate, formatOneDate } from './dateFormatter'
import { getData, getDataInStream } from '../models/db_apis'

export type OwnQuery = Function | null

class MainClass {
	dates: any
	date: string
	pureDate: string

	constructor(date: string) {
		this.dates = formatDate(date)
		this.date = formatOneDate(date)
		this.pureDate = date
	}

	beforeDateQuery(date: string) {
		return `SELECT TO_CHAR(OPER_DAY, 'DD.MM.YYYY') AS BEFORE_DATE FROM IBS.DAY_OPERATIONAL@IABS
                WHERE DAY_STATUS != 0 AND OPER_DAY<TO_DATE('${date}', 'DD.MM.YYYY')
                ORDER BY OPER_DAY DESC FETCH FIRST ROWS ONLY`
	}

	async getBeforeDate() {
		const { rows } = await getData(this.beforeDateQuery(this.date))
		// @ts-ignore
		const result = rows[0] || {}
		// @ts-ignore
		const { BEFORE_DATE } = result
		this.date = BEFORE_DATE
	}

	// eslint-disable-next-line no-unused-vars,unused-imports/no-unused-vars,@typescript-eslint/no-unused-vars
	formatQuery(date: string, whereQuery: string) {
		throw new Error('formatQuery method must be implemented in child class!')
	}

	async getDataInDates(
		whereQuery: string | 'true',
		ownQuery?: OwnQuery,
		isInStream = false
	): Promise<any> {
		try {
			const query = whereQuery
				? this.formatQuery(this.date, whereQuery)
				: ownQuery && ownQuery(this.date)
			if (isInStream) return await getDataInStream(query)
			// @ts-ignore
			const { rows } = await getData(query)
			// @ts-ignore
			return rows[0] || {}
		} catch (e) {
			if (e instanceof Error) {
				console.log(e.message)
				console.log('Stack: '.underline.yellow.bold, e.stack)
			}
			return {}
		}
	}

	async getCurrencyRate(currencyCode = '840', isExactDay = false) {
		const dayEqual = isExactDay ? '=' : ''
		const query = `SELECT equival FROM ibs.s_rate_cur@iabs
                       WHERE date_cross<${dayEqual}to_date('${this.date}', 'DD.MM.YYYY')-1 AND
                             code='${currencyCode}' and ROWNUM=1 ORDER BY DATE_CROSS DESC`
		const { rows } = await getData(query)
		// @ts-ignore
		const { EQUIVAL } = rows[0]
		return EQUIVAL
	}

	async getRows(): Promise<any> {
		throw new Error('getRows method must be implemented in child class!')
	}
}

export default MainClass
