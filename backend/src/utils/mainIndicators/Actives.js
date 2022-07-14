const MainIndicatorsMainClass = require("./mainIndicatorsMainClass")
const {getMainIndicatorsTotalData} = require("./mi_pure_functions")

class Actives extends MainIndicatorsMainClass {
    constructor(date) {
        super(date)
    }

    cash_equivs(...args) { /* Наличные и денежные эквиваленты */
        return {
            count: '',
            indicator_name: 'Наличные и денежные эквиваленты',
            ...getMainIndicatorsTotalData(...args),
            isTableHead: true
        }
    } /* Наличные и денежные эквиваленты */

    async cash_at_checkout() { /* Наличные в кассе */
        return await this.getOneRow(
            '',
            'Наличные в кассе',
            `code_coa like '101%'`
        )
    } /* Наличные в кассе */

    async CB_balances() { /* Остатки в Центральном банке */
        return await this.getOneRow(
            '',
            'Остатки в Центральном банке',
            `code_coa like '103%'`
        )
    } /* Остатки в Центральном банке */

    async other_bank_receipts() { /* К получению из других банков */
        return await this.getOneRow(
            '',
            'К получению из других банков',
            `code_coa like '105%'`,
            false,
            true
        )
    } /* К получению из других банков */

    async nostro_accounts() { /* Ностро счета */
        return await this.getOneRow(
            '',
            'Ностро счета',
            `code_coa='10501'`
        )
    } /* Ностро счета */

    async interbank_deposits() { /* Межбанковские депозиты */
        return await this.getOneRow(
            '',
            'Межбанковские депозиты',
            `code_coa in ('10521', '10597', '10531', '10541')`
        )
    } /* Межбанковские депозиты */

    bills(...args) { /* Ценные бумаги */
        return {
            count: '',
            indicator_name: 'Ценные бумаги',
            ...getMainIndicatorsTotalData(...args),
            isTableHead: true
        }
    } /* Ценные бумаги */

    async government_bills() { /* Государственные ценные бумаги */
        return await this.getOneRow(
            '',
            'Государственные ценные бумаги',
            `code_coa in ('10705', '10709')`
        )
    } /* Государственные ценные бумаги */

    async non_government_bills() { /* Негосударственные ценные бумаги */
        return await this.getOneRow(
            '',
            'Негосударственные ценные бумаги',
            `code_coa like '159%'`
        )
    } /* Негосударственные ценные бумаги */

    async loan_portfolio() { /* Кредитный портфель */
        return await this.getOneRow(
            '',
            'Кредитный портфель',
            false,
            this.mainIndicatorsQuery('L_P'),
            true
        )
    } /* Кредитный портфель */

    client_credits(...args) { /* Выданные кредиты клиентам */
        return {
            count: '',
            indicator_name: 'Выданные кредиты клиентам',
            ...getMainIndicatorsTotalData(...args)
        }
    } /* Выданные кредиты клиентам */

    async potential_loss_reserves() { /* Резервы возможных убытков */
        return await this.getOneRow(
            '',
            'Резервы возможных убытков',
            false,
            this.mainIndicatorsQuery('P_L_R')
        )
    } /* Резервы возможных убытков */

    async fixed_assets() { /* Основные средства банка */
        return await this.getOneRow(
            '',
            'Основные средства банка',
            `code_coa like '165%'`,
            false,
            true
        )
    } /* Основные средства банка */

    async accrued_interests() { /* Начисленные проценты к получению */
        return await this.getOneRow(
            '',
            'Начисленные проценты к получению',
            false,
            this.mainIndicatorsQuery('A_I_R'),
            true
        )
    } /* Начисленные проценты к получению */

    async balance_sheet_assets() { /* Имущества принятые на баланс */
        return await this.getOneRow(
            '',
            'Имущества принятые на баланс',
            `code_coa like '167%'`,
            false,
            true
        )
    } /* Имущества принятые на баланс */

    async other_actives() { /* Другие активы */
        return await this.getOneRow(
            '',
            'Другие активы',
            false,
            this.mainIndicatorsQuery('O_A'),
            true
        )
    } /* Другие активы */

    async total_actives() { /* Всего активов */
        return await this.getOneRow(
            '',
            'Всего активов',
            false,
            this.mainIndicatorsQuery('T_A'),
            true
        )
    } /* Всего активов */

    async bank_obligations() { /* Обязательства перед банками */
        return await this.getOneRow(
            '',
            'Обязательства перед банками',
            `code_coa like '210%'`,
            false,
            true
        )
    } /* Обязательства перед банками */

    async vostro_accounts() { /* Востро счета */
        return await this.getOneRow(
            '',
            'Востро счета',
            `code_coa='21002'`
        )
    } /* Востро счета */

    async interbank_deposits_A() { /* Межбанковские депозиты */
        return await this.getOneRow(
            '',
            'Межбанковские депозиты',
            `CODE_COA IN ('21010', '21022', '21032', '21042')`
        )
    } /* Межбанковские депозиты */

    async customer_commitments() { /* Обязательства перед клиентами */
        return await this.getOneRow(
            '',
            'Обязательства перед клиентами',
            false,
            this.mainIndicatorsQuery('C_T_C'),
            true
        )
    } /* Обязательства перед клиентами */

    async legals_demand_deposits() { /* депозиты юр. лиц. до востребования */
        return await this.getOneRow(
            '',
            'депозиты юр. лиц. до востребования',
            false,
            this.mainIndicatorsQuery('D_D_L_E')
        )
    } /* депозиты юр. лиц. до востребования */

    async legals_saving_deposits() { /* сберегательные депозиты юр. лиц. */
        return await this.getOneRow(
            '',
            'сберегательные депозиты юр. лиц.',
            `code_coa like '204%' and code_coa!='20406'`
        )
    } /* сберегательные депозиты юр. лиц. */

    async legals_urgent_deposits() { /* срочные депозиты юр. лиц. */
        return await this.getOneRow(
            '',
            'срочные депозиты юр. лиц.',
            false,
            this.mainIndicatorsQuery('T_D_L_E')
        )
    } /* срочные депозиты юр. лиц. */

    async obligations_and_borrowings() { /* Обязательства перед МФИ и другие заимствования */
        return await this.getOneRow(
            '',
            'Обязательства перед МФИ и другие заимствования',
            `code_coa like '220%' or code_coa like '216%'`,
            false,
            true
        )
    } /* Обязательства перед МФИ и другие заимствования */

    async bank_issued_bills() { /* Выпущенные банком ценные бумаги */
        return await this.getOneRow(
            '',
            'Выпущенные банком ценные бумаги',
            `code_coa like '236%'`,
            false,
            true
        )
    } /* Выпущенные банком ценные бумаги */

    async subordinated_debt() { /* Субординированный долг */
        return await this.getOneRow(
            '',
            'Субординированный долг',
            `code_coa='23702'`,
            false,
            true
        )
    } /* Субординированный долг */

    async payable_accrued_interest() { /* Начисленные проценты к оплате */
        return await this.getOneRow(
            '',
            'Начисленные проценты к оплате',
            false,
            this.mainIndicatorsQuery('A_I_P'),
            true
        )
    } /* Начисленные проценты к оплате */

    async pay_taxes() { /* Налоги к оплате */
        return await this.getOneRow(
            '',
            'Налоги к оплате',
            `code_coa like '225%'`,
            false,
            true
        )
    } /* Налоги к оплате */

    async other_financial_obligations() { /* Другие финансовые обязательства */
        return await this.getOneRow(
            '',
            'Другие финансовые обязательства',
            false,
            this.mainIndicatorsQuery('O_F_L'),
            true
        )
    } /* Другие финансовые обязательства */

    async other_obligations() { /* Другие обязательства */
        return await this.getOneRow(
            '',
            'Другие обязательства',
            false,
            this.mainIndicatorsQuery('O_O'),
            true
        )
    } /* Другие обязательства */

    async total_liabilities() { /* Всего обязательств */
        return await this.getOneRow(
            '',
            'Всего обязательств',
            false,
            this.mainIndicatorsQuery('T_L'),
            true
        )
    } /* Всего обязательств */

    async authorized_capital() { /* Уставный капитал */
        return await this.getOneRow(
            '',
            'Уставный капитал',
            `code_coa like '303%'`
        )
    } /* Уставный капитал */

    async reserve_fond() { /* Резервный фонд общего назначения */
        return await this.getOneRow(
            '',
            'Резервный фонд общего назначения',
            `code_coa='30903'`
        )
    } /* Резервный фонд общего назначения */

    async undistributed_profits() { /* Нераспределенная прибыль */
        return await this.getOneRow(
            '',
            'Нераспределенная прибыль',
            `code_coa='31203'`
        )
    } /* Нераспределенная прибыль */

    async current_profit() { /* Текущая прибыль */
        return await this.getOneRow(
            '',
            'Текущая прибыль',
            false,
            this.mainIndicatorsQuery('C_P')
        )
    } /* Текущая прибыль */

    async total_capital() { /* Совокупный капитал */
        return await this.getOneRow(
            '',
            'Совокупный капитал',
            false,
            this.mainIndicatorsQuery('T_C')
        )
    } /* Совокупный капитал */

    async getRows() {
        const [
            cashAtCheckOut,
            CBBalances,
            otherBankReceipts,
            nostroAccounts,
            interbankDeposits,
            governmentBills,
            nonGovernmentBills,
            loanPortfolio,
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
        ] = await Promise.all([
            this.cash_at_checkout(),
            this.CB_balances(),
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
        ])
        const cashEquivs = this.cash_equivs(cashAtCheckOut, CBBalances)
        const bills = this.bills(governmentBills, nonGovernmentBills)
        const clientCredits = this.client_credits(loanPortfolio, potentialLossReserves)
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
        ]
    }

}

module.exports = Actives