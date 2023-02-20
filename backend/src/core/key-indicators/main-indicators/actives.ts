import { MainIndicatorsBase } from './main-indicators.base'
import { DBData, MainIndicatorRow } from './main-indicators.interfaces'

export class Actives extends MainIndicatorsBase {
  private cash_equivs(...args: DBData[]): MainIndicatorRow {
    return <MainIndicatorRow>{
      count: '',
      indicatorName: 'Наличные и денежные эквиваленты',
      ...this.getTotalData(...args),
      isTableHead: true
    }
  } /* Наличные и денежные эквиваленты */

  private async cash_at_checkout() {
    return await this.getOneRow('', 'Наличные в кассе', `CODE_COA LIKE '101%'`)
  } /* Наличные в кассе */

  private async cb_balances() {
    return await this.getOneRow('', 'Остатки в Центральном банке', `CODE_COA LIKE '103%'`)
  } /* Остатки в Центральном банке */

  private async other_bank_receipts() {
    return await this.getOneRow(
      '',
      'К получению из других банков',
      `CODE_COA LIKE '105%'`,
      undefined,
      true
    )
  } /* К получению из других банков */

  private async nostro_accounts() {
    return await this.getOneRow('', 'Ностро счета', `CODE_COA='10501'`)
  } /* Ностро счета */

  private async interbank_deposits() {
    return await this.getOneRow(
      '',
      'Межбанковские депозиты',
      `CODE_COA IN ('10521', '10597', '10531', '10541')`
    )
  } /* Межбанковские депозиты */

  private bills(...args: DBData[]) {
    return <MainIndicatorRow>{
      count: '',
      indicatorName: 'Ценные бумаги',
      ...this.getTotalData(...args),
      isTableHead: true
    }
  } /* Ценные бумаги */

  private async government_bills() {
    return await this.getOneRow('', 'Государственные ценные бумаги', `CODE_COA LIKE '107%'`)
  } /* Государственные ценные бумаги */

  private async non_government_bills() {
    return await this.getOneRow('', 'Негосударственные ценные бумаги', `CODE_COA LIKE '159%'`)
  } /* Негосударственные ценные бумаги */

  private async loan_portfolio() {
    return await this.getOneRow(
      '',
      'Кредитный портфель',
      undefined,
      this.mainIndicatorsQuery('L_P'),
      true
    )
  } /* Кредитный портфель */

  private client_credits(...args: DBData[]) {
    return <MainIndicatorRow>{
      count: '',
      indicatorName: 'Выданные кредиты клиентам',
      ...this.getTotalData(...args)
    }
  } /* Выданные кредиты клиентам */

  private async potential_loss_reserves() {
    return await this.getOneRow(
      '',
      'Резервы возможных убытков',
      undefined,
      this.mainIndicatorsQuery('P_L_R')
    )
  } /* Резервы возможных убытков */

  private async fixed_assets() {
    return await this.getOneRow(
      '',
      'Основные средства банка',
      `CODE_COA LIKE '165%'`,
      undefined,
      true
    )
  } /* Основные средства банка */

  private async accrued_interests() {
    return await this.getOneRow(
      '',
      'Начисленные проценты к получению',
      undefined,
      this.mainIndicatorsQuery('A_I_R'),
      true
    )
  } /* Начисленные проценты к получению */

  private async balance_sheet_assets() {
    return await this.getOneRow(
      '',
      'Имущества принятые на баланс',
      `CODE_COA LIKE '167%'`,
      undefined,
      true
    )
  } /* Имущества принятые на баланс */

  private async other_actives() {
    return await this.getOneRow(
      '',
      'Другие активы',
      undefined,
      this.mainIndicatorsQuery('O_A'),
      true
    )
  } /* Другие активы */

  private async total_actives() {
    return await this.getOneRow(
      '',
      'Всего активов',
      undefined,
      this.mainIndicatorsQuery('T_A'),
      true
    )
  } /* Всего активов */

  private async bank_obligations() {
    return await this.getOneRow(
      '',
      'Обязательства перед банками',
      `CODE_COA LIKE '210%'`,
      undefined,
      true
    )
  } /* Обязательства перед банками */

  private async vostro_accounts() {
    return await this.getOneRow('', 'Востро счета', `CODE_COA='21002'`)
  } /* Востро счета */

  private async interbank_deposits_A() {
    return await this.getOneRow(
      '',
      'Межбанковские депозиты',
      `CODE_COA IN ('21010', '21022', '21032', '21042')`
    )
  } /* Межбанковские депозиты */

  private async customer_commitments() {
    return await this.getOneRow(
      '',
      'Обязательства перед клиентами',
      undefined,
      this.mainIndicatorsQuery('C_T_C'),
      true
    )
  } /* Обязательства перед клиентами */

  private async legals_demand_deposits() {
    return await this.getOneRow(
      '',
      'депозиты юр. лиц. до востребования',
      undefined,
      this.mainIndicatorsQuery('D_D_L_E')
    )
  } /* депозиты юр. лиц. до востребования */

  private async legals_saving_deposits() {
    return await this.getOneRow(
      '',
      'сберегательные депозиты юр. лиц.',
      `CODE_COA LIKE '204%' and CODE_COA!='20406'`
    )
  } /* сберегательные депозиты юр. лиц. */

  private async legals_urgent_deposits() {
    return await this.getOneRow(
      '',
      'срочные депозиты юр. лиц.',
      undefined,
      this.mainIndicatorsQuery('T_D_L_E')
    )
  } /* срочные депозиты юр. лиц. */

  private async obligations_and_borrowings() {
    return await this.getOneRow(
      '',
      'Обязательства перед МФИ и другие заимствования',
      `CODE_COA LIKE '220%' or CODE_COA LIKE '216%'`,
      undefined,
      true
    )
  } /* Обязательства перед МФИ и другие заимствования */

  private async bank_issued_bills() {
    return await this.getOneRow(
      '',
      'Выпущенные банком ценные бумаги',
      `CODE_COA LIKE '236%'`,
      undefined,
      true
    )
  } /* Выпущенные банком ценные бумаги */

  private async subordinated_debt() {
    return await this.getOneRow('', 'Субординированный долг', `CODE_COA='23702'`, null, true)
  } /* Субординированный долг */

  private async payable_accrued_interest() {
    return await this.getOneRow(
      '',
      'Начисленные проценты к оплате',
      undefined,
      this.mainIndicatorsQuery('A_I_P'),
      true
    )
  } /* Начисленные проценты к оплате */

  private async pay_taxes() {
    return await this.getOneRow('', 'Налоги к оплате', `CODE_COA LIKE '225%'`, null, true)
  } /* Налоги к оплате */

  private async other_financial_obligations() {
    return await this.getOneRow(
      '',
      'Другие финансовые обязательства',
      undefined,
      this.mainIndicatorsQuery('O_F_L'),
      true
    )
  } /* Другие финансовые обязательства */

  private async other_obligations() {
    return await this.getOneRow(
      '',
      'Другие обязательства',
      undefined,
      this.mainIndicatorsQuery('O_O'),
      true
    )
  } /* Другие обязательства */

  private async total_liabilities() {
    return await this.getOneRow(
      '',
      'Всего обязательств',
      undefined,
      this.mainIndicatorsQuery('T_L'),
      true
    )
  } /* Всего обязательств */

  private async authorized_capital() {
    return await this.getOneRow('', 'Уставный капитал', `CODE_COA LIKE '303%'`)
  } /* Уставный капитал */

  private async reserve_fond() {
    return await this.getOneRow('', 'Резервный фонд общего назначения', `CODE_COA='30903'`)
  } /* Резервный фонд общего назначения */

  private async undistributed_profits() {
    return await this.getOneRow('', 'Нераспределенная прибыль', `CODE_COA='31203'`)
  } /* Нераспределенная прибыль */

  private async current_profit() {
    return await this.getOneRow('', 'Текущая прибыль', undefined, this.mainIndicatorsQuery('C_P'))
  } /* Текущая прибыль */

  private async total_capital() {
    return await this.getOneRow(
      '',
      'Совокупный капитал',
      undefined,
      this.mainIndicatorsQuery('T_C')
    )
  } /* Совокупный капитал */

  async getRows(): Promise<MainIndicatorRow[]> {
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
