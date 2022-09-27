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

	createData(
		count: string,
		state: string,
		data: any = [],
		isTableHead = false,
		withPercent?: boolean
	) {
		if (!data.length) return { count, state, data: [], differ: 0, differ_percent: 0, isTableHead }
		const clonedData = [...data]
		const differ = +(clonedData[clonedData.length - 1]['SUM'] - clonedData[0]['SUM']).toFixed(2)
		const differPercent = +(
			(clonedData[clonedData.length - 1]['SUM'] / clonedData[0]['SUM'] - 1) *
			100
		).toFixed(2)
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

	async getOneRow(count: string, state: string, whereQuery: string, isTableHead = false) {
		const data = await this.getDataInDates(
			'',
			this.dashboardMonthlyQuery.bind(this, whereQuery),
			true
		)
		return this.createData(count, state, data, isTableHead)
	}

	async all_actives() {
		/* Активы (всего) */
		return await this.getOneRow(
			'1',
			'Активы (всего)',
			`BAL LIKE '1%' AND BAL NOT LIKE '161%' AND BAL NOT LIKE '175%'`,
			true
		)
	} /* Активы (всего) */

	async authorized_capital() {
		/* Уставный Капитал */
		return await this.getOneRow('2', 'Уставный Капитал', `BAL IN ('30306', '30312', '30318')`, true)
	} /* Уставный Капитал */

	async own_capital() {
		/* Собственный капитал */
		return await this.getOneRow('3', 'Собственный капитал', `BAL LIKE '3%'`, true)
	} /* Собственный капитал */

	async current_profit() {
		/* Чистая прибыль */
		const data = await this.getDataInDates('', this.currentProfitQuery.bind(this), true)
		return this.createData('4', 'Чистая прибыль', data, true)
	} /* Чистая прибыль */

	async regular_capital() {
		/* Регулятивный капитал */
		const data = await this.getDataInDates('', this.capitalQuery.bind(this, 'R_C'), true)
		return this.createData('5', 'Регулятивный капитал', data, true)
	} /* Регулятивный капитал */

	async capital_first_degree() {
		/* Капитал 1-го уровня */
		const data = await this.getDataInDates('', this.capitalQuery.bind(this, 'T_A_F_C'), true)
		return this.createData('6', 'Капитал 1-го уровня', data, true)
	} /* Капитал 1-го уровня */

	// TODO Коеффициент адекватности капитала(1-го уровня)
	// TODO Коеффициент адекватности капитала [ STATIC DATA YET ]
	async capital_adequacy_ratio() {
		/* Коеффициент адекватности капитала */
		const data = await this.getDataInDates('', this.currentProfitQuery.bind(this), true)
		const tempData = [14.63, 14.37]
		const temporaryData = data.map((data: any, index: number) => ({
			...data,
			SUM: tempData[index]
		}))
		return this.createData('7', 'Коеффициент адекватности капитала', temporaryData, true)
	} /* Коеффициент адекватности капитала */

	async roa() {
		/* Рентабелность активов (ROA) */
		const data = await this.getDataInDates('', this.ROAQuery.bind(this), true)
		return this.createData('8', 'Рентабелность активов (ROA)', data, true)
	} /* Рентабелность активов (ROA) */

	async roe() {
		/* Рентабелность капитала (ROE) */
		const data = await this.getDataInDates('', this.ROEQuery.bind(this), true)
		return this.createData('9', 'Рентабелность капитала (ROE)', data, true)
	} /* Рентабелность капитала (ROE) */

	async total_liabilities() {
		/* Обязательства (всего) */
		return await this.getOneRow(
			'1',
			'Обязательства (всего)',
			`BAL LIKE '2%' AND BAL NOT LIKE '222%'`,
			true
		)
	} /* Обязательства (всего) */

	async legals_deposits() {
		/* Депозиты юр. лиц */
		return await this.getOneRow(
			'2',
			'Депозиты юр. лиц',
			`BAL LIKE '202%' OR BAL LIKE '204%' OR BAL LIKE '206%' OR BAL LIKE '226%'`,
			true
		)
	} /* Депозиты юр. лиц */

	async demand_legals_deposits() {
		/* Депозиты до востребования юр. лиц */
		return await this.getOneRow(
			'2.1',
			'Депозиты до востребования юр. лиц',
			`BAL LIKE '202%' AND BAL != '20206'`
		)
	} /* Депозиты до востребования юр. лиц */

	async saving_legals_deposits() {
		/* Сберегательные депозиты юр. лиц */
		return await this.getOneRow(
			'2.2',
			'Сберегательные депозиты юр. лиц',
			`BAL LIKE '204%' AND BAL != '20406'`
		)
	} /* Сберегательные депозиты юр. лиц */

	async time_legals_deposits() {
		/* Срочные депозиты юр. лиц */
		return await this.getOneRow(
			'2.3',
			'Срочные депозиты юр. лиц',
			`BAL LIKE '206%' AND BAL != '20606'`
		)
	} /* Срочные депозиты юр. лиц */

	async physicals_deposits() {
		/* Депозиты физ. Лиц */
		return await this.getOneRow(
			'3',
			'Депозиты физ. Лиц',
			`BAL IN ('20206', '20406', '20606')`,
			true
		)
	} /* Депозиты физ. Лиц */

	async demand_physicals_deposits() {
		/* депозиты до востребования физ. лиц */
		return await this.getOneRow('3.2', 'депозиты до востребования физ. лиц', `BAL='20206'`)
	} /* депозиты до востребования физ. лиц */

	async saving_physicals_deposits() {
		/* Сберегательные депозиты физ. лиц */
		return await this.getOneRow('3.1', 'Сберегательные депозиты физ. лиц', `BAL='20406'`)
	} /* Сберегательные депозиты физ. лиц */

	async time_physicals_deposits() {
		/* срочные депозиты физ. лиц */
		return await this.getOneRow('3.3', 'срочные депозиты физ. лиц', `BAL='20606'`)
	} /* срочные депозиты физ. лиц */

	async external_funding() {
		/* Внешнее фондирование */
		return await this.getOneRow(
			'4',
			'Внешнее фондирование',
			`BAL LIKE '216%' OR BAL LIKE '220%'`,
			true
		)
	} /* Внешнее фондирование */

	// TODO -средневзвешенные процентные ставки

	async national_curr() {
		/* в том числе в нац.валюте */
		return await this.getOneRow(
			'4.1',
			'в том числе в нац.валюте',
			`BAL LIKE '216%' OR BAL LIKE '220%' AND VAL = '000'`
		)
	} /* в том числе в нац.валюте */

	// TODO -средневзвешенные процентные ставки

	async foreign_curr() {
		/* в том числе в иностранной валюте */
		return await this.getOneRow(
			'4.2',
			'в том числе в иностранной валюте',
			`BAL LIKE '216%' OR BAL LIKE '220%' AND VAL != '000'`
		)
	} /* в том числе в иностранной валюте */

	// TODO -средневзвешенные процентные ставки

	async getRows() {
		const [
			allActives,
			authorizedCapital,
			ownCapital,
			currentProfit,
			regularCapital,
			capitalFirstDegree,
			ROA,
			ROE,
			capitalAdequacyRatio,
			totalLiabilities,
			legalsDeposits,
			demandLegalsDeposits,
			savingLegalsDeposits,
			timeLegalsDeposits,
			physicalsDeposits,
			demandPhysicalsDeposits,
			savingPhysicalsDeposits,
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
			this.roa(),
			this.roe(),
			this.capital_adequacy_ratio(),
			this.total_liabilities(),
			this.legals_deposits(),
			this.demand_legals_deposits(),
			this.saving_legals_deposits(),
			this.time_legals_deposits(),
			this.physicals_deposits(),
			this.demand_physicals_deposits(),
			this.saving_physicals_deposits(),
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
			ROA,
			ROE
		]
		const liquidity = [
			totalLiabilities,
			legalsDeposits,
			demandLegalsDeposits,
			savingLegalsDeposits,
			timeLegalsDeposits,
			physicalsDeposits,
			demandPhysicalsDeposits,
			savingPhysicalsDeposits,
			timePhysicalsDeposits,
			externalFunding,
			nationalCurr,
			foreignCurr
		]
		return {
			// КАПИТАЛ
			capital,
			//  ЛИКВИДНОСТЬ
			liquidity
		}
	}
}

export default DashboardMonthlyMainClass
