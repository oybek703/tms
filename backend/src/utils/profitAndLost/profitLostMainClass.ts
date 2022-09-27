import {
	createMainIndicatorsData,
	getMainIndicatorsTotalData,
	returnDiffer
} from '../mainIndicators/mi_pure_functions'
import MainClass from '../mainClass'

/* eslint-disable camelcase */
class ProfitLostMainClass extends MainClass {
	constructor(date: string) {
		super(date)
	}

	profitLostQuery(role: string) {
		return function (date: string) {
			return `SELECT
                        BEGIN_YEAR YEAR_BEGIN,
                        BEGIN_MONTH MONTH_BEGIN,
                        SELECTED_DATE,
                        DIFFERENCE DIFFER,
                        DIFFER_PERCENT
                    FROM (SELECT * FROM PROFIT_LOST ORDER BY OPER_DAY DESC)
                    WHERE OPER_DAY<TO_DATE('${date}', 'DD.MM.YYYY') AND ROLE='${role}' AND ROWNUM=1`
		}
	}

	async getOneRow(count: string, indicatorName: string, role = 'O_O', isTableHead = false) {
		const { YEAR_BEGIN, MONTH_BEGIN, SELECTED_DATE, DIFFER, DIFFER_PERCENT } =
			await this.getDataInDates('', this.profitLostQuery(role))
		return createMainIndicatorsData(
			count,
			indicatorName,
			YEAR_BEGIN,
			MONTH_BEGIN,
			SELECTED_DATE,
			DIFFER,
			DIFFER_PERCENT,
			isTableHead
		)
	}

	async loan_portfolio_interest() {
		/* Проценты по кредитному портфелю */
		return await this.getOneRow('', 'Проценты по кредитному портфелю', 'L_P_I')
	} /* Проценты по кредитному портфелю */

	async investment_interest() {
		/* Проценты по инвестициям в ценные бумаги */
		return await this.getOneRow('', 'Проценты по инвестициям в ценные бумаги', 'I_I_S')
	} /* Проценты по инвестициям в ценные бумаги */

	async interbank_deposits_interest() {
		/* Проценты по межбанковским депозитам */
		return await this.getOneRow('', 'Проценты по межбанковским депозитам', 'I_I_D')
	} /* Проценты по межбанковским депозитам */

	async other_interest_income() {
		/* Другие процентные доходы */
		return await this.getOneRow('', 'Другие процентные доходы', 'O_I_I')
	} /* Другие процентные доходы */

	percent_income(...args: any) {
		/* Процентные доходы */
		return {
			count: '',
			indicator_name: 'Процентные доходы',
			...getMainIndicatorsTotalData(...args),
			isTableHead: true
		}
	} /* Процентные доходы */

	async payable_interest() {
		/* Проценты к оплате по депозитам клиентов */
		return await this.getOneRow('', 'Проценты к оплате по депозитам клиентов', 'I_P_C_D')
	} /* Проценты к оплате по депозитам клиентов */

	async borrowing_interest() {
		/* Проценты к оплате по заимствованиям */
		return await this.getOneRow('', 'Проценты к оплате по заимствованиям', 'I_P_B')
	} /* Проценты к оплате по заимствованиям */

	async other_interest_expenses() {
		/* Другие процентные расходы */
		return await this.getOneRow('', 'Другие процентные расходы', 'O_I_E')
	} /* Другие процентные расходы */

	percent_expenses(...args: any) {
		/* Процентные расходы */
		return {
			count: '',
			indicator_name: 'Процентные расходы',
			...getMainIndicatorsTotalData(...args),
			isTableHead: true
		}
	} /* Процентные расходы */

	clear_percent_expenses(income: any, expense: any) {
		/* Чистый процентный доход */
		return {
			count: '',
			...returnDiffer('Чистый процентный доход', income, expense, true)
		}
	} /* Чистый процентный доход */

	async potential_loss_provisions() {
		/* Резервы возможных убытков (кредиты) */
		return await this.getOneRow('', 'Резервы возможных убытков (кредиты)', 'P_L_P')
	} /* Резервы возможных убытков (кредиты) */

	async potential_loss_provisions_sum() {
		/* Резервы возможных убытков */
		return await this.getOneRow('', 'Резервы возможных убытков', 'P_L_P', true)
	} /* Резервы возможных убытков */

	// eslint-disable-next-line max-len
	clear_income_after_reserve(clear_income: any, potential_loss_sum: any) {
		/* Чистый процентный доход после вычета резервов */
		return {
			count: '',
			...returnDiffer(
				'Чистый процентный доход после вычета резервов',
				clear_income,
				potential_loss_sum,
				true
			)
		}
	} /* Чистый процентный доход после вычета резервов */

	async interest_free_income() {
		/* Беспроцентные доходы */
		return await this.getOneRow('', 'Беспроцентные доходы', 'I_F_I')
	} /* Беспроцентные доходы */

	async interest_free_expenses() {
		/* Беспроцентные расходы */
		return await this.getOneRow('', 'Беспроцентные расходы', 'I_F_E')
	} /* Беспроцентные расходы */

	clear_interest_free_income(if_income: any, if_expenses: any) {
		/* Чистые беспроцентные доходы */
		return {
			count: '',
			...returnDiffer('Чистые беспроцентные доходы', if_income, if_expenses, true)
		}
	} /* Чистые беспроцентные доходы */

	operational_incomes(after_reserve_income: any, clear_if_income: any) {
		/* Операционные доходы */
		return {
			count: '',
			...returnDiffer('Операционные доходы', clear_if_income, after_reserve_income, true)
		}
	} /* Операционные доходы */

	async salaries_costs() {
		/* Заработная плата и другие расходы на сотрудников */
		return await this.getOneRow('', 'Заработная плата и другие расходы на сотрудников', 'S_O_E_C')
	} /* Заработная плата и другие расходы на сотрудников */

	async rent_and_maintenance() {
		/* Аренда и содержание */
		return await this.getOneRow('', 'Аренда и содержание', 'R_M')
	} /* Аренда и содержание */

	async travel_transport() {
		/* Командировочные и транспортные расходы */
		return await this.getOneRow('', 'Командировочные и транспортные расходы', 'T_T_E')
	} /* Командировочные и транспортные расходы */

	async administrative_expenses() {
		/* Административные расходы */
		return await this.getOneRow('', 'Административные расходы', 'A_E')
	} /* Административные расходы */

	async representation_and_charity() {
		/* Репрезентация и благотворительность */
		return await this.getOneRow('', 'Репрезентация и благотворительность', 'R_CH')
	} /* Репрезентация и благотворительность */

	async depreciation_costs() {
		/* Расходы на износ */
		return await this.getOneRow('', 'Расходы на износ', 'D_C')
	} /* Расходы на износ */

	async insurance_taxes() {
		/* Страхование, налоги и другие расходы */
		return await this.getOneRow('', 'Страхование, налоги и другие расходы', 'I_T_O_E')
	} /* Страхование, налоги и другие расходы */

	async potential_loss_assessment() {
		/* Оценка возможных убытков */
		return await this.getOneRow('', 'Оценка возможных убытков', 'A_P_L')
	} /* Оценка возможных убытков */

	operational_expenses(...args: any) {
		/* Операционные расходы */
		return {
			count: '',
			indicator_name: 'Операционные расходы',
			...getMainIndicatorsTotalData(...args),
			isTableHead: true
		}
	} /* Операционные расходы */

	operational_result(op_incomes: any, op_expenses: any) {
		/* Операционные результаты */
		return {
			count: '',
			...returnDiffer('Операционные результаты', op_incomes, op_expenses, true, false)
		}
	} /* Операционные результаты */

	async tax_assessment() {
		/* Оценка подоходного налога */
		return await this.getOneRow('', 'Оценка подоходного налога', 'I_T_A', true)
	} /* Оценка подоходного налога */

	// eslint-disable-next-line max-len
	report_for_period(oper_result: any, tax_ass: any) {
		/* Чистая прибыль (убыток) на отчетный период */
		return {
			count: '',
			...returnDiffer('Чистая прибыль (убыток) на отчетный период', oper_result, tax_ass, true)
		}
	} /* Чистая прибыль (убыток) на отчетный период */

	async getRows() {
		const [
			loanPortfolioInterest,
			investmentInterest,
			interbankDepositsInterest,
			otherInterestIncome,
			payableInterest,
			borrowingInterest,
			otherInterestExpenses,
			potentialLossProvisions,
			potentialLossProvisionsSum,
			interestFreeIncome,
			interestFreeExpenses,
			salariesCosts,
			rentAndMaintenance,
			travelTransport,
			administrativeExpenses,
			representationAndCharity,
			depreciationCosts,
			insuranceTaxes,
			potentialLossAssessment,
			taxAssessment
		] = await Promise.all([
			this.loan_portfolio_interest(),
			this.investment_interest(),
			this.interbank_deposits_interest(),
			this.other_interest_income(),
			this.payable_interest(),
			this.borrowing_interest(),
			this.other_interest_expenses(),
			this.potential_loss_provisions(),
			this.potential_loss_provisions_sum(),
			this.interest_free_income(),
			this.interest_free_expenses(),
			this.salaries_costs(),
			this.rent_and_maintenance(),
			this.travel_transport(),
			this.administrative_expenses(),
			this.representation_and_charity(),
			this.depreciation_costs(),
			this.insurance_taxes(),
			this.potential_loss_assessment(),
			this.tax_assessment()
		])
		const percentIncome = this.percent_income(
			// @ts-ignore
			loanPortfolioInterest,
			investmentInterest,
			interbankDepositsInterest,
			otherInterestIncome
		)
		// @ts-ignore
		const percentExpenses = this.percent_expenses(
			payableInterest,
			borrowingInterest,
			otherInterestExpenses
		)
		const clearPercentExpenses = this.clear_percent_expenses(percentIncome, percentExpenses)
		const clearIncomeAfterReserve = this.clear_income_after_reserve(
			clearPercentExpenses,
			potentialLossProvisionsSum
		)
		const clearInterestFreeIncome = this.clear_interest_free_income(
			interestFreeIncome,
			interestFreeExpenses
		)
		const operationalIncomes = this.operational_incomes(
			clearIncomeAfterReserve,
			clearInterestFreeIncome
		)
		const operationalExpenses = this.operational_expenses(
			// @ts-ignore
			salariesCosts,
			rentAndMaintenance,
			travelTransport,
			administrativeExpenses,
			representationAndCharity,
			depreciationCosts,
			insuranceTaxes,
			potentialLossAssessment
		)
		const operationalResult = this.operational_result(operationalIncomes, operationalExpenses)
		const reportForPeriod = this.report_for_period(operationalResult, taxAssessment)
		return [
			loanPortfolioInterest,
			investmentInterest,
			interbankDepositsInterest,
			otherInterestIncome,
			percentIncome,
			payableInterest,
			borrowingInterest,
			otherInterestExpenses,
			percentExpenses,
			clearPercentExpenses,
			potentialLossProvisions,
			potentialLossProvisionsSum,
			clearIncomeAfterReserve,
			interestFreeIncome,
			interestFreeExpenses,
			clearInterestFreeIncome,
			operationalIncomes,
			salariesCosts,
			rentAndMaintenance,
			travelTransport,
			administrativeExpenses,
			representationAndCharity,
			depreciationCosts,
			insuranceTaxes,
			potentialLossAssessment,
			operationalExpenses,
			operationalResult,
			taxAssessment,
			reportForPeriod
		]
	}
}

export default ProfitLostMainClass
