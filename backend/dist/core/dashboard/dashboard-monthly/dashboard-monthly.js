"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardMonthly = void 0;
const base_1 = require("../../base");
class DashboardMonthly extends base_1.Base {
    constructor(firstDate, secondDate, oracleService, dateOption) {
        super(firstDate, oracleService);
        this.firstDate = firstDate;
        this.secondDate = secondDate;
        this.dateOption = dateOption;
        this.chooseQuery = (onlyTwoQuery, allQuery, monthQuery) => {
            switch (this.dateOption) {
                case 'all':
                    return allQuery;
                case 'month':
                    return monthQuery;
                default:
                    return onlyTwoQuery;
            }
        };
        this.dashboardMonthlyQuery = (whereQuery = '1=1') => {
            const onlyTwo = `SELECT DAT                                                                         AS "dat",
                            ROUND(ABS(SUM(SALDO_ACTIVE_EQ_IN + SALDO_PASSIVE_EQ_IN) / POWER(10, 8)), 2) AS "sum"
                     FROM IBS.SVOD_SALDO_DUMP@IABS
                     WHERE DAT IN (DATE '${this.firstDate}',
                                   DATE '${this.secondDate}')
                       AND (${whereQuery})
                     GROUP BY DAT
                     ORDER BY DAT`;
            const all = `SELECT DAT                                                                         AS "dat",
                        TO_CHAR(DAT, 'DD.MM.YYYY')                                                  AS "dateValue",
                        ROUND(ABS(SUM(SALDO_ACTIVE_EQ_IN + SALDO_PASSIVE_EQ_IN) / POWER(10, 8)), 2) AS "sum"
                 FROM IBS.SVOD_SALDO_DUMP@IABS
                 WHERE DAT BETWEEN DATE '${this.firstDate}' AND
                     DATE '${this.secondDate}'
                   AND (${whereQuery})
                 GROUP BY DAT
                 ORDER BY DAT`;
            const month = `SELECT DAT                                                                         AS "dat",
                          TO_CHAR(TRUNC(ADD_MONTHS(DAT, 1), 'MM'), 'DD.MM.YYYY')                      AS "monthBegin",
                          ROUND(ABS(SUM(SALDO_ACTIVE_EQ_IN + SALDO_PASSIVE_EQ_IN) / POWER(10, 8)), 2) AS "sum"
                   FROM IBS.SVOD_SALDO_DUMP@IABS
                   WHERE DAT IN (SELECT MAX(DAT)
                                 FROM IBS.SVOD_SALDO_DUMP@IABS
                                 WHERE DAT BETWEEN DATE '${this.firstDate}' AND
                                           DATE '${this.secondDate}'
                                 GROUP BY EXTRACT(YEAR FROM DAT),
                                          EXTRACT(MONTH FROM DAT)
                                 UNION
                                 SELECT DATE '${this.firstDate}'
                                 FROM DUAL)
                     AND (${whereQuery})
                   GROUP BY DAT
                   ORDER BY DAT`;
            return this.chooseQuery(onlyTwo, all, month);
        };
        this.currentProfitQuery = () => {
            const onlyTwo = `SELECT OPER_DAY         AS "dat",
                            SELECTED_DATE_IN AS "sum"
                     FROM MAININDICATORS
                     WHERE OPER_DAY IN (DATE '${this.firstDate}',
                                        DATE '${this.secondDate}')
                       AND ROLE = 'C_P'
                     ORDER BY "dat"`;
            const all = `SELECT OPER_DAY                        AS "dat",
                        TO_CHAR(OPER_DAY, 'DD.MM.YYYY') AS "dateValue",
                        SELECTED_DATE_IN                AS "sum"
                 FROM MAININDICATORS
                 WHERE OPER_DAY BETWEEN DATE '${this.firstDate}' AND
                     DATE '${this.secondDate}'
                   AND ROLE = 'C_P'
                 ORDER BY "dat"`;
            const month = `SELECT OPER_DAY                             AS "dat",
                          TRUNC(ADD_MONTHS(OPER_DAY, 1), 'MM') AS "monthBegin",
                          SELECTED_DATE_IN                     AS "sum"
                   FROM MAININDICATORS
                   WHERE OPER_DAY IN (SELECT MAX(OPER_DAY)
                                      FROM MAININDICATORS
                                      WHERE OPER_DAY BETWEEN DATE '${this.firstDate}'
                                                AND
                                                DATE '${this.secondDate}'
                                      GROUP BY EXTRACT(MONTH FROM OPER_DAY),
                                               EXTRACT(YEAR FROM OPER_DAY)
                                      UNION
                                      SELECT DATE '${this.firstDate}'
                                      FROM DUAL)
                     AND ROLE = 'C_P'`;
            return this.chooseQuery(onlyTwo, all, month);
        };
        this.capitalQuery = (role = 'R_C') => {
            const onlyTwo = `SELECT OPER_DAY                         AS "dat",
                            ROUND(EQUIVAL / POWER(10, 6), 2) AS "sum"
                     FROM REGULATORYCAPITAL
                     WHERE OPER_DAY IN (DATE '${this.firstDate}',
                                        DATE '${this.secondDate}')
                       AND ROLE = '${role}'`;
            const all = `SELECT OPER_DAY                         AS "dat",
                        TO_CHAR(OPER_DAY, 'DD.MM.YYYY')  AS "dateValue",
                        ROUND(EQUIVAL / POWER(10, 6), 2) AS "sum"
                 FROM REGULATORYCAPITAL
                 WHERE OPER_DAY BETWEEN DATE '${this.firstDate}' AND
                     DATE '${this.secondDate}'
                   AND ROLE = '${role}'`;
            const month = `SELECT OPER_DAY                             AS "dat",
                          TRUNC(ADD_MONTHS(OPER_DAY, 1), 'MM') AS "monthBegin",
                          ROUND(EQUIVAL / POWER(10, 6), 2)     AS "sum"
                   FROM REGULATORYCAPITAL
                   WHERE OPER_DAY IN (SELECT MAX(OPER_DAY)
                                      FROM REGULATORYCAPITAL
                                      WHERE OPER_DAY BETWEEN DATE '${this.firstDate}'
                                                AND
                                                DATE '${this.secondDate}'
                                      GROUP BY EXTRACT(YEAR FROM OPER_DAY), EXTRACT(MONTH FROM OPER_DAY)
                                      UNION
                                      SELECT DATE '${this.firstDate}'
                                      FROM DUAL)
                     AND ROLE = '${role}'
                   ORDER BY DAT`;
            return this.chooseQuery(onlyTwo, all, month);
        };
        this.ROAQuery = () => {
            const onlyTwo = `SELECT OPER_DAY    AS "dat",
                            (SELECT ABS(ROUND((SELECT SUM(SALDO_ACTIVE + SALDO_PASSIVE)
                                               FROM IBS.SVOD_SALDO_DUMP@IABS
                                               WHERE DAT = OPER_DAY
                                                 AND (BAL LIKE '4%'
                                                   OR BAL LIKE '5%'
                                                   OR BAL = '31206')) *
                                              (365 / TO_NUMBER(OPER_DAY - TRUNC(OPER_DAY, 'YYYY'))) /
                                              (SELECT SUM(SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ)
                                               FROM IBS.SVOD_SALDO_DUMP@IABS
                                               WHERE DAT = OPER_DAY
                                                 AND (BAL LIKE '1%' AND SUBSTR(BAL, 1, 3) NOT IN ('161', '175'))) * 100,
                                              2))
                             FROM DUAL) AS "sum"
                     FROM IBS.DAY_OPERATIONAL@IABS
                     WHERE DAY_STATUS = 1
                       AND (OPER_DAY = DATE '${this.firstDate}'
                         OR OPER_DAY = DATE '${this.secondDate}')
                     ORDER BY OPER_DAY`;
            const all = `SELECT OPER_DAY                        AS "dat",
                        TO_CHAR(OPER_DAY, 'DD.MM.YYYY') AS "dateValue",
                        (SELECT ABS(ROUND((SELECT SUM(SALDO_ACTIVE + SALDO_PASSIVE)
                                           FROM IBS.SVOD_SALDO_DUMP@IABS
                                           WHERE DAT = OPER_DAY
                                             AND (BAL LIKE '4%'
                                               OR BAL LIKE '5%'
                                               OR BAL = '31206')) *
                                          (365 / TO_NUMBER(OPER_DAY - TRUNC(OPER_DAY, 'YYYY'))) /
                                          (SELECT SUM(SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ)
                                           FROM IBS.SVOD_SALDO_DUMP@IABS
                                           WHERE DAT = OPER_DAY
                                             AND (BAL LIKE '1%' AND SUBSTR(BAL, 1, 3) NOT IN ('161', '175'))) * 100, 2))
                         FROM DUAL)                     AS "sum"
                 FROM IBS.DAY_OPERATIONAL@IABS
                 WHERE DAY_STATUS = 1
                   AND OPER_DAY BETWEEN DATE '${this.firstDate}' AND DATE '${this.secondDate}'
                 ORDER BY OPER_DAY`;
            const month = `SELECT OPER_DAY                             AS "dat",
                          TRUNC(ADD_MONTHS(OPER_DAY, 1), 'MM') AS "monthBegin",
                          (SELECT ABS(ROUND((SELECT SUM(SALDO_ACTIVE + SALDO_PASSIVE)
                                             FROM IBS.SVOD_SALDO_DUMP@IABS
                                             WHERE DAT = OPER_DAY
                                               AND (BAL LIKE '4%'
                                                 OR BAL LIKE '5%'
                                                 OR BAL = '31206')) *
                                            (365 / TO_NUMBER(OPER_DAY - TRUNC(OPER_DAY, 'YYYY'))) /
                                            (SELECT SUM(SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ)
                                             FROM IBS.SVOD_SALDO_DUMP@IABS
                                             WHERE DAT = OPER_DAY
                                               AND (BAL LIKE '1%' AND SUBSTR(BAL, 1, 3) NOT IN ('161', '175'))) * 100,
                                            2))
                           FROM DUAL)                          AS "sum"
                   FROM IBS.DAY_OPERATIONAL@IABS
                   WHERE DAY_STATUS = 1
                     AND OPER_DAY IN (SELECT MAX(OPER_DAY)
                                      FROM IBS.DAY_OPERATIONAL@IABS
                                      WHERE DAY_STATUS = 1
                                        AND OPER_DAY BETWEEN
                                          DATE '${this.firstDate}'
                                          AND
                                          DATE '${this.secondDate}'
                                      GROUP BY EXTRACT(MONTH FROM OPER_DAY), EXTRACT(MONTH FROM OPER_DAY))
                   ORDER BY OPER_DAY`;
            return this.chooseQuery(onlyTwo, all, month);
        };
        this.ROEQuery = () => {
            const onlyTwo = `SELECT OPER_DAY    AS "dat",
                            (SELECT ABS(ROUND((SELECT SUM(SALDO_ACTIVE + SALDO_PASSIVE)
                                               FROM IBS.SVOD_SALDO_DUMP@IABS
                                               WHERE DAT = OPER_DAY
                                                 AND (BAL LIKE '4%'
                                                   OR BAL LIKE '5%'
                                                   OR BAL = '31206')) *
                                              (365 / TO_NUMBER(OPER_DAY - TRUNC(OPER_DAY, 'YYYY'))) /
                                              (SELECT SUM(SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ)
                                               FROM IBS.SVOD_SALDO_DUMP@IABS
                                               WHERE DAT = OPER_DAY
                                                 AND (BAL LIKE '3%')) * 100, 2))
                             FROM DUAL) AS "sum"
                     FROM IBS.DAY_OPERATIONAL@IABS
                     WHERE DAY_STATUS = 1
                       AND (OPER_DAY = DATE '${this.firstDate}'
                         OR OPER_DAY = DATE '${this.secondDate}')
                     ORDER BY OPER_DAY`;
            const all = `SELECT OPER_DAY                        AS "dat",
                        TO_CHAR(OPER_DAY, 'DD.MM.YYYY') AS "dateValue",
                        (SELECT ABS(ROUND((SELECT SUM(SALDO_ACTIVE + SALDO_PASSIVE)
                                           FROM IBS.SVOD_SALDO_DUMP@IABS
                                           WHERE DAT = OPER_DAY
                                             AND (BAL LIKE '4%'
                                               OR BAL LIKE '5%'
                                               OR BAL = '31206')) *
                                          (365 / TO_NUMBER(OPER_DAY - TRUNC(OPER_DAY, 'YYYY'))) /
                                          (SELECT SUM(SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ)
                                           FROM IBS.SVOD_SALDO_DUMP@IABS
                                           WHERE DAT = OPER_DAY
                                             AND (BAL LIKE '3%')) * 100, 2))
                         FROM DUAL)                     AS "sum"
                 FROM IBS.DAY_OPERATIONAL@IABS
                 WHERE DAY_STATUS = 1
                   AND OPER_DAY BETWEEN DATE '${this.firstDate}' AND DATE '${this.secondDate}'
                 ORDER BY OPER_DAY`;
            const month = `SELECT OPER_DAY                             AS "dat",
                          TRUNC(ADD_MONTHS(OPER_DAY, 1), 'MM') AS "monthBegin",
                          (SELECT ABS(ROUND((SELECT SUM(SALDO_ACTIVE + SALDO_PASSIVE)
                                             FROM IBS.SVOD_SALDO_DUMP@IABS
                                             WHERE DAT = OPER_DAY
                                               AND (BAL LIKE '4%'
                                                 OR BAL LIKE '5%'
                                                 OR BAL = '31206')) *
                                            (365 / TO_NUMBER(OPER_DAY - TRUNC(OPER_DAY, 'YYYY'))) /
                                            (SELECT SUM(SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ)
                                             FROM IBS.SVOD_SALDO_DUMP@IABS
                                             WHERE DAT = OPER_DAY
                                               AND (BAL LIKE '3%')) * 100, 2))
                           FROM DUAL)                          AS "sum"
                   FROM IBS.DAY_OPERATIONAL@IABS
                   WHERE DAY_STATUS = 1
                     AND OPER_DAY IN (SELECT MAX(OPER_DAY)
                                      FROM IBS.DAY_OPERATIONAL@IABS
                                      WHERE DAY_STATUS = 1
                                        AND OPER_DAY BETWEEN
                                          DATE '${this.firstDate}'
                                          AND
                                          DATE '${this.secondDate}'
                                      GROUP BY EXTRACT(MONTH FROM OPER_DAY), EXTRACT(MONTH FROM OPER_DAY))
                   ORDER BY OPER_DAY`;
            return this.chooseQuery(onlyTwo, all, month);
        };
        this.LDWeightedAvgRatesQuery = (codeCoa, currency) => {
            return () => {
                const _whereQuery = codeCoa === '204'
                    ? `COA LIKE '204%' AND COA <> '20406'`
                    : codeCoa === '216-220'
                        ? `(COA LIKE '220%' OR COA LIKE '216%')`
                        : `COA LIKE '206%' AND COA <> '20606'`;
                const _currency = currency === 'foreign'
                    ? `SUBSTR(ACCOUNT_CODE, 13, 3) != '000')`
                    : `SUBSTR(ACCOUNT_CODE, 13, 3) = '000')`;
                const onlyTwo = `SELECT DATE '${this.firstDate}'                                            AS "dat",
                              ROUND(SUM(PERCENT * SALDO_EQUIVAL_OUT) / SUM(SALDO_EQUIVAL_OUT), 2) AS "sum"
                       FROM (SELECT CONTRACT_ID,
                                    ACCOUNT_CODE,
                                    (SELECT /*+index_desc (sl UK_SALDO_ACCOUNT_DAY)*/
                                         SALDO_EQUIVAL_OUT
                                     FROM IBS.SALDO@IABS SL
                                     WHERE ACCOUNT_CODE = ACC.ACCOUNT_CODE
                                       AND OPER_DAY < DATE '${this.firstDate}'
                                       AND ROWNUM = 1)         AS SALDO_EQUIVAL_OUT,
                                    NVL((SELECT /*+index_desc(s DEP_CONTRACTS_PERCENT_RATE_PK)*/
                                             PERCENT_RATE
                                         FROM IBS.DEP_CONTRACTS_PERCENT_RATE@IABS S
                                         WHERE CONTRACT_ID = ACC.CONTRACT_ID
                                           AND DATE_VALIDATE < DATE '${this.firstDate}'
                                           AND ROWNUM = 1), 0) AS PERCENT
                             FROM (SELECT CONTRACT_ID,
                                          MAX(DATE_VALIDATE) AS DATE_VALIDATE,
                                          ACCOUNT_CODE
                                   FROM IBS.DEP_ACCOUNTS@IABS DEP_AC
                                            JOIN IBS.DEP_CONTRACTS@IABS DEP_CON
                                                 ON DEP_CON.ID = DEP_AC.CONTRACT_ID
                                   WHERE ${_whereQuery}
                                     AND DEP_CON.STATE NOT IN ('DELETE')
                                     AND ACCOUNT_TYPE = 1
                                     AND DEP_CON.DATE_BEGIN < DATE '${this.firstDate}'
                                     AND DEP_CON.DATE_END > DATE '${this.firstDate}'
                                   GROUP BY ACCOUNT_CODE, CONTRACT_ID) ACC
                             WHERE ${_currency}
                             UNION ALL
                             SELECT DATE '${this.secondDate}'                                           AS "dat",
                                    ROUND(SUM(PERCENT * SALDO_EQUIVAL_OUT) / SUM(SALDO_EQUIVAL_OUT), 2) AS "sum"
                             FROM (SELECT CONTRACT_ID,
                                          DATE_VALIDATE,
                                          ACCOUNT_CODE,
                                          (SELECT /*+index_desc (sl UK_SALDO_ACCOUNT_DAY)*/
                                               SALDO_EQUIVAL_OUT
                                           FROM IBS.SALDO@IABS SL
                                           WHERE ACCOUNT_CODE = ACC.ACCOUNT_CODE
                                             AND OPER_DAY < DATE '${this.secondDate}'
                                             AND ROWNUM = 1)         AS SALDO_EQUIVAL_OUT,
                                          NVL((SELECT /*+index_desc(s DEP_CONTRACTS_PERCENT_RATE_PK)*/
                                                   PERCENT_RATE
                                               FROM IBS.DEP_CONTRACTS_PERCENT_RATE@IABS S
                                               WHERE CONTRACT_ID = ACC.CONTRACT_ID
                                                 AND DATE_VALIDATE < DATE '${this.secondDate}'
                                                 AND ROWNUM = 1), 0) AS PERCENT
                                   FROM (SELECT CONTRACT_ID,
                                                MAX(DATE_VALIDATE) AS DATE_VALIDATE,
                                                ACCOUNT_CODE
                                         FROM IBS.DEP_ACCOUNTS@IABS DEP_AC
                                                  JOIN IBS.DEP_CONTRACTS@IABS DEP_CON
                                                       ON DEP_CON.ID = DEP_AC.CONTRACT_ID
                                         WHERE ${_whereQuery}
                                           AND DEP_CON.STATE NOT IN ('DELETE')
                                           AND ACCOUNT_TYPE = 1
                                           AND DEP_CON.DATE_BEGIN < DATE '${this.secondDate}'
                                           AND DEP_CON.DATE_END > DATE '${this.secondDate}'
                                         GROUP BY ACCOUNT_CODE,
                                                  CONTRACT_ID) ACC
                                   WHERE ${_currency}`;
                const all = onlyTwo;
                const month = onlyTwo;
                return this.chooseQuery(onlyTwo, all, month);
            };
        };
        this.PDWeightedAvgRatesQuery = (codeCoa, currency) => {
            return () => {
                const _whereQuery = codeCoa === '204' ? `AC.CODE_COA IN ('20406')` : `AC.CODE_COA IN ('20606')`;
                const _currency = currency === 'foreign' ? `CODE_CURRENCY != '000'` : `CODE_CURRENCY = '000'`;
                const onlyTwo = `SELECT DATE '${this.firstDate}'                                                    AS "dat",
                              NVL(ROUND(SUM(SALDO_EQUIVAL_OUT * PERCENT) / SUM(SALDO_EQUIVAL_OUT), 2), 0) AS "sum"
                       FROM (SELECT AC.CODE_CURRENCY,
                                    AC.ACC_EXTERNAL,
                                    (SELECT /*+index_desc(s UK_SALDO_ACCOUNT_DAY)*/ SALDO_EQUIVAL_OUT
                                     FROM IBS.SALDO@IABS S
                                     WHERE S.ACCOUNT_CODE = AC.CODE
                                       AND S.OPER_DAY <= DATE '${this.firstDate}'
                                       AND ROWNUM = 1) AS SALDO_EQUIVAL_OUT,
                                    P_DEP.PERCENT
                             FROM IBS.ACCOUNTS@IABS AC
                                      JOIN IBS.SBD_DEP_ACC@IABS P_DEP
                                           ON P_DEP.ACC = AC.ACC_EXTERNAL
                             WHERE ${_whereQuery}
                               AND SALDO_EQUIVAL_OUT <> 0
                               AND PERCENT <> 0
                               AND ${_currency})
                       UNION
                       SELECT DATE '${this.secondDate}'                                                   AS "dat",
                              NVL(ROUND(SUM(SALDO_EQUIVAL_OUT * PERCENT) / SUM(SALDO_EQUIVAL_OUT), 2), 0) AS "sum"
                       FROM (SELECT AC.CODE_CURRENCY,
                                    AC.ACC_EXTERNAL,
                                    (SELECT /*+index_desc(s UK_SALDO_ACCOUNT_DAY)*/ SALDO_EQUIVAL_OUT
                                     FROM IBS.SALDO@IABS S
                                     WHERE S.ACCOUNT_CODE = AC.CODE
                                       AND S.OPER_DAY <= DATE '${this.secondDate}'
                                       AND ROWNUM = 1) AS SALDO_EQUIVAL_OUT,
                                    P_DEP.PERCENT
                             FROM IBS.ACCOUNTS@IABS AC
                                      JOIN IBS.SBD_DEP_ACC@IABS P_DEP
                                           ON P_DEP.ACC = AC.ACC_EXTERNAL
                             WHERE ${_whereQuery}
                               AND SALDO_EQUIVAL_OUT <> 0
                               AND PERCENT <> 0
                               AND ${_currency})`;
                const all = onlyTwo;
                const month = onlyTwo;
                return this.chooseQuery(onlyTwo, all, month);
            };
        };
        this.dashboardLiquidityQuery = (role) => {
            return () => {
                const onlyTwo = `SELECT OPER_DAY AS "dat",
                              PERCENT  AS "sum"
                       FROM DASHBOARD_LIQUIDITY
                       WHERE ROLE LIKE '${role}'
                         AND OPER_DAY = TRUNC(DATE '${this.firstDate}', 'MM')
                       UNION ALL
                       SELECT OPER_DAY AS DAT,
                              PERCENT  AS SUM
                       FROM DASHBOARD_LIQUIDITY
                       WHERE ROLE LIKE '${role}'
                         AND OPER_DAY = TRUNC(DATE '${this.secondDate}', 'MM')`;
                const all = onlyTwo;
                const month = onlyTwo;
                return this.chooseQuery(onlyTwo, all, month);
            };
        };
    }
    formatQuery(whereQuery) {
        return '';
    }
    createData(count, indicatorName, data = [], isTableHead = false, withPercent) {
        if (!data.length)
            return { count, indicatorName, data: [], differ: 0, differPercent: 0, isTableHead };
        const clonedData = [...data];
        const differ = +(clonedData[clonedData.length - 1]['sum'] - clonedData[0]['sum']).toFixed(2);
        const calculatedDifferPercent = +((clonedData[clonedData.length - 1]['sum'] / clonedData[0]['sum'] - 1) *
            100).toFixed(2);
        return {
            count,
            indicatorName,
            data,
            differ,
            differPercent: calculatedDifferPercent,
            isTableHead,
            withPercent
        };
    }
    async getOneRow(count, state, whereQuery, isTableHead = false) {
        const data = await this.getDataInDates(undefined, this.dashboardMonthlyQuery.bind(this, whereQuery), true);
        return this.createData(count, state, data, isTableHead);
    }
    async all_actives() {
        return await this.getOneRow('1', 'Активы (всего)', `BAL LIKE '1%' AND BAL NOT LIKE '161%' AND BAL NOT LIKE '175%'`, true);
    }
    async authorized_capital() {
        return await this.getOneRow('2', 'Уставный Капитал', `BAL IN ('30306', '30312', '30318')`, true);
    }
    async own_capital() {
        return await this.getOneRow('3', 'Собственный капитал', `BAL LIKE '3%'`, true);
    }
    async current_profit() {
        const data = await this.getDataInDates(undefined, this.currentProfitQuery, true);
        return this.createData('4', 'Чистая прибыль', data, true);
    }
    async regular_capital() {
        const data = await this.getDataInDates(undefined, this.capitalQuery.bind(this, 'R_C'), true);
        return this.createData('5', 'Регулятивный капитал', data, true);
    }
    async capital_first_degree() {
        const data = await this.getDataInDates(undefined, this.capitalQuery.bind(this, 'T_A_F_C'), true);
        return this.createData('6', 'Капитал 1-го уровня', data, true);
    }
    async capital_adequacy_ratio() {
        const data = await this.getDataInDates(undefined, this.currentProfitQuery, true);
        const tempData = [14.63, 14.37];
        const temporaryData = data.map((data, index) => (Object.assign(Object.assign({}, data), { sum: tempData[index] })));
        return this.createData('7', 'Коэффициент адекватности капитала', temporaryData, true);
    }
    async roa() {
        const data = await this.getDataInDates(undefined, this.ROAQuery, true);
        return this.createData('8', 'Рентабельность активов (ROA)', data, true);
    }
    async roe() {
        const data = await this.getDataInDates(undefined, this.ROEQuery, true);
        return this.createData('9', 'Рентабельность капитала (ROE)', data, true);
    }
    async total_liabilities() {
        return await this.getOneRow('1', 'Обязательства (всего)', `BAL LIKE '2%' AND BAL NOT LIKE '222%'`, true);
    }
    async legals_deposits() {
        return await this.getOneRow('2', 'Депозиты юр. лиц', `BAL LIKE '202%' OR BAL LIKE '204%' OR BAL LIKE '206%' OR BAL LIKE '226%'`, true);
    }
    async demand_legals_deposits() {
        return await this.getOneRow('2.1', 'Депозиты до востребования юр. лиц', `BAL LIKE '202%' AND BAL != '20206'`);
    }
    async saving_legals_deposits() {
        return await this.getOneRow('2.2', 'Сберегательные депозиты юр. лиц', `BAL LIKE '204%' AND BAL != '20406'`);
    }
    async saving_legals_deposits_nat_curr() {
        return await this.getOneRow('2.2.1', ' - в нац. валюте', `BAL LIKE '204%' AND BAL != '20406' AND VAL='000'`);
    }
    async sld_weighted_avg_rates_NC() {
        const data = await this.getDataInDates(undefined, this.LDWeightedAvgRatesQuery(`204`, 'national'), true);
        return this.createData('2.2.2', '-средневзвешенные процентные ставки', data, false, true);
    }
    async saving_legals_deposits_for_curr() {
        return await this.getOneRow('2.2.3', ' - в иностранной. валюте', `BAL LIKE '204%' AND BAL != '20406' AND VAL!='000'`);
    }
    async sld_weighted_avg_rates_FC() {
        const data = await this.getDataInDates(undefined, this.LDWeightedAvgRatesQuery(`204`, 'foreign'), true);
        return this.createData('2.2.4', '-средневзвешенные процентные ставки', data, false, true);
    }
    async time_legals_deposits() {
        return await this.getOneRow('2.3', 'Срочные депозиты юр. лиц', `BAL LIKE '206%' AND BAL != '20606'`);
    }
    async time_legals_deposits_nat_curr() {
        return await this.getOneRow('2.3.1', ' - в нац. валюте', `BAL LIKE '206%' AND BAL != '20606' AND VAL='000'`);
    }
    async tld_weighted_avg_rates_NC() {
        const data = await this.getDataInDates(undefined, this.LDWeightedAvgRatesQuery(`206`, 'national'), true);
        return this.createData('2.3.2', '-средневзвешенные процентные ставки', data, false, true);
    }
    async time_legals_deposits_for_curr() {
        return await this.getOneRow('2.3.3', ' - в иностранной. валюте', `BAL LIKE '206%' AND BAL != '20606' AND VAL!='000'`);
    }
    async tld_weighted_avg_rates_FC() {
        const data = await this.getDataInDates(undefined, this.LDWeightedAvgRatesQuery(`206`, 'foreign'), true);
        return this.createData('2.3.4', '-средневзвешенные процентные ставки', data, false, true);
    }
    async physicals_deposits() {
        return await this.getOneRow('3', 'Депозиты физ. Лиц', `BAL IN ('20206', '20406', '20606')`, true);
    }
    async demand_physicals_deposits() {
        return await this.getOneRow('3.1', 'депозиты до востребования физ. лиц', `BAL='20206'`);
    }
    async saving_physicals_deposits() {
        return await this.getOneRow('3.2', 'Сберегательные депозиты физ. лиц', `BAL='20406'`);
    }
    async saving_physicals_deposits_nat_curr() {
        return await this.getOneRow('3.2.1', ' - в нац. валюте', `BAL='20406' AND VAL='000'`);
    }
    async spd_weighted_avg_rates_NC() {
        const data = await this.getDataInDates(undefined, this.PDWeightedAvgRatesQuery(`204`, 'national'), true);
        return this.createData('3.2.2', '-средневзвешенные процентные ставки', data, false, true);
    }
    async saving_physicals_deposits_for_curr() {
        return await this.getOneRow('3.2.3', ' - в иностранной. валюте', `BAL='20406' AND VAL!='000'`);
    }
    async spd_weighted_avg_rates_FC() {
        const data = await this.getDataInDates(undefined, this.PDWeightedAvgRatesQuery(`204`, 'foreign'), true);
        return this.createData('3.2.4', '-средневзвешенные процентные ставки', data, false, true);
    }
    async time_physicals_deposits() {
        return await this.getOneRow('3.3', 'срочные депозиты физ. лиц', `BAL='20606'`);
    }
    async time_physicals_deposits_nat_curr() {
        return await this.getOneRow('3.3.1', ' - в нац. валюте', `BAL='20606' AND VAL='000'`);
    }
    async tpd_weighted_avg_rates_NC() {
        const data = await this.getDataInDates(undefined, this.PDWeightedAvgRatesQuery(`206`, 'national'), true);
        return this.createData('3.3.2', '-средневзвешенные процентные ставки', data, false, true);
    }
    async time_physicals_deposits_for_curr() {
        return await this.getOneRow('3.3.3', ' - в иностранной. валюте', `BAL='20606' AND VAL!='000'`);
    }
    async tpd_weighted_avg_rates_FC() {
        const data = await this.getDataInDates(undefined, this.PDWeightedAvgRatesQuery(`206`, 'foreign'), true);
        return this.createData('3.3.4', '-средневзвешенные процентные ставки', data, false, true);
    }
    async external_funding() {
        return await this.getOneRow('4', 'Внешнее фондирование', `BAL LIKE '216%' OR BAL LIKE '220%'`, true);
    }
    async national_curr() {
        return await this.getOneRow('4.1', 'в том числе в нац.валюте', `BAL LIKE '216%' OR BAL LIKE '220%' AND VAL = '000'`);
    }
    async ef_weighted_avg_rates_NC() {
        const data = await this.getDataInDates(undefined, this.LDWeightedAvgRatesQuery(`216-220`, 'national'), true);
        return this.createData('4.1.1', '-средневзвешенные процентные ставки', data, false, true);
    }
    async foreign_curr() {
        return await this.getOneRow('4.2', 'в том числе в иностранной валюте', `BAL LIKE '216%' OR BAL LIKE '220%' AND VAL != '000'`);
    }
    async ef_weighted_avg_rates_FC() {
        const data = await this.getDataInDates(undefined, this.LDWeightedAvgRatesQuery(`216-220`, 'foreign'), true);
        return this.createData('4.2.1', '-средневзвешенные процентные ставки', data, false, true);
    }
    async LCR_total() {
        const data = await this.getDataInDates(undefined, this.dashboardLiquidityQuery('LCR'), true);
        return this.createData('5', 'Коеффициент покрытия ликвидности (> 100 %)', data, true, true);
    }
    async LCR_nat_curr() {
        const data = await this.getDataInDates(undefined, this.dashboardLiquidityQuery('LCR_NAT'), true);
        return this.createData('5.1', '- в нац.валюте', data, false, true);
    }
    async LCR_for_curr() {
        const data = await this.getDataInDates(undefined, this.dashboardLiquidityQuery('LCR_FOR'), true);
        return this.createData('5.2', '- в иностранной валюте', data, false, true);
    }
    async NSFR_total() {
        const data = await this.getDataInDates(undefined, this.dashboardLiquidityQuery('NSFR'), true);
        return this.createData('6', 'Норма чистого стабилного фондирование (> 100 %)', data, true, true);
    }
    async NSFR_nat_curr() {
        const data = await this.getDataInDates(undefined, this.dashboardLiquidityQuery('NSFR_NAT'), true);
        return this.createData('6.1', '- в нац.валюте', data, false, true);
    }
    async NSFR_for_curr() {
        const data = await this.getDataInDates(undefined, this.dashboardLiquidityQuery('NSFR_FOR'), true);
        return this.createData('6.2', '- в иностранной валюте', data, false, true);
    }
    async VLA_total() {
        const data = await this.getDataInDates(undefined, this.dashboardLiquidityQuery('VLA'), true);
        return this.createData('7', 'Расчет коэффициента высоколиквыдных активов к всего актывам (> 10 %)', data, true, true);
    }
    async VLA_nat_curr() {
        const data = await this.getDataInDates(undefined, this.dashboardLiquidityQuery('VLA_NAT'), true);
        return this.createData('7.1', '- в нац.валюте', data, false, true);
    }
    async VLA_for_curr() {
        const data = await this.getDataInDates(undefined, this.dashboardLiquidityQuery('VLA_FOR'), true);
        return this.createData('7.2', '- в иностранной валюте', data, false, true);
    }
    async getRows() {
        const [allActives, authorizedCapital, ownCapital, currentProfit, regularCapital, capitalFirstDegree, ROA, ROE, capitalAdequacyRatio, totalLiabilities, legalsDeposits, demandLegalsDeposits, savingLegalsDeposits, savingLegalsDepositsNatCurr, sldWeightedAvgRatesNC, savingLegalsDepositsForCurr, sldWeightedAvgRatesFC, timeLegalsDeposits, timeLegalsDepositsNatCcurr, tldWeightedAvgRatesNC, timeLegalsDepositsForCcurr, tldWeightedAvgRatesFC, physicalsDeposits, demandPhysicalsDeposits, savingPhysicalsDeposits, savingPhysicalsDepositsNatCurr, spdWeightedAvgRatesNC, savingPhysicalsDepositsForCurr, spdWeightedAvgRatesFC, timePhysicalsDeposits, timePhysicalsDepositsNatCurr, tpdWeightedAvgRatesNC, timePhysicalsDepositsForCurr, tpdWeightedAvgRatesFC, externalFunding, nationalCurr, efWeightedAvgRatesNC, foreignCurr, efWeightedAvgRatesFC, LCRTotal, LCRNatCurr, LCRForCurr, NSFRTotal, NSFRNatCurr, NSFRForCurr, VLATotal, VLANatCurr, VLAForCurr] = await Promise.all([
            this.all_actives(),
            this.authorized_capital(),
            this.own_capital(),
            this.current_profit(),
            this.regular_capital(),
            this.capital_first_degree(),
            this.roa(),
            this.roe(),
            this.capital_adequacy_ratio(),
            this.total_liabilities(),
            this.legals_deposits(),
            this.demand_legals_deposits(),
            this.saving_legals_deposits(),
            this.saving_legals_deposits_nat_curr(),
            this.sld_weighted_avg_rates_NC(),
            this.saving_legals_deposits_for_curr(),
            this.sld_weighted_avg_rates_FC(),
            this.time_legals_deposits(),
            this.time_legals_deposits_nat_curr(),
            this.tld_weighted_avg_rates_NC(),
            this.time_legals_deposits_for_curr(),
            this.tld_weighted_avg_rates_FC(),
            this.physicals_deposits(),
            this.demand_physicals_deposits(),
            this.saving_physicals_deposits(),
            this.saving_physicals_deposits_nat_curr(),
            this.spd_weighted_avg_rates_NC(),
            this.saving_physicals_deposits_for_curr(),
            this.spd_weighted_avg_rates_FC(),
            this.time_physicals_deposits(),
            this.time_physicals_deposits_nat_curr(),
            this.tpd_weighted_avg_rates_NC(),
            this.time_physicals_deposits_for_curr(),
            this.tpd_weighted_avg_rates_FC(),
            this.external_funding(),
            this.national_curr(),
            this.ef_weighted_avg_rates_NC(),
            this.foreign_curr(),
            this.ef_weighted_avg_rates_FC(),
            this.LCR_total(),
            this.LCR_nat_curr(),
            this.LCR_for_curr(),
            this.NSFR_total(),
            this.NSFR_nat_curr(),
            this.NSFR_for_curr(),
            this.VLA_total(),
            this.VLA_nat_curr(),
            this.VLA_for_curr()
        ]);
        const capital = [
            allActives,
            authorizedCapital,
            ownCapital,
            currentProfit,
            regularCapital,
            capitalFirstDegree,
            capitalAdequacyRatio,
            ROA,
            ROE
        ];
        const liquidity = [
            totalLiabilities,
            legalsDeposits,
            demandLegalsDeposits,
            savingLegalsDeposits,
            savingLegalsDepositsNatCurr,
            sldWeightedAvgRatesNC,
            savingLegalsDepositsForCurr,
            sldWeightedAvgRatesFC,
            timeLegalsDeposits,
            timeLegalsDepositsNatCcurr,
            tldWeightedAvgRatesNC,
            timeLegalsDepositsForCcurr,
            tldWeightedAvgRatesFC,
            physicalsDeposits,
            demandPhysicalsDeposits,
            savingPhysicalsDeposits,
            savingPhysicalsDepositsNatCurr,
            spdWeightedAvgRatesNC,
            savingPhysicalsDepositsForCurr,
            spdWeightedAvgRatesFC,
            timePhysicalsDeposits,
            timePhysicalsDepositsNatCurr,
            tpdWeightedAvgRatesNC,
            timePhysicalsDepositsForCurr,
            tpdWeightedAvgRatesFC,
            externalFunding,
            nationalCurr,
            efWeightedAvgRatesNC,
            foreignCurr,
            efWeightedAvgRatesFC,
            LCRTotal,
            LCRNatCurr,
            LCRForCurr,
            NSFRTotal,
            NSFRNatCurr,
            NSFRForCurr,
            VLATotal,
            VLANatCurr,
            VLAForCurr
        ];
        return [
            capital,
            liquidity
        ];
    }
}
exports.DashboardMonthly = DashboardMonthly;
//# sourceMappingURL=dashboard-monthly.js.map