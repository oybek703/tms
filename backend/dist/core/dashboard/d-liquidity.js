"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardLiquidity = void 0;
const base_1 = require("../base");
const date_fns_1 = require("date-fns");
class DashboardLiquidity extends base_1.Base {
    constructor() {
        super(...arguments);
        this.dashboardLiquidityQuery = (liquidityCategory) => {
            return () => {
                return `SELECT SUBSTR(TRIM(INITCAP(TO_CHAR(OPER_DAY, 'month', 'NLS_DATE_LANGUAGE=RUSSIAN'))), 0,
                            3) AS      "monthName",
                     ROUND(PERCENT, 2) "percent"
              FROM (SELECT * FROM DASHBOARD_LIQUIDITY ORDER BY OPER_DAY DESC)
              WHERE ROLE = '${liquidityCategory}'
                AND OPER_DAY <= DATE '${this.date}'
                AND ROWNUM < 7
              ORDER BY OPER_DAY`;
            };
        };
        this.vlaCurrentStateQuery = () => {
            if ((0, date_fns_1.format)(new Date(), 'yyyy-MM-dd') === this.date) {
                return `SELECT VLA AS "vla", VLA_NAT AS "vlaNat", VLA_FOR AS "vlaFor"
              FROM DASHBOARD_LIQUIDITY_CURRENT
                  PIVOT (MAX(PERCENT) FOR ROLE IN ('VLA' AS VLA, 'VLA_NAT' AS VLA_NAT, 'VLA_FOR' AS VLA_FOR))`;
            }
            return `WITH CTE AS (SELECT * FROM DASHBOARD_LIQUIDITY_DAILY WHERE OPER_DAY = DATE '${this.date}')
            SELECT VLA AS "vla", VLA_NAT AS "vlaNat", VLA_FOR AS "vlaFor"
            FROM CTE PIVOT (MAX(PERCENT) FOR ROLE IN ('VLA' AS VLA, 'VLA_NAT' AS VLA_NAT, 'VLA_FOR' AS VLA_FOR))`;
        };
    }
    formatQuery(whereQuery) {
        return '';
    }
    async liquidityByCategory(liquidityCategory, withCategory = false) {
        const res = await this.getDataInDates(undefined, this.dashboardLiquidityQuery(liquidityCategory), true);
        const categories = [];
        const values = [];
        res.map(v => {
            if (withCategory)
                categories.push(v['monthName']);
            values.push(+v['percent'].toFixed(2));
        });
        if (withCategory) {
            return { values, categories };
        }
        return values;
    }
    async vlaCurrentState() {
        const [data] = await this.getDataInDates(undefined, this.vlaCurrentStateQuery, true);
        return Object.values(data);
    }
    async getRows() {
        const vlaTotal = await this.liquidityByCategory('VLA', true);
        const vlaNat = await this.liquidityByCategory('VLA_NAT');
        const vlaForeign = await this.liquidityByCategory('VLA_FOR');
        const lcrTotal = await this.liquidityByCategory('LCR', true);
        const lcrNat = await this.liquidityByCategory('LCR_NAT');
        const lcrForeign = await this.liquidityByCategory('LCR_FOR');
        const nsfrTotal = await this.liquidityByCategory('NSFR', true);
        const nsfrNat = await this.liquidityByCategory('NSFR_NAT');
        const nsfrForeign = await this.liquidityByCategory('NSFR_FOR');
        const vlaCurrent = await this.vlaCurrentState();
        const vla = {
            total: vlaTotal.values,
            nat: vlaNat,
            foreign: vlaForeign,
            categories: vlaTotal.categories,
            vlaCurrent
        };
        const lcr = {
            total: lcrTotal.values,
            nat: lcrNat,
            foreign: lcrForeign,
            categories: lcrTotal.categories
        };
        const nsfr = {
            total: nsfrTotal.values,
            nat: nsfrNat,
            foreign: nsfrForeign,
            categories: nsfrTotal.categories
        };
        return [vla, lcr, nsfr];
    }
}
exports.DashboardLiquidity = DashboardLiquidity;
//# sourceMappingURL=d-liquidity.js.map