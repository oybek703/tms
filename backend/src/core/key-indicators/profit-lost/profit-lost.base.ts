import { Base } from '../../base'
import { IProfitLostDbData, IProfitLostRow } from './profit-lost.interface'

export class ProfitAndLostBase extends Base {
  protected formatQuery(role: string): string {
    return `SELECT
                BEGIN_YEAR AS "yearBegin",
                BEGIN_MONTH AS "monthBegin",
                SELECTED_DATE AS "selectedDate",
                DIFFERENCE AS "differ",
                DIFFER_PERCENT AS "differPercent" 
            FROM (SELECT * FROM PROFIT_LOST ORDER BY OPER_DAY DESC)
            WHERE OPER_DAY<DATE '${this.date}' AND ROLE='${role}' AND ROWNUM=1`
  }

  private getTotalData(...args: IProfitLostDbData[]) {
    let yearBegin = 0
    let monthBegin = 0
    let selectedDate = 0
    args.forEach(arg => {
      yearBegin += Math.abs(arg['yearBegin'])
      monthBegin += Math.abs(arg['monthBegin'])
      selectedDate += Math.abs(arg['selectedDate'])
    })
    return {
      yearBegin: isNaN(yearBegin) ? 'no_data' : yearBegin,
      monthBegin: isNaN(monthBegin) ? 'no_data' : monthBegin,
      selectedDate: isNaN(selectedDate) ? 'no_data' : selectedDate,
      differ: isNaN(selectedDate) ? 'no_data' : selectedDate - monthBegin,
      differPercent: isNaN(selectedDate) ? 'no_data' : `${(selectedDate / monthBegin - 1) * 100}`
    }
  }

  private returnDiffer(
    indicatorName: string,
    total: IProfitLostDbData,
    left: IProfitLostDbData,
    isTableHead: boolean,
    isAbs = true
  ): Omit<IProfitLostRow, 'count'> {
    let yearBegin = Math.abs(total['yearBegin']) - Math.abs(left['yearBegin'])
    let monthBegin = Math.abs(total['monthBegin']) - Math.abs(left['monthBegin'])
    let selectedDate = Math.abs(total['selectedDate']) - Math.abs(left['selectedDate'])
    if (!isAbs) {
      yearBegin = total['yearBegin'] - left['yearBegin']
      monthBegin = total['monthBegin'] - left['monthBegin']
      selectedDate = total['selectedDate'] - left['selectedDate']
    }
    return {
      indicatorName,
      yearBegin,
      monthBegin,
      selectedDate,
      differ: selectedDate - monthBegin,
      differPercent: isNaN(selectedDate) ? 'no_data' : `${(selectedDate / monthBegin - 1) * 100}`,
      isTableHead
    }
  }

  private async getOneRow(count: string, indicatorName: string, role: string, isTableHead = false) {
    const { yearBegin, monthBegin, selectedDate, differ, differPercent } =
      await this.getDataInDates<IProfitLostDbData>(role, undefined)
    return {
      yearBegin,
      monthBegin,
      selectedDate,
      differ,
      differPercent,
      count,
      indicatorName,
      isTableHead
    }
  }

  private async loan_portfolio_interest() {
    return await this.getOneRow('', 'Проценты по кредитному портфелю', 'L_P_I')
  } /* Проценты по кредитному портфелю */

  private async investment_interest() {
    return await this.getOneRow('', 'Проценты по инвестициям в ценные бумаги', 'I_I_S')
  } /* Проценты по инвестициям в ценные бумаги */

  private async interbank_deposits_interest() {
    return await this.getOneRow('', 'Проценты по межбанковским депозитам', 'I_I_D')
  } /* Проценты по межбанковским депозитам */

  private async other_interest_income() {
    return await this.getOneRow('', 'Другие процентные доходы', 'O_I_I')
  } /* Другие процентные доходы */

  private percent_income(...args: IProfitLostRow[]) {
    return <IProfitLostRow>{
      count: '',
      indicatorName: 'Процентные доходы',
      ...this.getTotalData(...args),
      isTableHead: true
    }
  } /* Процентные доходы */

  private async payable_interest() {
    return await this.getOneRow('', 'Проценты к оплате по депозитам клиентов', 'I_P_C_D')
  } /* Проценты к оплате по депозитам клиентов */

  private async borrowing_interest() {
    return await this.getOneRow('', 'Проценты к оплате по заимствованиям', 'I_P_B')
  } /* Проценты к оплате по заимствованиям */

  private async other_interest_expenses() {
    return await this.getOneRow('', 'Другие процентные расходы', 'O_I_E')
  } /* Другие процентные расходы */

  private percent_expenses(...args: IProfitLostRow[]) {
    return <IProfitLostRow>{
      count: '',
      indicatorName: 'Процентные расходы',
      ...this.getTotalData(...args),
      isTableHead: true
    }
  } /* Процентные расходы */

  private clear_percent_expenses(income: IProfitLostRow, expense: IProfitLostRow) {
    return {
      count: '',
      ...this.returnDiffer('Чистый процентный доход', income, expense, true)
    }
  } /* Чистый процентный доход */

  private async potential_loss_provisions() {
    return await this.getOneRow('', 'Резервы возможных убытков (кредиты)', 'P_L_P')
  } /* Резервы возможных убытков (кредиты) */

  private async potential_loss_provisions_sum() {
    return await this.getOneRow('', 'Резервы возможных убытков', 'P_L_P', true)
  } /* Резервы возможных убытков */

  private clear_income_after_reserve(clear_income: any, potential_loss_sum: any) {
    return {
      count: '',
      ...this.returnDiffer(
        'Чистый процентный доход после вычета резервов',
        clear_income,
        potential_loss_sum,
        true
      )
    }
  } /* Чистый процентный доход после вычета резервов */

  private async interest_free_income() {
    return await this.getOneRow('', 'Беспроцентные доходы', 'I_F_I')
  } /* Беспроцентные доходы */

  private async interest_free_expenses() {
    return await this.getOneRow('', 'Беспроцентные расходы', 'I_F_E')
  } /* Беспроцентные расходы */

  private clear_interest_free_income(if_income: any, if_expenses: any) {
    return {
      count: '',
      ...this.returnDiffer('Чистые беспроцентные доходы', if_income, if_expenses, true)
    }
  } /* Чистые беспроцентные доходы */

  private operational_incomes(after_reserve_income: any, clear_if_income: any) {
    return {
      count: '',
      ...this.returnDiffer('Операционные доходы', clear_if_income, after_reserve_income, true)
    }
  } /* Операционные доходы */

  private async salaries_costs() {
    return await this.getOneRow('', 'Заработная плата и другие расходы на сотрудников', 'S_O_E_C')
  } /* Заработная плата и другие расходы на сотрудников */

  private async rent_and_maintenance() {
    return await this.getOneRow('', 'Аренда и содержание', 'R_M')
  } /* Аренда и содержание */

  private async travel_transport() {
    return await this.getOneRow('', 'Командировочные и транспортные расходы', 'T_T_E')
  } /* Командировочные и транспортные расходы */

  private async administrative_expenses() {
    return await this.getOneRow('', 'Административные расходы', 'A_E')
  } /* Административные расходы */

  private async representation_and_charity() {
    return await this.getOneRow('', 'Репрезентация и благотворительность', 'R_CH')
  } /* Репрезентация и благотворительность */

  private async depreciation_costs() {
    return await this.getOneRow('', 'Расходы на износ', 'D_C')
  } /* Расходы на износ */

  private async insurance_taxes() {
    return await this.getOneRow('', 'Страхование, налоги и другие расходы', 'I_T_O_E')
  } /* Страхование, налоги и другие расходы */

  private async potential_loss_assessment() {
    return await this.getOneRow('', 'Оценка возможных убытков', 'A_P_L')
  } /* Оценка возможных убытков */

  private operational_expenses(...args: IProfitLostRow[]) {
    return <IProfitLostRow>{
      count: '',
      indicatorName: 'Операционные расходы',
      ...this.getTotalData(...args),
      isTableHead: true
    }
  } /* Операционные расходы */

  private operational_result(op_incomes: IProfitLostRow, op_expenses: IProfitLostRow) {
    return {
      count: '',
      ...this.returnDiffer('Операционные результаты', op_incomes, op_expenses, true, false)
    }
  } /* Операционные результаты */

  private async tax_assessment() {
    return await this.getOneRow('', 'Оценка подоходного налога', 'I_T_A', true)
  } /* Оценка подоходного налога */

  private report_for_period(oper_result: IProfitLostRow, tax_ass: IProfitLostRow) {
    return {
      count: '',
      ...this.returnDiffer('Чистая прибыль (убыток) на отчетный период', oper_result, tax_ass, true)
    }
  } /* Чистая прибыль (убыток) на отчетный период */

  async getRows(): Promise<IProfitLostRow[]> {
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
      loanPortfolioInterest,
      investmentInterest,
      interbankDepositsInterest,
      otherInterestIncome
    )
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
