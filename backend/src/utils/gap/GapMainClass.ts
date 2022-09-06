import MainClass from '../mainClass'
import { getGapSubOrDivideByMonth, getGapTotal } from './gap_pure_functions'

/* eslint-disable camelcase */
class GapMainClass extends MainClass {
  constructor() {
    super('')
  }

  async returnTempData(INDICATOR_NAME = '__INDICATOR_NAME__', TOTAL = 0,
      NATIONAL_CURRENCY = 0, FOREIGN_CURRENCY = 0) {
    return Promise.resolve({
      INDICATOR_NAME,
      TOTAL,
      NATIONAL_CURRENCY,
      FOREIGN_CURRENCY
    })
  }

  formatQuery(date: string, whereQuery: string) {
    return `SELECT ROLE, 
                       INDICATOR_NAME,
                       TOTAL,
                       NATIONAL_CURRENCY,
                       FOREIGN_CURRENCY,
                       USD, 
                       EUR,
                       'AUTO' AS SOURCE
                FROM GAP_ANALYSIS_AUTO
                WHERE ROLE = '${whereQuery}' ORDER BY OPER_DAY`
  }

  manualTableQuery(role: string) {
    return function() {
      return `SELECT ROLE,
                           INDICATOR_NAME,
                           TOTAL,
                           NATIONAL_CURRENCY,
                           FOREIGN_CURRENCY,
                           USD,
                           EUR,
                           'MANUAL' AS SOURCE
                    FROM GAP_ANALYSIS_MANUAL
                    WHERE ROLE = '${role}'
                    ORDER BY OPER_DAY`
    }
  }

  monthQuery() {
    return `SELECT TO_CHAR(OPER_DAY, 'Month (YY)', 'NLS_DATE_LANGUAGE=''RUSSIAN''') MONTH
            FROM GAP_ANALYSIS_AUTO
            WHERE ROLE = 'r_c'
            ORDER BY OPER_DAY`
  }

  outflowQuery() {
    return `SELECT ROUND((SUM(PERCENT_NAT * NATIONAL_CURRENCY / 100)
        + SUM(PERCENT_FOR * NVL(FOREIGIN_CURR_SUMM_EQ, 0) / 100)) /
                         POWER(10, 6), 2)                                              AS
                       TOTAL,
                   ROUND(SUM(PERCENT_NAT * NATIONAL_CURRENCY / 100) / POWER(10, 6), 2) AS
                       NATIONAL_CURRENCY,
                   ROUND(SUM(PERCENT_FOR * FOREIGN_CURRENCY / 100) / POWER(10, 6), 2)  AS
                       FOREIGN_CURRENCY
            FROM LCR_BUILDER
            WHERE ROLE IN ('B_I', 'T_D', 'P_C', 'BORROW', 'C_L_O', 'U_P_L', 'I_C', 'O_L')`
  }

  inflowQuery() {
    return `SELECT (LCR.TOTAL - VLA.TOTAL)                         AS TOTAL,
                   (LCR.NATIONAL_CURRENCY - VLA.NATIONAL_CURRENCY) AS NATIONAL_CURRENCY,
                   (LCR.FOREIGN_CURRENCY - VLA.FOREIGN_CURRENCY)   AS FOREIGN_CURRENCY
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

  stableFinancingRequiredAmountQuery() {
    return `SELECT (NSFR.TOTAL + LCR.TOTAL)                         AS TOTAL,
                   (NSFR.NATIONAL_CURRENCY + LCR.NATIONAL_CURRENCY) AS NATIONAL_CURRENCY,
                   (NSFR.FOREIGN_CURRENCY + LCR.FOREIGN_CURRENCY)   AS FOREIGN_CURRENCY
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

  nsfrQuery(role = '1=1') {
    return function() {
      return `SELECT ROUND(
                               SUM((PERCENT_NAT * NATIONAL_CURRENCY 
                                        + PERCENT_FOR * FOREIGIN_CURR_SUMM_EQ) / POWER(10, 10)), 2) AS TOTAL,
                           ROUND(SUM(PERCENT_NAT * NATIONAL_CURRENCY / POWER(10, 10)), 2) AS NATIONAL_CURRENCY,
                           ROUND(SUM(PERCENT_FOR * FOREIGN_CURRENCY / POWER(10, 10)), 2) AS FOREIGN_CURRENCY
                    FROM NSFR_BUILDER
                    WHERE ${role}`
    }
  }

  fromOffBalanceSheets15Query() {
    return `SELECT ROUND(
                               (PERCENT_NAT * NATIONAL_CURRENCY + PERCENT_FOR * FOREIGIN_CURR_SUMM_EQ) /
                               POWER(10, 8), 2)                             AS TOTAL,
                   ROUND(PERCENT_NAT * NATIONAL_CURRENCY / POWER(10, 8), 2) AS NATIONAL_CURRENCY,
                   ROUND(PERCENT_FOR * FOREIGN_CURRENCY / POWER(10, 8), 2)  AS FOREIGN_CURRENCY
            FROM LCR_BUILDER
            WHERE ROLE IN ('B_I')`
  }

  getLcrOrNsfrOneRow(INDICATOR_NAME = '__NAME__', data = {}) {
    return {
      INDICATOR_NAME,
      ...data
    }
  }

  async getOneRow(role: string, fromManual: boolean = false) {
    if (fromManual) {
      return await this.getDataInDates('',
          this.manualTableQuery(role), true)
    }
    return await this.getDataInDates(role, null, true)
  }

  async getMonths() {
    const data = await this.getDataInDates('', this.monthQuery, true)
    return data.map((m: { MONTH: string }) => m['MONTH'])
  }

  async vla() {/* Всего ВЛА факт на начало месяца */
    return await this.getOneRow('vla')
  } /* Всего ВЛА факт на начало месяца */

  async attraction_of_credit_lines() {/* Привлечение кредитных линии (ВЭД) */
    return await this.getOneRow('ved', true)
  } /* Привлечение кредитных линии (ВЭД) */

  async legal_deposits() {/* Депозиты юр. лиц */
    return await this.getOneRow('in_206', true)
  } /* Депозиты юр. лиц */

  async liquidity_source_others() {/* Прочие */
    return await this.getOneRow('in', true)
  } /* Прочие */

  async return_of_loans() {/* Возврат кредитов(70%) */
    return await this.getOneRow('r_c')
  } /* Возврат кредитов(70%) */

  async interbank_deposits() {/* Межбанковский депозит */
    return await this.getOneRow('10597')
  } /* Межбанковский депозит */

  async return_of_interbank_deposits() {/* Возврат Межбанковских депозитов */
    return await this.getOneRow('21010')
  } /* Возврат Межбанковских депозитов */

  async placement_of_interbank_deposits() {/* Размещение Межбанковских депозитов */
    return await this.getOneRow('in_10597', true)
  } /* Размещение Межбанковских депозитов */

  async return_of_legal_deposits() {/* Возврат депозитов Юр. Лиц */
    return await this.getOneRow('206')
  } /* Возврат депозитов Юр. Лиц */

  async repayment_of_credit_lines() {/* Погашение по кредитным линиям */
    return await this.getOneRow('220')
  } /* Погашение по кредитным линиям */

  async post_fin_liabilities() {/* Обязательства  по пост фин (аккр.) */
    return await this.getOneRow('l_ac', true)
  } /* Обязательства  по пост фин (аккр.) */

  async issuance_of_loans() {/* Выдача кредитов */
    return await this.getOneRow('i_l', true)
  } /* Выдача кредитов */

  async liquidity_need_others() {/* Прочие */
    return await this.getOneRow('out', true)
  } /* Прочие */

  async amount_for_vla_lcr() {/* Необходимая сумма для выполнения показателя ВЛА */
    return await this.getOneRow('t_a')
  } /* Необходимая сумма для выполнения показателя ВЛА */

  async outFlow() {/* Сумма оттока за 30 дней */
    return this.getLcrOrNsfrOneRow(
        'Сумма оттока за 30 дней',
        await this.getDataInDates(
            '',
            this.outflowQuery
        )
    )
  } /* Сумма оттока за 30 дней */

  async inFlow() {/* Сумма притока за 30 дней */
    return this.getLcrOrNsfrOneRow(
        'Сумма притока за 30 дней',
        await this.getDataInDates(
            '',
            this.inflowQuery
        )
    )
  } /* Сумма притока за 30 дней */

  // NSFR

  async stable_funding_available_amount(): Promise<any> {/* Доступная сумма стабильного финансирования */
    // TODO
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
  } /* Доступная сумма стабильного финансирования */

  async own_capital() {/* Собственный  капитал */
    return this.getLcrOrNsfrOneRow(
        'Собственный  капитал',
        await this.getDataInDates(
            '',
            this.nsfrQuery(`ROLE='p_c'`)
        )
    )
  } /* Собственный  капитал */

  async liabilities_over_1year() {/* Обязательства свыше 1 года */
    return this.getLcrOrNsfrOneRow(
        'Обязательства свыше 1 года',
        await this.getDataInDates(
            '',
            this.nsfrQuery(
                `ROLE IN ('l_d','d_p','security','borrow','credit_line','s_d_o','o_o')`)
        )
    )
  } /* Обязательства свыше 1 года */

  async other_perpetual_liabilities30() {/* 30% других бессрочных обязательств */
    return this.getLcrOrNsfrOneRow(
        '30% других бессрочных обязательств',
        await this.getDataInDates(
            '',
            this.nsfrQuery(`ROLE IN ('o_i_o')`)
        )
    )
  } /* 30% других бессрочных обязательств */

  async other_liabilities_less_than_1year() {/* 30% других обязательств менее 1 года */
    return this.getLcrOrNsfrOneRow(
        '30% других обязательств менее 1 года',
        await this.getDataInDates(
            '',
            this.nsfrQuery(`ROLE IN ('less_than_year')`)
        )
    )
  } /* 30% других обязательств менее 1 года */

  async stable_funding_required_amount(): Promise<any> {/* Необходимая сумма стабильного финансирования */
    // TODO
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
  } /* Необходимая сумма стабильного финансирования */

  async assets_over_1year() {/* Активы свыше 1 года */
    // TODO
    return this.returnTempData(
        'Активы свыше 1 года',
        28198975.83,
        8458312.5,
        2154.37
    )
    // return this.getLcrOrNsfrOneRow(
    //     'Активы свыше 1 года',
    //     await this.getDataInDates(
    //         false,
    //         false,
    //         this.nsfrQuery(`ROLE IN ('credits','i_d','invest','c_s')`)
    //     )
    // )
  } /* Активы свыше 1 года */

  async bank_things() {/* Банковские помещения, мебель и оборудование, чистые */
    return this.getLcrOrNsfrOneRow(
        'Банковские помещения, мебель и оборудование, чистые',
        await this.getDataInDates(
            '',
            this.nsfrQuery(`ROLE = 'o_p_b'`)
        )
    )
  } /* Банковские помещения, мебель и оборудование, чистые */

  async loan_things() {/* Кредиты, лизинги и авансы в процессе судебного разбирательства или не взысканные в установленном порядке (чистые) */
    return this.getLcrOrNsfrOneRow(
        'Кредиты, лизинги и авансы в процессе судебного разбирательства или не взысканные в установленном порядке (чистые)',
        await this.getDataInDates(
            '',
            this.nsfrQuery(`ROLE = 'leasing'`)
        )
    )
  } /* Кредиты, лизинги и авансы в процессе судебного разбирательства или не взысканные в установленном порядке (чистые) */

  // eslint-disable-next-line max-len
  async other_assets_less_than_1Year30() {/* 30% других активов менее 1 го года (за исключением бессрочных и со сроком менее 1 го года ликвидных активов) */
    // TODO
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
  } /* 30% других активов менее 1 го года (за исключением бессрочных и со сроком менее 1 го года ликвидных активов) */

  async from_off_balance_sheets_15() {/* 15% из забалансовых инструментов */
    return this.getLcrOrNsfrOneRow(
        '15% из забалансовых инструментов',
        await this.getDataInDates(
            '',
            this.fromOffBalanceSheets15Query
        )
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
    let sourceOfLiquidityTotal = getGapTotal(months, ...sourceOfLiquidity)
    const needsOfLiquidityTotal = getGapTotal(months, ...needsOfLiquidity)
    const tempArray = new Array(13).fill('')
    // Остаток ВЛА на конец месяца
    const vlaBalance: any = []
    // fill vla and vla balance and update total rows
    tempArray.forEach((_, index) => {
      vlaBalance.push(getGapSubOrDivideByMonth(index, sourceOfLiquidityTotal, needsOfLiquidityTotal))
      sourceOfLiquidity[0].push(vlaBalance[index])
      sourceOfLiquidityTotal = getGapTotal(months, ...sourceOfLiquidity)
    })
    // Необходимая сумма для выполнения показателя ВЛА
    const amountForVlaLcr = await this.amount_for_vla_lcr()
    // Сумма отклонения(дефицит) на конец месяца
    const deficitAmount = tempArray.map(
        (_, index) => getGapSubOrDivideByMonth(
            index,
            vlaBalance,
            amountForVlaLcr,
            'Сумма отклонения(дефицит) на конец месяца'
        )
    )
    // ПОКАЗАТЕЛЬ ВЛА
    const vlaIndicator = tempArray.map(
        (_, index) => getGapSubOrDivideByMonth(
            index,
            vlaBalance,
            amountForVlaLcr,
            'ПОКАЗАТЕЛЬ ВЛА',
            true
        ))
    const vlaLcrData = [
      vlaBalance,
      amountForVlaLcr,
      deficitAmount,
      vlaIndicator
    ]

    // LCR START
    const outFlow: any = await this.outFlow()
    const inFlow: any = await this.inFlow()
    const rowKeys = Object.keys(outFlow).
        filter((key) => key !== 'INDICATOR_NAME')
    // Чистий отток в последующие 30 дней
    const cleanOutFlow: any = this.getLcrOrNsfrOneRow(
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
          acc[val] = Math.trunc(
              highLiqAssets[val] * 100 / cleanOutFlow[val])
          return acc
        }, {})
    )
    const lcrData = [
      lcrForecast,
      highLiqAssets,
      cleanOutFlow,
      outFlow,
      inFlow]

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
          acc[val] = Math.trunc(stableFundingAvailableAmount[val] * 100 /
          stableFundingRequiredAmount[val])
          return acc
        }, {})
    )

    const nsfrData = [
      nsfrForecast,
      stableFundingAvailableAmount, ownCapital,
      liabilitiesOver1Year, otherPerpetualLiabilities30,
      otherLiabilitiesLessThan1Year, stableFundingRequiredAmount,
      assetsOver1Year, bankThings, loanThings,
      otherAssetsLessThan1Year30, fromOffBalanceSheets15
    ]
    return {
      months, sourceOfLiquidity,
      sourceOfLiquidityTotal,
      needsOfLiquidity,
      needsOfLiquidityTotal,
      vlaLcrData, lcrData, nsfrData
    }
  }
}

export default GapMainClass
