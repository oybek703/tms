"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiquidityBase = void 0;
const base_1 = require("../../base");
class LiquidityBase extends base_1.Base {
    constructor() {
        super(...arguments);
        this.columns = ['total', 'natCurr', 'forCurr', 'usaDollar', 'evro'];
        this.createData = (count, indicatorName, total, natCurr, forCurr, usaDollar, evro, isTableHead) => ({
            count,
            indicatorName,
            total: Math.abs(total),
            natCurr: Math.abs(natCurr),
            forCurr: Math.abs(forCurr),
            usaDollar: Math.abs(usaDollar),
            evro: Math.abs(evro),
            isTableHead
        });
        this.getEmptyRow = () => ({
            count: '',
            indicatorName: 'в том числе:',
            total: 0,
            natCurr: 0,
            forCurr: 0,
            usaDollar: 0,
            evro: 0,
            isTableHead: false
        });
        this.getTotal = (propertyName, ...args) => {
            let total = 0.0;
            args.forEach((arg) => {
                total += Number(arg[propertyName]);
            });
            return Number(total.toFixed(2));
        };
    }
    formatQuery(whereQuery) {
        return `SELECT TOTAL AS "total",
                   NAT_CURR AS "natCurr",
                   ROUND((TOTAL - NAT_CURR) / (SELECT EQUIVAL
                                               FROM IBS.S_RATE_CUR@IABS
                                               WHERE DATE_CROSS = (SELECT MAX(DATE_CROSS)
                                                                   FROM IBS.S_RATE_CUR@IABS
                                                                   WHERE CODE = '840' AND DATE_CROSS < DATE '${this.date}')
                                                 AND CODE = '840'), 2) AS "forCurr",
                   USA_DOLLAR AS "usaDollar",
                   EVRO AS "evro"
            FROM (SELECT (SELECT ROUND(ABS(SUM((SELECT
                                                    /*+index_desc(s UK_SALDO_ACCOUNT_DAY)*/
                                                    SALDO_EQUIVAL_OUT
                                                FROM IBS.SALDO@IABS S
                                                WHERE S.ACCOUNT_CODE = AC.CODE
                                                  AND OPER_DAY < DATE '${this.date}'
                                                  AND ROWNUM = 1))) / POWER(10, 8), 2) AS SALDO_OUT
                          FROM IBS.ACCOUNTS@IABS AC
                          WHERE ${whereQuery})  AS TOTAL,
                         (SELECT ROUND(ABS(SUM((SELECT
                                                    /*+index_desc(s UK_SALDO_ACCOUNT_DAY)*/
                                                    SALDO_OUT
                                                FROM IBS.SALDO@IABS S
                                                WHERE S.ACCOUNT_CODE = AC.CODE
                                                  AND OPER_DAY < DATE '${this.date}'
                                                  AND ROWNUM = 1))) / POWER(10, 8), 2 ) AS SALDO_OUT
                          FROM IBS.ACCOUNTS@IABS AC
                          WHERE ${whereQuery}
                            AND CODE_CURRENCY = '000') AS NAT_CURR,
                         (SELECT ROUND(ABS(SUM((SELECT
                                                      /*+index_desc(s UK_SALDO_ACCOUNT_DAY)*/
                                                      SALDO_OUT
                                                  FROM IBS.SALDO@IABS S
                                                  WHERE S.ACCOUNT_CODE = AC.CODE
                                                    AND OPER_DAY < DATE '${this.date}' 
                                                    AND ROWNUM = 1))) / POWER(10, 8), 2) AS SALDO_OUT
                            FROM IBS.ACCOUNTS@IABS AC
                            WHERE ${whereQuery}
                              AND CODE_CURRENCY = '840') AS USA_DOLLAR,
                           (SELECT ROUND(ABS(SUM((SELECT
                                                      /*+index_desc(s UK_SALDO_ACCOUNT_DAY)*/
                                                      SALDO_OUT
                                                  FROM IBS.SALDO@IABS S
                                                  WHERE S.ACCOUNT_CODE = AC.CODE
                                                    AND OPER_DAY < DATE '${this.date}' 
                                                    AND ROWNUM = 1))) / POWER(10, 8), 2 ) AS SALDO_OUT
                            FROM IBS.ACCOUNTS@IABS AC
                            WHERE ${whereQuery}
                              AND CODE_CURRENCY = '978') AS EVRO
                    FROM DUAL)`;
    }
    liquidityQuery(role) {
        return () => {
            return `SELECT TOTAL AS "total",
                     NAT_CURR AS "natCurr", 
                     FOR_CURR AS "forCurr",
                     USA_DOLLAR AS "usaDollar",
                     EVRO AS "evro"
              FROM (SELECT * FROM LIQUIDITY ORDER BY OPER_DAY DESC)
              WHERE OPER_DAY<DATE '${this.date}' AND ROLE='${role}' AND ROWNUM=1`;
        };
    }
    async getOneRow(count, indicatorName, whereQuery, ownQuery, isTableHead = false) {
        let data;
        if (whereQuery) {
            data = await this.getDataInDates(whereQuery, undefined);
        }
        else {
            data = await this.getDataInDates(undefined, ownQuery);
        }
        return this.createData(count, indicatorName, data.total, data.natCurr, data.forCurr, data.usaDollar, data.evro, isTableHead);
    }
}
exports.LiquidityBase = LiquidityBase;
//# sourceMappingURL=liquidity.base.js.map