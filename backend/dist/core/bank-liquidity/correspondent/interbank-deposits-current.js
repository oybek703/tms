"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterbankDepositsCurrent = void 0;
const interbank_deposits_1 = require("./interbank-deposits");
const date_fns_1 = require("date-fns");
class InterbankDepositsCurrent extends interbank_deposits_1.InterbankDeposits {
    constructor(oracleService) {
        super(new Date(), oracleService);
        this.innerBanksQuery = () => {
            return `SELECT
                    CONCAT(SUBSTR(REPLACE(NAME, 'ТОШКЕНТ Ш.,', ''), 0, 44), '.') AS "name",
                    NVL(ROUND(ABS(UZS) / POWER(10, 8), 2), 0) AS "uzs",
                    NVL(ROUND(ABS(CNY) / POWER(10, 6), 2), 0) AS "cny",
                    NVL(ROUND(ABS(JPY) / POWER(10, 6), 2), 0) AS "jpy",
                    NVL(ROUND(ABS(KZT) / POWER(10, 8), 2), 0) AS "kzt",
                    NVL(ROUND(ABS(RUB) / POWER(10, 8), 2), 0) AS "rub",
                    NVL(ROUND(ABS(CHF) / POWER(10, 8), 2), 0) AS "chf",
                    NVL(ROUND(ABS(GBP) / POWER(10, 8), 2), 0) AS "gbp",
                    NVL(ROUND(ABS(USD) / POWER(10, 8), 2), 0) AS "usd",
                    NVL(ROUND(ABS(EUR) / POWER(10, 8), 2), 0) AS "eur"
                FROM (SELECT CC.NAME,
                             AC.SALDO_OUT,
                             AC.CODE_CURRENCY
                      FROM IBS.ACCOUNTS@IABS AC,
                           IBS.CLIENT_CURRENT@IABS CC
                      WHERE AC.CODE_COA IN ('10597', '10521', '10531', '10541')
                        AND AC.SALDO_OUT <> 0
                        AND CC.CODE = SUBSTR(AC.CODE, 17, 8)) PIVOT (SUM(SALDO_OUT)
                    FOR CODE_CURRENCY IN ('000' AS UZS,
                    '840' AS USD,
                    '826' AS GBP,
                    '643' AS RUB,
                    '756' AS CHF,
                    '978' AS EUR,
                    '392' AS JPY,
                    '156' AS CNY,
                    '398' AS KZT))`;
        };
        this.date = (0, date_fns_1.format)(new Date(), 'yyyy-MM-dd');
    }
    formatQuery(whereQuery = '') {
        return `SELECT ROUND((SELECT ABS(SUM(SALDO_OUT))
                              from IBS.ACCOUNTS@IABS
                              WHERE ${whereQuery}
                                AND CODE_CURRENCY = '000') / POWER(10, 8), 2) AS "uzs",
                       ROUND(NVL((SELECT ABS(SUM(SALDO_OUT))
                                  from IBS.ACCOUNTS@IABS
                                  WHERE ${whereQuery}
                                    AND CODE_CURRENCY = '156'), 0) / POWER(10, 8), 2) AS "cny",
                       ROUND(NVL((SELECT ABS(SUM(SALDO_OUT))
                                  from IBS.ACCOUNTS@IABS
                                  WHERE ${whereQuery}
                                    AND CODE_CURRENCY = '392'), 0) / POWER(10, 8), 2) AS "jpy",
                       ROUND(NVL((SELECT ABS(SUM(SALDO_OUT))
                                  from IBS.ACCOUNTS@IABS
                                  WHERE ${whereQuery}
                                    AND CODE_CURRENCY = '398'), 0) / POWER(10, 8), 2) AS "kzt",
                       ROUND(NVL((SELECT ABS(SUM(SALDO_OUT))
                                  from IBS.ACCOUNTS@IABS
                                  WHERE ${whereQuery}
                                    AND CODE_CURRENCY = '643'), 0) / POWER(10, 8), 2) AS "rub",
                       ROUND(NVL((SELECT ABS(SUM(SALDO_OUT))
                                  from IBS.ACCOUNTS@IABS
                                  WHERE ${whereQuery}
                                    AND CODE_CURRENCY = '756'), 0) / POWER(10, 8), 2) AS "chf",
                       ROUND(NVL((SELECT ABS(SUM(SALDO_OUT))
                                  from IBS.ACCOUNTS@IABS
                                  WHERE ${whereQuery}
                                    AND CODE_CURRENCY = '826'), 0) / POWER(10, 8), 2) AS "gbp",
                       ROUND(NVL((SELECT ABS(SUM(SALDO_OUT))
                                  from IBS.ACCOUNTS@IABS
                                  WHERE ${whereQuery}
                                    AND CODE_CURRENCY = '840'), 0) / POWER(10, 8), 2) AS "usd",
                       ROUND(NVL((SELECT ABS(SUM(SALDO_OUT))
                                  from IBS.ACCOUNTS@IABS
                                  WHERE ${whereQuery}
                                    AND CODE_CURRENCY = '978'), 0) / POWER(10, 8), 2) AS "eur"
                FROM   DUAL`;
    }
    liq_assets_total(...args) {
        const [uzs, cny, jpy, kzt, rub, chf, gbp, usd, eur] = this.currencyNames.map(c => this.getTotal(c, ...args));
        return {
            count: '-',
            indicatorName: 'Всего ликвидные средства',
            uzs,
            cny,
            jpy,
            kzt,
            rub,
            chf,
            gbp,
            usd,
            eur,
            isTableHead: true
        };
    }
    async accounts_settlement() {
        return await this.getOneRow('-', 'Расчеты с клиентами - 29801', `CODE_COA='29801'`);
    }
    async customer_funds() {
        return await this.getOneRow('-', 'Cредства клиентов для конвертации - 22613', `CODE_COA='22613'`);
    }
    async inner_banks_data() {
        return (await this.getDataInDates('', this.innerBanksQuery, true)).map(b => (Object.assign(Object.assign({}, b), { count: '-', indicatorName: b['name'] })));
    }
    inter_bank_deposits(...args) {
        const [uzs, cny, jpy, kzt, rub, chf, gbp, usd, eur] = this.currencyNames.map(c => this.getTotal(c, ...args));
        return {
            count: '-',
            indicatorName: 'Межбанковские депозиты (10521, 10531, 10541)',
            uzs,
            cny,
            jpy,
            kzt,
            rub,
            chf,
            gbp,
            usd,
            eur,
            isTableHead: true
        };
    }
    async getRows(others) {
        const [innerBanks, customerFunds, accountsSettlement] = await Promise.all([
            this.inner_banks_data(),
            this.customer_funds(),
            this.accounts_settlement()
        ]);
        const interBankDeposits = this.inter_bank_deposits(...innerBanks);
        const liqAssetsTotal = this.liq_assets_total(interBankDeposits, ...others);
        return [interBankDeposits, ...innerBanks, liqAssetsTotal, accountsSettlement, customerFunds];
    }
}
exports.InterbankDepositsCurrent = InterbankDepositsCurrent;
//# sourceMappingURL=interbank-deposits-current.js.map