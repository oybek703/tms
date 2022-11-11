"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObligationsCurrent = void 0;
const obligations_1 = require("./obligations");
class ObligationsCurrent extends obligations_1.Obligations {
    constructor(oracleService) {
        super(new Date(), oracleService);
    }
    formatQuery(whereQuery = `CODE_COA LIKE '101%'`) {
        return `SELECT ABS((NVL(UZS_SE, 0) + NVL(EUR_SE, 0) + NVL(USD_SE, 0) 
                        + NVL(RUB_SE, 0) + NVL(JPY_SE, 0) + NVL(KZT_SE, 0) +
                        NVL(GBP_SE, 0) + NVL(CHF_SE, 0) + NVL(CHN_SE, 0)))           AS "total",
               ABS(UZS)                                                             AS "natCurr",
               ABS(ROUND((NVL(USD_SE, 0) + NVL(EUR_SE, 0) + NVL(RUB_SE, 0) 
                              + NVL(JPY_SE, 0) + NVL(KZT_SE, 0) + NVL(GBP_SE, 0) +
                              NVL(CHF_SE, 0) + NVL(CHN_SE, 0)) /
                             (SELECT EQUIVAL
                              FROM IBS.S_RATE_CUR@IABS
                              WHERE CODE = '840'
                              ORDER BY DATE_CROSS DESC FETCH FIRST 1 ROWS ONLY), 2)) AS "forCurr",
                   ABS(NVL(USD, 0))                                                  AS "usaDollar",
                   ABS(NVL(EUR, 0))                                                  AS "evro"
            FROM (
                SELECT CODE_CURRENCY,
                       ROUND(SUM(SALDO_OUT) / POWER(10, 8), 2)         AS SALDO_OUT,
                       ROUND(SUM(SALDO_EQUIVAL_OUT) / POWER(10, 8), 2) AS SALDO_EQUIVAL_OUT
                FROM IBS.ACCOUNTS@IABS
                WHERE ${whereQuery}
                GROUP BY CODE_CURRENCY)
                PIVOT ( SUM(NVL(SALDO_OUT, 0)), SUM(NVL(SALDO_EQUIVAL_OUT, 0)) 
                    AS SE FOR CODE_CURRENCY IN ('000' AS UZS,
                    '840' AS USD,
                    '978' AS EUR,
                    '643' AS RUB,
                    '392' AS JPY,
                    '398' AS KZT,
                    '826' AS GBP,
                    '756' AS CHF,
                    '156' AS CHN) )`;
    }
    async demand_deposits() {
        return await this.getOneRow('10', 'Депозиты до востребования', `CODE_COA LIKE '202%'`, undefined, true);
    }
    async individuals() {
        return await this.getOneRow('', 'Физические лица', `CODE_COA='20206'`);
    }
    async other_client_deposits() {
        return await this.getOneRow('12', 'Другие депозиты клиентов', `CODE_COA LIKE '226%'`, undefined, true);
    }
    async funds_on_pc() {
        return await this.getOneRow('-', 'Средства на ПК', `CODE_COA IN ('22617', '22618', '22619', '22620')`);
    }
    async other_obligations() {
        return await this.getOneRow('-', 'Другие обязательства', `CODE_COA LIKE '298%'`, undefined, true);
    }
}
exports.ObligationsCurrent = ObligationsCurrent;
//# sourceMappingURL=obligations-current.js.map