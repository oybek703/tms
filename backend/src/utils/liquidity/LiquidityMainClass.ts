import MainClass, { OwnQuery } from '../mainClass'

const { createLiqPointersData } = require('./liq_pure_functions')

class LiquidityMainClass extends MainClass {
	columns: string[]

	constructor(date: string) {
		super(date)
		this.columns = ['total', 'nat_curr', 'for_curr', 'usa_dollar', 'evro']
	}

	formatQuery(date: string, whereQuery = `code_coa like '101%'`) {
		return `SELECT TOTAL,
                     NAT_CURR,
                     ROUND((TOTAL - NAT_CURR) / (SELECT EQUIVAL
                                                 FROM IBS.S_RATE_CUR@IABS
                                                 WHERE DATE_CROSS = (SELECT MAX(DATE_CROSS)
                                                                     FROM IBS.S_RATE_CUR@IABS
                                                                     WHERE CODE = '840' AND DATE_CROSS < TO_DATE('${date}', 'DD.MM.YYYY'))
                                                   AND CODE = '840'), 2) AS FOR_CURR,
                     USA_DOLLAR,
                     EVRO
              FROM (SELECT (SELECT ROUND(ABS(SUM((SELECT
                                                      /*+index_desc(s UK_SALDO_ACCOUNT_DAY)*/
                                                      SALDO_EQUIVAL_OUT
                                                  FROM IBS.SALDO@IABS S
                                                  WHERE S.ACCOUNT_CODE = AC.CODE
                                                    AND OPER_DAY < TO_DATE('${date}', 'DD.MM.YYYY')
                                                    AND ROWNUM = 1))) / POWER(10, 8), 2) AS SALDO_OUT
                            FROM IBS.ACCOUNTS@IABS AC
                            WHERE ${whereQuery})  AS TOTAL,
                           (SELECT ROUND(ABS(SUM((SELECT
                                                      /*+index_desc(s UK_SALDO_ACCOUNT_DAY)*/
                                                      SALDO_OUT
                                                  FROM IBS.SALDO@IABS S
                                                  WHERE S.ACCOUNT_CODE = AC.CODE
                                                    AND OPER_DAY < TO_DATE('${date}', 'DD.MM.YYYY')
                                                    AND ROWNUM = 1))) / POWER(10, 8), 2 ) AS SALDO_OUT
                            FROM IBS.ACCOUNTS@IABS AC
                            WHERE ${whereQuery}
                              AND CODE_CURRENCY = '000') AS NAT_CURR,
                           (SELECT ROUND(ABS(SUM((SELECT
                                                      /*+index_desc(s UK_SALDO_ACCOUNT_DAY)*/
                                                      SALDO_OUT
                                                  FROM IBS.SALDO@IABS S
                                                  WHERE S.ACCOUNT_CODE = AC.CODE
                                                    AND OPER_DAY < TO_DATE('${date}', 'DD.MM.YYYY') 
                                                    AND ROWNUM = 1))) / POWER(10, 8), 2) AS SALDO_OUT
                            FROM IBS.ACCOUNTS@IABS AC
                            WHERE ${whereQuery}
                              AND CODE_CURRENCY = '840') AS USA_DOLLAR,
                           (SELECT ROUND(ABS(SUM((SELECT
                                                      /*+index_desc(s UK_SALDO_ACCOUNT_DAY)*/
                                                      SALDO_OUT
                                                  FROM IBS.SALDO@IABS S
                                                  WHERE S.ACCOUNT_CODE = AC.CODE
                                                    AND OPER_DAY < TO_DATE( '${date}', 'DD.MM.YYYY') 
                                                    AND ROWNUM = 1))) / POWER(10, 8), 2 ) AS SALDO_OUT
                            FROM IBS.ACCOUNTS@IABS AC
                            WHERE ${whereQuery}
                              AND CODE_CURRENCY = '978') AS EVRO
                    FROM DUAL)`
	}

	liquidityQuery(role: string) {
		return function (date: string) {
			return `SELECT * FROM (SELECT * FROM LIQUIDITY ORDER BY OPER_DAY DESC)
                WHERE OPER_DAY<TO_DATE('${date}', 'DD-MM-YYYY') AND ROLE='${role}' AND ROWNUM=1`
		}
	}

	async getOneRow(
		count?: string,
		state?: string,
		codeCoa = '',
		ownQuery: OwnQuery = null,
		isTableHead = false
	) {
		if (!codeCoa) {
			const { TOTAL, NAT_CURR, FOR_CURR, USA_DOLLAR, EVRO } = await this.getDataInDates(
				'',
				ownQuery
			)
			return createLiqPointersData(
				count,
				state,
				TOTAL,
				NAT_CURR,
				FOR_CURR,
				USA_DOLLAR,
				EVRO,
				isTableHead
			)
		}
		const { TOTAL, NAT_CURR, FOR_CURR, USA_DOLLAR, EVRO } = await this.getDataInDates(codeCoa)
		return createLiqPointersData(
			count,
			state,
			TOTAL,
			NAT_CURR,
			FOR_CURR,
			USA_DOLLAR,
			EVRO,
			isTableHead
		)
	}
}

export default LiquidityMainClass
