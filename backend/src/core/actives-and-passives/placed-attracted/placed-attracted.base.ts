import { Base } from '../../base'
import { OwnQuery } from '../../core.interface'
import { IPlacedAttractedRow } from './placed-attracted.interface'

export class PlacedAttractedBase extends Base {
  protected formatQuery(whereQuery: string): string {
    return `SELECT
                    ABS(ROUND(NVL(SUM(SALDO_EQUIVAL_OUT)/POWER(10, 5), 0), 2)) "sum"
                FROM
                    (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                    SALDO_EQUIVAL_OUT
                             FROM IBS.SALDO@IABS sl
                             WHERE sl.account_code=ac.code
                               AND sl.OPER_DAY < DATE '${this.date}'
                               AND ROWNUM = 1) AS SALDO_EQUIVAL_OUT
                     FROM IBS.ACCOUNTS@IABS AC
                     WHERE ${whereQuery})`
  }

  private platQuery = (role: string) => {
    return () => {
      return `SELECT SALDO_EQUIVAL_OUT AS "sum" 
              FROM (SELECT * FROM PLACED_ATTRACTED ORDER BY OPER_DAY DESC)
                            WHERE OPER_DAY<DATE '${this.date}' 
                              AND ROLE='${role}' 
                              AND ROWNUM=1`
    }
  }

  private async getOneRow(
    fundName: string,
    balanceCode: string,
    whereQuery: string | undefined,
    ownQuery?: OwnQuery | undefined,
    forChart = false
  ) {
    let sum: number
    if (whereQuery) {
      sum = (await this.getDataInDates<{ sum: number }>(whereQuery, undefined)).sum
    } else {
      sum = (await this.getDataInDates<{ sum: number }>(undefined, ownQuery)).sum
    }
    return { fundName, balanceCode, sum, percent: '', forChart }
  }

  private async demand_deposits() {
    return await this.getOneRow(
      'Депозиты до востребования',
      '202',
      undefined,
      this.platQuery('DD'),
      true
    )
  } /* Депозиты до востребования */

  private async organization_deposits() {
    return await this.getOneRow(
      'в т.ч. счета государственных и бюджетных организаций',
      '203-205, 20207, 20210',
      `code_coa='20203' or 
        code_coa='20204' or code_coa='20205' 
        or code_coa='20207' or code_coa='20210'`
    )
  } /* в т.ч. счета государственных и бюджетных организаций */

  private async saving_deposits() {
    return await this.getOneRow('Сберегательные депозиты', '204', undefined, this.platQuery('SD'))
  } /* Сберегательные депозиты */

  private async time_deposits() {
    return await this.getOneRow('Срочные депозиты', '206', undefined, this.platQuery('TD'), true)
  } /* Срочные депозиты */

  private async other_corr_accounts() {
    return await this.getOneRow('Коррсчета других банков', '210', `code_coa like '210%'`)
  } /* Коррсчета других банков */

  private async payable_loans() {
    return await this.getOneRow(
      'Кредиты к оплате',
      '216, 220, 23602',
      `code_coa like '216%' or code_coa like '220%' or code_coa='23602'`,
      null,
      true
    )
  } /* Кредиты к оплате */

  private async interests_taxes() {
    return await this.getOneRow(
      'Начисленные проценты и налоги к оплате',
      '224, 225',
      undefined,
      this.platQuery('IT')
    )
  } /* Начисленные проценты и налоги к оплате */

  private async other_client_deposits() {
    return await this.getOneRow(
      'Другие депозиты клиентов',
      '226',
      undefined,
      this.platQuery('OCD'),
      true
    )
  } /* Другие депозиты клиентов */

  private async issued_bills() {
    return await this.getOneRow('Выпущенные ценные бумаги', '236', `code_coa like '236%'`)
  } /* Выпущенные ценные бумаги */

  private async own_resources() {
    return await this.getOneRow(
      'Собственные ресурсы (Капитал)',
      '300+400-500',
      undefined,
      this.platQuery('OWR'),
      true
    )
  } /* Собственные ресурсы (Капитал) */

  private async cash_on_hand() {
    return await this.getOneRow('Кассовая наличность', '101', `code_coa like '101%'`, null, true)
  } /* Кассовая наличность */

  private async funds_in_cb() {
    return await this.getOneRow('Средства в ЦБ РУз', '103', `code_coa like '103%'`, null, true)
  } /* Средства в ЦБ РУз */

  private async corr_accounts() {
    return await this.getOneRow(
      'Коррсчета в других банках',
      '105',
      `code_coa like '105%'`,
      null,
      true
    )
  } /* Коррсчета в других банках */

  private async bills_investments() {
    return await this.getOneRow(
      'Вложения в ценные бумаги',
      '108, 118',
      `code_coa like '108%' or code_coa like '118%'`
    )
  } /* Вложения в ценные бумаги */

  private async promissory_obligations() {
    return await this.getOneRow('Обязательства клиентов по векселям', '115', `code_coa like '115%'`)
  } /* Обязательства клиентов по векселям */

  private async factoring_leasing() {
    return await this.getOneRow(
      'Факторинг, кредиты и лизинг',
      '111, 119-156',
      undefined,
      this.platQuery('FL'),
      true
    )
  } /* Факторинг, кредиты и лизинг */

  private async litigation_loans() {
    return await this.getOneRow(
      'Кредиты в судебном разбирательстве',
      '157',
      undefined,
      this.platQuery('LL')
    )
  } /* Кредиты в судебном разбирательстве */

  private async investments() {
    return await this.getOneRow('Инвестиции', '158', `code_coa like '158%'`)
  } /* Инвестиции */

  private async interest_charges() {
    return await this.getOneRow(
      'Начисленные проценты',
      '163, 164',
      undefined,
      this.platQuery('ICH'),
      true
    )
  } /* Начисленные проценты */

  private async main_assets() {
    return await this.getOneRow(
      'Основные средства',
      '165, 166, 167',
      `code_coa like '165%' or code_coa like '166%' or code_coa like '167%'`
    )
  } /* Основные средства */

  private async requirements() {
    return await this.getOneRow('МАЖБУРИЯТЛАР (2)', undefined, undefined, this.platQuery('RQ'))
  } /* МАЖБУРИЯТЛАР (2) */

  private async received_funds() {
    return await this.getOneRow(
      'Бош банк/филиаллардан олинадиган маблаглар (161)',
      undefined,
      undefined,
      this.platQuery('RF')
    )
  } /* Бош банк/филиаллардан олинадиган маблаглар (161) */

  private async payed_funds() {
    return await this.getOneRow(
      'Бош банк/филиалларга туланадиган маблаглар (222)',
      undefined,
      undefined,
      this.platQuery('PF')
    )
  } /* Бош банк/филиалларга туланадиган маблаглар (222) */

  async getRows(): Promise<[IPlacedAttractedRow[], IPlacedAttractedRow[]]> {
    const [
      demandDeposits,
      organizationDeposits,
      savingDeposits,
      timeDeposits,
      otherCorrAccounts,
      payableLoans,
      interestTaxes,
      otherClientDeposits,
      issuedBills,
      ownResources,
      cashOnHand,
      fundsInCB,
      corrAccounts,
      billsInvestments,
      promissoryObligations,
      factoringLeasing,
      litigationLoans,
      investments,
      interestCharges,
      mainAssets,
      requirements,
      receivedFunds,
      payedFunds
    ] = await Promise.all([
      this.demand_deposits(),
      this.organization_deposits(),
      this.saving_deposits(),
      this.time_deposits(),
      this.other_corr_accounts(),
      this.payable_loans(),
      this.interests_taxes(),
      this.other_client_deposits(),
      this.issued_bills(),
      this.own_resources(),
      this.cash_on_hand(),
      this.funds_in_cb(),
      this.corr_accounts(),
      this.bills_investments(),
      this.promissory_obligations(),
      this.factoring_leasing(),
      this.litigation_loans(),
      this.investments(),
      this.interest_charges(),
      this.main_assets(),
      this.requirements(),
      this.received_funds(),
      this.payed_funds()
    ])

    let involvedFunds: IPlacedAttractedRow[] = [
      demandDeposits,
      organizationDeposits,
      savingDeposits,
      timeDeposits,
      otherCorrAccounts,
      payableLoans,
      interestTaxes,
      otherClientDeposits,
      issuedBills,
      ownResources
    ] /* ПРИВЛЕЧЕННЫЕ СРЕДСТВА */
    let placedFunds: IPlacedAttractedRow[] = [
      cashOnHand,
      fundsInCB,
      corrAccounts,
      billsInvestments,
      promissoryObligations,
      factoringLeasing,
      litigationLoans,
      investments,
      interestCharges,
      mainAssets
    ] /* РАЗМЕЩЕННЫЕ СРЕДСТВА */
    const involvedMiddleValue = [...involvedFunds]
      .filter((_, i) => i !== 1)
      .reduce((acc, val) => (acc += val['sum']), 0)
    const minOfTwoFunds = Math.min(receivedFunds['sum'], payedFunds['sum'])

    /* Прочие обязательства */
    const otherLiabilitiesTemp: any = +(
      ownResources['sum'] +
      requirements['sum'] -
      (involvedMiddleValue + minOfTwoFunds)
    ).toFixed(2)
    const otherLiabilities = {
      fundName: 'Прочие обязательства',
      balanceCode: undefined,
      sum: otherLiabilitiesTemp,
      percent: 'no_calc'
    }

    involvedFunds.push(otherLiabilities)
    const involvedFundsSum = [...involvedFunds]
      .filter((_, i) => i !== 1)
      .reduce((acc, val) => (acc += val['sum']), 0)

    /* Прочие активы */
    const otherActivesTemp = +(
      involvedFundsSum - [...placedFunds].reduce((acc, val) => (acc += val['sum']), 0)
    ).toFixed(2)
    const otherActives = {
      fundName: 'Прочие активы',
      balanceCode: undefined,
      sum: otherActivesTemp,
      percent: 'no_calc'
    }
    placedFunds.push(otherActives)
    const placedFundsSum = +placedFunds
      .reduce((acc: number, val: IPlacedAttractedRow) => (acc += val['sum']), 0)
      .toFixed(2)

    involvedFunds = involvedFunds.map((v: IPlacedAttractedRow, i: number) => {
      if (i !== 1) {
        v['percent'] = ((v['sum'] * 100) / involvedFundsSum).toFixed(2)
      }
      return v
    })
    placedFunds = placedFunds.map((v: IPlacedAttractedRow) => {
      v['percent'] = ((v['sum'] * 100) / placedFundsSum).toFixed(2)
      return v
    })
    involvedFunds.push({
      fundName: 'ВСЕГО РЕСУРСОВ',
      balanceCode: undefined,
      sum: involvedFundsSum,
      percent: '100.00'
    })
    placedFunds.push({
      fundName: 'ВСЕГО ВЛОЖЕНИЙ',
      balanceCode: undefined,
      sum: placedFundsSum,
      percent: '100.00'
    })
    return [involvedFunds, placedFunds]
  }
}
