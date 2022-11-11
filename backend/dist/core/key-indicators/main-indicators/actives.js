"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Actives = void 0;
const main_indicators_base_1 = require("./main-indicators.base");
class Actives extends main_indicators_base_1.MainIndicatorsBase {
    cash_equivs(...args) {
        return Object.assign(Object.assign({ count: '', indicatorName: 'Наличные и денежные эквиваленты' }, this.getTotalData(...args)), { isTableHead: true });
    }
    async cash_at_checkout() {
        return await this.getOneRow('', 'Наличные в кассе', `CODE_COA LIKE '101%'`);
    }
    async cb_balances() {
        return await this.getOneRow('', 'Остатки в Центральном банке', `CODE_COA LIKE '103%'`);
    }
    async other_bank_receipts() {
        return await this.getOneRow('', 'К получению из других банков', `CODE_COA LIKE '105%'`, undefined, true);
    }
    async nostro_accounts() {
        return await this.getOneRow('', 'Ностро счета', `CODE_COA='10501'`);
    }
    async interbank_deposits() {
        return await this.getOneRow('', 'Межбанковские депозиты', `CODE_COA IN ('10521', '10597', '10531', '10541')`);
    }
    bills(...args) {
        return Object.assign(Object.assign({ count: '', indicatorName: 'Ценные бумаги' }, this.getTotalData(...args)), { isTableHead: true });
    }
    async government_bills() {
        return await this.getOneRow('', 'Государственные ценные бумаги', `CODE_COA IN ('10705', '10709')`);
    }
    async non_government_bills() {
        return await this.getOneRow('', 'Негосударственные ценные бумаги', `CODE_COA LIKE '159%'`);
    }
    async loan_portfolio() {
        return await this.getOneRow('', 'Кредитный портфель', undefined, this.mainIndicatorsQuery('L_P'), true);
    }
    client_credits(...args) {
        return Object.assign({ count: '', indicatorName: 'Выданные кредиты клиентам' }, this.getTotalData(...args));
    }
    async potential_loss_reserves() {
        return await this.getOneRow('', 'Резервы возможных убытков', undefined, this.mainIndicatorsQuery('P_L_R'));
    }
    async fixed_assets() {
        return await this.getOneRow('', 'Основные средства банка', `CODE_COA LIKE '165%'`, undefined, true);
    }
    async accrued_interests() {
        return await this.getOneRow('', 'Начисленные проценты к получению', undefined, this.mainIndicatorsQuery('A_I_R'), true);
    }
    async balance_sheet_assets() {
        return await this.getOneRow('', 'Имущества принятые на баланс', `CODE_COA LIKE '167%'`, undefined, true);
    }
    async other_actives() {
        return await this.getOneRow('', 'Другие активы', undefined, this.mainIndicatorsQuery('O_A'), true);
    }
    async total_actives() {
        return await this.getOneRow('', 'Всего активов', undefined, this.mainIndicatorsQuery('T_A'), true);
    }
    async bank_obligations() {
        return await this.getOneRow('', 'Обязательства перед банками', `CODE_COA LIKE '210%'`, undefined, true);
    }
    async vostro_accounts() {
        return await this.getOneRow('', 'Востро счета', `CODE_COA='21002'`);
    }
    async interbank_deposits_A() {
        return await this.getOneRow('', 'Межбанковские депозиты', `CODE_COA IN ('21010', '21022', '21032', '21042')`);
    }
    async customer_commitments() {
        return await this.getOneRow('', 'Обязательства перед клиентами', undefined, this.mainIndicatorsQuery('C_T_C'), true);
    }
    async legals_demand_deposits() {
        return await this.getOneRow('', 'депозиты юр. лиц. до востребования', undefined, this.mainIndicatorsQuery('D_D_L_E'));
    }
    async legals_saving_deposits() {
        return await this.getOneRow('', 'сберегательные депозиты юр. лиц.', `CODE_COA LIKE '204%' and CODE_COA!='20406'`);
    }
    async legals_urgent_deposits() {
        return await this.getOneRow('', 'срочные депозиты юр. лиц.', undefined, this.mainIndicatorsQuery('T_D_L_E'));
    }
    async obligations_and_borrowings() {
        return await this.getOneRow('', 'Обязательства перед МФИ и другие заимствования', `CODE_COA LIKE '220%' or CODE_COA LIKE '216%'`, undefined, true);
    }
    async bank_issued_bills() {
        return await this.getOneRow('', 'Выпущенные банком ценные бумаги', `CODE_COA LIKE '236%'`, undefined, true);
    }
    async subordinated_debt() {
        return await this.getOneRow('', 'Субординированный долг', `CODE_COA='23702'`, null, true);
    }
    async payable_accrued_interest() {
        return await this.getOneRow('', 'Начисленные проценты к оплате', undefined, this.mainIndicatorsQuery('A_I_P'), true);
    }
    async pay_taxes() {
        return await this.getOneRow('', 'Налоги к оплате', `CODE_COA LIKE '225%'`, null, true);
    }
    async other_financial_obligations() {
        return await this.getOneRow('', 'Другие финансовые обязательства', undefined, this.mainIndicatorsQuery('O_F_L'), true);
    }
    async other_obligations() {
        return await this.getOneRow('', 'Другие обязательства', undefined, this.mainIndicatorsQuery('O_O'), true);
    }
    async total_liabilities() {
        return await this.getOneRow('', 'Всего обязательств', undefined, this.mainIndicatorsQuery('T_L'), true);
    }
    async authorized_capital() {
        return await this.getOneRow('', 'Уставный капитал', `CODE_COA LIKE '303%'`);
    }
    async reserve_fond() {
        return await this.getOneRow('', 'Резервный фонд общего назначения', `CODE_COA='30903'`);
    }
    async undistributed_profits() {
        return await this.getOneRow('', 'Нераспределенная прибыль', `CODE_COA='31203'`);
    }
    async current_profit() {
        return await this.getOneRow('', 'Текущая прибыль', undefined, this.mainIndicatorsQuery('C_P'));
    }
    async total_capital() {
        return await this.getOneRow('', 'Совокупный капитал', undefined, this.mainIndicatorsQuery('T_C'));
    }
    async getRows() {
        const [cashAtCheckOut, CBBalances, otherBankReceipts, nostroAccounts, interbankDeposits, governmentBills, nonGovernmentBills, loanPortfolio, potentialLossReserves, fixedAssets, accruedInterests, balanceSheetAssets, otherActives, totalActives, bankObligations, vostroAccounts, interbankDepositsA, customerCommitments, legalDemandDeposits, legalSavingDeposits, legalUrgentDeposits, obligationsAndBorrowings, bankIssuedBills, subordinatedDebt, payableAccruedInterest, payTaxes, otherFinancialObligations, otherObligations, totalLiabilities, authorizedCapital, reserveFond, undistributedProfits, currentProfit, totalCapital] = await Promise.all([
            this.cash_at_checkout(),
            this.cb_balances(),
            this.other_bank_receipts(),
            this.nostro_accounts(),
            this.interbank_deposits(),
            this.government_bills(),
            this.non_government_bills(),
            this.loan_portfolio(),
            this.potential_loss_reserves(),
            this.fixed_assets(),
            this.accrued_interests(),
            this.balance_sheet_assets(),
            this.other_actives(),
            this.total_actives(),
            this.bank_obligations(),
            this.vostro_accounts(),
            this.interbank_deposits_A(),
            this.customer_commitments(),
            this.legals_demand_deposits(),
            this.legals_saving_deposits(),
            this.legals_urgent_deposits(),
            this.obligations_and_borrowings(),
            this.bank_issued_bills(),
            this.subordinated_debt(),
            this.payable_accrued_interest(),
            this.pay_taxes(),
            this.other_financial_obligations(),
            this.other_obligations(),
            this.total_liabilities(),
            this.authorized_capital(),
            this.reserve_fond(),
            this.undistributed_profits(),
            this.current_profit(),
            this.total_capital()
        ]);
        const cashEquivs = this.cash_equivs(cashAtCheckOut, CBBalances);
        const bills = this.bills(governmentBills, nonGovernmentBills);
        const clientCredits = this.client_credits(loanPortfolio, potentialLossReserves);
        return [
            cashEquivs,
            cashAtCheckOut,
            CBBalances,
            otherBankReceipts,
            nostroAccounts,
            interbankDeposits,
            bills,
            governmentBills,
            nonGovernmentBills,
            loanPortfolio,
            clientCredits,
            potentialLossReserves,
            fixedAssets,
            accruedInterests,
            balanceSheetAssets,
            otherActives,
            totalActives,
            bankObligations,
            vostroAccounts,
            interbankDepositsA,
            customerCommitments,
            legalDemandDeposits,
            legalSavingDeposits,
            legalUrgentDeposits,
            obligationsAndBorrowings,
            bankIssuedBills,
            subordinatedDebt,
            payableAccruedInterest,
            payTaxes,
            otherFinancialObligations,
            otherObligations,
            totalLiabilities,
            authorizedCapital,
            reserveFond,
            undistributedProfits,
            currentProfit,
            totalCapital
        ];
    }
}
exports.Actives = Actives;
//# sourceMappingURL=actives.js.map