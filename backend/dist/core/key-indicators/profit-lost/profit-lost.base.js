"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfitAndLostBase = void 0;
const base_1 = require("../../base");
class ProfitAndLostBase extends base_1.Base {
    formatQuery(role) {
        return `SELECT
                BEGIN_YEAR AS "yearBegin",
                BEGIN_MONTH AS "monthBegin",
                SELECTED_DATE AS "selectedDate",
                DIFFERENCE AS "differ",
                DIFFER_PERCENT AS "differPercent" 
            FROM (SELECT * FROM PROFIT_LOST ORDER BY OPER_DAY DESC)
            WHERE OPER_DAY<DATE '${this.date}' AND ROLE='${role}' AND ROWNUM=1`;
    }
    getTotalData(...args) {
        let yearBegin = 0;
        let monthBegin = 0;
        let selectedDate = 0;
        args.forEach(arg => {
            yearBegin += Math.abs(arg['yearBegin']);
            monthBegin += Math.abs(arg['monthBegin']);
            selectedDate += Math.abs(arg['selectedDate']);
        });
        return {
            yearBegin: isNaN(yearBegin) ? 'no_data' : yearBegin,
            monthBegin: isNaN(monthBegin) ? 'no_data' : monthBegin,
            selectedDate: isNaN(selectedDate) ? 'no_data' : selectedDate,
            differ: isNaN(selectedDate) ? 'no_data' : selectedDate - monthBegin,
            differPercent: isNaN(selectedDate) ? 'no_data' : `${(selectedDate / monthBegin - 1) * 100}`
        };
    }
    returnDiffer(indicatorName, total, left, isTableHead, isAbs = true) {
        let yearBegin = Math.abs(total['yearBegin']) - Math.abs(left['yearBegin']);
        let monthBegin = Math.abs(total['monthBegin']) - Math.abs(left['monthBegin']);
        let selectedDate = Math.abs(total['selectedDate']) - Math.abs(left['selectedDate']);
        if (!isAbs) {
            yearBegin = total['yearBegin'] - left['yearBegin'];
            monthBegin = total['monthBegin'] - left['monthBegin'];
            selectedDate = total['selectedDate'] - left['selectedDate'];
        }
        return {
            indicatorName,
            yearBegin,
            monthBegin,
            selectedDate,
            differ: selectedDate - monthBegin,
            differPercent: isNaN(selectedDate) ? 'no_data' : `${(selectedDate / monthBegin - 1) * 100}`,
            isTableHead
        };
    }
    async getOneRow(count, indicatorName, role, isTableHead = false) {
        const { yearBegin, monthBegin, selectedDate, differ, differPercent } = await this.getDataInDates(role, undefined);
        return {
            yearBegin,
            monthBegin,
            selectedDate,
            differ,
            differPercent,
            count,
            indicatorName,
            isTableHead
        };
    }
    async loan_portfolio_interest() {
        return await this.getOneRow('', 'Проценты по кредитному портфелю', 'L_P_I');
    }
    async investment_interest() {
        return await this.getOneRow('', 'Проценты по инвестициям в ценные бумаги', 'I_I_S');
    }
    async interbank_deposits_interest() {
        return await this.getOneRow('', 'Проценты по межбанковским депозитам', 'I_I_D');
    }
    async other_interest_income() {
        return await this.getOneRow('', 'Другие процентные доходы', 'O_I_I');
    }
    percent_income(...args) {
        return Object.assign(Object.assign({ count: '', indicatorName: 'Процентные доходы' }, this.getTotalData(...args)), { isTableHead: true });
    }
    async payable_interest() {
        return await this.getOneRow('', 'Проценты к оплате по депозитам клиентов', 'I_P_C_D');
    }
    async borrowing_interest() {
        return await this.getOneRow('', 'Проценты к оплате по заимствованиям', 'I_P_B');
    }
    async other_interest_expenses() {
        return await this.getOneRow('', 'Другие процентные расходы', 'O_I_E');
    }
    percent_expenses(...args) {
        return Object.assign(Object.assign({ count: '', indicatorName: 'Процентные расходы' }, this.getTotalData(...args)), { isTableHead: true });
    }
    clear_percent_expenses(income, expense) {
        return Object.assign({ count: '' }, this.returnDiffer('Чистый процентный доход', income, expense, true));
    }
    async potential_loss_provisions() {
        return await this.getOneRow('', 'Резервы возможных убытков (кредиты)', 'P_L_P');
    }
    async potential_loss_provisions_sum() {
        return await this.getOneRow('', 'Резервы возможных убытков', 'P_L_P', true);
    }
    clear_income_after_reserve(clear_income, potential_loss_sum) {
        return Object.assign({ count: '' }, this.returnDiffer('Чистый процентный доход после вычета резервов', clear_income, potential_loss_sum, true));
    }
    async interest_free_income() {
        return await this.getOneRow('', 'Беспроцентные доходы', 'I_F_I');
    }
    async interest_free_expenses() {
        return await this.getOneRow('', 'Беспроцентные расходы', 'I_F_E');
    }
    clear_interest_free_income(if_income, if_expenses) {
        return Object.assign({ count: '' }, this.returnDiffer('Чистые беспроцентные доходы', if_income, if_expenses, true));
    }
    operational_incomes(after_reserve_income, clear_if_income) {
        return Object.assign({ count: '' }, this.returnDiffer('Операционные доходы', clear_if_income, after_reserve_income, true));
    }
    async salaries_costs() {
        return await this.getOneRow('', 'Заработная плата и другие расходы на сотрудников', 'S_O_E_C');
    }
    async rent_and_maintenance() {
        return await this.getOneRow('', 'Аренда и содержание', 'R_M');
    }
    async travel_transport() {
        return await this.getOneRow('', 'Командировочные и транспортные расходы', 'T_T_E');
    }
    async administrative_expenses() {
        return await this.getOneRow('', 'Административные расходы', 'A_E');
    }
    async representation_and_charity() {
        return await this.getOneRow('', 'Репрезентация и благотворительность', 'R_CH');
    }
    async depreciation_costs() {
        return await this.getOneRow('', 'Расходы на износ', 'D_C');
    }
    async insurance_taxes() {
        return await this.getOneRow('', 'Страхование, налоги и другие расходы', 'I_T_O_E');
    }
    async potential_loss_assessment() {
        return await this.getOneRow('', 'Оценка возможных убытков', 'A_P_L');
    }
    operational_expenses(...args) {
        return Object.assign(Object.assign({ count: '', indicatorName: 'Операционные расходы' }, this.getTotalData(...args)), { isTableHead: true });
    }
    operational_result(op_incomes, op_expenses) {
        return Object.assign({ count: '' }, this.returnDiffer('Операционные результаты', op_incomes, op_expenses, true, false));
    }
    async tax_assessment() {
        return await this.getOneRow('', 'Оценка подоходного налога', 'I_T_A', true);
    }
    report_for_period(oper_result, tax_ass) {
        return Object.assign({ count: '' }, this.returnDiffer('Чистая прибыль (убыток) на отчетный период', oper_result, tax_ass, true));
    }
    async getRows() {
        const [loanPortfolioInterest, investmentInterest, interbankDepositsInterest, otherInterestIncome, payableInterest, borrowingInterest, otherInterestExpenses, potentialLossProvisions, potentialLossProvisionsSum, interestFreeIncome, interestFreeExpenses, salariesCosts, rentAndMaintenance, travelTransport, administrativeExpenses, representationAndCharity, depreciationCosts, insuranceTaxes, potentialLossAssessment, taxAssessment] = await Promise.all([
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
        ]);
        const percentIncome = this.percent_income(loanPortfolioInterest, investmentInterest, interbankDepositsInterest, otherInterestIncome);
        const percentExpenses = this.percent_expenses(payableInterest, borrowingInterest, otherInterestExpenses);
        const clearPercentExpenses = this.clear_percent_expenses(percentIncome, percentExpenses);
        const clearIncomeAfterReserve = this.clear_income_after_reserve(clearPercentExpenses, potentialLossProvisionsSum);
        const clearInterestFreeIncome = this.clear_interest_free_income(interestFreeIncome, interestFreeExpenses);
        const operationalIncomes = this.operational_incomes(clearIncomeAfterReserve, clearInterestFreeIncome);
        const operationalExpenses = this.operational_expenses(salariesCosts, rentAndMaintenance, travelTransport, administrativeExpenses, representationAndCharity, depreciationCosts, insuranceTaxes, potentialLossAssessment);
        const operationalResult = this.operational_result(operationalIncomes, operationalExpenses);
        const reportForPeriod = this.report_for_period(operationalResult, taxAssessment);
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
        ];
    }
}
exports.ProfitAndLostBase = ProfitAndLostBase;
//# sourceMappingURL=profit-lost.base.js.map