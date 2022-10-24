import MainClass from '../mainClass'

/* eslint-disable camelcase */
class FcrbMainClass extends MainClass {
	constructor(date: string) {
		super(date)
	}

	formatQuery(date: string, whereQuery = '1=1') {
		return `SELECT ABS(ROUND(SUM(SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ) / POWER(10, 11), 2)) AS SUM
                FROM IBS.SVOD_SALDO_DUMP@IABS
                WHERE ${whereQuery} AND DAT = TO_DATE('${date}', 'DD.MM.YYYY')`
	}

	percentQuery(date: string, depositTypeQuery = '1=1', coaQuery = '1=1') {
		return `SELECT DECODE(CODE_CURRENCY, '000', 'UZS', '840', 'USD', '978', 'EUR', CODE_CURRENCY) CURRENCY_NAME,
                       ROUND(SUM(PERCENT_RATE * SALDO_EQUIVAL_OUT) / DECODE(SUM(SALDO_EQUIVAL_OUT), 0, 1, SUM(SALDO_EQUIVAL_OUT)), 2)
                           AS
                                                                                       PERCENT
                FROM (SELECT SUBSTR(ACCOUNT_CODE, 13, 3) AS CODE_CURRENCY,
                             ACCOUNT_CODE,
                             PERCENT_RATE,
                             NVL((SELECT /*+index_desc(s UK_SALDO_ACCOUNT_DAY)*/ ABS(
                                                                                         SALDO_EQUIVAL_OUT)
                                  FROM IBS.SALDO@IABS S
                                  WHERE S.ACCOUNT_CODE = ALIAS_TABLE.ACCOUNT_CODE
                                    AND OPER_DAY <= TO_DATE('${date}', 'DD.MM.YYYY')
                                    AND ROWNUM = 1), 0)  AS SALDO_EQUIVAL_OUT
                      FROM (SELECT ALIAS_TABLE.CONTRACT_ID,
                                   (SELECT ACCOUNT_CODE
                                    FROM IBS.DEP_ACCOUNTS@IABS
                                    WHERE CONTRACT_ID = ALIAS_TABLE.CONTRACT_ID
                                      AND DATE_VALIDATE = ALIAS_TABLE.DATE_VALIDATE
                                      AND ACCOUNT_TYPE = 1
                                      AND ROWNUM = 1)         AS ACCOUNT_CODE,
                                   NVL((SELECT --+index_desc(p DEP_CONTR_PERCENT_RATE_H_PK)
                                               PERCENT_RATE
                                        FROM IBS.DEP_CONTRACTS_PERCENT_RATE_H@IABS P
                                        WHERE P.CONTRACT_ID = ALIAS_TABLE.CONTRACT_ID
                                          AND ACTION NOT IN ('DELETE')
                                          AND DATE_VALIDATE <= TO_DATE('${date}',
                                                                       'DD.MM.YYYY')
                                          AND ROWNUM = 1), 0) AS PERCENT_RATE
                            FROM (SELECT CONTRACT_ID,
                                         MAX(AC.DATE_VALIDATE) AS date_validate
                                  FROM IBS.DEP_ACCOUNTS@IABS AC
                                           JOIN IBS.DEP_CONTRACTS@IABS CON
                                                ON AC.CONTRACT_ID = CON.ID
                                  WHERE ${coaQuery}
                                    AND AC.ACCOUNT_TYPE = 1
                                    AND ${depositTypeQuery}
                                    AND AC.DATE_VALIDATE <= TO_DATE('${date}',
                                                                    'DD.MM.YYYY')
                                    AND CON.DATE_BEGIN <= TO_DATE('${date}',
                                                                  'DD.MM.YYYY'
                                      )
                                    AND CON.DATE_END >= TO_DATE('${date}',
                                                                'DD.MM.YYYY')
                                    AND CON.STATE NOT IN ('DELETE')
                                  GROUP BY AC.CONTRACT_ID) ALIAS_TABLE) ALIAS_TABLE)
                                  WHERE CODE_CURRENCY in ('000', '840', '978')
                GROUP BY CODE_CURRENCY`
	}

	mfiPercentsQuery(date: string) {
		return `SELECT DECODE(CODE_CURRENCY, '000', 'UZS', '840', 'USD', '978', 'EUR', CODE_CURRENCY) CURRENCY_NAME,
                       ROUND(SUM(PERCENT_RATE * SALDO_EQUIVAL_OUT) / DECODE(SUM(SALDO_EQUIVAL_OUT), 0, 1, SUM(SALDO_EQUIVAL_OUT)) + 
                             DECODE(CODE_CURRENCY, '000',10.11,'840',0.94,'978',1.68,0), 2) AS PERCENT
                FROM (SELECT SUBSTR(ACCOUNT_CODE, 13, 3) AS CODE_CURRENCY,
                             ACCOUNT_CODE,
                             PERCENT_RATE,
                             NVL((SELECT /*+index_desc(s UK_SALDO_ACCOUNT_DAY)*/ ABS(
                                                                                         SALDO_EQUIVAL_OUT)
                                  FROM IBS.SALDO@IABS S
                                  WHERE S.ACCOUNT_CODE = ALIAS_TABLE.ACCOUNT_CODE
                                    AND OPER_DAY <= TO_DATE('${date}', 'DD.MM.YYYY')
                                    AND ROWNUM = 1), 0)  AS SALDO_EQUIVAL_OUT
                      FROM (SELECT ALIAS_TABLE.CONTRACT_ID,
                                   (SELECT ACCOUNT_CODE
                                    FROM IBS.DEP_ACCOUNTS@IABS
                                    WHERE CONTRACT_ID = ALIAS_TABLE.CONTRACT_ID
                                      AND DATE_VALIDATE = ALIAS_TABLE.DATE_VALIDATE
                                      AND ACCOUNT_TYPE = 1
                                      AND ROWNUM = 1)         AS ACCOUNT_CODE,
                                   NVL((SELECT --+index_desc(p DEP_CONTR_PERCENT_RATE_H_PK)
                                               PERCENT_RATE
                                        FROM IBS.DEP_CONTRACTS_PERCENT_RATE_H@IABS P
                                        WHERE P.CONTRACT_ID = ALIAS_TABLE.CONTRACT_ID
                                          AND ACTION NOT IN ('DELETE')
                                          AND DATE_VALIDATE <= TO_DATE('${date}',
                                                                       'DD.MM.YYYY')
                                          AND ROWNUM = 1), 0) AS PERCENT_RATE
                            FROM (SELECT CONTRACT_ID,
                                         MAX(AC.DATE_VALIDATE) AS date_validate
                                  FROM IBS.DEP_ACCOUNTS@IABS AC
                                           JOIN IBS.DEP_CONTRACTS@IABS CON
                                                ON AC.CONTRACT_ID = CON.ID
                                  WHERE (COA LIKE '220%' OR COA LIKE '216%')
                                    AND AC.ACCOUNT_TYPE = 1
                                    AND CON.DEPOSIT_TYPE = 7
                                    AND AC.DATE_VALIDATE <= TO_DATE('${date}',
                                                                    'DD.MM.YYYY')
                                    AND CON.DATE_BEGIN <= TO_DATE('${date}',
                                                                  'DD.MM.YYYY'
                                      )
                                    AND CON.DATE_END >= TO_DATE('${date}',
                                                                'DD.MM.YYYY')
                                    AND CON.STATE NOT IN ('DELETE')
                                  GROUP BY AC.CONTRACT_ID) ALIAS_TABLE) ALIAS_TABLE)
                                  WHERE CODE_CURRENCY in ('000', '840', '978')
                GROUP BY CODE_CURRENCY`
	}

	fundingAvgRatePercents(date: string) {
		return `SELECT 
                   DECODE(CODE_CURRENCY, '000', 'UZS', '840', 'USD', '978', 'EUR', CODE_CURRENCY) CURRENCY_NAME,
                   ROUND((SUM(PERCENT_RATE * SALDO_EQUIVAL_OUT)*DECODE(
                       CODE_CURRENCY, '000',1.11,'840',1.23,'978',1.3,0)) / DECODE(
                           SUM(SALDO_EQUIVAL_OUT), 0, 1, 
                       SUM(SALDO_EQUIVAL_OUT)), 2) AS PERCENT
            FROM (SELECT SUBSTR(ACCOUNT_CODE, 13, 3) AS CODE_CURRENCY,
                         ACCOUNT_CODE,
                         PERCENT_RATE,
                         NVL((SELECT /*+index_desc(s UK_SALDO_ACCOUNT_DAY)*/ ABS(
                                                                                     SALDO_EQUIVAL_OUT)
                              FROM IBS.SALDO@IABS S
                              WHERE S.ACCOUNT_CODE = ALIAS_TABLE.ACCOUNT_CODE
                                AND OPER_DAY <= TO_DATE('${date}', 'DD.MM.YYYY')
                                AND ROWNUM = 1), 0)  AS SALDO_EQUIVAL_OUT
                  FROM (SELECT ALIAS_TABLE.CONTRACT_ID,
                               (SELECT ACCOUNT_CODE
                                FROM IBS.DEP_ACCOUNTS@IABS
                                WHERE CONTRACT_ID = ALIAS_TABLE.CONTRACT_ID
                                  AND DATE_VALIDATE = ALIAS_TABLE.DATE_VALIDATE
                                  AND ACCOUNT_TYPE = 1
                                  AND ROWNUM = 1)         AS ACCOUNT_CODE,
                               NVL((SELECT --+index_desc(p DEP_CONTR_PERCENT_RATE_H_PK)
                                           PERCENT_RATE
                                    FROM IBS.DEP_CONTRACTS_PERCENT_RATE_H@IABS P
                                    WHERE P.CONTRACT_ID = ALIAS_TABLE.CONTRACT_ID
                                      AND ACTION NOT IN ('DELETE')
                                      AND DATE_VALIDATE <= TO_DATE('${date}',
                                                                   'DD.MM.YYYY')
                                      AND ROWNUM = 1), 0) AS PERCENT_RATE
                        FROM (SELECT CONTRACT_ID,
                                     MAX(AC.DATE_VALIDATE) AS date_validate
                              FROM IBS.DEP_ACCOUNTS@IABS AC
                                       JOIN IBS.DEP_CONTRACTS@IABS CON
                                            ON AC.CONTRACT_ID = CON.ID
                              WHERE (COA IN('21022','21032','21042') OR (COA LIKE '204%' OR COA LIKE '206%' 
                                AND COA NOT IN('20406','20606')) OR COA LIKE '216%'OR COA LIKE '220%')
                                AND AC.ACCOUNT_TYPE = 1
                                AND CON.DEPOSIT_TYPE IN (2, 3, 5, 7)
                                AND AC.DATE_VALIDATE <= TO_DATE('${date}',
                                                                'DD.MM.YYYY')
                                AND CON.DATE_BEGIN <= TO_DATE('${date}',
                                                              'DD.MM.YYYY'
                                  )
                                AND CON.DATE_END >= TO_DATE('${date}',
                                                            'DD.MM.YYYY')
                                AND CON.STATE NOT IN ('DELETE')
                              GROUP BY AC.CONTRACT_ID) ALIAS_TABLE) ALIAS_TABLE)
                              WHERE CODE_CURRENCY in ('000', '840', '978')
            GROUP BY CODE_CURRENCY`
	}

	retailPercentsQuery(date: string) {
		return `SELECT DECODE(CURRENCY_CODE, '000', 'UZS', '840', 'USD', '978', 'EUR') AS CURRENCY_NAME,
                       PERCENT
                FROM (LEGAL_DEPOSITS_AVG_PERCENTS)
                WHERE OPER_DAY =
                      (SELECT MAX(OPER_DAY) FROM LEGAL_DEPOSITS_AVG_PERCENTS WHERE OPER_DAY < TO_DATE('${date}', 'DD.MM.YYYY'))`
	}

	async getOneRow(whereQuery: string) {
		await this.getBeforeDate()
		const { SUM } = await this.getDataInDates(whereQuery)
		return SUM
	}

	async mfi() {
		/* МФИ */
		return await this.getOneRow(`(BAL LIKE '220%' OR BAL LIKE '216%')`)
	} /*  МФИ */

	async mfi_percents() {
		/* МФИ Проценты */
		// TODO temporary data
		return await this.getDataInDates('', this.mfiPercentsQuery.bind(this, this.date), true)
		// return Promise.resolve([
		// 	{ CURRENCY_NAME: 'UZS', PERCENT: 18.7 },
		// 	{ CURRENCY_NAME: 'USD', PERCENT: 5.69 },
		// 	{ CURRENCY_NAME: 'EUR', PERCENT: 4.91 }
		// ])
	} /* МФИ Проценты */

	async treasury() {
		/* Казначейство (депозиты юр.лиц + меж.банк) */
		return await this.getOneRow(
			`((BAL LIKE '206%' AND BAL <> '20606') OR (BAL IN ('21022', '21032', '21042', '21010')))`
		)
	} /*  Казначейство (депозиты юр.лиц + меж.банк) */

	async treasury_percents() {
		/* Казначейство Проценты */
		return await this.getDataInDates(
			'',
			this.percentQuery.bind(
				this,
				this.date,
				`CON.DEPOSIT_TYPE IN (2, 3, 5)`,
				`(COA IN ('21022', '21032', '21042') OR (COA LIKE '204%' OR COA LIKE '206%' AND COA NOT IN ('20406', '20606')))`
			),
			true
		)
	} /* Казначейство Проценты */

	async retail() {
		/* Розница (депозиты физ. лиц) */
		return await this.getOneRow(`BAL IN ('20206', '20406', '20606', '22616', '22617', '22618')`)
	} /*  Розница (депозиты физ. лиц) */

	async retail_percents() {
		return await this.getDataInDates('', this.retailPercentsQuery, true)
	}

	// ЦЕНТРАЛИЗОВАННАЯ РЕСУРСНАЯ БАЗА КАПИТАЛ

	async capital() {
		/* Капитал */
		return await this.getOneRow(`(BAL LIKE '3%' OR BAL LIKE '4%' OR BAL LIKE '5%')`)
	} /*  Капитал */

	async obligations() {
		/* ОБЯЗАТЕЛЬСТВА */
		return await this.getOneRow(`((BAL LIKE '2%' AND BAL NOT LIKE '222%') OR BAL LIKE '175%')`)
	} /*  ОБЯЗАТЕЛЬСТВА */

	async other_actives() {
		/* другие активы */
		return await this.getOneRow(
			`(BAL LIKE '108%'
                        OR BAL LIKE '109%'
                        OR BAL LIKE '115%'
                        OR BAL LIKE '117%'
                        OR BAL LIKE '164%'
                        OR BAL LIKE '161%'
                        OR BAL LIKE '166%'
                        OR BAL LIKE '171%'
                        OR BAL LIKE '173%'
                        OR BAL LIKE '199%'
                        OR BAL LIKE '174%'
                        OR BAL LIKE '168%'
                        OR BAL LIKE '175%'
                        OR BAL = '10791'
                        OR BAL = '10793')`
		)
	} /*  другие активы */

	async investments() {
		/* инвестиции */
		return await this.getOneRow(`BAL LIKE '158%'`)
	} /*  инвестиции */

	async bills_and_interbank_deposits() {
		/* цен. бумаги и меж. банк. */
		return await this.getOneRow(
			`BAL IN ('10301', '10501', '10531', '10331', '10321', '10521', '10541', '10341')`
		)
	} /*  цен. бумаги и меж. банк. */

	async crediting_and_accredetiv() {
		/* кредитования + аккредитив */
		return await this.getOneRow(
			`BAL IN('11901','12101','12301','12401','12601','12621','12701','12704','12801','12802'
                            ,'12803','12901','12904','12921','13001','13101','13104','13121','13201','13301',
                            '14301','14401','14402','14403','14501','14701','14801','15001','15021','15101','15104','15201',
                            '15301','15304','15321','15401','15501','15504','15521','15601','15605','15607','15609','15611',
                            '15613','15615','12609','12709','12909','13109','14305','15105','15205','15305','15505','15619',
                            '12105','12305','12405','12605','12705','12805','12905','13005','13105','13205','13305','15617')`
		)
	} /*  кредитования + аккредитив */

	async retail_lending() {
		/* розничное кредитования */
		return await this.getOneRow(
			`BAL IN('12501','12502','12503','12504','12521','14901','14902','14903','14904','14913','14921','12505','14905')`
		)
	} /*  розничное кредитования */

	async treasury_portfolio() {
		/* Казначейский портфель */
		return await this.getOneRow(
			`((BAL LIKE '107%') OR BAL LIKE '158%' OR BAL LIKE '159%' OR BAL = '10597')`
		)
	} /*  Казначейский портфель */

	async balance_active() {
		/* Балансовый актив */
		return await this.getOneRow(`(BAL LIKE '1%' AND BAL NOT LIKE '161%' AND BAL NOT LIKE '175%')`)
	} /*  Балансовый актив */

	// *Средняя ставка всего фондирования

	async funding_avg_rate_percents() {
		/* *Средняя ставка всего фондирования Проценты */
		// TODO temporary data
		return await this.getDataInDates('', this.fundingAvgRatePercents, true)
		// return Promise.resolve([
		// 	{ CURRENCY_NAME: 'UZS', PERCENT: 7.8 },
		// 	{ CURRENCY_NAME: 'USD', PERCENT: 3.37 },
		// 	{ CURRENCY_NAME: 'EUR', PERCENT: 3.04 }
		// ])
	} /* *Средняя ставка всего фондирования Проценты */

	async getRows() {
		const [
			mfiTotal,
			mfiPercents,
			treasuryTotal,
			treasuryPercents,
			retailTotal,
			retailPercents,
			capital,
			obligations,
			otherActives,
			investments,
			billsAndInterbankDeposits,
			creditingAndAccredetiv,
			retailLending,
			treasuryPortfolio,
			balanceActive,
			fundingAvgRatePercents
		] = await Promise.all([
			this.mfi(),
			this.mfi_percents(),
			this.treasury(),
			this.treasury_percents(),
			this.retail(),
			this.retail_percents(),
			this.capital(),
			this.obligations(),
			this.other_actives(),
			this.investments(),
			this.bills_and_interbank_deposits(),
			this.crediting_and_accredetiv(),
			this.retail_lending(),
			this.treasury_portfolio(),
			this.balance_active(),
			this.funding_avg_rate_percents()
		])
		const mfiData = { mfiTotal, mfiPercents }
		const retailData = { retailTotal, retailPercents }
		const centralizedResourceBaseData = { capital, obligations }
		// TODO treasuryTotal is calculated temporary
		// const treasuryTotal = obligations - (mfiTotal + retailTotal)
		const treasuryData = { treasuryTotal, treasuryPercents }
		const portfolioData = {
			otherActives,
			investments,
			billsAndInterbankDeposits,
			creditingAndAccredetiv,
			retailLending,
			treasuryPortfolio,
			balanceActive,
			fundingAvgRatePercents
		}
		return { mfiData, treasuryData, retailData, centralizedResourceBaseData, portfolioData }
	}
}

export default FcrbMainClass
