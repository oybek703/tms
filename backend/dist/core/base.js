"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Base = void 0;
class Base {
    constructor(date, oracleService) {
        this.date = date;
        this.oracleService = oracleService;
    }
    beforeDateQuery() {
        return `SELECT TO_CHAR(OPER_DAY, 'YYYY-MM-DD') AS "beforeDate"
            FROM IBS.DAY_OPERATIONAL@IABS
            WHERE DAY_STATUS != 0 AND OPER_DAY< DATE '${this.date}'
            ORDER BY OPER_DAY DESC FETCH FIRST ROWS ONLY`;
    }
    async getBeforeDate() {
        const { beforeDate } = await this.oracleService.executeQuery(this.beforeDateQuery());
        this.date = beforeDate;
    }
    async getDataInDates(whereQuery, ownQuery, inStream) {
        let query;
        if (whereQuery) {
            query = this.formatQuery(whereQuery);
        }
        else {
            query = ownQuery(this.date);
        }
        if (inStream)
            return (await this.oracleService.executeQueryInStream(query));
        return (await this.oracleService.executeQuery(query));
    }
    async getRows() {
        return [];
    }
}
exports.Base = Base;
//# sourceMappingURL=base.js.map