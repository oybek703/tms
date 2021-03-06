import MainClass from '../mainClass'
import { formatDate } from '../dateFormatter'

/* eslint-disable camelcase */
class DashboardMonthlyMainClass extends MainClass {
    firstDate: string
    secondDate: string
    dateOption: string

    constructor(firstDate: string, secondDate: string, dateOption: string) {
      super(firstDate)
      const { selectedDate: formattedFirstDate } = formatDate(firstDate)
      const { selectedDate: formattedSecondDate } = formatDate(secondDate)
      this.firstDate = formattedFirstDate
      this.secondDate = formattedSecondDate
      this.dateOption = dateOption
    }

    chooseQuery(onlyTwoQuery: string, allQuery: string, monthQuery: string) {
      switch (this.dateOption) {
        case 'all':
          return allQuery
        case 'month':
          return monthQuery
        default:
          return onlyTwoQuery
      }
    }

    dashboardMonthlyQuery(whereQuery = '1=1') {
      const onlyTwo = `SELECT 
                               DAT,
                               ROUND(ABS(SUM(SALDO_ACTIVE_EQ_IN + SALDO_PASSIVE_EQ_IN) / POWER(10, 8)), 2) AS SUM
                            FROM   IBS.SVOD_SALDO_DUMP@IABS
                            WHERE  DAT IN ( TO_DATE('${this.firstDate}', 'dd.mm.yyyy'),
                                        TO_DATE('${this.secondDate}', 'dd.mm.yyyy') )
                            AND (${whereQuery})
                            GROUP  BY DAT ORDER BY DAT`
      const all = `SELECT 
                           DAT,
                           TO_CHAR(DAT, 'DD.MM.YYYY') DATE_VALUE,
                           ROUND(ABS(SUM(SALDO_ACTIVE_EQ_IN + SALDO_PASSIVE_EQ_IN) / POWER(10, 8)), 2) AS SUM
                        FROM   IBS.SVOD_SALDO_DUMP@IABS
                        WHERE  DAT BETWEEN TO_DATE('${this.firstDate}', 'dd.mm.yyyy') AND
                                    TO_DATE('${this.secondDate}', 'dd.mm.yyyy') 
                        AND (${whereQuery})
                        GROUP  BY DAT ORDER BY DAT`
      const month = `SELECT
                                DAT,
                                TO_CHAR(TRUNC(ADD_MONTHS(DAT, 1), 'MM'), 'DD.MM.YYYY') MONTH_BEGIN,
                                ROUND(ABS(SUM(SALDO_ACTIVE_EQ_IN + SALDO_PASSIVE_EQ_IN) / POWER(10, 8)), 2) AS SUM
                            FROM   IBS.SVOD_SALDO_DUMP@IABS
                            WHERE  DAT IN (SELECT MAX(DAT)
                                           FROM   IBS.SVOD_SALDO_DUMP@IABS
                                           WHERE  DAT BETWEEN TO_DATE('${this.firstDate}', 'DD.MM.YYYY') AND
                                                      TO_DATE('${this.secondDate}', 'DD.MM.YYYY')
                                           GROUP  BY EXTRACT(YEAR FROM DAT),
                                                     EXTRACT(MONTH FROM DAT) 
                            UNION
                      SELECT TO_DATE('${this.firstDate}', 'DD.MM.YYYY')
                      FROM DUAL)
                              AND (${whereQuery})
                            GROUP  BY DAT ORDER BY DAT`
      return this.chooseQuery(onlyTwo, all, month)
    }

    currentProfitQuery() {
      const onlyTwo = `SELECT OPER_DAY      DAT,
                           SELECTED_DATE_IN SUM
                    FROM   MAININDICATORS
                    WHERE  OPER_DAY IN ( TO_DATE('${this.firstDate}', 'DD.MM.YYYY'),
                                         TO_DATE('${this.secondDate}', 'DD.MM.YYYY') )
                      AND ROLE = 'C_P' ORDER BY DAT`
      const all = `SELECT OPER_DAY      DAT,
                           TO_CHAR(OPER_DAY, 'DD.MM.YYYY') DATE_VALUE,
                           SELECTED_DATE_IN SUM
                    FROM   MAININDICATORS
                    WHERE  OPER_DAY BETWEEN TO_DATE('${this.firstDate}', 'DD.MM.YYYY') AND
                                         TO_DATE('${this.secondDate}', 'DD.MM.YYYY') 
                      AND ROLE = 'C_P' ORDER BY DAT`
      const month = `SELECT OPER_DAY DAT,
                           TRUNC(ADD_MONTHS(OPER_DAY, 1), 'MM') AS MONTH_BEGIN,
                           SELECTED_DATE_IN SUM
                    FROM   MAININDICATORS
                    WHERE  OPER_DAY IN (SELECT MAX(OPER_DAY)
                                        FROM   MAININDICATORS
                                        WHERE  OPER_DAY BETWEEN TO_DATE('${this.firstDate}', 'DD.MM.YYYY')
                                                                AND
                                                                TO_DATE('${this.secondDate}', 'DD.MM.YYYY')
                                        GROUP  BY EXTRACT(MONTH FROM OPER_DAY),
                                                  EXTRACT(YEAR FROM OPER_DAY)
                                        UNION
                                        SELECT TO_DATE('${this.firstDate}', 'DD.MM.YYYY')
                                        FROM   DUAL)
                           AND ROLE = 'C_P'`
      return this.chooseQuery(onlyTwo, all, month)
    }

    capitalQuery(role = 'R_C') {
      const onlyTwo = `SELECT OPER_DAY DAT,
                               ROUND(EQUIVAL / POWER(10, 6), 2) SUM
                        FROM REGULATORYCAPITAL
                        WHERE OPER_DAY IN (TO_DATE('${this.firstDate}', 'DD.MM.YYYY'),
                                           TO_DATE('${this.secondDate}', 'DD.MM.YYYY')) AND ROLE='${role}'`
      const all = `SELECT OPER_DAY                         DAT,
                           TO_CHAR(OPER_DAY, 'DD.MM.YYYY') DATE_VALUE,
                           ROUND(EQUIVAL / POWER(10, 6), 2) SUM
                    FROM REGULATORYCAPITAL
                    WHERE OPER_DAY BETWEEN TO_DATE('${this.firstDate}', 'DD.MM.YYYY') AND
                                       TO_DATE('${this.secondDate}', 'DD.MM.YYYY') AND ROLE='${role}'`
      const month = `SELECT OPER_DAY DAT,
                           TRUNC(ADD_MONTHS(OPER_DAY, 1), 'MM') AS MONTH_BEGIN,
                           ROUND(EQUIVAL / POWER(10, 6), 2)        SUM
                    FROM REGULATORYCAPITAL
                    WHERE OPER_DAY IN (
                        SELECT MAX(OPER_DAY)
                        FROM REGULATORYCAPITAL
                        WHERE OPER_DAY BETWEEN TO_DATE('${this.firstDate}', 'DD.MM.YYYY')
                                  AND
                                  TO_DATE('${this.secondDate}', 'DD.MM.YYYY')
                        GROUP BY EXTRACT(YEAR FROM OPER_DAY), EXTRACT(MONTH FROM OPER_DAY)
                        UNION
                        SELECT TO_DATE('${this.firstDate}', 'DD.MM.YYYY')
                        FROM DUAL) AND ROLE='${role}' ORDER BY DAT`
      return this.chooseQuery(onlyTwo, all, month)
    }

    ROAQuery() {
      const onlyTwo = `SELECT OPER_DAY DAT,
                                (SELECT ABS(ROUND((SELECT SUM(SALDO_ACTIVE + SALDO_PASSIVE)
                                                   FROM IBS.SVOD_SALDO_DUMP@IABS
                                                   WHERE DAT = OPER_DAY
                                                     AND (BAL LIKE '4%'
                                                       OR BAL LIKE '5%'
                                                       OR BAL = '31206')) * (365 / TO_NUMBER(OPER_DAY - TRUNC(OPER_DAY, 'YYYY'))) /
                                                  (SELECT SUM(SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ)
                                                   FROM IBS.SVOD_SALDO_DUMP@IABS
                                                   WHERE DAT = OPER_DAY
                                                     AND (BAL LIKE '1%' AND SUBSTR(BAL, 1, 3) NOT IN ('161', '175'))) * 100, 2))
                                 FROM DUAL) AS SUM
                         FROM IBS.DAY_OPERATIONAL@IABS
                         WHERE DAY_STATUS = 1
                           AND (OPER_DAY = TO_DATE('${this.firstDate}', 'DD.MM.YYYY')
                             OR OPER_DAY = TO_DATE('${this.secondDate}', 'DD.MM.YYYY'))
                         ORDER BY OPER_DAY`
      const all = `SELECT OPER_DAY                        DAT,
                           TO_CHAR(OPER_DAY, 'DD.MM.YYYY') DATE_VALUE,
                           (SELECT ABS(ROUND((SELECT SUM(SALDO_ACTIVE + SALDO_PASSIVE)
                                              FROM IBS.SVOD_SALDO_DUMP@IABS
                                              WHERE DAT = OPER_DAY
                                                AND (BAL LIKE '4%'
                                                  OR BAL LIKE '5%'
                                                  OR BAL = '31206')) * (365 / TO_NUMBER(OPER_DAY - TRUNC(OPER_DAY, 'YYYY'))) /
                                             (SELECT SUM(SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ)
                                              FROM IBS.SVOD_SALDO_DUMP@IABS
                                              WHERE DAT = OPER_DAY
                                                AND (BAL LIKE '1%' AND SUBSTR(BAL, 1, 3) NOT IN ('161', '175'))) * 100, 2))
                            FROM DUAL) AS                  SUM
                    FROM IBS.DAY_OPERATIONAL@IABS
                    WHERE DAY_STATUS = 1
                      AND OPER_DAY BETWEEN TO_DATE('${this.firstDate}', 'DD.MM.YYYY') AND TO_DATE('${this.secondDate}', 'DD.MM.YYYY')
                    ORDER BY OPER_DAY`
      const month = `SELECT OPER_DAY                                DAT,
                           TRUNC(ADD_MONTHS(OPER_DAY, 1), 'MM') AS MONTH_BEGIN,
                           (SELECT ABS(ROUND((SELECT SUM(SALDO_ACTIVE + SALDO_PASSIVE)
                                              FROM IBS.SVOD_SALDO_DUMP@IABS
                                              WHERE DAT = OPER_DAY
                                                AND (BAL LIKE '4%'
                                                  OR BAL LIKE '5%'
                                                  OR BAL = '31206')) * (365 / TO_NUMBER(OPER_DAY - TRUNC(OPER_DAY, 'YYYY'))) /
                                             (SELECT SUM(SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ)
                                              FROM IBS.SVOD_SALDO_DUMP@IABS
                                              WHERE DAT = OPER_DAY
                                                AND (BAL LIKE '1%' AND SUBSTR(BAL, 1, 3) NOT IN ('161', '175'))) * 100, 2))
                            FROM DUAL)                          AS SUM
                    FROM IBS.DAY_OPERATIONAL@IABS
                    WHERE DAY_STATUS = 1
                      AND OPER_DAY IN (SELECT MAX(OPER_DAY)
                                       FROM IBS.DAY_OPERATIONAL@IABS
                                       WHERE DAY_STATUS = 1
                                         AND OPER_DAY BETWEEN 
                                             TO_DATE('${this.firstDate}', 'DD.MM.YYYY') 
                                             AND 
                                             TO_DATE('${this.secondDate}', 'DD.MM.YYYY')
                                       GROUP BY EXTRACT(MONTH FROM OPER_DAY), EXTRACT(MONTH FROM OPER_DAY))
                    ORDER BY OPER_DAY`
      return this.chooseQuery(onlyTwo, all, month)
    }

    ROEQuery() {
      const onlyTwo = `SELECT OPER_DAY DAT,
                                (SELECT ABS(ROUND((SELECT SUM(SALDO_ACTIVE + SALDO_PASSIVE)
                                                   FROM IBS.SVOD_SALDO_DUMP@IABS
                                                   WHERE DAT = OPER_DAY
                                                     AND (BAL LIKE '4%'
                                                       OR BAL LIKE '5%'
                                                       OR BAL = '31206')) * (365 / TO_NUMBER(OPER_DAY - TRUNC(OPER_DAY, 'YYYY'))) /
                                                  (SELECT SUM(SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ)
                                                   FROM IBS.SVOD_SALDO_DUMP@IABS
                                                   WHERE DAT = OPER_DAY
                                                     AND (BAL LIKE '3%')) * 100, 2))
                                 FROM DUAL) AS SUM
                         FROM IBS.DAY_OPERATIONAL@IABS
                         WHERE DAY_STATUS = 1
                           AND (OPER_DAY = TO_DATE('${this.firstDate}', 'DD.MM.YYYY')
                             OR OPER_DAY = TO_DATE('${this.secondDate}', 'DD.MM.YYYY'))
                         ORDER BY OPER_DAY`
      const all = `SELECT OPER_DAY DAT,
                            TO_CHAR(OPER_DAY, 'DD.MM.YYYY') DATE_VALUE,
                            (SELECT ABS(ROUND((SELECT SUM(SALDO_ACTIVE + SALDO_PASSIVE)
                                               FROM IBS.SVOD_SALDO_DUMP@IABS
                                               WHERE DAT = OPER_DAY
                                                 AND (BAL LIKE '4%'
                                                   OR BAL LIKE '5%'
                                                   OR BAL = '31206')) * (365 / TO_NUMBER(OPER_DAY - TRUNC(OPER_DAY, 'YYYY'))) /
                                              (SELECT SUM(SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ)
                                               FROM IBS.SVOD_SALDO_DUMP@IABS
                                               WHERE DAT = OPER_DAY
                                                 AND (BAL LIKE '3%')) * 100, 2))
                             FROM DUAL) AS SUM
                     FROM IBS.DAY_OPERATIONAL@IABS
                     WHERE DAY_STATUS = 1
                       AND OPER_DAY BETWEEN TO_DATE('${this.firstDate}', 'DD.MM.YYYY') AND TO_DATE('${this.secondDate}', 'DD.MM.YYYY')
                     ORDER BY OPER_DAY`
      const month = `SELECT OPER_DAY DAT,
                              TRUNC(ADD_MONTHS(OPER_DAY, 1), 'MM') AS MONTH_BEGIN,
                              (SELECT ABS(ROUND((SELECT SUM(SALDO_ACTIVE + SALDO_PASSIVE)
                                                 FROM IBS.SVOD_SALDO_DUMP@IABS
                                                 WHERE DAT = OPER_DAY
                                                   AND (BAL LIKE '4%'
                                                     OR BAL LIKE '5%'
                                                     OR BAL = '31206')) * (365 / TO_NUMBER(OPER_DAY - TRUNC(OPER_DAY, 'YYYY'))) /
                                                (SELECT SUM(SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ)
                                                 FROM IBS.SVOD_SALDO_DUMP@IABS
                                                 WHERE DAT = OPER_DAY
                                                   AND (BAL LIKE '3%')) * 100, 2))
                               FROM DUAL) AS SUM
                       FROM IBS.DAY_OPERATIONAL@IABS
                       WHERE DAY_STATUS = 1
                         AND OPER_DAY IN (SELECT MAX(OPER_DAY)
                                          FROM IBS.DAY_OPERATIONAL@IABS
                                          WHERE DAY_STATUS = 1
                                            AND OPER_DAY BETWEEN 
                                                TO_DATE('${this.firstDate}', 'DD.MM.YYYY') 
                                                AND 
                                                TO_DATE('${this.secondDate}', 'DD.MM.YYYY')
                                          GROUP BY EXTRACT(MONTH FROM OPER_DAY), EXTRACT(MONTH FROM OPER_DAY))
                       ORDER BY OPER_DAY`
      return this.chooseQuery(onlyTwo, all, month)
    }

    createData(count: string, state: string, data: any = [], isTableHead: boolean = false, withPercent?: boolean) {
      if (!data.length) return { count, state, data: [], differ: 0, differ_percent: 0, isTableHead }
      const clonedData = [...data]
      const differ = +(clonedData[clonedData.length - 1]['SUM'] - clonedData[0]['SUM']).toFixed(2)
      const differPercent = +((clonedData[clonedData.length - 1]['SUM'] / clonedData[0]['SUM'] - 1) * 100).toFixed(2)
      return {
        count,
        state,
        data,
        differ,
        differ_percent: differPercent,
        isTableHead,
        withPercent
      }
    }

    async getOneRow(count: string, state: string, whereQuery: string, isTableHead: boolean = false) {
      const data = await this.getDataInDates(
          '',
          this.dashboardMonthlyQuery.bind(this, whereQuery),
          true
      )
      return this.createData(count, state, data, isTableHead)
    }

    async all_actives() {/* ???????????? (??????????) */
      return await this.getOneRow(
          '1',
          '???????????? (??????????)',
          `BAL LIKE '1%' AND BAL NOT LIKE '161%' AND BAL NOT LIKE '175%'`,
          true
      )
    } /* ???????????? (??????????) */

    async authorized_capital() {/* ???????????????? ?????????????? */
      return await this.getOneRow(
          '2',
          '???????????????? ??????????????',
          `BAL IN ('30306', '30312', '30318')`,
          true
      )
    } /* ???????????????? ?????????????? */

    async own_capital() {/* ?????????????????????? ?????????????? */
      return await this.getOneRow(
          '3',
          '?????????????????????? ??????????????',
          `BAL LIKE '3%'`,
          true
      )
    } /* ?????????????????????? ?????????????? */

    async current_profit() {/* ???????????? ?????????????? */
      const data = await this.getDataInDates(
          '',
          this.currentProfitQuery.bind(this),
          true
      )
      return this.createData('4', '???????????? ??????????????', data, true)
    } /* ???????????? ?????????????? */

    async regular_capital() {/* ???????????????????????? ?????????????? */
      const data = await this.getDataInDates(
          '',
          this.capitalQuery.bind(this, 'R_C'),
          true
      )
      return this.createData('5', '???????????????????????? ??????????????', data, true)
    } /* ???????????????????????? ?????????????? */

    async capital_first_degree() {/* ?????????????? 1-???? ???????????? */
      const data = await this.getDataInDates(
          '',
          this.capitalQuery.bind(this, 'T_A_F_C'),
          true
      )
      return this.createData('6', '?????????????? 1-???? ????????????', data, true)
    } /* ?????????????? 1-???? ???????????? */

    // TODO ?????????????????????? ???????????????????????? ????????????????
    // TODO ?????????????????????? ???????????????????????? ????????????????(1-???? ????????????) STATIC DATA YET
    async capital_adequacy_ratio() {/* ?????????????????????? ???????????????????????? ???????????????? */
      const data = await this.getDataInDates(
          '',
          this.currentProfitQuery.bind(this),
          true
      )
      const tempData = [14.63, 14.37]
      const temporaryData = data.map((data: any, index: number) => ({ ...data, SUM: tempData[index] }))
      return this.createData('7', '?????????????????????? ???????????????????????? ????????????????', temporaryData, true)
    } /* ?????????????????????? ???????????????????????? ???????????????? */

    async roa() {/* ?????????????????????????? ?????????????? (ROA) */
      const data = await this.getDataInDates(
          '',
          this.ROAQuery.bind(this),
          true
      )
      return this.createData('8', '?????????????????????????? ?????????????? (ROA)', data, true)
    } /* ?????????????????????????? ?????????????? (ROA) */

    async roe() {/* ?????????????????????????? ???????????????? (ROE) */
      const data = await this.getDataInDates(
          '',
          this.ROEQuery.bind(this),
          true
      )
      return this.createData('9', '?????????????????????????? ???????????????? (ROE)', data, true)
    } /* ?????????????????????????? ???????????????? (ROE) */

    async total_liabilities() {/* ?????????????????????????? (??????????) */
      return await this.getOneRow(
          '1',
          '?????????????????????????? (??????????)',
          `BAL LIKE '2%' AND BAL NOT LIKE '222%'`,
          true
      )
    } /* ?????????????????????????? (??????????) */

    async legals_deposits() {/* ???????????????? ????. ?????? */
      return await this.getOneRow(
          '2',
          '???????????????? ????. ??????',
          `BAL LIKE '202%' OR BAL LIKE '204%' OR BAL LIKE '206%' OR BAL LIKE '226%'`,
          true
      )
    } /* ???????????????? ????. ?????? */

    async demand_legals_deposits() {/* ???????????????? ???? ?????????????????????????? ????. ?????? */
      return await this.getOneRow(
          '2.1',
          '???????????????? ???? ?????????????????????????? ????. ??????',
          `BAL LIKE '202%' AND BAL != '20206'`
      )
    } /* ???????????????? ???? ?????????????????????????? ????. ?????? */

    async time_legals_deposits() {/* ?????????????? ???????????????? ????. ?????? */
      return await this.getOneRow(
          '2.2',
          '?????????????? ???????????????? ????. ??????',
          `BAL LIKE '206%' AND BAL != '20606'`
      )
    } /* ?????????????? ???????????????? ????. ?????? */

    async physicals_deposits() {/* ???????????????? ??????. ?????? */
      return await this.getOneRow(
          '3',
          '???????????????? ??????. ??????',
          `BAL IN ('20206', '20406', '20606')`,
          true
      )
    } /* ???????????????? ??????. ?????? */

    async demand_physicals_deposits() {/* ???????????????? ???? ?????????????????????????? ??????. ?????? */
      return await this.getOneRow(
          '3.1',
          '???????????????? ???? ?????????????????????????? ??????. ??????',
          `BAL='20206'`
      )
    } /* ???????????????? ???? ?????????????????????????? ??????. ?????? */

    async time_physicals_deposits() {/* ?????????????? ???????????????? ??????. ?????? */
      return await this.getOneRow(
          '3.2',
          '?????????????? ???????????????? ??????. ??????',
          `BAL='20606'`
      )
    } /* ?????????????? ???????????????? ??????. ?????? */

    async external_funding() {/* ?????????????? ???????????????????????? */
      return await this.getOneRow(
          '4',
          '?????????????? ????????????????????????',
          `BAL LIKE '216%' OR BAL LIKE '220%'`,
          true
      )
    } /* ?????????????? ???????????????????????? */

    // TODO -???????????????????????????????? ???????????????????? ????????????

    async national_curr() {/* ?? ?????? ?????????? ?? ??????.???????????? */
      return await this.getOneRow(
          '4.1',
          '?? ?????? ?????????? ?? ??????.????????????',
          `BAL LIKE '216%' OR BAL LIKE '220%' AND VAL = '000'`
      )
    } /* ?? ?????? ?????????? ?? ??????.???????????? */

    // TODO -???????????????????????????????? ???????????????????? ????????????

    async foreign_curr() {/* ?? ?????? ?????????? ?? ?????????????????????? ???????????? */
      return await this.getOneRow(
          '4.2',
          '?? ?????? ?????????? ?? ?????????????????????? ????????????',
          `BAL LIKE '216%' OR BAL LIKE '220%' AND VAL != '000'`
      )
    } /* ?? ?????? ?????????? ?? ?????????????????????? ???????????? */

    // TODO -???????????????????????????????? ???????????????????? ????????????

    async getRows() {
      const [
        allActives,
        authorizedCapital,
        ownCapital,
        currentProfit,
        regularCapital,
        capitalFirstDegree,
        ROA, ROE,
        capitalAdequacyRatio,
        totalLiabilities,
        legalsDeposits,
        demandLegalsDeposits,
        timeLegalsDeposits,
        physicalsDeposits,
        demandPhysicalsDeposits,
        timePhysicalsDeposits,
        externalFunding,
        nationalCurr,
        foreignCurr
      ] = await Promise.all([
        this.all_actives(),
        this.authorized_capital(),
        this.own_capital(),
        this.current_profit(),
        this.regular_capital(),
        this.capital_first_degree(),
        this.roa(), this.roe(),
        this.capital_adequacy_ratio(),
        this.total_liabilities(),
        this.legals_deposits(),
        this.demand_legals_deposits(),
        this.time_legals_deposits(),
        this.physicals_deposits(),
        this.demand_physicals_deposits(),
        this.time_physicals_deposits(),
        this.external_funding(),
        this.national_curr(),
        this.foreign_curr()
      ])
      const capital = [
        allActives,
        authorizedCapital,
        ownCapital,
        currentProfit,
        regularCapital,
        capitalFirstDegree,
        capitalAdequacyRatio,
        ROA, ROE
      ]
      const liquidity = [
        totalLiabilities,
        legalsDeposits,
        demandLegalsDeposits,
        timeLegalsDeposits,
        physicalsDeposits,
        demandPhysicalsDeposits,
        timePhysicalsDeposits,
        externalFunding,
        nationalCurr,
        foreignCurr
      ]
      return {
        // ??????????????
        capital,
        //  ??????????????????????
        liquidity
      }
    }
}

export default DashboardMonthlyMainClass
