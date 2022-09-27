import GapMainClass from '../../../utils/gap/GapMainClass'
import { getGapSubOrDivideByMonth, getGapTotal } from '../../../utils/gap/gap_pure_functions'

class GapSimulation extends GapMainClass {
	forEditing: boolean
	constructor(forEditing: boolean) {
		super()
		this.forEditing = forEditing
	}

	formatQuery(date: string, whereQuery: string) {
		if (this.forEditing) {
			return `SELECT ROLE,
                       INDICATOR_NAME,
                       TOTAL,
                       NATIONAL_CURRENCY,
                       FOREIGN_CURRENCY,
                       USD,
                       EUR,
                       'AUTO' AS SOURCE
                FROM GAP_SIMULATION_AUTO
                WHERE ROLE = '${whereQuery}' ORDER BY OPER_DAY`
		}
		return super.formatQuery(date, whereQuery)
	}

	manualTableQuery(role: string) {
		if (this.forEditing) {
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

	// @ts-ignore
	async getRows() {
		const months = await this.getMonths()
		const sourceOfLiquidity = await Promise.all([
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
		const needsOfLiquidityTotal: any = getGapTotal(months, ...needsOfLiquidity)
		const tempArray = new Array(13).fill('')
		// Остаток ВЛА на конец месяца
		const vlaBalance: any = []
		// fill vla and vla balance and update total rows
		tempArray.forEach((_, index) => {
			vlaBalance.push(
				getGapSubOrDivideByMonth(index, sourceOfLiquidityTotal, needsOfLiquidityTotal)
			)
			sourceOfLiquidity[0].push(vlaBalance[index])
			sourceOfLiquidityTotal = getGapTotal(months, ...sourceOfLiquidity)
		})
		// Необходимая сумма для выполнения показателя ВЛА
		const amountForVlaLcr = await this.amount_for_vla_lcr()
		// Сумма отклонения(дефицит) на конец месяца
		const deficitAmount = tempArray.map((_, index) =>
			getGapSubOrDivideByMonth(
				index,
				vlaBalance,
				amountForVlaLcr,
				'Сумма отклонения(дефицит) на конец месяца'
			)
		)
		// ПОКАЗАТЕЛЬ ВЛА
		const vlaIndicator = tempArray.map((_, index) =>
			getGapSubOrDivideByMonth(index, vlaBalance, amountForVlaLcr, 'ПОКАЗАТЕЛЬ ВЛА', true)
		)
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

export default GapSimulation
