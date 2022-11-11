import { Base } from '../base'
import { IGapData, IGapFlowData, IGapMonths } from './gap.interface'
import { OracleService } from '../../oracle/oracle.service'

export class GapBase extends Base {
  constructor(oracleService: OracleService) {
    super(new Date(), oracleService)
  }

  protected formatQuery(whereQuery: string) {
    return `SELECT ROLE              AS "role",
                   INDICATOR_NAME    AS "indicatorName",
                   TOTAL             AS "total",
                   NATIONAL_CURRENCY AS "nationalCurrency",
                   FOREIGN_CURRENCY  AS "foreignCurrency",
                   USD               AS "usd",
                   EUR               AS "eur",
                   'AUTO'            AS "source"
            FROM GAP_ANALYSIS_AUTO
            WHERE ROLE = '${whereQuery}'
            ORDER BY OPER_DAY`
  }

  protected manualTableQuery(role: string) {
    return () => {
      return `SELECT ROLE              AS "role",
                     INDICATOR_NAME    AS "indicatorName",
                     TOTAL             AS "total",
                     NATIONAL_CURRENCY AS "nationalCurrency",
                     FOREIGN_CURRENCY  AS "foreignCurrency",
                     USD               AS "usd",
                     EUR               AS "eur",
                     'MANUAL'          AS "source"
              FROM GAP_ANALYSIS_MANUAL
              WHERE ROLE = '${role}'
              ORDER BY OPER_DAY`
    }
  }

  private monthQuery = () => {
    return `SELECT TO_CHAR(OPER_DAY, 'Month (YY)', 'NLS_DATE_LANGUAGE=''RUSSIAN''') AS "month"
            FROM GAP_ANALYSIS_AUTO
            WHERE ROLE = 'r_c'
            ORDER BY OPER_DAY`
  }

  protected outflowQuery = () => {
    return `SELECT ROUND((SUM(PERCENT_NAT * NATIONAL_CURRENCY / 100)
        + SUM(PERCENT_FOR * NVL(FOREIGIN_CURR_SUMM_EQ, 0) / 100)) /
                         POWER(10, 6), 2)                                              AS
                       "total",
                   ROUND(SUM(PERCENT_NAT * NATIONAL_CURRENCY / 100) / POWER(10, 6), 2) AS
                       "nationalCurrency",
                   ROUND(SUM(PERCENT_FOR * FOREIGN_CURRENCY / 100) / POWER(10, 6), 2)  AS
                       "foreignCurrency"
            FROM LCR_BUILDER
            WHERE ROLE IN ('B_I', 'T_D', 'P_C', 'BORROW', 'C_L_O', 'U_P_L', 'I_C', 'O_L')`
  }

  protected inflowQuery = () => {
    return `SELECT (LCR.TOTAL - VLA.TOTAL)                         AS "total",
                   (LCR.NATIONAL_CURRENCY - VLA.NATIONAL_CURRENCY) AS "nationalCurrency",
                   (LCR.FOREIGN_CURRENCY - VLA.FOREIGN_CURRENCY)   AS "foreignCurrency"
            FROM (SELECT ROUND((SUM(PERCENT_NAT * NATIONAL_CURRENCY / 100) +
                                SUM(PERCENT_FOR * NVL(FOREIGIN_CURR_SUMM_EQ, 0) / 100)) /
                               POWER(10, 6), 2)                                              AS TOTAL,
                         ROUND(SUM(PERCENT_NAT * NATIONAL_CURRENCY / 100) / POWER(10, 6), 2) AS NATIONAL_CURRENCY,
                         ROUND(SUM(PERCENT_FOR * FOREIGN_CURRENCY / 100) / POWER(10, 6), 2)  AS FOREIGN_CURRENCY,
                         'TEMP_COL'                                                          AS TEMP_COL
                  FROM LCR_BUILDER
                  WHERE ROLE IN ('C_O_D', 'R_F_CBU', 'LEND', 'P_B',
                                 'L_C_A', 'L_C_O', 'P_C_L', 'REPO',
                                 'RECIVE')) LCR
                     INNER JOIN (SELECT TOTAL,
                                        NATIONAL_CURRENCY,
                                        FOREIGN_CURRENCY,
                                        'TEMP_COL' AS TEMP_COL
                                 FROM GAP_ANALYSIS_AUTO
                                 WHERE ROLE = 'vla') VLA
                                ON LCR.TEMP_COL = VLA.TEMP_COL`
  }

  protected stableFinancingRequiredAmountQuery = () => {
    return `SELECT (NSFR.TOTAL + LCR.TOTAL)                         AS "total",
                   (NSFR.NATIONAL_CURRENCY + LCR.NATIONAL_CURRENCY) AS "nationalCurrency",
                   (NSFR.FOREIGN_CURRENCY + LCR.FOREIGN_CURRENCY)   AS "foreignCurrency"
            FROM (SELECT ROUND(SUM(
                                           (PERCENT_NAT * NATIONAL_CURRENCY + PERCENT_FOR * FOREIGIN_CURR_SUMM_EQ) /
                                           POWER(10, 10)),
                               2)                                                       AS TOTAL,
                         ROUND(SUM(PERCENT_NAT * NATIONAL_CURRENCY / POWER(10, 10)), 2) AS NATIONAL_CURRENCY,
                         ROUND(SUM(PERCENT_FOR * FOREIGN_CURRENCY / POWER(10, 10)), 2)  AS FOREIGN_CURRENCY
                  FROM NSFR_BUILDER
                  WHERE ROLE IN
                        ('credits', 'i_d', 'invest', 'c_s', 'o_p_b', 'leasing', 'liquidity')) NSFR,
                 (SELECT ROUND((SUM(PERCENT_NAT * NATIONAL_CURRENCY / 100) +
                                SUM(PERCENT_FOR * NVL(FOREIGIN_CURR_SUMM_EQ, 0) / 100)) /
                               POWER(10, 6), 2)                                              AS TOTAL,
                         ROUND(SUM(PERCENT_NAT * NATIONAL_CURRENCY / 100) / POWER(10, 6), 2) AS NATIONAL_CURRENCY,
                         ROUND(SUM(PERCENT_FOR * FOREIGN_CURRENCY / 100) / POWER(10, 6), 2)  AS FOREIGN_CURRENCY
                  FROM LCR_BUILDER
                  WHERE ROLE = 'B_I') LCR`
  }

  protected nsfrQuery = (role = '1=1') => {
    return () => {
      return `SELECT ROUND(
                             SUM((PERCENT_NAT * NATIONAL_CURRENCY
                                 + PERCENT_FOR * FOREIGIN_CURR_SUMM_EQ) / POWER(10, 10)), 2) AS "total",
                     ROUND(SUM(PERCENT_NAT * NATIONAL_CURRENCY / POWER(10, 10)), 2)          AS "nationalCurrency",
                     ROUND(SUM(PERCENT_FOR * FOREIGN_CURRENCY / POWER(10, 10)), 2)           AS "foreignCurrency"
              FROM NSFR_BUILDER
              WHERE ${role}`
    }
  }

  protected fromOffBalanceSheets15Query = () => {
    return `SELECT ROUND(
                               (PERCENT_NAT * NATIONAL_CURRENCY + PERCENT_FOR * FOREIGIN_CURR_SUMM_EQ) /
                               POWER(10, 8), 2)                             AS "total",
                   ROUND(PERCENT_NAT * NATIONAL_CURRENCY / POWER(10, 8), 2) AS "nationalCurrency",
                   ROUND(PERCENT_FOR * FOREIGN_CURRENCY / POWER(10, 8), 2)  AS "foreignCurrency"
            FROM LCR_BUILDER
            WHERE ROLE IN ('B_I')`
  }

  protected async returnTempData(
    indicatorName = '__INDICATOR_NAME__',
    total = 0,
    nationalCurrency = 0,
    foreignCurrency = 0
  ) {
    return Promise.resolve<IGapFlowData & { indicatorName: string }>({
      indicatorName,
      total,
      nationalCurrency,
      foreignCurrency
    })
  }

  protected getGapSubOrDivideByMonth(
    monthIndex: number,
    total: IGapData[],
    left: IGapData[],
    indicatorName = 'Остаток ВЛА на конец месяца',
    divide = false
  ) {
    function getSubByProp(prop: string) {
      if (divide) {
        return (left[monthIndex] || {})[prop] === 0
          ? 0
          : ((total[monthIndex] || {})[prop] / (left[monthIndex] || {})[prop]) * 10
      }
      return (total[monthIndex] || {})[prop] - (left[monthIndex] || {})[prop]
    }

    return {
      ...total[monthIndex],
      indicatorName,
      total: getSubByProp('total'),
      nationalCurrency: getSubByProp('nationalCurrency'),
      foreignCurrency: getSubByProp('foreignCurrency'),
      usd: getSubByProp('usd'),
      eur: getSubByProp('eur')
    }
  }

  protected getByMonth(monthIndex: number, ...args: IGapData[]): IGapData {
    let total = 0
    let nationalCurrency = 0
    let foreignCurrency = 0
    let usd = 0
    let eur = 0
    return args.reduce((acc, value) => {
      if (value[monthIndex]) {
        total += value[monthIndex]['total']
        nationalCurrency += value[monthIndex]['nationalCurrency']
        foreignCurrency += value[monthIndex]['foreignCurrency']
        usd += value[monthIndex]['usd']
        eur += value[monthIndex]['eur']
      }
      return {
        ...value[monthIndex],
        indicatorName: 'Итого',
        total,
        nationalCurrency,
        foreignCurrency,
        usd,
        eur
      }
    }, {})
  }

  protected getTotal(months: string[], ...args: IGapData[][]) {
    return new Array(13)
      .fill('')
      .map((_, index) => this.getByMonth(index, ...(args as unknown as IGapData[])))
  }

  protected getLcrOrNsfrOneRow(indicatorName = '__NAME__', data: IGapData) {
    return {
      indicatorName,
      ...data
    }
  }

  protected async getOneRow(role: string, fromManual = false) {
    if (fromManual) {
      return await this.getDataInDates<IGapData, true>(undefined, this.manualTableQuery(role), true)
    }
    return await this.getDataInDates<IGapData, true>(role, null, true)
  }

  protected async getMonths() {
    const data = await this.getDataInDates<IGapMonths, true>(undefined, this.monthQuery, true)
    return data.map(m => m['month'])
  }

  protected async vla() {
    return await this.getOneRow('vla')
  } /* Всего ВЛА факт на начало месяца */

  protected async attraction_of_credit_lines() {
    return await this.getOneRow('ved', true)
  } /* Привлечение кредитных линии (ВЭД) */

  protected async legal_deposits() {
    return await this.getOneRow('in_206', true)
  } /* Депозиты юр. лиц */

  protected async liquidity_source_others() {
    return await this.getOneRow('in', true)
  } /* Прочие */

  protected async return_of_loans() {
    return await this.getOneRow('r_c')
  } /* Возврат кредитов(70%) */

  protected async interbank_deposits() {
    return await this.getOneRow('10597')
  } /* Межбанковский депозит */

  protected async return_of_interbank_deposits() {
    return await this.getOneRow('21010')
  } /* Возврат Межбанковских депозитов */

  protected async placement_of_interbank_deposits() {
    return await this.getOneRow('in_10597', true)
  } /* Размещение Межбанковских депозитов */

  protected async return_of_legal_deposits() {
    return await this.getOneRow('206')
  } /* Возврат депозитов Юр. Лиц */

  protected async repayment_of_credit_lines() {
    return await this.getOneRow('220')
  } /* Погашение по кредитным линиям */

  protected async post_fin_liabilities() {
    return await this.getOneRow('l_ac', true)
  } /* Обязательства  по пост фин (аккр.) */

  protected async issuance_of_loans() {
    return await this.getOneRow('i_l', true)
  } /* Выдача кредитов */

  protected async liquidity_need_others() {
    return await this.getOneRow('out', true)
  } /* Прочие */

  protected async amount_for_vla_lcr() {
    return await this.getOneRow('t_a')
  } /* Необходимая сумма для выполнения показателя ВЛА */

  protected async outFlow() {
    return this.getLcrOrNsfrOneRow(
      'Сумма оттока за 30 дней',
      await this.getDataInDates('', this.outflowQuery)
    )
  } /* Сумма оттока за 30 дней */

  protected async inFlow() {
    return this.getLcrOrNsfrOneRow(
      'Сумма притока за 30 дней',
      await this.getDataInDates('', this.inflowQuery)
    )
  } /* Сумма притока за 30 дней */

  // NSFR

  protected async stable_funding_available_amount(): Promise<IGapFlowData> {
    return await this.returnTempData(
      'Доступная сумма стабильного финансирования',
      37556625.59,
      12215331.34,
      2327.44
    )
    // return this.getLcrOrNsfrOneRow(
    //     'Доступная сумма стабильного финансирования',
    //     await this.getDataInDates(
    //         false,
    //         false,
    //         this.nsfrQuery(`ROLE IN ('p_e', 'l_d', 'd_p', 'security',
    //         'borrow', 'credit_line', 's_d_o', 'o_o', 'o_i_o', 'less_than_year')`)
    //     )
    // )
  } /* Доступная сумма стабильного финансирования TODO */

  protected async own_capital() {
    return this.getLcrOrNsfrOneRow(
      'Собственный  капитал',
      await this.getDataInDates('', this.nsfrQuery(`ROLE='p_c'`))
    )
  } /* Собственный  капитал */

  protected async liabilities_over_1year() {
    return this.getLcrOrNsfrOneRow(
      'Обязательства свыше 1 года',
      await this.getDataInDates(
        '',
        this.nsfrQuery(`ROLE IN ('l_d','d_p','security','borrow','credit_line','s_d_o','o_o')`)
      )
    )
  } /* Обязательства свыше 1 года */

  protected async other_perpetual_liabilities30() {
    return this.getLcrOrNsfrOneRow(
      '30% других бессрочных обязательств',
      await this.getDataInDates('', this.nsfrQuery(`ROLE IN ('o_i_o')`))
    )
  } /* 30% других бессрочных обязательств */

  protected async other_liabilities_less_than_1year() {
    return this.getLcrOrNsfrOneRow(
      '30% других обязательств менее 1 года',
      await this.getDataInDates('', this.nsfrQuery(`ROLE IN ('less_than_year')`))
    )
  } /* 30% других обязательств менее 1 года */

  protected async stable_funding_required_amount(): Promise<IGapFlowData> {
    return await this.returnTempData(
      'Необходимая сумма стабильного финансирования',
      32397474.98,
      9240502.96,
      1854.37
    )
    // return this.getLcrOrNsfrOneRow(
    //     'Необходимая сумма стабильного финансирования',
    //     await this.getDataInDates(
    //         false,
    //         false,
    //         this.stableFinancingRequiredAmountQuery
    //     )
    // )
  } /* Необходимая сумма стабильного финансирования TODO */

  protected async assets_over_1year() {
    return this.returnTempData('Активы свыше 1 года', 28198975.83, 8458312.5, 2154.37)
    // return this.getLcrOrNsfrOneRow(
    //     'Активы свыше 1 года',
    //     await this.getDataInDates(
    //         false,
    //         false,
    //         this.nsfrQuery(`ROLE IN ('credits','i_d','invest','c_s')`)
    //     )
    // )
  } /* Активы свыше 1 года TODO */

  protected async bank_things() {
    return this.getLcrOrNsfrOneRow(
      'Банковские помещения, мебель и оборудование, чистые',
      await this.getDataInDates('', this.nsfrQuery(`ROLE = 'o_p_b'`))
    )
  } /* Банковские помещения, мебель и оборудование, чистые */

  protected async loan_things() {
    return this.getLcrOrNsfrOneRow(
      'Кредиты, лизинги и авансы в процессе судебного разбирательства или не взысканные в установленном порядке (чистые)',
      await this.getDataInDates('', this.nsfrQuery(`ROLE = 'leasing'`))
    )
  } /* Кредиты, лизинги и авансы в процессе судебного разбирательства или не взысканные в установленном порядке (чистые) */

  protected async other_assets_less_than_1Year30() {
    return await this.returnTempData(
      '30% других активов менее 1 го года (за исключением бессрочных и со сроком менее 1 го года ликвидных активов)',
      4624194.59,
      1799962.62,
      259.39
    )
    // return this.getLcrOrNsfrOneRow(
    //     '30% других активов менее 1 го года (за исключением бессрочных и со сроком менее 1 го года ликвидных активов)',
    //     await this.getDataInDates(
    //         false,
    //         false,
    //         this.nsfrQuery(`ROLE = 'liquidity'`)
    //     )
    // )
  } /* 30% других активов менее 1 го года (за исключением бессрочных и со сроком менее 1 го года ликвидных активов) TODO */

  protected async from_off_balance_sheets_15() {
    return this.getLcrOrNsfrOneRow(
      '15% из забалансовых инструментов',
      await this.getDataInDates('', this.fromOffBalanceSheets15Query)
    )
  } /* 15% из забалансовых инструментов */

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
    let sourceOfLiquidityTotal = this.getTotal(months, ...sourceOfLiquidity)
    const needsOfLiquidityTotal = this.getTotal(months, ...needsOfLiquidity)
    const tempArray = new Array(13).fill('')
    // Остаток ВЛА на конец месяца
    const vlaBalance = []
    // fill vla and vla balance and update total rows
    tempArray.forEach((_, index) => {
      vlaBalance.push(
        this.getGapSubOrDivideByMonth(index, sourceOfLiquidityTotal, needsOfLiquidityTotal)
      )
      sourceOfLiquidity[0].push(vlaBalance[index])
      sourceOfLiquidityTotal = this.getTotal(months, ...sourceOfLiquidity)
    })
    // Необходимая сумма для выполнения показателя ВЛА
    const amountForVlaLcr = await this.amount_for_vla_lcr()
    // Сумма отклонения(дефицит) на конец месяца
    const deficitAmount = tempArray.map((_, index) =>
      this.getGapSubOrDivideByMonth(
        index,
        vlaBalance,
        amountForVlaLcr,
        'Сумма отклонения(дефицит) на конец месяца'
      )
    )
    // ПОКАЗАТЕЛЬ ВЛА
    const vlaIndicator = tempArray.map((_, index) =>
      this.getGapSubOrDivideByMonth(index, vlaBalance, amountForVlaLcr, 'ПОКАЗАТЕЛЬ ВЛА', true)
    )
    const vlaLcrData = [vlaBalance, amountForVlaLcr, deficitAmount, vlaIndicator]

    // LCR START
    const outFlow = await this.outFlow()
    const inFlow = await this.inFlow()
    const rowKeys = Object.keys(outFlow).filter(key => key !== 'indicatorName')
    // Чистий отток в последующие 30 дней
    const cleanOutFlow = this.getLcrOrNsfrOneRow(
      'Чистий отток в последующие 30 дней',
      rowKeys.reduce((acc: any, val: any) => {
        acc[val] = outFlow[val] - inFlow[val]
        return acc
      }, {})
    )
    // Высоколиквидные активы
    const highLiqAssets: any = this.getLcrOrNsfrOneRow(
      'Высоколиквидные активы',
      (vlaLcrData[0] || [])[0]
    )
    // ПРОГНОЗ LCR
    const lcrForecast = this.getLcrOrNsfrOneRow(
      'ПРОГНОЗ LCR',
      rowKeys.reduce((acc: any, val: any) => {
        acc[val] = Math.trunc((highLiqAssets[val] * 100) / cleanOutFlow[val])
        return acc
      }, {})
    )
    const lcrData = [lcrForecast, highLiqAssets, cleanOutFlow, outFlow, inFlow]

    // NSFR START
    const [
      stableFundingAvailableAmount,
      ownCapital,
      liabilitiesOver1Year,
      otherPerpetualLiabilities30,
      otherLiabilitiesLessThan1Year,
      stableFundingRequiredAmount,
      assetsOver1Year,
      bankThings,
      loanThings,
      otherAssetsLessThan1Year30,
      fromOffBalanceSheets15
    ] = await Promise.all([
      this.stable_funding_available_amount(),
      this.own_capital(),
      this.liabilities_over_1year(),
      this.other_perpetual_liabilities30(),
      this.other_liabilities_less_than_1year(),
      this.stable_funding_required_amount(),
      this.assets_over_1year(),
      this.bank_things(),
      this.loan_things(),
      this.other_assets_less_than_1Year30(),
      this.from_off_balance_sheets_15()
    ])

    // ПРОГНОЗ NSFR
    const nsfrForecast = this.getLcrOrNsfrOneRow(
      'ПРОГНОЗ NSFR',
      rowKeys.reduce((acc: any, val: any) => {
        acc[val] = Math.trunc(
          (stableFundingAvailableAmount[val] * 100) / stableFundingRequiredAmount[val]
        )
        return acc
      }, {})
    )

    const nsfrData = [
      nsfrForecast,
      stableFundingAvailableAmount,
      ownCapital,
      liabilitiesOver1Year,
      otherPerpetualLiabilities30,
      otherLiabilitiesLessThan1Year,
      stableFundingRequiredAmount,
      assetsOver1Year,
      bankThings,
      loanThings,
      otherAssetsLessThan1Year30,
      fromOffBalanceSheets15
    ]
    return [
      months,
      sourceOfLiquidity,
      sourceOfLiquidityTotal,
      needsOfLiquidity,
      needsOfLiquidityTotal,
      vlaLcrData,
      lcrData,
      nsfrData
    ]
  }
}
