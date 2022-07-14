const GapMainClass = require('../../../utils/gap/GapMainClass')
const {getGapSubOrDivideByMonth} = require('../../../utils/gap/gap_pure_functions')
const {getGapTotal} = require('../../../utils/gap/gap_pure_functions')

class GapSimulation extends GapMainClass {

    constructor(forEditing) {
        super()
        this.forEditing = forEditing
    }

    formatQuery(date, where_query) {
        if(this.forEditing) {
            return `SELECT ROLE,
                           INDICATOR_NAME,
                           TOTAL,
                           NATIONAL_CURRENCY,
                           FOREIGN_CURRENCY,
                           USD,
                           EUR,
                           'AUTO' AS SOURCE
                    FROM GAP_SIMULATION_AUTO
                    WHERE ROLE = '${where_query}' ORDER BY OPER_DAY`
        }
        return super.formatQuery(date, where_query)
    }

    manualTableQuery(role) {
        if(this.forEditing) {
            return function () {
                return `SELECT
                               INDICATOR_NAME,
                               ROLE,
                               TOTAL,
                               NATIONAL_CURRENCY,
                               FOREIGN_CURRENCY,
                               USD,
                               EUR,
                               'MANUAL' AS SOURCE
                        FROM GAP_SIMULATION_MANUAL
                        WHERE ROLE = '${role}'
                        ORDER BY OPER_DAY`
            }
        }
        return super.manualTableQuery(role)
    }

    async getRows() {
        const months = await this.getMonths()
        let sourceOfLiquidity = await Promise.all([
            this.vla(),
            this.attraction_of_credit_lines(),
            this.return_of_loans(),
            this.interbank_deposits(),
            this.legal_deposits(),
            this.liquidity_source_others()
        ])
        const needsOfLiquidity = await Promise.all([
            this.return_of_interbank_deposits(),
            this.placement_of_interbank_deposits(),
            this.return_of_legal_deposits(),
            this.repayment_of_credit_lines(),
            this.post_fin_liabilities(),
            this.issuance_of_loans(),
            this.liquidity_need_others()
        ])
        let sourceOfLiquidityTotal = getGapTotal(months, ...sourceOfLiquidity)
        const needsOfLiquidityTotal = getGapTotal(months, ...needsOfLiquidity)
        const tempArray = new Array(13).fill('')
        // Остаток ВЛА на конец месяца
        const vlaBalance = []
        // fill vla and vla balance and update total rows
        tempArray.forEach((_, index) => {
            vlaBalance.push(getGapSubOrDivideByMonth(index, sourceOfLiquidityTotal, needsOfLiquidityTotal))
            sourceOfLiquidity[0].push(vlaBalance[index])
            sourceOfLiquidityTotal = getGapTotal(months, ...sourceOfLiquidity)
        })
        // Необходимая сумма для выполнения показателя ВЛА
        const amountForVlaLcr = await this.amount_for_vla_lcr()
        // Сумма отклонения(дефицит) на конец месяца
        const deficitAmount = tempArray
            .map((_, index) => getGapSubOrDivideByMonth(
                index,
                vlaBalance,
                amountForVlaLcr,
                'Сумма отклонения(дефицит) на конец месяца'
            ))
        // ПОКАЗАТЕЛЬ ВЛА
        const vlaIndicator = tempArray
            .map((_, index) => getGapSubOrDivideByMonth(
                index,
                vlaBalance,
                amountForVlaLcr,
                'ПОКАЗАТЕЛЬ ВЛА',
                true
            ))
        const vlaLcrData = [vlaBalance, amountForVlaLcr, deficitAmount, vlaIndicator]
        return {
            months,
            sourceOfLiquidity,
            sourceOfLiquidityTotal,
            needsOfLiquidity,
            needsOfLiquidityTotal,
            vlaLcrData
        }
    }
}

module.exports = GapSimulation