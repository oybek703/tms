const DashboardMainClass = require("./dashboardMainClass")
const {formatOneDate} = require('../dateFormatter')

class DashboardLiquidity extends DashboardMainClass {
    constructor(date) {
        super(date)
    }

    dashboardLiquidityQuery(liquidity_category) {
        return function (date) {
            return `SELECT
                        SUBSTR(TRIM(INITCAP(TO_CHAR(OPER_DAY, 'month', 'NLS_DATE_LANGUAGE=RUSSIAN'))), 0, 3) MONTH_NAME,
                        ROUND(PERCENT, 2) PERCENT
                    FROM (SELECT * FROM DASHBOARD_LIQUIDITY ORDER BY OPER_DAY DESC)
                    WHERE ROLE = '${liquidity_category}'
                      AND OPER_DAY <= TO_DATE('${date}', 'DD-MM-YYYY')
                      AND ROWNUM < 7 ORDER BY OPER_DAY`
        }
    }

    vlaCurrentStateQuery() {
        if(formatOneDate(new Date()) === this.date) {
            return `SELECT VLA, VLA_NAT, VLA_FOR
                FROM DASHBOARD_LIQUIDITY_CURRENT
                    PIVOT (MAX(PERCENT) FOR ROLE IN ('VLA' AS VLA, 'VLA_NAT' AS VLA_NAT, 'VLA_FOR' AS VLA_FOR))`
        }
        return `WITH CTE AS (SELECT * FROM DASHBOARD_LIQUIDITY_DAILY WHERE OPER_DAY=TO_DATE('${this.date}', 'DD-MM-YYYY'))
                SELECT VLA, VLA_NAT, VLA_FOR
                FROM CTE PIVOT (MAX(PERCENT) FOR ROLE IN ('VLA' AS VLA, 'VLA_NAT' AS VLA_NAT, 'VLA_FOR' AS VLA_FOR))`
    }

    async liquidityByCategory(liquidity_category, withCategory = false) {
        const res = await this.getDataInDates('', false,
            this.dashboardLiquidityQuery(liquidity_category), true)
        const categories = [], values = []
        res.map(v => {
            if(withCategory) categories.push(v['MONTH_NAME'])
            values.push(+v['PERCENT'].toFixed(2))
        })
        if(withCategory) return {values, categories}
        return values
    }

    async vlaCurrentState() {
        const [data = {}] = await this.getDataInDates(
            '',
            false, this.vlaCurrentStateQuery.bind(this),
            true
        )
        return Object.values(data)
    }

    async getRows() {
        const vlaTotal = await this.liquidityByCategory('VLA', true)
        const vlaNat = await this.liquidityByCategory('VLA_NAT')
        const vlaForeign = await this.liquidityByCategory('VLA_FOR')
        const lcrTotal = await this.liquidityByCategory('LCR', true)
        const lcrNat = await this.liquidityByCategory('LCR_NAT')
        const lcrForeign = await this.liquidityByCategory('LCR_FOR')
        const nsfrTotal = await this.liquidityByCategory('NSFR', true)
        const nsfrNat = await this.liquidityByCategory('NSFR_NAT')
        const nsfrForeign = await this.liquidityByCategory('NSFR_FOR')
        const vlaCurrent = await this.vlaCurrentState()
        return {
            vla: {total: vlaTotal.values, nat: vlaNat, foreign: vlaForeign, categories: vlaTotal.categories, vlaCurrent},
            lcr: {total: lcrTotal.values, nat: lcrNat, foreign: lcrForeign, categories: lcrTotal.categories},
            nsfr: {total: nsfrTotal.values, nat: nsfrNat, foreign: nsfrForeign, categories: nsfrTotal.categories}
        }
    }

}

module.exports = DashboardLiquidity