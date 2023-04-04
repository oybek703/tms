import { Base } from '../../base'
import { IDate, IIncomeDbData, IIncomeQueryCodes } from './income-analysis.interface'

export class IncomeAnalysisBase extends Base {
  protected dates: string

  protected formatQuery(whereQuery: string): string {
    return whereQuery
  }

  protected getDatesQuery = () => {
    return `SELECT TO_CHAR(MAX(OPER_DAY), 'YYYY-MM-DD') AS "dat"
            FROM IBS.DAY_OPERATIONAL@IABS
            GROUP BY EXTRACT(MONTH FROM OPER_DAY), EXTRACT(YEAR FROM OPER_DAY)
            HAVING (MAX(OPER_DAY) >= ADD_MONTHS(DATE '${this.date}', -7) AND MAX(OPER_DAY) < DATE '${this.date}')
            ORDER BY MAX(OPER_DAY) DESC FETCH FIRST 7 ROWS ONLY`
  }

  protected getChartDataQuery = (whereQuery: string, dates: string) => {
    return () => {
      return `WITH BENIFIT AS
                       (SELECT DAT,
                               DECODE(SUM(SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ), 0,
                                      (SELECT SUM(SALDO_EQV_OUTM + SALDO_EQV_OUTP)
                                       FROM IBS.DWH_COA_Y@IABS
                                       WHERE OPER_DAY = DAT
                                         AND ${whereQuery}),
                                      SUM(SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ)) / POWER(10, 8) AS SUM_EQV
                        FROM IBS.SVOD_SALDO_DUMP@IABS
                        WHERE ${whereQuery.replace('COA_CODE', 'BAL')}
                          AND DAT IN (${dates})
                        GROUP BY DAT)
              SELECT INITCAP(TO_CHAR(TRUNC(ADD_MONTHS(DAT, 1), 'MM'), 'month', 'NLS_DATE_LANGUAGE=RUSSIAN')) AS "monthName",
                     ABS(DECODE(EXTRACT(MONTH FROM DAT), 1, SUM_EQV, SUM_EQV - LAG(SUM_EQV) OVER (ORDER BY DAT))) AS "saldo"
              FROM BENIFIT
              OFFSET 1 ROWS`
    }
  }

  getDates = async () => {
    const dates = await this.getDataInDates<IDate, true>(undefined, this.getDatesQuery, true)
    this.dates = dates.reduce((previousValue, currentValue, currentIndex) => {
      const { dat } = currentValue
      const isLastElement = currentIndex === dates.length - 1
      previousValue += `DATE '${dat}'${isLastElement ? '' : ', '}`
      return previousValue
    }, ``)
  }

  getChartData = async (whereQuery: string, title: string) => {
    const data = await this.getDataInDates<IIncomeDbData, true>(
      undefined,
      this.getChartDataQuery(whereQuery, this.dates),
      true
    )
    return { title, data }
  }

  getIncome = async () => {
    //Прочие процентные доходы
    const otherPercentIncomes = await this.getChartData(
      IIncomeQueryCodes.otherPercentIncomes,
      'Прочие процентные доходы'
    )
    //По долгосрочным кредитам
    const forLongTermIncomes = await this.getChartData(
      IIncomeQueryCodes.forLongTermIncomes,
      'По долгосрочным кредитам'
    )
    //Процентный доход по ценным бумагам
    const interestIncome = await this.getChartData(
      IIncomeQueryCodes.interestIncome,
      'Процентный доход по ценным бумагам'
    )
    // По неоплаченными акцептам
    const unpaidAcceptances = await this.getChartData(
      IIncomeQueryCodes.unpaidAcceptances,
      ' По неоплаченным акцептам'
    )
    // По инвестициям
    const byInvestments = await this.getChartData(
      IIncomeQueryCodes.byInvestments,
      ' По инвестициям'
    )
    // По счётам в других банках
    const otherBanksAccounts = await this.getChartData(
      IIncomeQueryCodes.otherBanksAccounts,
      ' По счётам в других банках'
    )
    return [
      otherPercentIncomes,
      forLongTermIncomes,
      interestIncome,
      unpaidAcceptances,
      byInvestments,
      otherBanksAccounts
    ]
  }

  getIncomeNoPercent = async () => {
    //Резервы по кредитам
    const creditReserve = await this.getChartData(
      IIncomeQueryCodes.creditReserve,
      'Резервы по кредитам'
    )
    //СПОТ (продажа)
    const spotSell = await this.getChartData(IIncomeQueryCodes.spotSell, 'СПОТ (продажа)')
    //СПОТ (переоценка)
    const spotRemark = await this.getChartData(IIncomeQueryCodes.spotRemark, 'СПОТ (переоценка)')
    //Дебетовые обороты
    const debitTurnOvers = await this.getChartData(
      IIncomeQueryCodes.debitTurnOvers,
      'Дебетовые обороты'
    )
    //Услуги по аккредитивам
    const accredetivServices = await this.getChartData(
      IIncomeQueryCodes.accredetivServices,
      'Услуги по аккредитивам'
    )

    //Денежные переводы
    const moneyTransfers = await this.getChartData(
      IIncomeQueryCodes.moneyTransfers,
      'Денежные переводы'
    )
    return [creditReserve, spotSell, spotRemark, debitTurnOvers, accredetivServices, moneyTransfers]
  }

  getConsumption = async () => {
    //Прочие процентные расходы (Ресурсы)
    const otherPercentConsumptions = await this.getChartData(
      IIncomeQueryCodes.otherPercentConsumptions,
      'Прочие процентные расходы (Ресурсы)'
    )
    //Долгосрочным кредитам
    const longTermLoans = await this.getChartData(
      IIncomeQueryCodes.longTermLoans,
      'Долгосрочным кредитам'
    )
    //Срочным депозитам
    const termDeposits = await this.getChartData(
      IIncomeQueryCodes.termDeposits,
      'Срочным депозитам'
    )
    //Краткосрочным кредитам
    const shortTermLoans = await this.getChartData(
      IIncomeQueryCodes.shortTermLoans,
      'Краткосрочным кредитам'
    )
    //Выпущенным ценным бумагам
    const issuedSecurities = await this.getChartData(
      IIncomeQueryCodes.issuedSecurities,
      'Выпущенным ценным бумагам'
    )

    //Сберегательным депозитам
    const savingDeposits = await this.getChartData(
      IIncomeQueryCodes.savingDeposits,
      'Сберегательным депозитам'
    )
    return [
      otherPercentConsumptions,
      longTermLoans,
      termDeposits,
      shortTermLoans,
      issuedSecurities,
      savingDeposits
    ]
  }

  getConsumptionNoPercent = async () => {
    //Зароботная плата и другие расходы на сотрудников
    const employeeExpenses = await this.getChartData(
      IIncomeQueryCodes.employeeExpenses,
      'Зароботная плата и другие расходы на сотрудников'
    )
    //Оценка возможных убытков
    const possibleLosses = await this.getChartData(
      IIncomeQueryCodes.possibleLosses,
      'Оценка возможных убытков'
    )
    //Административные расходы
    const administrativeExpenses = await this.getChartData(
      IIncomeQueryCodes.administrativeExpenses,
      'Административные расходы'
    )
    //Командировочные и транспортные расходы
    const travelExpenses = await this.getChartData(
      IIncomeQueryCodes.travelExpenses,
      'Командировочные и транспортные расходы'
    )
    //Расходы на износ
    const wearCosts = await this.getChartData(IIncomeQueryCodes.wearCosts, 'Расходы на износ')

    //Аренда и содержания
    const rentAndMaintenance = await this.getChartData(
      IIncomeQueryCodes.rentAndMaintenance,
      'Аренда и содержания'
    )
    return [
      employeeExpenses,
      possibleLosses,
      administrativeExpenses,
      travelExpenses,
      wearCosts,
      rentAndMaintenance
    ]
  }

  async getRows() {
    await this.getDates()
    // АНАЛИЗ ПРОЦЕНТНОГО ДОХОДА
    const income = await this.getIncome()
    // АНАЛИЗ БЕСПРОЦЕНТНОГО ДОХОДА
    const incomeNoPercent = await this.getIncomeNoPercent()
    // АНАЛИЗ ПРОЦЕНТНОГО РАСХОДА
    const consumption = await this.getConsumption()
    // АНАЛИЗ БЕСПРОЦЕНТНОГО РАСХОДА
    const consumptionNoPercent = await this.getConsumptionNoPercent()
    return [income, incomeNoPercent, consumption, consumptionNoPercent]
  }
}
