import { ConsoleLogger } from '@nestjs/common'
import { Base } from '../../base'
import { OwnQuery } from '../../core.interface'
// import { format } from 'date-fns'
import { ICapitalDbData, ICapitalRow } from './capital.interface'

export class CapitalBase extends Base {
  protected formatQuery(whereQuery: string): string {
    return `SELECT ROUND(SUM(SALDO_EQUIVAL_OUT) / POWER(10, 5), 2) AS "saldoEquivalOut"
            FROM (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                 SALDO_EQUIVAL_OUT
                          FROM IBS.SALDO@IABS SL
                          WHERE SL.ACCOUNT_CODE = AC.CODE
                            AND SL.OPER_DAY < DATE '${this.date}'
                            AND ROWNUM = 1) AS SALDO_EQUIVAL_OUT
                  FROM IBS.ACCOUNTS@IABS AC
                  WHERE ${whereQuery})`
  }

  private fullPaidSharesQuery = () => {
    return `SELECT ROUND((NVL(col1, 0) + NVL(col2, 0) - NVL(col3, 0)) / POWER(10, 5), 2) AS "saldoEquivalOut"
                FROM  (SELECT (SELECT SUM(saldo_equival_out)
               FROM  (SELECT AC.code,
                             (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                     saldo_equival_out
                              FROM   ibs.saldo@iabs sl
                              WHERE  sl.account_code = ac.code
                                AND sl.oper_day < DATE '${this.date}'
                                AND ROWNUM = 1) AS saldo_equival_out
                      FROM   ibs.accounts@iabs AC
                      WHERE  code_coa = '30312')) AS col1,
              (SELECT SUM(saldo_equival_out)
               FROM  (SELECT AC.code,
                             (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                     oper_day
                              FROM   ibs.saldo@iabs sl
                              WHERE  sl.account_code = ac.code
                                AND sl.oper_day < DATE '${this.date}'
                                AND ROWNUM = 1) AS oper_day,
                             (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                     saldo_equival_out
                              FROM   ibs.saldo@iabs sl
                              WHERE  sl.account_code = ac.code
                                AND sl.oper_day < DATE '${this.date}'
                                AND ROWNUM = 1) AS saldo_equival_out
                      FROM   ibs.accounts@iabs AC
                      WHERE  code_coa = '30318')) AS col2,
              (SELECT SUM(saldo_equival_out)
               FROM  (SELECT AC.code,
                             (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                     oper_day
                              FROM   ibs.saldo@iabs sl
                              WHERE  sl.account_code = ac.code
                                AND sl.oper_day < DATE '${this.date}'
                                AND ROWNUM = 1) AS oper_day,
                             (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                     saldo_equival_out
                              FROM   ibs.saldo@iabs sl
                              WHERE  sl.account_code = ac.code
                                AND sl.oper_day < DATE '${this.date}'
                                AND ROWNUM = 1) AS saldo_equival_out
                      FROM   ibs.accounts@iabs AC
                      WHERE  code_coa = '30306')) AS col3
       FROM   ibs.saldo@iabs s,
              ibs.accounts@iabs a
       WHERE  a.code = s.account_code
         AND ROWNUM = 1)`
  }

  private reversePurchasedQuery = () => {
    return `select round(nvl(sum(saldo_equival_out),0) / power(10, 5), 2) AS "saldoEquivalOut" from(
                select 
                (select --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                saldo_equival_out
                from ibs.saldo@iabs sl 
                where
                sl.account_code=ac.code
                and sl.oper_day< DATE '${this.date}'
                and rownum =1)
                as saldo_equival_out
                from ibs.accounts@iabs  AC
                where code_coa='30324')`
  }

  private pastPeriodsQuery = () => {
    return `SELECT 
       round(decode(sign(sum(saldo_equival_out)), -1, sum(saldo_equival_out), 0) / power(10,5), 2) AS "saldoEquivalOut"
                FROM
                    (SELECT
                         (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                 saldo_equival_out
                          FROM ibs.saldo@iabs sl
                          WHERE sl.account_code=ac.code
                            AND sl.oper_day<date '${this.date}'
                            AND rownum =1) AS saldo_equival_out
                     FROM ibs.accounts@iabs AC
                     WHERE code_coa='31203')`
  }

  private currentYearQuery = () => {
    return `SELECT
                    ROUND(DECODE(SUM_31206, 0, SUM_4_5, SUM_31206) / POWER(10, 5), 2) AS "saldoEquivalOut"
                FROM (SELECT DECODE(SIGN(SUM(SALDO_EQUIVAL_OUT)), -1, SUM(SALDO_EQUIVAL_OUT),
                                    0) AS SUM_31206
                      FROM (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                           SALDO_EQUIVAL_OUT
                                    FROM IBS.SALDO@IABS SL
                                    WHERE SL.ACCOUNT_CODE = AC.CODE
                                      AND SL.OPER_DAY < DATE '${this.date}'
                                      AND ROWNUM = 1) AS saldo_equival_out
                            FROM IBS.ACCOUNTS@IABS AC
                            WHERE CODE_COA = '31206')), (SELECT DECODE(SIGN(SUM(SALDO_EQUIVAL_OUT)), -1, ABS(SUM(SALDO_EQUIVAL_OUT)),
                                                                       0) AS SUM_4_5
                                                         FROM (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                                              SALDO_EQUIVAL_OUT
                                                                       FROM IBS.SALDO@IABS SL
                                                                       WHERE SL.ACCOUNT_CODE = AC.CODE
                                                                         AND SL.OPER_DAY < DATE '${this.date}'
                                                                         AND ROWNUM = 1) AS saldo_equival_out
                                                               FROM IBS.ACCOUNTS@IABS AC
                                                               WHERE CODE_COA LIKE '4%'
                                                                  OR CODE_COA LIKE '5%'))`
  }

  private fullyPaidSharesQuery = () => {
    return `SELECT
                round(nvl(((SELECT sum(saldo_equival_out)
                            FROM
                                (SELECT
                                     (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                             saldo_equival_out
                                      FROM ibs.saldo@iabs sl
                                      WHERE sl.account_code=ac.code
                                        AND sl.oper_day<date '${this.date}'
                                        AND rownum =1 ) AS saldo_equival_out
                                 FROM ibs.accounts@iabs AC
                                 WHERE code_coa in ('30315', '30309')))-(SELECT sum(saldo_equival_out)
                                                                         FROM
                                                                             (SELECT
                                                                                  (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                                                          saldo_equival_out
                                                                                   FROM ibs.saldo@iabs sl
                                                                                   WHERE sl.account_code=ac.code
                                                                                     AND sl.oper_day<date '${this.date}'
                                                                                     AND rownum =1 ) AS saldo_equival_out
                                                                              FROM ibs.accounts@iabs AC
                                                                              WHERE code_coa='30303'))), 0) / power(10, 5), 2) AS "saldoEquivalOut"
        FROM dual`
  }

  private totalCapitalInvestmentQuery = () => {
    return `SELECT
                    ROUND(((SELECT sum(saldo_equival_out)
                            FROM (SELECT
                                      (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                              saldo_equival_out
                                       FROM ibs.saldo@iabs sl
                                       WHERE sl.account_code=ac.code
                                         AND sl.oper_day<date '${this.date}'
                                         AND rownum =1 ) AS saldo_equival_out
                                  FROM ibs.accounts@iabs AC
                                  WHERE code_coa in ('10711',
                                                     '10719',
                                                     '10779',
                                                     '10821',
                                                     '10813',
                                                     '10823',
                                                     '10825',
                                                     '10879',
                                                     '10899')
                                     OR code_coa like '158%'
                                     OR code_coa like '159%'))-(SELECT sum(saldo_equival_out)
                                                                FROM
                                                                    (SELECT
                                                                         (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                                                 saldo_equival_out
                                                                          FROM ibs.saldo@iabs sl
                                                                          WHERE sl.account_code=ac.code
                                                                            AND sl.oper_day<date'${this.date}'
                                                                            AND rownum =1 ) AS saldo_equival_out
                                                                     FROM ibs.accounts@iabs AC
                                                                     WHERE code_coa in ('10723',
                                                                                        '10725',
                                                                                        '10799',
                                                                                        '10823',
                                                                                        '10825',
                                                                                        '15913',
                                                                                        '10899')))) / POWER(10, 5), 2) AS "saldoEquivalOut"
                FROM dual`
  }

  private currentYearProfitQuery = () => {
    return `select  case  when sum(saldo_active_eq+saldo_passive_eq)/100<0 then 0 
    else sum(saldo_active_eq+saldo_passive_eq)/power(10,2) end  AS "saldoEquivalOut" from ibs.svod_saldo_dump@iabs
    where dat= date '${this.date}'
    and (bal in('30907','30909','31206') or substr(bal,1,1) in('4','5'))
    `
  }
  private subordinatedDebtQuery = () => {
    return `SELECT Round(SUM(Decode(Floor(( Min(( ds.date_validate )) - DATE '${this.date}' )
    / 365),
0, 0,
1,
    0.2 *
        saldo_equival_out,
2,
    0.4 *
        saldo_equival_out,
3,
    0.6 *
        saldo_equival_out,
4,
    0.8 *
        saldo_equival_out,
saldo_equival_out) / Power(10, 5)), 1) AS "saldoEquivalOut"
FROM   ibs.dep_accounts@iabs dep_acc
join ibs.accounts@iabs ac
ON dep_acc.acc_id = ac.id
join ibs.dep_schedules_forecast@iabs ds
ON ds.contract_id = dep_acc.contract_id
WHERE  ac.code_coa = '23702'
AND condition = 'A'
AND ds.TYPE = 1
AND ds.date_validate > DATE'${this.date}'
GROUP  BY ac.name,
ac.code,
dep_acc.contract_id,
saldo_equival_out
   `
  }

  private createData = (
    count: string,
    indicatorName: string,
    value: number,
    isTableHead?: boolean
  ) => ({
    count,
    indicatorName,
    value,
    isTableHead
  })

  private getTotal(...args: ICapitalRow[]) {
    return args.reduce((previousValue, currentValue) => (previousValue += currentValue.value), 0)
  }

  private async getOneRow(
    count: string,
    indicatorName: string,
    whereQuery: string | undefined,
    ownQuery?: OwnQuery,
    isTableHead = false
  ) {
    let value: number
    if (typeof whereQuery === 'string') {
      const { saldoEquivalOut } = await this.getDataInDates<ICapitalDbData>(whereQuery, undefined)
      value = saldoEquivalOut
    } else {
      const { saldoEquivalOut } = await this.getDataInDates<ICapitalDbData>(undefined, ownQuery)
      value = saldoEquivalOut
    }
    if (typeof value === null || typeof value === undefined) value = 0
    if (value < 0) value = Math.abs(value)
    return this.createData(count, indicatorName, value, isTableHead)
  }

  private ordinary_shares(full_paid: ICapitalRow, rev_purchased: ICapitalRow) {
    return this.createData(
      '1.1.',
      'Обыкновенные Акции, чистые',
      this.getTotal(full_paid, rev_purchased),
      true
    )
  } /* Обыкновенные Акции, чистые */

  private async full_paid_shares() {
    return await this.getOneRow(
      'а',
      'Полностью оплаченные обыкновенные акции',
      undefined,
      this.fullPaidSharesQuery
    )
  } /* Полностью оплаченные обыкновенные акции */

  private async reverse_repurchased() {
    return await this.getOneRow(
      'б',
      'Минус: Обратно Выкупленные обыкновенные акции',
      undefined,
      this.reversePurchasedQuery
    )
  } /* Минус: Обратно Выкупленные обыкновенные акции */

  private async capital_added() {
    return await this.getOneRow(
      '1.2.',
      'Добавленный капитал - Обыкновенные',
      `CODE_COA='30606'`,
      undefined,
      true
    )
  } /* Добавленный капитал - Обыкновенные */

  private async capital_reserves() {
    return await this.getOneRow(
      'а',
      'Капитальные резервы ',
      `CODE_COA IN ('30903', '30904', '30910')`
    )
  } /* Капитальные резервы  */

  private async undistributed_profits() {
    return await this.getOneRow('б', 'Нераспределенная прибыль', `CODE_COA='31203'`)
  } /* Нераспределенная прибыль */

  private async los_for_past_periods() {
    return await this.getOneRow('в', 'Убыток за прошлый год', undefined, this.pastPeriodsQuery)
  } /* Убыток за прошлый год */

  private async los_for_current_year() {
    return await this.getOneRow('г', 'Убыток за текущий год', undefined, this.currentYearQuery)
  } /* Убыток за текущий год  */

  private retained_earnings(
    reserves: ICapitalRow,
    profit: ICapitalRow,
    los1: ICapitalRow,
    los2: ICapitalRow
  ) {
    return this.createData(
      '1.3.',
      'Нераспределенная прибыль (убыток), в том числе капитальные резервы',
      this.getTotal(reserves, profit) - this.getTotal(los1, los2),
      true
    )
  } /* Нераспределенная прибыль (убыток), в том числе капитальные резервы */

  private async subsidy_minor_interest(): Promise<ICapitalRow> {
    /* TODO requires to calc */
    return new Promise(resolve => {
      resolve({
        count: '1.4.',
        indicatorName: 'Интерес меньшинства в консолидированных дочерних компаниях (согласно МБС)',
        value: 0.0
      })
    })
  } /* Интерес меньшинства в консолидированных дочерних компаниях (согласно МБС)  */

  private async devaluation_reserve() {
    return await this.getOneRow(
      '1.5.',
      'Резерв на девальвацию',
      `CODE_COA='30906'`,
      undefined,
      true
    )
  } /* Резерв на девальвацию */

  private capital_before_deduction(...args: ICapitalRow[]) {
    return this.createData(
      '',
      'Итого основного капитала уровня I до вычетов',
      this.getTotal(...args)
    )
  } /* Итого основного капитала уровня I до вычетов  */

  private deduction_from_tier1(
    investment_total: ICapitalRow,
    investment_for_other_banks: ICapitalRow,
    intangible_assets: ICapitalRow
  ) {
    return this.createData(
      '1.6.',
      'Вычеты из суммы основного капитала уровня I',
      this.getTotal(investment_total, investment_for_other_banks, intangible_assets),
      true
    )
  } /* Вычеты из суммы основного капитала уровня I */

  private async intangible_assets() {
    return await this.getOneRow(
      'а',
      'Нематериальные активы',
      `acc_external IN ( '16601000300000873002', '16605000300000873002' )`
    )
  } /* Нематериальные активы */

  private async total_capital_investment() {
    return await this.getOneRow(
      'б',
      `Все инвестиции в капитал неконсолидированных хозяйствующих субъектов, в том 
        числе в долговые обязательства, которые образуют капитал хозяйствующих субъектов`,
      undefined,
      this.totalCapitalInvestmentQuery
    )
    // eslint-disable-next-line max-len
  } /* Все инвестиции в капитал неконсолидированных хозяйствующих субъектов, в том числе в долговые обязательства, которые образуют капитал хозяйствующих субъектов */

  private async investment_for_other_banks() {
    return await this.getOneRow(
      'в',
      'Инвестиции в капитал других банков',
      `CODE_COA IN ('10723', '10725', '10799', '10823', '10825', '10899')`
    )
  } /* Инвестиции в капитал других банков */

  private total_corrected_capital(capital_before_ded: ICapitalRow, ded_from_t1: ICapitalRow) {
    return this.createData(
      'I',
      'ВСЕГО СКОРРЕКТИРОВАННЫЙ ОСНОВНОЙ КАПИТАЛ УРОВНЯ I',
      this.getTotal(capital_before_ded) - this.getTotal(ded_from_t1),
      true
    )
  } /* ВСЕГО СКОРРЕКТИРОВАННЫЙ ОСНОВНОЙ КАПИТАЛ УРОВНЯ I */

  private added_capital_level1() {
    return {
      count: '2',
      indicatorName: 'ДОБАВЛЕННЫЙ КАПИТАЛ УРОВНЯ 1',
      value: 0
    }
  } /* ДОБАВЛЕННЫЙ КАПИТАЛ УРОВНЯ 1 */

  private non_cumulative_shares(
    fully_paid_shares: ICapitalRow,
    reverse_repurchased_assets: ICapitalRow
  ) {
    return this.createData(
      '2.1.',
      'Некумулятивные бессрочные привилегированные акции',
      this.getTotal(fully_paid_shares) - this.getTotal(reverse_repurchased_assets),
      true
    )
  } /* Некумулятивные бессрочные привилегированные акции  */

  private async fully_paid_shares() {
    return await this.getOneRow(
      'а',
      'Полностью оплаченные привилегированные акции',
      undefined,
      this.fullyPaidSharesQuery
    )
  } /* Полностью оплаченные привилегированные акции */

  private async reverse_repurchased_assets() {
    return await this.getOneRow(
      'б',
      'Минус: Обратно Выкупленные привилегированные акции',
      `CODE_COA='30321'`
    )
  } /* Минус: Обратно Выкупленные привилегированные акции */

  private async added_capital_preferred() {
    return await this.getOneRow(
      '2.2.',
      'Добавленный капитал - Привилегированные',
      `CODE_COA='30603'`
    )
  } /* Добавленный капитал - Привилегированные  */

  private async interest_in_consolidated_subsidiary(): Promise<ICapitalRow> {
    /* TODO requires to calc */
    return new Promise(resolve => {
      resolve({
        count: '2.3.',
        indicatorName: 'Интерес меньшинства в консолидированных дочерних компаниях',
        value: 0.0,
        isTableHead: true
      })
    })
  } /* Интерес меньшинства в консолидированных дочерних компаниях  */

  private async interest_of_subsidiaries(): Promise<ICapitalRow> {
    /* TODO requires to calc */
    return new Promise(resolve => {
      resolve({
        count: '2.4.',
        indicatorName: `Доля участия 
        дочерних предприятий (выпущенные дочерними предприятиями и находящиеся во владении третьих лиц инструменты, приравненные к капиталу)`,
        value: 0.0
      })
    })
    // eslint-disable-next-line max-len
  } /* Доля участия дочерних предприятий (выпущенные дочерними предприятиями и находящиеся во владении третьих лиц инструменты, приравненные к капиталу)  */

  private capital_added_total_level1(...args: ICapitalRow[]) {
    return this.createData('II', 'ВСЕГО ДОБАВЛЕННЫЙ КАПИТАЛ УРОВНЯ I', this.getTotal(...args))
  } /* ВСЕГО ДОБАВЛЕННЫЙ КАПИТАЛ УРОВНЯ I */

  private total_adjusted_capital_level1(level1: ICapitalRow, level2: ICapitalRow) {
    return this.createData(
      'III',
      'ВСЕГО СКОРРЕКТИРОВАННЫЙ КАПИТАЛ УРОВНЯ I',
      this.getTotal(level1, level2),
      true
    )
  } /* ВСЕГО СКОРРЕКТИРОВАННЫЙ КАПИТАЛ УРОВНЯ I */

  private capital_level2() {
    return {
      count: '',
      indicatorName: 'КАПИТАЛ УРОВНЯ II',
      value: 0,
      isTableHead: true
    }
  } /* КАПИТАЛ УРОВНЯ II */

  private async current_year_profit() {
    const currentDate = this.date
    await this.getBeforeDate()
    const currentProfitRow = await this.getOneRow(
      '3.1.',
      'Прибыль за текущий год (при подтверждении аудиторами - 100%, в противном случае 50% от суммы)',
      undefined,
      this.currentYearProfitQuery
    )
    this.date = currentDate
    return currentProfitRow
  } /* Прибыль за текущий год (при подтверждении аудиторами - 100%, в противном случае 50% от суммы) */

  private async provisions_for_loans() {
    return await this.getOneRow(
      '3.2.',
      'Резервы, создаваемые на стандартные кредиты (активы), в размере не более 1.25% от общей суммы активов, взвешенных с учетом риска',
      `CODE_COA='30911' OR CODE_COA LIKE '177%' OR CODE_COA=29807`
    )
  } /* Резервы, создаваемые на стандартные кредиты (активы), в размере не более 1.25% от общей суммы активов, взвешенных с учетом риска */

  private async surplus_over_cost() {
    const res = await this.getOneRow(
      '3.3.',
      'Излишки оценочной стоимости прироста над первоначальной стоимостью',
      `CODE_COA='30908'`
    )
    return {
      ...res,
      value: 0.45 * res.value
    }
  } /* Излишки оценочной стоимости прироста над первоначальной стоимостью */

  private async other_capital_instruments(): Promise<ICapitalRow> {
    return new Promise(resolve => {
      resolve({
        count: '3.4.',
        indicatorName:
          'Другие инструменты капитала (не более 1/3 части капитала 1 уровня после вычетов)',
        value: 0.0
      })
    })
  } /* Другие инструменты капитала (не более 1/3 части капитала 1 уровня после вычетов) */

  private async subordinated_debt() {
    return await this.getOneRow(
      '3.5.',
      'Субординированный долг',
      undefined,
      this.subordinatedDebtQuery
    )
  } /* Субординированный долг */

  private deductions_of_excess() {
    return {
      count: '3.6.',
      indicatorName: 'Вычеты превышения Капитала Уровня II над Капиталом Уровня I',
      value: 0
    }
  } /* Вычеты превышения Капитала Уровня II над Капиталом Уровня I  */

  private total_capital_level2(...args: ICapitalRow[]) {
    return this.createData('', 'Итого капитала Уровня II', this.getTotal(...args), true)
  } /* Итого капитала Уровня II */

  private corrected_capital_level2(...args: ICapitalRow[]) {
    return this.createData(
      'IV',
      'СКОРРЕКТИРОВАННЫЙ КАПИТАЛ УРОВНЯ II',
      this.getTotal(...args),
      true
    )
  } /* СКОРРЕКТИРОВАННЫЙ КАПИТАЛ УРОВНЯ II */

  private total_regular_capital(...args: ICapitalRow[]) {
    this.createData('V', 'ВСЕГО РЕГУЛЯТИВНЫЙ КАПИТАЛ', this.getTotal(...args), true)
    return this.createData('V', 'ВСЕГО РЕГУЛЯТИВНЫЙ КАПИТАЛ', this.getTotal(...args), true)
  } /* ВСЕГО РЕГУЛЯТИВНЫЙ КАПИТАЛ */

  async getRows(): Promise<ICapitalRow[]> {
    const [
      fullPaidShares,
      reverseRepurchased,
      capitalAdded,
      capitalReserves,
      undistributedProfits,
      lostForPastPeriods,
      lostForCurrentYear,
      subsidyMinorInterest,
      devaluation_Reserve,
      intangibleAssets,
      totalCapitalInvestment,
      investmentForOtherBanks,
      fullyPaidShares,
      reverseRepurchasedAssets,
      addedCapitalPreferred,
      interestInConsolidatedSubsidiary,
      interestOfSubsidiaries,
      currentYearProfit,
      provisionForLoans,
      surplusOverCost,
      otherCapitalInstruments,
      subordinatedDebt
    ] = await Promise.all([
      this.full_paid_shares(),
      this.reverse_repurchased(),
      this.capital_added(),
      this.capital_reserves(),
      this.undistributed_profits(),
      this.los_for_past_periods(),
      this.los_for_current_year(),
      this.subsidy_minor_interest(),
      this.devaluation_reserve(),
      this.intangible_assets(),
      this.total_capital_investment(),
      this.investment_for_other_banks(),
      this.fully_paid_shares(),
      this.reverse_repurchased_assets(),
      this.added_capital_preferred(),
      this.interest_in_consolidated_subsidiary(),
      this.interest_of_subsidiaries(),
      this.current_year_profit(),
      this.provisions_for_loans(),
      this.surplus_over_cost(),
      this.other_capital_instruments(),
      this.subordinated_debt()
    ])
    const ordinaryShares = this.ordinary_shares(fullPaidShares, reverseRepurchased)
    const retainedEarnings = this.retained_earnings(
      capitalReserves,
      undistributedProfits,
      lostForPastPeriods,
      lostForCurrentYear
    )
    const capitalBeforeDeduction = this.capital_before_deduction(
      ordinaryShares,
      capitalAdded,
      retainedEarnings,
      subsidyMinorInterest,
      devaluation_Reserve
    )
    const deductionFromTier1 = this.deduction_from_tier1(
      totalCapitalInvestment,
      investmentForOtherBanks,
      intangibleAssets
    )
    const totalCorrectedTotal = this.total_corrected_capital(
      capitalBeforeDeduction,
      deductionFromTier1
    )
    const addedCapitalLevel1 = this.added_capital_level1()
    const nonCumulativeShares = this.non_cumulative_shares(
      fullyPaidShares,
      reverseRepurchasedAssets
    )
    const capitalTotalAddedLevel1 = this.capital_added_total_level1(
      nonCumulativeShares,
      addedCapitalPreferred,
      interestInConsolidatedSubsidiary,
      interestOfSubsidiaries
    )
    const totalAdjustedCapitalLevel1 = this.total_adjusted_capital_level1(
      totalCorrectedTotal,
      capitalTotalAddedLevel1
    )
    const capitalLevel2 = this.capital_level2()
    const deductionsOfExcess = this.deductions_of_excess()
    const totalCapitalLevel2 = this.total_capital_level2(
      currentYearProfit,
      provisionForLoans,
      surplusOverCost,
      otherCapitalInstruments,
      subordinatedDebt,
      deductionsOfExcess
    )
    // console.log('currentYearProfit', currentYearProfit)
    // console.log('provisionForLoans', provisionForLoans)
    // console.log('surplusOverCost', surplusOverCost)
    // console.log('otherCapitalInstruments', otherCapitalInstruments)
    // console.log('subordinatedDebt', subordinatedDebt)
    // console.log('deductionsOfExcess', deductionsOfExcess)

    const correctedCapitalLevel2 = this.corrected_capital_level2(totalCapitalLevel2)
    const totalRegularCapital = this.total_regular_capital(
      totalAdjustedCapitalLevel1,
      totalCapitalLevel2
    )

    return [
      ordinaryShares,
      fullPaidShares,
      reverseRepurchased,
      capitalAdded,
      retainedEarnings,
      capitalReserves,
      undistributedProfits,
      lostForPastPeriods,
      lostForCurrentYear,
      subsidyMinorInterest,
      devaluation_Reserve,
      capitalBeforeDeduction,
      deductionFromTier1,
      intangibleAssets,
      totalCapitalInvestment,
      investmentForOtherBanks,
      totalCorrectedTotal,
      addedCapitalLevel1,
      nonCumulativeShares,
      fullyPaidShares,
      reverseRepurchasedAssets,
      addedCapitalPreferred,
      interestInConsolidatedSubsidiary,
      interestOfSubsidiaries,
      capitalTotalAddedLevel1,
      totalAdjustedCapitalLevel1,
      capitalLevel2,
      currentYearProfit,
      provisionForLoans,
      surplusOverCost,
      otherCapitalInstruments,
      subordinatedDebt,
      deductionsOfExcess,
      totalCapitalLevel2,
      correctedCapitalLevel2,
      totalRegularCapital
    ]
  }
}
