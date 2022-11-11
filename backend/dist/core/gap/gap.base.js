"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GapBase = void 0;
const base_1 = require("../base");
class GapBase extends base_1.Base {
    constructor(oracleService) {
        super(new Date(), oracleService);
        this.monthQuery = () => {
            return `SELECT TO_CHAR(OPER_DAY, 'Month (YY)', 'NLS_DATE_LANGUAGE=''RUSSIAN''') AS "month"
            FROM GAP_ANALYSIS_AUTO
            WHERE ROLE = 'r_c'
            ORDER BY OPER_DAY`;
        };
        this.outflowQuery = () => {
            return `SELECT ROUND((SUM(PERCENT_NAT * NATIONAL_CURRENCY / 100)
        + SUM(PERCENT_FOR * NVL(FOREIGIN_CURR_SUMM_EQ, 0) / 100)) /
                         POWER(10, 6), 2)                                              AS
                       "total",
                   ROUND(SUM(PERCENT_NAT * NATIONAL_CURRENCY / 100) / POWER(10, 6), 2) AS
                       "nationalCurency",
                   ROUND(SUM(PERCENT_FOR * FOREIGN_CURRENCY / 100) / POWER(10, 6), 2)  AS
                       "foreignCurrency"
            FROM LCR_BUILDER
            WHERE ROLE IN ('B_I', 'T_D', 'P_C', 'BORROW', 'C_L_O', 'U_P_L', 'I_C', 'O_L')`;
        };
        this.inflowQuery = () => {
            return `SELECT (LCR.TOTAL - VLA.TOTAL)                         AS "total",
                   (LCR.NATIONAL_CURRENCY - VLA.NATIONAL_CURRENCY) AS "nationalCurrency",
                   (LCR.FOREIGN_CURRENCY - VLA.FOREIGN_CURRENCY)   AS "foreignCurrency"
            FROM (SELECT ROUND((SUM(PERCENT_NAT * NATIONAL_CURRENCY / 100) +
                                SUM(PERCENT_FOR * NVL(FOREIGIN_CURR_SUMM_EQ, 0) / 100)) /
                               POWER(10, 6), 2)                                              AS TOTAL,
                         ROUND(SUM(PERCENT_NAT * NATIONAL_CURRENCY / 100) / POWER(10, 6), 2) AS NATIONAL_CURRENCY,
                         ROUND(SUM(PERCENT_FOR * FOREIGN_CURRENCY / 100) / POWER(10, 6), 2)  AS FOREIGN_CURRENCY,
                         'TEMP_COL'                                                          AS TEMP_COL
                  FROM LCR_BUILDER
                  WHERE ROLE IN ('C_O_D', 'R_F_CBU', 'LEND', 'P_B',
                                 'L_C_A', 'L_C_O', 'P_C_L', 'REPO',
                                 'RECIVE')) LCR
                     INNER JOIN (SELECT TOTAL,
                                        NATIONAL_CURRENCY,
                                        FOREIGN_CURRENCY,
                                        'TEMP_COL' AS TEMP_COL
                                 FROM GAP_ANALYSIS_AUTO
                                 WHERE ROLE = 'vla') VLA
                                ON LCR.TEMP_COL = VLA.TEMP_COL`;
        };
        this.stableFinancingRequiredAmountQuery = () => {
            return `SELECT (NSFR.TOTAL + LCR.TOTAL)                         AS "total",
                   (NSFR.NATIONAL_CURRENCY + LCR.NATIONAL_CURRENCY) AS "nationalCurrency",
                   (NSFR.FOREIGN_CURRENCY + LCR.FOREIGN_CURRENCY)   AS "foreignCurrency"
            FROM (SELECT ROUND(SUM(
                                           (PERCENT_NAT * NATIONAL_CURRENCY + PERCENT_FOR * FOREIGIN_CURR_SUMM_EQ) /
                                           POWER(10, 10)),
                               2)                                                       AS TOTAL,
                         ROUND(SUM(PERCENT_NAT * NATIONAL_CURRENCY / POWER(10, 10)), 2) AS NATIONAL_CURRENCY,
                         ROUND(SUM(PERCENT_FOR * FOREIGN_CURRENCY / POWER(10, 10)), 2)  AS FOREIGN_CURRENCY
                  FROM NSFR_BUILDER
                  WHERE ROLE IN
                        ('credits', 'i_d', 'invest', 'c_s', 'o_p_b', 'leasing', 'liquidity')) NSFR,
                 (SELECT ROUND((SUM(PERCENT_NAT * NATIONAL_CURRENCY / 100) +
                                SUM(PERCENT_FOR * NVL(FOREIGIN_CURR_SUMM_EQ, 0) / 100)) /
                               POWER(10, 6), 2)                                              AS TOTAL,
                         ROUND(SUM(PERCENT_NAT * NATIONAL_CURRENCY / 100) / POWER(10, 6), 2) AS NATIONAL_CURRENCY,
                         ROUND(SUM(PERCENT_FOR * FOREIGN_CURRENCY / 100) / POWER(10, 6), 2)  AS FOREIGN_CURRENCY
                  FROM LCR_BUILDER
                  WHERE ROLE = 'B_I') LCR`;
        };
        this.nsfrQuery = (role = '1=1') => {
            return () => {
                return `SELECT ROUND(
                               SUM((PERCENT_NAT * NATIONAL_CURRENCY 
                                        + PERCENT_FOR * FOREIGIN_CURR_SUMM_EQ) / POWER(10, 10)), 2) AS "total",
                           ROUND(SUM(PERCENT_NAT * NATIONAL_CURRENCY / POWER(10, 10)), 2) AS "nationalCurrency",
                           ROUND(SUM(PERCENT_FOR * FOREIGN_CURRENCY / POWER(10, 10)), 2) AS "foreignCurrency"
                    FROM NSFR_BUILDER
                    WHERE ${role}`;
            };
        };
        this.fromOffBalanceSheets15Query = () => {
            return `SELECT ROUND(
                               (PERCENT_NAT * NATIONAL_CURRENCY + PERCENT_FOR * FOREIGIN_CURR_SUMM_EQ) /
                               POWER(10, 8), 2)                             AS "total",
                   ROUND(PERCENT_NAT * NATIONAL_CURRENCY / POWER(10, 8), 2) AS "nationalCurrency",
                   ROUND(PERCENT_FOR * FOREIGN_CURRENCY / POWER(10, 8), 2)  AS "foreignCurrency"
            FROM LCR_BUILDER
            WHERE ROLE IN ('B_I')`;
        };
    }
    formatQuery(whereQuery) {
        return `SELECT ROLE              AS "role",
                   INDICATOR_NAME    AS "indicatorName",
                   TOTAL             AS "total",
                   NATIONAL_CURRENCY AS "nationalCurrency",
                   FOREIGN_CURRENCY  AS "foreignCurrency",
                   USD               AS "usd",
                   EUR               AS "eur",
                   'AUTO'            AS "source"
            FROM GAP_ANALYSIS_AUTO
            WHERE ROLE = '${whereQuery}'
            ORDER BY OPER_DAY`;
    }
    manualTableQuery(role) {
        return () => {
            return `SELECT ROLE AS "role",
                     INDICATOR_NAME AS "indicatorName",
                     TOTAL AS "total",
                     NATIONAL_CURRENCY AS "nationalCurrency",
                     FOREIGN_CURRENCY AS "foreignCurrency",
                     USD AS "usd",
                     EUR AS "eur",
                     'MANUAL' AS "source"
              FROM GAP_ANALYSIS_MANUAL
              WHERE ROLE = '${role}'
              ORDER BY OPER_DAY`;
        };
    }
    async returnTempData(indicatorName = '__INDICATOR_NAME__', total = 0, nationalCurrency = 0, foreignCurrency = 0) {
        return Promise.resolve({
            indicatorName,
            total,
            nationalCurrency,
            foreignCurrency
        });
    }
    getGapSubOrDivideByMonth(monthIndex, total, left, indicatorName = 'Остаток ВЛА на конец месяца', divide = false) {
        function getSubByProp(prop) {
            if (divide) {
                return (left[monthIndex] || {})[prop] === 0
                    ? 0
                    : ((total[monthIndex] || {})[prop] / (left[monthIndex] || {})[prop]) * 10;
            }
            return (total[monthIndex] || {})[prop] - (left[monthIndex] || {})[prop];
        }
        return Object.assign(Object.assign({}, total[monthIndex]), { indicatorName, total: getSubByProp('total'), nationalCurrency: getSubByProp('nationalCurrency'), foreignCurrency: getSubByProp('foreignCurrency'), usd: getSubByProp('usd'), eur: getSubByProp('eur') });
    }
    getByMonth(monthIndex, ...args) {
        let total = 0;
        let nationalCurrency = 0;
        let foreignCurrency = 0;
        let usd = 0;
        let eur = 0;
        return args.reduce((acc, value) => {
            if (value[monthIndex]) {
                total += value[monthIndex]['total'];
                nationalCurrency += value[monthIndex]['nationalCurrency'];
                foreignCurrency += value[monthIndex]['foreignCurrency'];
                usd += value[monthIndex]['usd'];
                eur += value[monthIndex]['eur'];
            }
            return Object.assign(Object.assign({}, value[monthIndex]), { indicatorName: 'Итого', total,
                nationalCurrency,
                foreignCurrency,
                usd,
                eur });
        }, {});
    }
    getTotal(months, ...args) {
        return new Array(13)
            .fill('')
            .map((_, index) => this.getByMonth(index, ...args));
    }
    getLcrOrNsfrOneRow(indicatorName = '__NAME__', data) {
        return Object.assign({ indicatorName }, data);
    }
    async getOneRow(role, fromManual = false) {
        if (fromManual) {
            return await this.getDataInDates(undefined, this.manualTableQuery(role), true);
        }
        return await this.getDataInDates(role, null, true);
    }
    async getMonths() {
        const data = await this.getDataInDates(undefined, this.monthQuery, true);
        return data.map(m => m['month']);
    }
    async vla() {
        return await this.getOneRow('vla');
    }
    async attraction_of_credit_lines() {
        return await this.getOneRow('ved', true);
    }
    async legal_deposits() {
        return await this.getOneRow('in_206', true);
    }
    async liquidity_source_others() {
        return await this.getOneRow('in', true);
    }
    async return_of_loans() {
        return await this.getOneRow('r_c');
    }
    async interbank_deposits() {
        return await this.getOneRow('10597');
    }
    async return_of_interbank_deposits() {
        return await this.getOneRow('21010');
    }
    async placement_of_interbank_deposits() {
        return await this.getOneRow('in_10597', true);
    }
    async return_of_legal_deposits() {
        return await this.getOneRow('206');
    }
    async repayment_of_credit_lines() {
        return await this.getOneRow('220');
    }
    async post_fin_liabilities() {
        return await this.getOneRow('l_ac', true);
    }
    async issuance_of_loans() {
        return await this.getOneRow('i_l', true);
    }
    async liquidity_need_others() {
        return await this.getOneRow('out', true);
    }
    async amount_for_vla_lcr() {
        return await this.getOneRow('t_a');
    }
    async outFlow() {
        return this.getLcrOrNsfrOneRow('Сумма оттока за 30 дней', await this.getDataInDates('', this.outflowQuery));
    }
    async inFlow() {
        return this.getLcrOrNsfrOneRow('Сумма притока за 30 дней', await this.getDataInDates('', this.inflowQuery));
    }
    async stable_funding_available_amount() {
        return await this.returnTempData('Доступная сумма стабильного финансирования', 37556625.59, 12215331.34, 2327.44);
    }
    async own_capital() {
        return this.getLcrOrNsfrOneRow('Собственный  капитал', await this.getDataInDates('', this.nsfrQuery(`ROLE='p_c'`)));
    }
    async liabilities_over_1year() {
        return this.getLcrOrNsfrOneRow('Обязательства свыше 1 года', await this.getDataInDates('', this.nsfrQuery(`ROLE IN ('l_d','d_p','security','borrow','credit_line','s_d_o','o_o')`)));
    }
    async other_perpetual_liabilities30() {
        return this.getLcrOrNsfrOneRow('30% других бессрочных обязательств', await this.getDataInDates('', this.nsfrQuery(`ROLE IN ('o_i_o')`)));
    }
    async other_liabilities_less_than_1year() {
        return this.getLcrOrNsfrOneRow('30% других обязательств менее 1 года', await this.getDataInDates('', this.nsfrQuery(`ROLE IN ('less_than_year')`)));
    }
    async stable_funding_required_amount() {
        return await this.returnTempData('Необходимая сумма стабильного финансирования', 32397474.98, 9240502.96, 1854.37);
    }
    async assets_over_1year() {
        return this.returnTempData('Активы свыше 1 года', 28198975.83, 8458312.5, 2154.37);
    }
    async bank_things() {
        return this.getLcrOrNsfrOneRow('Банковские помещения, мебель и оборудование, чистые', await this.getDataInDates('', this.nsfrQuery(`ROLE = 'o_p_b'`)));
    }
    async loan_things() {
        return this.getLcrOrNsfrOneRow('Кредиты, лизинги и авансы в процессе судебного разбирательства или не взысканные в установленном порядке (чистые)', await this.getDataInDates('', this.nsfrQuery(`ROLE = 'leasing'`)));
    }
    async other_assets_less_than_1Year30() {
        return await this.returnTempData('30% других активов менее 1 го года (за исключением бессрочных и со сроком менее 1 го года ликвидных активов)', 4624194.59, 1799962.62, 259.39);
    }
    async from_off_balance_sheets_15() {
        return this.getLcrOrNsfrOneRow('15% из забалансовых инструментов', await this.getDataInDates('', this.fromOffBalanceSheets15Query));
    }
    async getRows() {
        const months = await this.getMonths();
        const sourceOfLiquidity = await Promise.all([
            this.vla(),
            this.attraction_of_credit_lines(),
            this.return_of_loans(),
            this.interbank_deposits(),
            this.legal_deposits(),
            this.liquidity_source_others()
        ]);
        const needsOfLiquidity = await Promise.all([
            this.return_of_interbank_deposits(),
            this.placement_of_interbank_deposits(),
            this.return_of_legal_deposits(),
            this.repayment_of_credit_lines(),
            this.post_fin_liabilities(),
            this.issuance_of_loans(),
            this.liquidity_need_others()
        ]);
        let sourceOfLiquidityTotal = this.getTotal(months, ...sourceOfLiquidity);
        const needsOfLiquidityTotal = this.getTotal(months, ...needsOfLiquidity);
        const tempArray = new Array(13).fill('');
        const vlaBalance = [];
        tempArray.forEach((_, index) => {
            vlaBalance.push(this.getGapSubOrDivideByMonth(index, sourceOfLiquidityTotal, needsOfLiquidityTotal));
            sourceOfLiquidity[0].push(vlaBalance[index]);
            sourceOfLiquidityTotal = this.getTotal(months, ...sourceOfLiquidity);
        });
        const amountForVlaLcr = await this.amount_for_vla_lcr();
        const deficitAmount = tempArray.map((_, index) => this.getGapSubOrDivideByMonth(index, vlaBalance, amountForVlaLcr, 'Сумма отклонения(дефицит) на конец месяца'));
        const vlaIndicator = tempArray.map((_, index) => this.getGapSubOrDivideByMonth(index, vlaBalance, amountForVlaLcr, 'ПОКАЗАТЕЛЬ ВЛА', true));
        const vlaLcrData = [vlaBalance, amountForVlaLcr, deficitAmount, vlaIndicator];
        const outFlow = await this.outFlow();
        const inFlow = await this.inFlow();
        const rowKeys = Object.keys(outFlow).filter(key => key !== 'INDICATOR_NAME');
        const cleanOutFlow = this.getLcrOrNsfrOneRow('Чистий отток в последующие 30 дней', rowKeys.reduce((acc, val) => {
            acc[val] = outFlow[val] - inFlow[val];
            return acc;
        }, {}));
        const highLiqAssets = this.getLcrOrNsfrOneRow('Высоколиквидные активы', (vlaLcrData[0] || [])[0]);
        const lcrForecast = this.getLcrOrNsfrOneRow('ПРОГНОЗ LCR', rowKeys.reduce((acc, val) => {
            acc[val] = Math.trunc((highLiqAssets[val] * 100) / cleanOutFlow[val]);
            return acc;
        }, {}));
        const lcrData = [lcrForecast, highLiqAssets, cleanOutFlow, outFlow, inFlow];
        const [stableFundingAvailableAmount, ownCapital, liabilitiesOver1Year, otherPerpetualLiabilities30, otherLiabilitiesLessThan1Year, stableFundingRequiredAmount, assetsOver1Year, bankThings, loanThings, otherAssetsLessThan1Year30, fromOffBalanceSheets15] = await Promise.all([
            this.stable_funding_available_amount(),
            this.own_capital(),
            this.liabilities_over_1year(),
            this.other_perpetual_liabilities30(),
            this.other_liabilities_less_than_1year(),
            this.stable_funding_required_amount(),
            this.assets_over_1year(),
            this.bank_things(),
            this.loan_things(),
            this.other_assets_less_than_1Year30(),
            this.from_off_balance_sheets_15()
        ]);
        const nsfrForecast = this.getLcrOrNsfrOneRow('ПРОГНОЗ NSFR', rowKeys.reduce((acc, val) => {
            acc[val] = Math.trunc((stableFundingAvailableAmount[val] * 100) / stableFundingRequiredAmount[val]);
            return acc;
        }, {}));
        const nsfrData = [
            nsfrForecast,
            stableFundingAvailableAmount,
            ownCapital,
            liabilitiesOver1Year,
            otherPerpetualLiabilities30,
            otherLiabilitiesLessThan1Year,
            stableFundingRequiredAmount,
            assetsOver1Year,
            bankThings,
            loanThings,
            otherAssetsLessThan1Year30,
            fromOffBalanceSheets15
        ];
        return [
            months,
            sourceOfLiquidity,
            sourceOfLiquidityTotal,
            needsOfLiquidity,
            needsOfLiquidityTotal,
            vlaLcrData,
            lcrData,
            nsfrData
        ];
    }
}
exports.GapBase = GapBase;
//# sourceMappingURL=gap.base.js.map