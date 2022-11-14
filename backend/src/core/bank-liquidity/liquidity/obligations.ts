import { LiquidityBase } from './liquidity.base'
import { ILiquidityRow } from './liquidity.interface'

export class Obligations extends LiquidityBase {
  protected async demand_deposits() {
    return await this.getOneRow(
      '10',
      'Депозиты до востребования',
      '',
      this.liquidityQuery('D_D'),
      true
    )
  } /* Депозиты до востребования */

  protected async individuals() {
    return await this.getOneRow('', 'Физические лица', '', this.liquidityQuery('P_P'))
  } /* Физические лица */

  protected legal_entities(total_depos: ILiquidityRow, indvdls: ILiquidityRow) {
    const [total, natCurr, forCurr, usaDollar, evro] = this.columns.map(
      p => total_depos[p] - indvdls[p]
    )
    return <ILiquidityRow>{
      count: '-',
      indicatorName: 'Юридические лица',
      total,
      natCurr,
      forCurr,
      usaDollar,
      evro,
      isTableHead: true
    }
  } /* Юридические лица */

  protected async state_owned_companies() {
    return await this.getOneRow('-', 'Государственные компании', `code_coa='20210'`)
  } /* Государственные компании */

  protected async joint_ventures() {
    return await this.getOneRow('-', 'Совместные предприятия', `code_coa='20214'`)
  } /* Совместные предприятия */

  protected other_clients(
    legal_entities: ILiquidityRow,
    state_owned_comp: ILiquidityRow,
    joint_vn: ILiquidityRow
  ) {
    /* Прочие клиенты */
    const [total, natCurr, forCurr, usaDollar, evro] = this.columns.map(
      p => legal_entities[p] - this.getTotal(p as keyof ILiquidityRow, state_owned_comp, joint_vn)
    )
    return <ILiquidityRow>{
      count: '-',
      indicatorName: 'Прочие клиенты',
      total,
      natCurr,
      forCurr,
      usaDollar,
      evro
    }
  } /* Прочие клиенты */

  protected async vostro_accounts() {
    /* ВОСТРО счета */
    return await this.getOneRow('11', 'ВОСТРО счета', `code_coa='21002'`, null, true)
  } /* ВОСТРО счета */

  protected async other_client_deposits() {
    /* Другие депозиты клиентов */
    return await this.getOneRow(
      '12',
      'Другие депозиты клиентов',
      '',
      this.liquidityQuery('O_C_D'),
      true
    )
  } /* Другие депозиты клиентов */

  protected async accredit_coverage() {
    /* Покрытие по аккредитивам */
    return await this.getOneRow('-', 'Покрытие по аккредитивам', `code_coa='22602'`)
  } /* Покрытие по аккредитивам */

  protected async funds_on_pc() {
    /* Средства на ПК */
    return await this.getOneRow('-', 'Средства на ПК', '', this.liquidityQuery('F_PC'))
  } /* Средства на ПК */

  protected async funds_on_conversion() {
    /* Средства на конвертацию */
    return await this.getOneRow('-', 'Средства на конвертацию', `code_coa='22613'`)
  } /* Средства на конвертацию */

  protected async converted_funds() {
    /* Сконвертированные средства */
    return await this.getOneRow('-', 'Сконвертированные средства', `code_coa='22614'`)
  } /* Сконвертированные средства */

  protected others(
    other_cl_depos: ILiquidityRow,
    accr_cover: ILiquidityRow,
    fd_onpc: ILiquidityRow,
    fd_onconv: ILiquidityRow,
    conved_fd: ILiquidityRow
  ) {
    /* Прочее */
    const [total, natCurr, forCurr, usaDollar, evro] = this.columns.map(
      p =>
        other_cl_depos[p] -
        this.getTotal(p as keyof ILiquidityRow, accr_cover, fd_onpc, fd_onconv, conved_fd)
    )
    return <ILiquidityRow>{
      count: '-',
      indicatorName: 'Прочее',
      total,
      natCurr,
      forCurr,
      usaDollar,
      evro
    }
  } /* Прочее */

  protected async other_obligations() {
    /* Другие обязательства */
    return await this.getOneRow('-', 'Другие обязательства', '', this.liquidityQuery('O_O'), true)
  } /* Другие обязательства */

  protected total_demand_liabilities(
    demand_depos: ILiquidityRow,
    vostro_accs: ILiquidityRow,
    other_cl_depos: ILiquidityRow,
    other_obls: ILiquidityRow
  ) {
    /* ИТОГО обязательств до востребования */
    const [total, natCurr, forCurr, usaDollar, evro] = this.columns.map((p: keyof ILiquidityRow) =>
      this.getTotal(p, demand_depos, vostro_accs, other_cl_depos, other_obls)
    )
    return <ILiquidityRow>{
      count: '14',
      indicatorName: 'ИТОГО обязательств до востребования',
      total,
      natCurr,
      forCurr,
      usaDollar,
      evro,
      isTableHead: true
    }
  } /* ИТОГО обязательств до востребования */

  async getRows(): Promise<ILiquidityRow[]> {
    const [
      demandDeposits,
      individuals,
      stateOwnedCompanies,
      jointVentures,
      vostroAccounts,
      otherClientDeposits,
      accreditCoverage,
      fundsOnPc,
      fundsOnConversion,
      convertedFunds,
      otherObligations
    ] = await Promise.all([
      this.demand_deposits(),
      this.individuals(),
      this.state_owned_companies(),
      this.joint_ventures(),
      this.vostro_accounts(),
      this.other_client_deposits(),
      this.accredit_coverage(),
      this.funds_on_pc(),
      this.funds_on_conversion(),
      this.converted_funds(),
      this.other_obligations()
    ])
    const legalEntities = this.legal_entities(demandDeposits, individuals)
    const otherClients = this.other_clients(legalEntities, stateOwnedCompanies, jointVentures)
    const others = this.others(
      otherClientDeposits,
      accreditCoverage,
      fundsOnPc,
      fundsOnConversion,
      convertedFunds
    )
    const totalDemandLiabilities = this.total_demand_liabilities(
      demandDeposits,
      vostroAccounts,
      otherClientDeposits,
      otherObligations
    )
    return [
      demandDeposits,
      this.getEmptyRow(),
      individuals,
      legalEntities,
      this.getEmptyRow(),
      stateOwnedCompanies,
      jointVentures,
      otherClients,
      vostroAccounts,
      otherClientDeposits,
      this.getEmptyRow(),
      accreditCoverage,
      fundsOnPc,
      fundsOnConversion,
      convertedFunds,
      others,
      otherObligations,
      totalDemandLiabilities
    ]
  }
}
