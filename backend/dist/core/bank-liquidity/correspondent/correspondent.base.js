"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CorrespondentBase = void 0;
const base_1 = require("../../base");
class CorrespondentBase extends base_1.Base {
    constructor() {
        super(...arguments);
        this.currencyNames = ['uzs', 'cny', 'jpy', 'kzt', 'rub', 'chf', 'gbp', 'usd', 'eur'];
        this.createData = (count, indicatorName, uzs, cny, jpy, kzt, rub, chf, gbp, usd, eur, isTableHead, isNegative) => ({
            count,
            indicatorName,
            uzs: isNegative ? uzs : Math.abs(uzs),
            cny: isNegative ? cny : Math.abs(cny),
            jpy: isNegative ? jpy : Math.abs(jpy),
            kzt: isNegative ? kzt : Math.abs(kzt),
            rub: isNegative ? rub : Math.abs(rub),
            chf: isNegative ? chf : Math.abs(chf),
            gbp: isNegative ? gbp : Math.abs(gbp),
            usd: isNegative ? usd : Math.abs(usd),
            eur: isNegative ? eur : Math.abs(eur),
            isTableHead
        });
    }
    formatQuery(role) {
        return `SELECT 
                UZS AS "uzs", 
                CNY AS "cny", 
                JPY AS "jpy", 
                KZT AS "kzt", 
                RUB AS "rub", 
                CHF AS "chf", 
                GBP AS "gbp", 
                USD AS "usd",
                EUR AS "eur"
            FROM (SELECT * FROM CORRESPONDENT ORDER BY OPER_DAY DESC)
            WHERE OPER_DAY<DATE '${this.date}' AND CODE_COA='${role}'
            AND ROWNUM=1`;
    }
    getTotal(propertyName, ...args) {
        let total = 0.0;
        args.forEach((arg) => {
            total += Number(arg[propertyName]);
        });
        return Number(total.toFixed(2));
    }
    async getOneRow(count, indicatorName, whereQuery, ownQuery, isTableHead = false, isNegative = false) {
        let data;
        if (whereQuery) {
            data = await this.getDataInDates(whereQuery, undefined);
        }
        else {
            data = await this.getDataInDates(undefined, ownQuery);
        }
        return this.createData(count, indicatorName, data.uzs, data.cny, data.jpy, data.kzt, data.rub, data.chf, data.gbp, data.usd, data.eur, isTableHead, isNegative);
    }
}
exports.CorrespondentBase = CorrespondentBase;
//# sourceMappingURL=correspondent.base.js.map