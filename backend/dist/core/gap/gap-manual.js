"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GapManual = void 0;
const gap_base_1 = require("./gap.base");
class GapManual extends gap_base_1.GapBase {
    constructor(oracleService, forEditing = false) {
        super(oracleService);
        this.forEditing = forEditing;
    }
    formatQuery(whereQuery) {
        if (this.forEditing) {
            return `SELECT ROLE AS "role",
                       INDICATOR_NAME AS "indicatorName",
                       TOTAL AS "total",
                       NATIONAL_CURRENCY AS "nationalCurrency",
                       FOREIGN_CURRENCY AS "foreignCurrency",
                       USD AS "usd",
                       EUR AS "eur",
                       'AUTO' AS "source"
                FROM GAP_SIMULATION_AUTO
                WHERE ROLE = '${whereQuery}' ORDER BY OPER_DAY`;
        }
        return super.formatQuery(whereQuery);
    }
    manualTableQuery(role) {
        if (this.forEditing) {
            return () => {
                return `SELECT
                         INDICATOR_NAME AS "indicatorName",
                         ROLE AS "role",
                         TOTAL AS "total",
                         NATIONAL_CURRENCY AS "nationalCurrency",
                         FOREIGN_CURRENCY AS "foreignCurrency",
                         USD AS "usd",
                         EUR AS "eur",
                         'MANUAL' AS "source"
                  FROM GAP_SIMULATION_MANUAL
                  WHERE ROLE = '${role}'
                  ORDER BY OPER_DAY`;
            };
        }
        return super.manualTableQuery(role);
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
        return [
            months,
            sourceOfLiquidity,
            sourceOfLiquidityTotal,
            needsOfLiquidity,
            needsOfLiquidityTotal,
            vlaLcrData
        ];
    }
}
exports.GapManual = GapManual;
//# sourceMappingURL=gap-manual.js.map