import { getLiquidityTotal, liqInclude } from './liq_pure_functions'
import LiquidityMainClass from './LiquidityMainClass'

/* eslint-disable camelcase */
class LiquidityAssets extends LiquidityMainClass {
	governmentBillsQuery(date: Date) {
		return `SELECT ROUND(ABS((SELECT SUM((SELECT /*+index_desc(s UK_SALDO_ACCOUNT_DAY)*/
                                                  SALDO_EQUIVAL_OUT / POWER(
                                                      10, 8)
                                          FROM IBS.SALDO@IABS S
                                          WHERE OPER_DAY <= TO_DATE('${date}', 'DD.MM.YYYY')
                                            AND S.ACCOUNT_CODE = AC.CODE
                                            AND ROWNUM = 1)) AS SALDO_OUT
                              FROM IBS.ACCOUNTS@IABS AC
                              WHERE AC.CODE_COA LIKE '107%')), 2)       AS TOTAL,
                   ROUND(ABS((SELECT SUM((SELECT /*+index_desc(s UK_SALDO_ACCOUNT_DAY)*/
                                              SALDO_EQUIVAL_OUT / POWER(10, 8)
                                          FROM IBS.SALDO@IABS S
                                          WHERE OPER_DAY <= TO_DATE('${date}', 'DD.MM.YYYY')
                                            AND S.ACCOUNT_CODE = AC.CODE
                                            AND ROWNUM = 1)) AS SALDO_OUT
                              FROM IBS.ACCOUNTS@IABS AC
                              WHERE AC.CODE_COA LIKE '107%'
                                AND CODE_CURRENCY = '000')), 2)         AS NAT_CURR,
                   NVL(ROUND(ABS((SELECT SUM((SELECT /*+index_desc(s UK_SALDO_ACCOUNT_DAY)*/
                                                      SALDO_EQUIVAL_OUT / POWER
                                                      (10, 8)
                                              FROM IBS.SALDO@IABS S
                                              WHERE OPER_DAY <= TO_DATE('${date}', 'DD.MM.YYYY')
                                                AND S.ACCOUNT_CODE = AC.CODE
                                                AND ROWNUM = 1)) AS SALDO_OUT
                                  FROM IBS.ACCOUNTS@IABS AC
                                  WHERE AC.CODE_COA LIKE '107%'
                                    AND CODE_CURRENCY != '000')), 2) /
                       (SELECT EQUIVAL
                        FROM (SELECT EQUIVAL
                              FROM IBS.S_RATE_CUR@IABS
                              WHERE DATE_CROSS < TO_DATE('${date}', 'DD.MM.YYYY')
                                AND CODE = '840'
                              ORDER BY DATE_CROSS DESC)
                        WHERE ROWNUM =
                              1), 0)
                                                                        AS FOR_CURR,
                   NVL(ROUND(ABS((SELECT SUM((SELECT /*+index_desc(s UK_SALDO_ACCOUNT_DAY)*/
                                                  SALDO_OUT / POWER(10, 8)
                                              FROM IBS.SALDO@IABS S
                                              WHERE OPER_DAY <= TO_DATE('${date}', 'DD.MM.YYYY')
                                                AND S.ACCOUNT_CODE = AC.CODE
                                                AND ROWNUM = 1)) AS SALDO_OUT
                                  FROM IBS.ACCOUNTS@IABS AC
                                  WHERE AC.CODE_COA LIKE '107%'
                                    AND CODE_CURRENCY = '840')), 2), 0) AS USA_DOLLAR,
                   NVL(ROUND(ABS((SELECT SUM((SELECT /*+index_desc(s UK_SALDO_ACCOUNT_DAY)*/
                                                  SALDO_OUT / POWER(10, 8)
                                              FROM IBS.SALDO@IABS S
                                              WHERE OPER_DAY <= TO_DATE('${date}', 'DD.MM.YYYY')
                                                AND S.ACCOUNT_CODE = AC.CODE
                                                AND ROWNUM = 1)) AS SALDO_OUT
                                  FROM IBS.ACCOUNTS@IABS AC
                                  WHERE AC.CODE_COA LIKE '107%'
                                    AND CODE_CURRENCY = '978')), 2), 0) AS EVRO
            FROM DUAL`
	}

	localBanksQuery(date: Date) {
		return `SELECT (SELECT ROUND(SUM(SALDO_EQUIVAL_OUT) / POWER(10, 8), 2)
            FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                   NVL(SALDO_EQUIVAL_OUT, 0)
                            FROM   IBS.SALDO@IABS SL
                            WHERE  SL.ACCOUNT_CODE = AC.CODE
                              AND SL.OPER_DAY < TO_DATE('${date}',
                                                        'DD.MM.YYYY')
                              AND ROWNUM = 1) AS SALDO_EQUIVAL_OUT
                    FROM   IBS.ACCOUNTS@IABS AC,
                           BANK_DICTIONARY B
                    WHERE  CONCAT('000', B.CLIENT_CODE) = AC.CLIENT_CODE
                      AND CODE_COA IN ( '21002' ))) AS TOTAL,
                   (SELECT ROUND(SUM(SALDO_EQUIVAL_OUT) / POWER(10, 8), 2)
                    FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                           NVL(SALDO_EQUIVAL_OUT, 0)
                                    FROM   IBS.SALDO@IABS SL
                                    WHERE  SL.ACCOUNT_CODE = AC.CODE
                                      AND SL.OPER_DAY < TO_DATE('${date}',
                                                                'DD.MM.YYYY')
                                      AND ROWNUM = 1) AS SALDO_EQUIVAL_OUT
                            FROM   IBS.ACCOUNTS@IABS AC,
                                   BANK_DICTIONARY B
                            WHERE  CONCAT('000', B.CLIENT_CODE) = AC.CLIENT_CODE
                              AND CODE_COA IN ( '21002' )
                              AND CODE_CURRENCY = '000')) AS NAT_CURR,
                   (SELECT ROUND(SUM(SALDO_EQUIVAL_OUT) / POWER(10, 8), 2)
                    FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                    NVL(SALDO_EQUIVAL_OUT, 0) / 
                    (SELECT EQUIVAL FROM (SELECT --+index_desc(rate XPK_S_RATE_CUR )
                                                                                 EQUIVAL,
                                                                                 ROWNUM AS N
                                                                             FROM
                                                                                 IBS.S_RATE_CUR@IABS
                                                                                     RATE
                                                                             WHERE  CODE = '840')
                                                                        WHERE  N = 2)
                                    FROM   IBS.SALDO@IABS SL
                                    WHERE  SL.ACCOUNT_CODE = AC.CODE
                                      AND SL.OPER_DAY < TO_DATE('${date}',
                                                                'DD.MM.YYYY')
                                      AND ROWNUM = 1) AS SALDO_EQUIVAL_OUT
                            FROM   IBS.ACCOUNTS@IABS AC,
                                   BANK_DICTIONARY B
                            WHERE  CONCAT('000', B.CLIENT_CODE) = AC.CLIENT_CODE
                              AND CODE_COA IN ( '21002' )
                              AND CODE_CURRENCY <> '000')) AS FOR_CURR,
                   (SELECT ROUND(SUM(SALDO_OUT) / POWER(10, 8), 2)
                    FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                           NVL(SALDO_OUT, 0)
                                    FROM   IBS.SALDO@IABS SL
                                    WHERE  SL.ACCOUNT_CODE = AC.CODE
                                      AND SL.OPER_DAY < TO_DATE('${date}',
                                                                'DD.MM.YYYY')
                                      AND ROWNUM = 1) AS saldo_out
                            FROM   IBS.ACCOUNTS@IABS AC,
                                   BANK_DICTIONARY B
                            WHERE  CONCAT('000', B.CLIENT_CODE) = AC.CLIENT_CODE
                              AND CODE_COA IN ( '21002' )
                              AND CODE_CURRENCY = '840'))         AS USA_DOLLAR,
                   (SELECT ROUND(SUM(SALDO_OUT) / POWER(10, 8), 2)
                    FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                           NVL(SALDO_OUT, 0)
                                    FROM   IBS.SALDO@IABS SL
                                    WHERE  SL.ACCOUNT_CODE = AC.CODE
                                      AND SL.OPER_DAY < TO_DATE('${date}',
                                                                'DD.MM.YYYY')
                                      AND ROWNUM = 1) AS saldo_out
                            FROM   IBS.ACCOUNTS@IABS AC,
                                   BANK_DICTIONARY B
                            WHERE  CONCAT('000', B.CLIENT_CODE) = AC.CLIENT_CODE
                              AND CODE_COA IN ( '21002' )
                              AND CODE_CURRENCY = '978'))         AS EVRO
            FROM   DUAL`
	}

	vostroFilteredQuery(date: string) {
		return `SELECT ROUND(FOR_CURR * (SELECT EQUIVAL
                                    FROM IBS.S_RATE_CUR@IABS
                                    WHERE DATE_CROSS < TO_DATE('${date}', 'DD.MM.YYYY')
                                      AND CODE = '840'
                                    ORDER BY DATE_CROSS DESC FETCH FIRST ROW ONLY ), 2) AS TOTAL,
                   NAT_CURR,
                   ROUND(FOR_CURR, 2) AS FOR_CURR,
                   USA_DOLLAR,
                   EVRO
            FROM (SELECT 0                               AS NAT_CURR,
                         (SELECT ROUND(NVL(SUM(ABS(
                                     (SELECT
                                             /*+index_desc(s UK_SALDO_ACCOUNT_DAY)*/
                                             SALDO_EQUIVAL_OUT
                                         FROM IBS.SALDO@IABS S
                                         WHERE S.ACCOUNT_CODE = AC.CODE
                                           AND OPER_DAY <= TO_DATE('${date}', 'DD.MM.YYYY')
                                           AND ROWNUM = 1))) / POWER(10, 8), 0), 2) AS SALDO_EQUIVAL_OUT
                             FROM IBS.ACCOUNTS@IABS AC
                                      JOIN BANK_INFO_RATING BR
                                           ON BR.CLIENT_CODE = AC.CLIENT_CODE
                             WHERE AC.CODE_COA IN ('10501', '10521')
                               AND AC.CODE_CURRENCY != '000'
                               AND BR.RATING_STATUS = 1) /
                         (SELECT EQUIVAL
                             FROM IBS.S_RATE_CUR@IABS
                             WHERE DATE_CROSS < TO_DATE('${date}', 'DD.MM.YYYY')
                               AND CODE = '840'
                             ORDER BY DATE_CROSS DESC
                                 FETCH FIRST ROW ONLY)   AS FOR_CURR,
                         (SELECT ROUND(NVL(SUM(ABS((SELECT
                                             /*+index_desc(s UK_SALDO_ACCOUNT_DAY)*/
                                             SALDO_OUT
                                         FROM IBS.SALDO@IABS S
                                         WHERE S.ACCOUNT_CODE = AC.CODE
                                           AND OPER_DAY <= TO_DATE('${date}', 'DD.MM.YYYY')
                                           AND ROWNUM = 1))) / POWER(10, 8), 0), 2)
                             FROM IBS.ACCOUNTS@IABS AC
                                      JOIN BANK_INFO_RATING BR
                                           ON BR.CLIENT_CODE = AC.CLIENT_CODE
                             WHERE AC.CODE_COA IN ('10501', '10521')
                               AND AC.CODE_CURRENCY = '840'
                               AND BR.RATING_STATUS = 1) AS USA_DOLLAR,
                         (SELECT ROUND(NVL(SUM(ABS((SELECT
                                             /*+index_desc(s UK_SALDO_ACCOUNT_DAY)*/
                                             SALDO_OUT
                                         FROM IBS.SALDO@IABS S
                                         WHERE S.ACCOUNT_CODE = AC.CODE
                                           AND OPER_DAY <= TO_DATE('${date}', 'DD.MM.YYYY')
                                           AND ROWNUM = 1))) / POWER(10, 8), 0), 2)
                             FROM IBS.ACCOUNTS@IABS AC
                                      JOIN BANK_INFO_RATING BR
                                           ON BR.CLIENT_CODE = AC.CLIENT_CODE
                             WHERE AC.CODE_COA IN ('10501', '10521')
                               AND AC.CODE_CURRENCY = '978'
                               AND BR.RATING_STATUS = 1) AS EVRO
                  FROM DUAL)`
	}

	async total_actives() {
		/* Всего активы (чистые) */
		return await this.getOneRow('', 'Всего активы (чистые)', '', this.liquidityQuery('T_A'), true)
	} /* Всего активы (чистые) */

	async cash_box() {
		/* Касса */
		return await this.getOneRow('1', 'Касса', `code_coa like '101%'`, null, true)
	} /* Касса */

	async government_bills() {
		/* Гос . ценные бумаги */
		return await this.getOneRow('2', 'Гос. ценные бумаги', '', this.governmentBillsQuery, true)
	} /* Гос . ценные бумаги */

	async drag_metals() {
		/* Драг. металы */
		return await this.getOneRow('3', 'Драг. металы', `code_coa='10909'`, null, true)
	} /* Драг. металы */

	async over_night() {
		/* Овернайт */
		return await this.getOneRow('4', 'Овернайт', `code_coa='10521'`, null, true)
	} /* Овернайт */

	async cb_accounts() {
		/* Счета в ЦБ Руз */
		return await this.getOneRow('5', 'Счета в ЦБ Руз', `code_coa like '103%'`, null, true)
	} /* Счета в ЦБ Руз */

	async correspondent_accounts() {
		/* Корреспондентский счет */
		return await this.getOneRow('-', 'Корреспондентский счет', `code_coa='10301'`)
	} /* Корреспондентский счет */

	async f_o_r() {
		/* ФОР */
		return await this.getOneRow('-', 'ФОР', `code_coa='10309'`)
	} /* ФОР */

	async funds_to_receive() {
		/* Средства к получению */
		return await this.getOneRow('-', 'Средства к получению', `code_coa='10311'`)
	} /* Средства к получению */

	async repo_transaction() {
		/* Репо сделки */
		return await this.getOneRow('-', 'Репо сделки', `code_coa like '223%'`)
	} /* Репо сделки */

	async interbank_deposits() {
		/* межбанковские депозиты */
		return await this.getOneRow(
			'-',
			'межбанковские депозиты',
			`CODE_COA IN ('10397', '10321', '10331')`
		)
	} /* межбанковские депозиты */

	async nostro_accounts() {
		/* НОСТРО счета */
		return await this.getOneRow('6', 'НОСТРО счета', `code_coa='10501'`, null, true)
	} /* НОСТРО счета */

	async vostro_accounts() {
		/* В том числе, Востро счета */
		return await this.getOneRow('', 'В том числе, Востро счета', `code_coa='21002'`)
	} /* В том числе, Востро счета */

	async local_banks() {
		/* Local Banks */
		return await this.getOneRow('2', '__LOCAL_BANKS__', '', this.localBanksQuery)
	} /* Local Banks */

	async vostro_filtered() {
		/* Vostro Filtered */
		return await this.getOneRow('2', '__VOSTRO_FILTERED__', '', this.vostroFilteredQuery)
	} /* Vostro Filtered */

	liquidity_assets_total(...args: any) {
		/* ВСЕГО ликвидных активов */
		const [total, nat_curr, for_curr, usa_dollar, evro] = this.columns.map((p) =>
			getLiquidityTotal(p, ...args)
		)
		return {
			count: 7,
			state: 'ВСЕГО ликвидных активов',
			total,
			nat_curr,
			for_curr,
			usa_dollar,
			evro,
			isTableHead: true
		}
	} /* ВСЕГО ликвидных активов */

	high_liq_assets_total(
		total_assets: any,
		f_o_r: any,
		repo_tr: any,
		vostr_accounts: any,
		localBanks: any
	) {
		/* ИТОГО ВЫСОКО ликвидных активов */
		const [total, nat_curr, for_curr, usa_dollar, evro] = this.columns.map(
			(p) => total_assets[p] - getLiquidityTotal(p, f_o_r, repo_tr, vostr_accounts) + localBanks[p]
		)
		return {
			count: 8,
			state: 'ИТОГО ВЫСОКО ликвидных активов',
			total,
			nat_curr,
			for_curr,
			usa_dollar,
			evro,
			isTableHead: true
		}
	} /* ИТОГО ВЫСОКО ликвидных активов */

	high_liq_assets_share(high_liq_assets_total: any, total_actives: any) {
		/* Доля высоколиквидных активов в % */
		const colValues = this.columns.map(
			(p) => `${((high_liq_assets_total[p] * 100) / total_actives[p]).toFixed(2)}`
		)
		return {
			count: 9,
			state: 'Доля высоколиквидных активов в %',
			...this.columns.reduce((acc, prop, i) => {
				// @ts-ignore
				acc[prop] = colValues[i] === 'Infinity' ? ' ' : colValues[i]
				return acc
			}, {}),
			isTableHead: true
		}
	} /* Доля высоколиквидных активов в % */

	async getRows() {
		const [
			totalActives,
			cashBox,
			governmentBills,
			dragMetals,
			overNight,
			cbAccounts,
			correspondentAccounts,
			F_O_R,
			fundsToReceive,
			repoTransaction,
			interbankDeposits,
			nostroAccounts,
			vostroAccounts,
			localBanks,
			vostroFiltered
		] = await Promise.all([
			this.total_actives(),
			this.cash_box(),
			this.government_bills(),
			this.drag_metals(),
			this.over_night(),
			this.cb_accounts(),
			this.correspondent_accounts(),
			this.f_o_r(),
			this.funds_to_receive(),
			this.repo_transaction(),
			this.interbank_deposits(),
			this.nostro_accounts(),
			this.vostro_accounts(),
			this.local_banks(),
			this.vostro_filtered()
		])
		const liquidityAssetsTotal = this.liquidity_assets_total(
			cashBox,
			cbAccounts,
			vostroFiltered,
			governmentBills
		)
		const highLiqAssetsTotal = this.high_liq_assets_total(
			liquidityAssetsTotal,
			F_O_R,
			repoTransaction,
			vostroAccounts,
			localBanks
		)
		const highLiqAssetsShare = this.high_liq_assets_share(highLiqAssetsTotal, totalActives)
		return [
			totalActives,
			cashBox,
			governmentBills,
			dragMetals,
			overNight,
			cbAccounts,
			liqInclude(),
			correspondentAccounts,
			F_O_R,
			fundsToReceive,
			repoTransaction,
			interbankDeposits,
			nostroAccounts,
			vostroAccounts,
			liquidityAssetsTotal,
			highLiqAssetsTotal,
			highLiqAssetsShare
		]
	}
}

export default LiquidityAssets
