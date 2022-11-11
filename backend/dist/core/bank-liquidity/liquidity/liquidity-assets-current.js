"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiquidityAssetsCurrent = void 0;
const liquidity_assets_1 = require("./liquidity-assets");
class LiquidityAssetsCurrent extends liquidity_assets_1.LiquidityAssets {
    constructor(oracleService) {
        super(new Date(), oracleService);
        this.localBanksQuery = () => {
            return `SELECT (SELECT ROUND(SUM(SALDO_EQUIVAL_OUT) / POWER(10, 8), 2)
                    FROM IBS.ACCOUNTS@IABS AC
                             JOIN BANK_DICTIONARY BD
                                  ON AC.CLIENT_CODE = CONCAT('000', BD.CLIENT_CODE)
                    WHERE AC.CODE_COA = '21002')            AS "total",
                   (SELECT ROUND(SUM(SALDO_EQUIVAL_OUT) / POWER(10, 8), 2)
                    FROM IBS.ACCOUNTS@IABS AC
                             JOIN BANK_DICTIONARY BD
                                  ON AC.CLIENT_CODE = CONCAT('000', BD.CLIENT_CODE)
                    WHERE AC.CODE_COA = '21002'
                      AND CODE_CURRENCY = '000')            AS "natCurr",
                   (SELECT ROUND(
                                       FOR_CURR_SUM / (POWER(10, 8) * (SELECT EQUIVAL
                                                                       FROM IBS.S_RATE_CUR@IABS
                                                                       WHERE CODE = '840' ORDER BY DATE_CROSS DESC FETCH FIRST 1 ROWS ONLY)), 2)
                    FROM ((SELECT SUM(SALDO_EQUIVAL_OUT) AS FOR_CURR_SUM
                           FROM IBS.ACCOUNTS@IABS AC
                                    JOIN BANK_DICTIONARY BD
                                         ON AC.CLIENT_CODE = CONCAT('000', BD.CLIENT_CODE)
                           WHERE AC.CODE_COA = '21002'
                             AND CODE_CURRENCY <> '000'))) AS "forCurr",
                   (SELECT ROUND(SUM(SALDO_OUT) / POWER(10, 8), 2)
                    FROM IBS.ACCOUNTS@IABS AC
                             JOIN BANK_DICTIONARY BD
                                  ON AC.CLIENT_CODE = CONCAT('000', BD.CLIENT_CODE)
                    WHERE AC.CODE_COA = '21002'
                      AND CODE_CURRENCY = '840')            AS "usaDollar",
                   (SELECT ROUND(SUM(SALDO_OUT) / POWER(10, 8), 2)
                    FROM IBS.ACCOUNTS@IABS AC
                             JOIN BANK_DICTIONARY BD
                                  ON AC.CLIENT_CODE = CONCAT('000', BD.CLIENT_CODE)
                    WHERE AC.CODE_COA = '21002'
                      AND CODE_CURRENCY = '978')            AS "evro"
            FROM DUAL`;
        };
        this.vostroFilteredQuery = () => {
            return `SELECT FOR_CURR                      AS "total",
                   NAT_CURR AS "natCurr",
                   ROUND(FOR_CURR / USD_RATE, 2) AS "forCurr",
                   USA_DOLLAR AS "usaDollar",
                   EVRO AS "evro"
            FROM (SELECT 0                            AS NAT_CURR,
                         (SELECT ROUND(ABS(SUM(SALDO_EQUIVAL_OUT) / POWER(10, 8)), 2)
                          FROM IBS.ACCOUNTS@IABS AC
                                   JOIN BANK_INFO_RATING BR
                                        ON BR.CLIENT_CODE = AC.CLIENT_CODE
                          WHERE CODE_COA IN ('10501', '10521')
                            AND AC.CODE_CURRENCY != '000'
                            AND BR.RATING_STATUS = 1) AS FOR_CURR,
                         (SELECT ROUND(ABS(SUM(SALDO_OUT) / POWER(10, 8)), 2)
                          FROM IBS.ACCOUNTS@IABS AC
                                   JOIN BANK_INFO_RATING BR
                                        ON BR.CLIENT_CODE = AC.CLIENT_CODE
                          WHERE CODE_COA IN ('10501', '10521')
                            AND AC.CODE_CURRENCY = '840'
                            AND BR.RATING_STATUS = 1) AS USA_DOLLAR,
                         (SELECT ROUND(ABS(SUM(SALDO_OUT) / POWER(10, 8)), 2)
                          FROM IBS.ACCOUNTS@IABS AC
                                   JOIN BANK_INFO_RATING BR
                                        ON BR.CLIENT_CODE = AC.CLIENT_CODE
                          WHERE CODE_COA IN ('10501', '10521')
                            AND AC.CODE_CURRENCY = '978'
                            AND BR.RATING_STATUS = 1) AS EVRO,
                         (SELECT EQUIVAL
                          FROM IBS.S_RATE_CUR@IABS CURS
                                   JOIN IBS.DAY_OPERATIONAL@IABS DAY
                                        ON DAY.OPER_DAY = CURS.DATE_CROSS
                          WHERE DATE_CROSS < SYSDATE
                            AND CODE = '840'
                            AND DAY.DAY_STATUS = 1
                          ORDER BY DATE_CROSS DESC
                              FETCH FIRST ROW ONLY)   AS USD_RATE
                  FROM DUAL)`;
        };
    }
    formatQuery(whereQuery = `CODE_COA LIKE '101%'`) {
        return `SELECT ABS((NVL(UZS_SE, 0) + NVL(EUR_SE, 0) + NVL(USD_SE, 0) 
                + NVL(RUB_SE, 0) + NVL(JPY_SE, 0) + NVL(KZT_SE, 0) +
                NVL(GBP_SE, 0) + NVL(CHF_SE, 0) + NVL(CHN_SE, 0)))              AS "total",
           ABS(UZS) AS "natCurr",
           ABS(ROUND((NVL(USD_SE, 0) + NVL(EUR_SE, 0) + NVL(RUB_SE, 0) 
                          + NVL(JPY_SE, 0) + NVL(KZT_SE, 0) + NVL(GBP_SE, 0) +
                      NVL(CHF_SE, 0) + NVL(CHN_SE, 0)) /
                     (SELECT EQUIVAL
                         FROM IBS.S_RATE_CUR@IABS
                         WHERE CODE = '840' AND DATE_CROSS<SYSDATE
                         ORDER BY DATE_CROSS DESC FETCH FIRST 1 ROWS ONLY), 2)) AS "forCurr",
           ABS(NVL(USD, 0))                                                     AS "usaDollar",
           ABS(NVL(EUR, 0))                                                     AS "evro"
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
    async total_actives() {
        return await this.getOneRow('', 'Всего активы (чистые)', `CODE_COA LIKE '1%'
                     AND CODE_COA NOT LIKE '161%'
                     AND CODE_COA NOT LIKE '175%'`, undefined, true);
    }
    async government_bills() {
        return await this.getOneRow('2', 'Гос . ценные бумаги', `CODE_COA LIKE '107%' AND CODE_COA != '10793'`, undefined, true);
    }
}
exports.LiquidityAssetsCurrent = LiquidityAssetsCurrent;
//# sourceMappingURL=liquidity-assets-current.js.map