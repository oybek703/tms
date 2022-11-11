"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiquidityAssets = void 0;
const liquidity_base_1 = require("./liquidity.base");
class LiquidityAssets extends liquidity_base_1.LiquidityBase {
    constructor() {
        super(...arguments);
        this.governmentBillsQuery = () => {
            return `SELECT ROUND(ABS((SELECT SUM((SELECT /*+index_desc(s UK_SALDO_ACCOUNT_DAY)*/
                                                  SALDO_EQUIVAL_OUT / POWER(
                                                      10, 8)
                                          FROM IBS.SALDO@IABS S
                                          WHERE OPER_DAY <= DATE '${this.date}'
                                            AND S.ACCOUNT_CODE = AC.CODE
                                            AND ROWNUM = 1)) AS SALDO_OUT
                              FROM IBS.ACCOUNTS@IABS AC
                              WHERE AC.CODE_COA LIKE '107%')), 2)       AS "total",
                   ROUND(ABS((SELECT SUM((SELECT /*+index_desc(s UK_SALDO_ACCOUNT_DAY)*/
                                              SALDO_EQUIVAL_OUT / POWER(10, 8)
                                          FROM IBS.SALDO@IABS S
                                          WHERE OPER_DAY <= DATE '${this.date}'
                                            AND S.ACCOUNT_CODE = AC.CODE
                                            AND ROWNUM = 1)) AS SALDO_OUT
                              FROM IBS.ACCOUNTS@IABS AC
                              WHERE AC.CODE_COA LIKE '107%'
                                AND CODE_CURRENCY = '000')), 2)         AS "natCurr",
                   NVL(ROUND(ABS((SELECT SUM((SELECT /*+index_desc(s UK_SALDO_ACCOUNT_DAY)*/
                                                      SALDO_EQUIVAL_OUT / POWER
                                                      (10, 8)
                                              FROM IBS.SALDO@IABS S
                                              WHERE OPER_DAY <= DATE '${this.date}'
                                                AND S.ACCOUNT_CODE = AC.CODE
                                                AND ROWNUM = 1)) AS SALDO_OUT
                                  FROM IBS.ACCOUNTS@IABS AC
                                  WHERE AC.CODE_COA LIKE '107%'
                                    AND CODE_CURRENCY != '000')), 2) /
                       (SELECT EQUIVAL
                        FROM (SELECT EQUIVAL
                              FROM IBS.S_RATE_CUR@IABS
                              WHERE DATE_CROSS < DATE '${this.date}'
                                AND CODE = '840'
                              ORDER BY DATE_CROSS DESC)
                        WHERE ROWNUM =
                              1), 0)
                                                                        AS "forCurr",
                   NVL(ROUND(ABS((SELECT SUM((SELECT /*+index_desc(s UK_SALDO_ACCOUNT_DAY)*/
                                                  SALDO_OUT / POWER(10, 8)
                                              FROM IBS.SALDO@IABS S
                                              WHERE OPER_DAY <= DATE '${this.date}'
                                                AND S.ACCOUNT_CODE = AC.CODE
                                                AND ROWNUM = 1)) AS SALDO_OUT
                                  FROM IBS.ACCOUNTS@IABS AC
                                  WHERE AC.CODE_COA LIKE '107%'
                                    AND CODE_CURRENCY = '840')), 2), 0) AS "usaDollar",
                   NVL(ROUND(ABS((SELECT SUM((SELECT /*+index_desc(s UK_SALDO_ACCOUNT_DAY)*/
                                                  SALDO_OUT / POWER(10, 8)
                                              FROM IBS.SALDO@IABS S
                                              WHERE OPER_DAY <= DATE '${this.date}'
                                                AND S.ACCOUNT_CODE = AC.CODE
                                                AND ROWNUM = 1)) AS SALDO_OUT
                                  FROM IBS.ACCOUNTS@IABS AC
                                  WHERE AC.CODE_COA LIKE '107%'
                                    AND CODE_CURRENCY = '978')), 2), 0) AS "evro"
            FROM DUAL`;
        };
        this.localBanksQuery = () => {
            return `SELECT (SELECT ROUND(SUM(SALDO_EQUIVAL_OUT) / POWER(10, 8), 2)
            FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                   NVL(SALDO_EQUIVAL_OUT, 0)
                            FROM   IBS.SALDO@IABS SL
                            WHERE  SL.ACCOUNT_CODE = AC.CODE
                              AND SL.OPER_DAY < DATE '${this.date}'
                              AND ROWNUM = 1) AS SALDO_EQUIVAL_OUT
                    FROM   IBS.ACCOUNTS@IABS AC,
                           BANK_DICTIONARY B
                    WHERE  CONCAT('000', B.CLIENT_CODE) = AC.CLIENT_CODE
                      AND CODE_COA IN ( '21002' ))) AS "total",
                   (SELECT ROUND(SUM(SALDO_EQUIVAL_OUT) / POWER(10, 8), 2)
                    FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                           NVL(SALDO_EQUIVAL_OUT, 0)
                                    FROM   IBS.SALDO@IABS SL
                                    WHERE  SL.ACCOUNT_CODE = AC.CODE
                                      AND SL.OPER_DAY < DATE '${this.date}'
                                      AND ROWNUM = 1) AS SALDO_EQUIVAL_OUT
                            FROM   IBS.ACCOUNTS@IABS AC,
                                   BANK_DICTIONARY B
                            WHERE  CONCAT('000', B.CLIENT_CODE) = AC.CLIENT_CODE
                              AND CODE_COA IN ( '21002' )
                              AND CODE_CURRENCY = '000')) AS "natCurr",
                   (SELECT ROUND(SUM(SALDO_EQUIVAL_OUT) / POWER(10, 8), 2)
                    FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                    NVL(SALDO_EQUIVAL_OUT, 0) / 
                    (SELECT EQUIVAL FROM (SELECT --+index_desc(rate XPK_S_RATE_CUR )
                                                                                 EQUIVAL,
                                                                                 ROWNUM AS N
                                                                             FROM
                                                                                 IBS.S_RATE_CUR@IABS
                                                                                     RATE
                                                                             WHERE  CODE = '840')
                                                                        WHERE  N = 2)
                                    FROM   IBS.SALDO@IABS SL
                                    WHERE  SL.ACCOUNT_CODE = AC.CODE
                                      AND SL.OPER_DAY < DATE '${this.date}'
                                      AND ROWNUM = 1) AS SALDO_EQUIVAL_OUT
                            FROM   IBS.ACCOUNTS@IABS AC,
                                   BANK_DICTIONARY B
                            WHERE  CONCAT('000', B.CLIENT_CODE) = AC.CLIENT_CODE
                              AND CODE_COA IN ( '21002' )
                              AND CODE_CURRENCY <> '000')) AS "forCurr",
                   (SELECT ROUND(SUM(SALDO_OUT) / POWER(10, 8), 2)
                    FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                           NVL(SALDO_OUT, 0)
                                    FROM   IBS.SALDO@IABS SL
                                    WHERE  SL.ACCOUNT_CODE = AC.CODE
                                      AND SL.OPER_DAY < DATE '${this.date}'
                                      AND ROWNUM = 1) AS saldo_out
                            FROM   IBS.ACCOUNTS@IABS AC,
                                   BANK_DICTIONARY B
                            WHERE  CONCAT('000', B.CLIENT_CODE) = AC.CLIENT_CODE
                              AND CODE_COA IN ( '21002' )
                              AND CODE_CURRENCY = '840'))         AS "usaDollar",
                   (SELECT ROUND(SUM(SALDO_OUT) / POWER(10, 8), 2)
                    FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                           NVL(SALDO_OUT, 0)
                                    FROM   IBS.SALDO@IABS SL
                                    WHERE  SL.ACCOUNT_CODE = AC.CODE
                                      AND SL.OPER_DAY < DATE '${this.date}'
                                      AND ROWNUM = 1) AS saldo_out
                            FROM   IBS.ACCOUNTS@IABS AC,
                                   BANK_DICTIONARY B
                            WHERE  CONCAT('000', B.CLIENT_CODE) = AC.CLIENT_CODE
                              AND CODE_COA IN ( '21002' )
                              AND CODE_CURRENCY = '978'))         AS "evro"
            FROM   DUAL`;
        };
        this.vostroFilteredQuery = () => {
            return `SELECT ROUND(FOR_CURR * (SELECT EQUIVAL
                                    FROM IBS.S_RATE_CUR@IABS
                                    WHERE DATE_CROSS < DATE '${this.date}'
                                      AND CODE = '840'
                                    ORDER BY DATE_CROSS DESC FETCH FIRST ROW ONLY ), 2)  AS "total",
                   NAT_CURR AS "natCurr",
                   ROUND(FOR_CURR, 2)  AS "forCurr",
                   USA_DOLLAR AS "usaDollar",
                   EVRO AS "evro"
            FROM (SELECT 0                               AS NAT_CURR,
                         (SELECT ROUND(NVL(SUM(ABS(
                                     (SELECT
                                             /*+index_desc(s UK_SALDO_ACCOUNT_DAY)*/
                                             SALDO_EQUIVAL_OUT
                                         FROM IBS.SALDO@IABS S
                                         WHERE S.ACCOUNT_CODE = AC.CODE
                                           AND OPER_DAY <= DATE '${this.date}'
                                           AND ROWNUM = 1))) / POWER(10, 8), 0), 2) AS SALDO_EQUIVAL_OUT
                             FROM IBS.ACCOUNTS@IABS AC
                                      JOIN BANK_INFO_RATING BR
                                           ON BR.CLIENT_CODE = AC.CLIENT_CODE
                             WHERE AC.CODE_COA IN ('10501', '10521')
                               AND AC.CODE_CURRENCY != '000'
                               AND BR.RATING_STATUS = 1) /
                         (SELECT EQUIVAL
                             FROM IBS.S_RATE_CUR@IABS
                             WHERE DATE_CROSS < DATE '${this.date}'
                               AND CODE = '840'
                             ORDER BY DATE_CROSS DESC
                                 FETCH FIRST ROW ONLY)   AS FOR_CURR,
                         (SELECT ROUND(NVL(SUM(ABS((SELECT
                                             /*+index_desc(s UK_SALDO_ACCOUNT_DAY)*/
                                             SALDO_OUT
                                         FROM IBS.SALDO@IABS S
                                         WHERE S.ACCOUNT_CODE = AC.CODE
                                           AND OPER_DAY <= DATE '${this.date}'
                                           AND ROWNUM = 1))) / POWER(10, 8), 0), 2)
                             FROM IBS.ACCOUNTS@IABS AC
                                      JOIN BANK_INFO_RATING BR
                                           ON BR.CLIENT_CODE = AC.CLIENT_CODE
                             WHERE AC.CODE_COA IN ('10501', '10521')
                               AND AC.CODE_CURRENCY = '840'
                               AND BR.RATING_STATUS = 1) AS USA_DOLLAR,
                         (SELECT ROUND(NVL(SUM(ABS((SELECT
                                             /*+index_desc(s UK_SALDO_ACCOUNT_DAY)*/
                                             SALDO_OUT
                                         FROM IBS.SALDO@IABS S
                                         WHERE S.ACCOUNT_CODE = AC.CODE
                                           AND OPER_DAY <= DATE '${this.date}'
                                           AND ROWNUM = 1))) / POWER(10, 8), 0), 2)
                             FROM IBS.ACCOUNTS@IABS AC
                                      JOIN BANK_INFO_RATING BR
                                           ON BR.CLIENT_CODE = AC.CLIENT_CODE
                             WHERE AC.CODE_COA IN ('10501', '10521')
                               AND AC.CODE_CURRENCY = '978'
                               AND BR.RATING_STATUS = 1) AS EVRO
                  FROM DUAL)`;
        };
    }
    async total_actives() {
        return await this.getOneRow('', 'Всего активы (чистые)', '', this.liquidityQuery('T_A'), true);
    }
    async cash_box() {
        return await this.getOneRow('1', 'Касса', `code_coa like '101%'`, undefined, true);
    }
    async government_bills() {
        return await this.getOneRow('2', 'Гос. ценные бумаги', '', this.governmentBillsQuery, true);
    }
    async drag_metals() {
        return await this.getOneRow('3', 'Драг. металы', `code_coa='10909'`, undefined, true);
    }
    async over_night() {
        return await this.getOneRow('4', 'Овернайт', `code_coa='10521'`, undefined, true);
    }
    async cb_accounts() {
        return await this.getOneRow('5', 'Счета в ЦБ Руз', `code_coa like '103%'`, undefined, true);
    }
    async correspondent_accounts() {
        return await this.getOneRow('-', 'Корреспондентский счет', `code_coa='10301'`);
    }
    async f_o_r() {
        return await this.getOneRow('-', 'ФОР', `code_coa='10309'`);
    }
    async funds_to_receive() {
        return await this.getOneRow('-', 'Средства к получению', `code_coa='10311'`);
    }
    async repo_transaction() {
        return await this.getOneRow('-', 'Репо сделки', `code_coa like '223%'`);
    }
    async interbank_deposits() {
        return await this.getOneRow('-', 'межбанковские депозиты', `CODE_COA IN ('10397', '10321', '10331')`);
    }
    async nostro_accounts() {
        return await this.getOneRow('6', 'НОСТРО счета', `code_coa='10501'`, undefined, true);
    }
    async vostro_accounts() {
        return await this.getOneRow('', 'В том числе, Востро счета', `code_coa='21002'`);
    }
    async local_banks() {
        return await this.getOneRow('2', '__LOCAL_BANKS__', '', this.localBanksQuery);
    }
    async vostro_filtered() {
        return await this.getOneRow('2', '__VOSTRO_FILTERED__', '', this.vostroFilteredQuery);
    }
    liquidity_assets_total(...args) {
        const [total, natCurr, forCurr, usaDollar, evro] = this.columns.map((p) => this.getTotal(p, ...args));
        return {
            count: '7',
            indicatorName: 'ВСЕГО ликвидных активов',
            total,
            natCurr,
            forCurr,
            usaDollar,
            evro,
            isTableHead: true
        };
    }
    high_liq_assets_total(total_assets, f_o_r, repo_tr, vostr_accounts, localBanks) {
        const [total, natCurr, forCurr, usaDollar, evro] = this.columns.map(p => total_assets[p] -
            this.getTotal(p, f_o_r, repo_tr, vostr_accounts) +
            localBanks[p]);
        return {
            count: '8',
            indicatorName: 'ИТОГО ВЫСОКО ликвидных активов',
            total,
            natCurr,
            forCurr,
            usaDollar,
            evro,
            isTableHead: true
        };
    }
    high_liq_assets_share(high_liq_assets_total, total_actives) {
        const colValues = this.columns.map(p => `${((high_liq_assets_total[p] * 100) / total_actives[p]).toFixed(2)}`);
        return Object.assign(Object.assign({ count: '9', indicatorName: 'Доля высоколиквидных активов в %' }, this.columns.reduce((acc, prop, i) => {
            acc[prop] = colValues[i] === 'Infinity' ? ' ' : colValues[i];
            return acc;
        }, {})), { isTableHead: true });
    }
    async getRows() {
        const [totalActives, cashBox, governmentBills, dragMetals, overNight, cbAccounts, correspondentAccounts, F_O_R, fundsToReceive, repoTransaction, interbankDeposits, nostroAccounts, vostroAccounts, localBanks, vostroFiltered] = await Promise.all([
            this.total_actives(),
            this.cash_box(),
            this.government_bills(),
            this.drag_metals(),
            this.over_night(),
            this.cb_accounts(),
            this.correspondent_accounts(),
            this.f_o_r(),
            this.funds_to_receive(),
            this.repo_transaction(),
            this.interbank_deposits(),
            this.nostro_accounts(),
            this.vostro_accounts(),
            this.local_banks(),
            this.vostro_filtered()
        ]);
        const liquidityAssetsTotal = this.liquidity_assets_total(cashBox, cbAccounts, vostroFiltered, governmentBills);
        const highLiqAssetsTotal = this.high_liq_assets_total(liquidityAssetsTotal, F_O_R, repoTransaction, vostroAccounts, localBanks);
        const highLiqAssetsShare = this.high_liq_assets_share(highLiqAssetsTotal, totalActives);
        return [
            totalActives,
            cashBox,
            governmentBills,
            dragMetals,
            overNight,
            cbAccounts,
            this.getEmptyRow(),
            correspondentAccounts,
            F_O_R,
            fundsToReceive,
            repoTransaction,
            interbankDeposits,
            nostroAccounts,
            vostroAccounts,
            liquidityAssetsTotal,
            highLiqAssetsTotal,
            highLiqAssetsShare
        ];
    }
}
exports.LiquidityAssets = LiquidityAssets;
//# sourceMappingURL=liquidity-assets.js.map