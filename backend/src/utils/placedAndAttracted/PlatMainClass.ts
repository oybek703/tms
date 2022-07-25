import MainClass, { OwnQuery } from '../mainClass'

interface FundData {
    fundName: string
    balanceCode: string
    sum: number
    percent: string
}


/* eslint-disable camelcase */
class PlatMainClass extends MainClass {
  constructor(date: string) {
    super(date)
  }

  formatQuery(date: string, whereQuery: string) {
    return `SELECT
                    ABS(ROUND(NVL(SUM(SALDO_EQUIVAL_OUT)/POWER(10, 5), 0), 2)) SUM
                FROM
                    (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                    SALDO_EQUIVAL_OUT
                             FROM IBS.SALDO@IABS sl
                             WHERE sl.account_code=ac.code
                               AND sl.OPER_DAY < TO_DATE('${date}', 'DD.MM.YYYY')
                               AND ROWNUM = 1) AS SALDO_EQUIVAL_OUT
                     FROM IBS.ACCOUNTS@IABS AC
                     WHERE ${whereQuery})`
  }

  platQuery(role: string) {
    const _this = this
    return function() {
      return `SELECT SALDO_EQUIVAL_OUT SUM 
              FROM (SELECT * FROM PLACED_ATTRACTED ORDER BY OPER_DAY DESC)
                            WHERE OPER_DAY<TO_DATE('${_this.date}', 'DD-MM-YYYY') 
                              AND ROLE='${role}' 
                              AND ROWNUM=1`
    }
  }

  async getOneRow(fundName: string, balanceCode: string,
      codeCoa: string, ownQuery? : OwnQuery, forChart: boolean = false) {
    let sum
    if (Boolean(codeCoa)) {
      const { SUM } = await this.getDataInDates(codeCoa)
      sum = SUM
    } else {
      const { SUM } = await this.getDataInDates('', ownQuery)
      sum = SUM
    }
    return {
      fund_name: fundName,
      balance_code: balanceCode,
      sum,
      percent: '',
      forChart
    }
  }

  async demand_deposits() {/* Депозиты до востребования */
    return await this.getOneRow(
        'Депозиты до востребования',
        '202',
        '',
        this.platQuery('DD'),
        true
    )
  } /* Депозиты до востребования */

  async organization_deposits() {/* в т.ч. счета государственных и бюджетных организаций */
    return await this.getOneRow(
        'в т.ч. счета государственных и бюджетных организаций',
        '203-205, 20207, 20210',
        `code_coa='20203' or 
        code_coa='20204' or code_coa='20205' 
        or code_coa='20207' or code_coa='20210'`
    )
  } /* в т.ч. счета государственных и бюджетных организаций */

  async saving_deposits() {/* Сберегательные депозиты */
    return await this.getOneRow(
        'Сберегательные депозиты',
        '204',
        '',
        this.platQuery('SD')
    )
  } /* Сберегательные депозиты */

  async time_deposits() {/* Срочные депозиты */
    return await this.getOneRow(
        'Срочные депозиты',
        '206',
        '',
        this.platQuery('TD'),
        true
    )
  } /* Срочные депозиты */

  async other_corr_accounts() {/* Коррсчета других банков */
    return await this.getOneRow(
        'Коррсчета других банков',
        '210',
        `code_coa like '210%'`
    )
  } /* Коррсчета других банков */

  async payable_loans() {/* Кредиты к оплате */
    return await this.getOneRow(
        'Кредиты к оплате',
        '216, 220, 23602',
        `code_coa like '216%' or code_coa like '220%' or code_coa='23602'`,
        null,
        true
    )
  } /* Кредиты к оплате */

  async interests_taxes() {/* Начисленные проценты и налоги к оплате */
    return await this.getOneRow(
        'Начисленные проценты и налоги к оплате',
        '224, 225',
        '',
        this.platQuery('IT')
    )
  } /* Начисленные проценты и налоги к оплате */

  async other_client_deposits() {/* Другие депозиты клиентов */
    return await this.getOneRow(
        'Другие депозиты клиентов',
        '226',
        '',
        this.platQuery('OCD'),
        true
    )
  } /* Другие депозиты клиентов */

  async issued_bills() {/* Выпущенные ценные бумаги */
    return await this.getOneRow(
        'Выпущенные ценные бумаги',
        '236',
        `code_coa like '236%'`
    )
  } /* Выпущенные ценные бумаги */

  async own_resources() {/* Собственные ресурсы (Капитал) */
    return await this.getOneRow(
        'Собственные ресурсы (Капитал)',
        '300+400-500',
        '',
        this.platQuery('OWR'),
        true
    )
  } /* Собственные ресурсы (Капитал) */

  async cash_on_hand() {/* Кассовая наличность */
    return await this.getOneRow(
        'Кассовая наличность',
        '101',
        `code_coa like '101%'`,
        null,
        true
    )
  } /* Кассовая наличность */

  async funds_in_cb() {/* Средства в ЦБ РУз */
    return await this.getOneRow(
        'Средства в ЦБ РУз',
        '103',
        `code_coa like '103%'`,
        null,
        true
    )
  } /* Средства в ЦБ РУз */

  async corr_accounts() {/* Коррсчета в других банках */
    return await this.getOneRow(
        'Коррсчета в других банках',
        '105',
        `code_coa like '105%'`,
        null,
        true
    )
  } /* Коррсчета в других банках */

  async bills_investments() {/* Вложения в ценные бумаги */
    return await this.getOneRow(
        'Вложения в ценные бумаги',
        '108, 118',
        `code_coa like '108%' or code_coa like '118%'`
    )
  } /* Вложения в ценные бумаги */

  async promissory_obligations() {/* Обязательства клиентов по векселям */
    return await this.getOneRow(
        'Обязательства клиентов по векселям',
        '115',
        `code_coa like '115%'`
    )
  } /* Обязательства клиентов по векселям */

  async factoring_leasing() {/* Факторинг, кредиты и лизинг */
    return await this.getOneRow(
        'Факторинг, кредиты и лизинг',
        '111, 119-156',
        '',
        this.platQuery('FL'),
        true
    )
  } /* Факторинг, кредиты и лизинг */

  async litigation_loans() {/* Кредиты в судебном разбирательстве */
    return await this.getOneRow(
        'Кредиты в судебном разбирательстве',
        '157',
        '',
        this.platQuery('LL')
    )
  } /* Кредиты в судебном разбирательстве */

  async investments() {/* Инвестиции */
    return await this.getOneRow(
        'Инвестиции',
        '158',
        `code_coa like '158%'`
    )
  } /* Инвестиции */

  async interest_charges() {/* Начисленные проценты */
    return await this.getOneRow(
        'Начисленные проценты',
        '163, 164',
        '',
        this.platQuery('ICH'),
        true
    )
  } /* Начисленные проценты */

  async main_assets() {/* Основные средства */
    return await this.getOneRow(
        'Основные средства',
        '165, 166, 167',
        `code_coa like '165%' or code_coa like '166%' or code_coa like '167%'`
    )
  } /* Основные средства */

  async requirements() {/* МАЖБУРИЯТЛАР (2) */
    return await this.getOneRow(
        'МАЖБУРИЯТЛАР (2)',
        '',
        '',
        this.platQuery('RQ')
    )
  } /* МАЖБУРИЯТЛАР (2) */

  async received_funds() {/* Бош банк/филиаллардан олинадиган маблаглар (161) */
    return await this.getOneRow(
        'Бош банк/филиаллардан олинадиган маблаглар (161)',
        '',
        '',
        this.platQuery('RF')
    )
  } /* Бош банк/филиаллардан олинадиган маблаглар (161) */

  async payed_funds() {/* Бош банк/филиалларга туланадиган маблаглар (222) */
    return await this.getOneRow(
        'Бош банк/филиалларга туланадиган маблаглар (222)',
        '',
        '',
        this.platQuery('PF')
    )
  } /* Бош банк/филиалларга туланадиган маблаглар (222) */

  async getRows() {
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

    let involvedFunds: any = [
      demandDeposits,
      organizationDeposits,
      savingDeposits,
      timeDeposits,
      otherCorrAccounts,
      payableLoans,
      interestTaxes,
      otherClientDeposits,
      issuedBills,
      ownResources] /* ПРИВЛЕЧЕННЫЕ СРЕДСТВА */
    let placedFunds: any = [
      cashOnHand,
      fundsInCB,
      corrAccounts,
      billsInvestments,
      promissoryObligations,
      factoringLeasing,
      litigationLoans,
      investments,
      interestCharges,
      mainAssets] /* РАЗМЕЩЕННЫЕ СРЕДСТВА */
    const involvedMiddleValue = [...involvedFunds]
        .filter((_, i) => i !== 1).reduce((acc, val) => acc+=val['sum'], 0)
    const minOfTwoFunds = Math.min(receivedFunds['sum'], payedFunds['sum'])

    /* Прочие обязательства */
    let otherLiabilities: any = +(ownResources['sum']+requirements['sum']-
        (involvedMiddleValue+minOfTwoFunds)).toFixed(2)
    otherLiabilities = {
      fund_name: 'Прочие обязательства',
      balance_code: '',
      sum: otherLiabilities,
      percent: 'no_calc'
    }

    involvedFunds.push(otherLiabilities)
    const involvedFundsSum = [...involvedFunds]
        .filter((_, i) => i !== 1).reduce((acc, val) => acc+=val['sum'], 0)

    /* Прочие активы */
    let otherActives: any = +(involvedFundsSum-[...placedFunds]
        .reduce((acc, val) => acc+=val['sum'], 0)).toFixed(2)
    otherActives = {
      fund_name: 'Прочие активы',
      balance_code: '',
      sum: otherActives,
      percent: 'no_calc'
    }
    placedFunds.push(otherActives)
    const placedFundsSum = +placedFunds
        .reduce((acc: number, val: FundData) => acc+=val['sum'], 0).toFixed(2)

    involvedFunds = involvedFunds.map((v: FundData, i: number) => {
      if (i !== 1) {
        v['percent'] = (v['sum']*100/involvedFundsSum).toFixed(2)
      }
      return v
    })
    placedFunds = placedFunds.map((v: FundData) => {
      v['percent'] = (v['sum']*100/placedFundsSum).toFixed(2)
      return v
    })
    involvedFunds.push({
      fundName: 'ВСЕГО РЕСУРСОВ',
      balanceCode: '',
      sum: involvedFundsSum,
      percent: '100.00'
    })
    placedFunds.push({
      fundName: 'ВСЕГО ВЛОЖЕНИЙ',
      balanceCode: '',
      sum: placedFundsSum,
      percent: '100.00'
    })
    return { involvedFunds, placedFunds }
  }
}

export default PlatMainClass
