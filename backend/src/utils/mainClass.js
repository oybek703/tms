const {getDataInStream} = require('../models/db_apis')
const {getData} = require('../models/db_apis')
const {formatOneDate} = require('./dateFormatter')
const {formatDate} = require('./dateFormatter')

class MainClass {

    constructor(date) {
        this.dates = formatDate(date)
        this.date = formatOneDate(date)
        this.pureDate = date
    }

    beforeDateQuery(date) {
        return `SELECT TO_CHAR(OPER_DAY, 'DD.MM.YYYY') AS BEFORE_DATE FROM IBS.DAY_OPERATIONAL@IABS
                WHERE DAY_STATUS != 0 AND OPER_DAY<TO_DATE('${date}', 'DD.MM.YYYY')
                ORDER BY OPER_DAY DESC FETCH FIRST ROWS ONLY`
    }

    async getBeforeDate() {
        const {rows: [result = {}]} = await getData(this.beforeDateQuery(this.date))
        const {BEFORE_DATE} = result
        this.date = BEFORE_DATE
    }

    formatQuery(date, where_query) {
        throw new Error('formatQuery method must be implemented in child class!')
    }

    async getDataInDates(where_query, isWhere = true, ownQuery, isInStream = false) {
        try {
            const query = isWhere ? this.formatQuery(this.date, where_query) : ownQuery(this.date)
            if (isInStream) return await getDataInStream(query)
            const {rows: [result = {}]} = await getData(query)
            return result
        } catch (e) {
            console.log(e)
            const error = new Error(e)
            const errorMessage = error.message
            console.log('Error on server side: ', errorMessage)
            return {}
        }
    }

    async getCurrencyRate(currency_code = '840', isExactDay = false) {
        const dayEqual = isExactDay ? '=' : ''
        const query = `SELECT equival FROM ibs.s_rate_cur@iabs
                       WHERE date_cross<${dayEqual}to_date('${this.date}', 'DD.MM.YYYY')-1 AND
                             code='${currency_code}' and ROWNUM=1 ORDER BY DATE_CROSS DESC`
        const {rows: [{EQUIVAL}]} = await getData(query)
        return EQUIVAL
    }

    async getRows() {
        throw new Error('getRows method must be implemented in child class!')
    }

}

module.exports = MainClass

