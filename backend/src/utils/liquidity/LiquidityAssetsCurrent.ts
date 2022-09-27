import LiquidityAssets from './LiquidityAssets'

/* eslint-disable camelcase */
class LiquidityAssetsCurrent extends LiquidityAssets {
	constructor(_date?: string) {
		super('')
	}

	formatQuery(date: string, whereQuery = `CODE_COA LIKE '101%'`) {
		return `SELECT ABS((NVL(UZS_SE, 0) + NVL(EUR_SE, 0) + NVL(USD_SE, 0) 
                + NVL(RUB_SE, 0) + NVL(JPY_SE, 0) + NVL(KZT_SE, 0) +
                NVL(GBP_SE, 0) + NVL(CHF_SE, 0) + NVL(CHN_SE, 0)))              AS TOTAL,
           ABS(UZS) NAT_CURR,
           ABS(ROUND((NVL(USD_SE, 0) + NVL(EUR_SE, 0) + NVL(RUB_SE, 0) 
                          + NVL(JPY_SE, 0) + NVL(KZT_SE, 0) + NVL(GBP_SE, 0) +
                      NVL(CHF_SE, 0) + NVL(CHN_SE, 0)) /
                     (SELECT EQUIVAL
                         FROM IBS.S_RATE_CUR@IABS
                         WHERE CODE = '840' AND DATE_CROSS<SYSDATE
                         ORDER BY DATE_CROSS DESC FETCH FIRST 1 ROWS ONLY), 2)) AS FOR_CURR,
           ABS(NVL(USD, 0))                                                     AS USA_DOLLAR,
           ABS(NVL(EUR, 0))                                                     AS EVRO
    FROM (
        SELECT CODE_CURRENCY,
               ROUND(SUM(SALDO_OUT) / POWER(10, 8), 2)         AS SALDO_OUT,
               ROUND(SUM(SALDO_EQUIVAL_OUT) / POWER(10, 8), 2) AS SALDO_EQUIVAL_OUT
        FROM IBS.ACCOUNTS@IABS
        WHERE ${whereQuery}
        GROUP BY CODE_CURRENCY)
        PIVOT ( SUM(NVL(SALDO_OUT, 0)), SUM(NVL(SALDO_EQUIVAL_OUT, 0)) 
            AS SE FOR CODE_CURRENCY IN ('000' AS UZS,
            '840' AS USD,
            '978' AS EUR,
            '643' AS RUB,
            '392' AS JPY,
            '398' AS KZT,
            '826' AS GBP,
            '756' AS CHF,
            '156' AS CHN) )`
	}

	localBanksQuery() {
		return `SELECT (SELECT ROUND(SUM(SALDO_EQUIVAL_OUT) / POWER(10, 8), 2)
                        FROM IBS.ACCOUNTS@IABS AC
                                 JOIN BANK_DICTIONARY BD
                                      ON AC.CLIENT_CODE = CONCAT('000', BD.CLIENT_CODE)
                        WHERE AC.CODE_COA = '21002')            AS TOTAL,
                   (SELECT ROUND(SUM(SALDO_EQUIVAL_OUT) / POWER(10, 8), 2)
                        FROM IBS.ACCOUNTS@IABS AC
                                 JOIN BANK_DICTIONARY BD
                                      ON AC.CLIENT_CODE = CONCAT('000', BD.CLIENT_CODE)
                        WHERE AC.CODE_COA = '21002'
                          AND CODE_CURRENCY = '000')            AS NAT_CURR,
                   (SELECT ROUND(
                           FOR_CURR_SUM / (POWER(10, 8) * (SELECT EQUIVAL
                                                           FROM IBS.S_RATE_CUR@IABS
                   WHERE CODE = '840' ORDER BY DATE_CROSS DESC FETCH FIRST 1 ROWS ONLY)), 2)
                        FROM ((SELECT SUM(SALDO_EQUIVAL_OUT) AS FOR_CURR_SUM
                               FROM IBS.ACCOUNTS@IABS AC
                                        JOIN BANK_DICTIONARY BD
                                             ON AC.CLIENT_CODE = CONCAT('000', BD.CLIENT_CODE)
                               WHERE AC.CODE_COA = '21002'
                                 AND CODE_CURRENCY <> '000'))) AS FOR_CURR,
                   (SELECT ROUND(SUM(SALDO_OUT) / POWER(10, 8), 2)
                        FROM IBS.ACCOUNTS@IABS AC
                                 JOIN BANK_DICTIONARY BD
                                      ON AC.CLIENT_CODE = CONCAT('000', BD.CLIENT_CODE)
                        WHERE AC.CODE_COA = '21002'
                          AND CODE_CURRENCY = '840')            AS USA_DOLLAR,
                   (SELECT ROUND(SUM(SALDO_OUT) / POWER(10, 8), 2)
                        FROM IBS.ACCOUNTS@IABS AC
                                 JOIN BANK_DICTIONARY BD
                                      ON AC.CLIENT_CODE = CONCAT('000', BD.CLIENT_CODE)
                        WHERE AC.CODE_COA = '21002'
                          AND CODE_CURRENCY = '978')            AS EVRO
                FROM DUAL`
	}

	vostroFilteredQuery(_date: string) {
		return `SELECT FOR_CURR                      AS TOTAL,
                   NAT_CURR,
                   ROUND(FOR_CURR / USD_RATE, 2) AS FOR_CURR,
                   USA_DOLLAR,
                   EVRO
            FROM (SELECT 0                            AS NAT_CURR,
                         (SELECT ROUND(ABS(SUM(SALDO_EQUIVAL_OUT) / POWER(10, 8)), 2)
                          FROM IBS.ACCOUNTS@IABS AC
                                   JOIN BANK_INFO_RATING BR
                                        ON BR.CLIENT_CODE = AC.CLIENT_CODE
                          WHERE CODE_COA IN ('10501', '10521')
                            AND AC.CODE_CURRENCY != '000'
                            AND BR.RATING_STATUS = 1) AS FOR_CURR,
                         (SELECT ROUND(ABS(SUM(SALDO_OUT) / POWER(10, 8)), 2)
                          FROM IBS.ACCOUNTS@IABS AC
                                   JOIN BANK_INFO_RATING BR
                                        ON BR.CLIENT_CODE = AC.CLIENT_CODE
                          WHERE CODE_COA IN ('10501', '10521')
                            AND AC.CODE_CURRENCY = '840'
                            AND BR.RATING_STATUS = 1) AS USA_DOLLAR,
                         (SELECT ROUND(ABS(SUM(SALDO_OUT) / POWER(10, 8)), 2)
                          FROM IBS.ACCOUNTS@IABS AC
                                   JOIN BANK_INFO_RATING BR
                                        ON BR.CLIENT_CODE = AC.CLIENT_CODE
                          WHERE CODE_COA IN ('10501', '10521')
                            AND AC.CODE_CURRENCY = '978'
                            AND BR.RATING_STATUS = 1) AS EVRO,
                         (SELECT EQUIVAL
                          FROM IBS.S_RATE_CUR@IABS CURS
                                   JOIN IBS.DAY_OPERATIONAL@IABS DAY
                                        ON DAY.OPER_DAY = CURS.DATE_CROSS
                          WHERE DATE_CROSS < SYSDATE
                            AND CODE = '840'
                            AND DAY.DAY_STATUS = 1
                          ORDER BY DATE_CROSS DESC
                              FETCH FIRST ROW ONLY)   AS USD_RATE
                  FROM DUAL)`
	}

	async total_actives() {
		/* Всего активы (чистые) */
		return await this.getOneRow(
			'',
			'Всего активы (чистые)',
			`CODE_COA LIKE '1%'
                     AND CODE_COA NOT LIKE '161%'
                     AND CODE_COA NOT LIKE '175%'`,
			null,
			true
		)
	} /* Всего активы (чистые) */

	async government_bills() {
		/* Гос . ценные бумаги */
		return await this.getOneRow(
			'2',
			'Гос . ценные бумаги',
			`CODE_COA LIKE '107%' AND CODE_COA != '10793'`,
			null,
			true
		)
	} /* Гос . ценные бумаги */
}

export default LiquidityAssetsCurrent
