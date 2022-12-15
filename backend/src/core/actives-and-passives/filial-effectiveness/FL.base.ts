import { Base } from '../../base'
import { IFilialEffectivenessData, IRoaRoeTotal } from './FL.interface'

export class FilialEffectivenessBase extends Base {
  protected formatQuery() {
    return `WITH CREDIT_PART AS (SELECT FILIAL_CODE,
                                        ROUND(SUM(TOTAL_LOAN) / POWER(10, 3))       AS TOTAL_LOAN,
                                        ROUND(SUM(CASE
                                                      WHEN OPER_DAY - OVERDUE_DATE < 30 THEN OVERDUE_SALDO
                                                      ELSE 0
                                            END) / POWER(10, 3))                    AS PAR_30,
                                        ROUND(SUM(CASE
                                                      WHEN (OPER_DAY - OVERDUE_DATE >= 30
                                                          AND OPER_DAY - OVERDUE_DATE < 60) THEN
                                                          OVERDUE_SALDO
                                                      ELSE 0
                                            END) / POWER(10, 3))                    AS PAR_60,
                                        ROUND(SUM(CASE
                                                      WHEN (OPER_DAY - OVERDUE_DATE >= 60
                                                          AND OPER_DAY - OVERDUE_DATE < 90) THEN
                                                          OVERDUE_SALDO
                                                      ELSE 0
                                            END) / POWER(10, 3))                    AS PAR_90,
                                        ROUND(SUM(CASE
                                                      WHEN (OPER_DAY - OVERDUE_DATE > 90)
                                                          OR (JUDICAL_SALDO <> 0) THEN
                                                          OVERDUE_SALDO + JUDICAL_SALDO
                                                      ELSE 0
                                            END) / POWER(10, 3))                    AS NPL,
                                        ROUND(SUM(ACCRUED_INTEREST) / POWER(10, 3)) AS ACCRUED_INTEREST
                                 FROM CR.VIEW_CREDITS_DWH@RISK
                                 WHERE OPER_DAY = DATE '${this.date}'
                                 GROUP BY FILIAL_CODE),
                 RESOURCE_DEBT AS (SELECT SUBSTR(CLIENT_CODE, 4, 5)                     AS FILIAL_CODE,
                                          ROUND(SUM((SELECT /*+index_desc(s UK_SALDO_ACCOUNT_DAY)*/
                                                         ABS(SALDO_EQUIVAL_OUT)
                                                     FROM IBS.SALDO@IABS S
                                                     WHERE S.ACCOUNT_CODE = AC.CODE
                                                       AND OPER_DAY <= DATE '${this.date}'
                                                       AND ROWNUM = 1)) / POWER(10, 5)) AS RESOURCE_DEBT
                                   FROM IBS.ACCOUNTS@IABS AC
                                   WHERE CODE_COA = '16102'
                                     AND CODE_FILIAL = '00873'
                                   GROUP BY SUBSTR(CLIENT_CODE, 4, 5)),
                 BENIFIT_FILIAL
                     AS (SELECT MFO,
                                ROUND(SUM(SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ) / POWER(10, 5)) AS
                                    BENEFIT
                         FROM IBS.SVOD_SALDO_DUMP@IABS
                         WHERE DAT = DATE '${this.date}'
                           AND (SUBSTR(BAL, 1, 1) IN ('4', '5')
                             OR BAL = '31206')
                         GROUP BY MFO),
                 ADDITIONAL_CLAIMS
                     AS (SELECT MFO,
                                ROUND(ABS(SUM(SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ) / POWER(10, 5)
                                    )) AS
                                    DEPOSIT_202
                         FROM IBS.SVOD_SALDO_DUMP@IABS
                         WHERE DAT = DATE '${this.date}'
                           AND (BAL LIKE '202%')
                         GROUP BY MFO),
                 SAVINGS_DEPOSIT
                     AS (SELECT MFO,
                                ROUND(ABS(SUM(SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ) / POWER(10, 5)
                                    )) AS
                                    DEPOSIT_204
                         FROM IBS.SVOD_SALDO_DUMP@IABS
                         WHERE DAT = DATE '${this.date}'
                           AND (BAL LIKE '204%')
                         GROUP BY MFO),
                 TIME_DEPOSIT
                     AS (SELECT MFO,
                                ROUND(ABS(SUM(SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ) / POWER(10, 5)
                                    )) AS
                                    DEPOSIT_206
                         FROM IBS.SVOD_SALDO_DUMP@IABS
                         WHERE DAT = DATE '${this.date}'
                           AND (BAL LIKE '206%')
                         GROUP BY MFO),
                 CAPITAL
                     AS (SELECT MFO,
                                ROUND(SUM(SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ) / POWER(10, 5)) AS
                                    TOTAL_CAPITAL
                         FROM IBS.SVOD_SALDO_DUMP@IABS
                         WHERE DAT = DATE '${this.date}'
                           AND (SUBSTR(BAL, 1, 3) IN ('303', '306', '309', '312')
                             OR SUBSTR(BAL, 1, 1) IN ('4', '5'))
                         GROUP BY MFO),
                 ASSETS
                     AS (SELECT MFO,
                                ROUND(ABS(SUM(SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ) / POWER(10, 5)
                                    )) AS
                                    TOTAL_ASSETS
                         FROM IBS.SVOD_SALDO_DUMP@IABS
                         WHERE DAT = DATE '${this.date}'
                           AND (BAL LIKE '1%'
                             AND SUBSTR(BAL, 1, 3) NOT IN ('161', '175'))
                         GROUP BY MFO)
            SELECT CREDIT_PART.FILIAL_CODE                      AS "mfo",
                   FD.UZB_NAME                                  AS "filialName",
                   NVL(DEPOSIT_202, 0)                          AS "deposit202",
                   NVL(DEPOSIT_204, 0)                          AS "deposit204",
                   NVL(DEPOSIT_206, 0)                          AS "deposit206",
                   CREDIT_PART.TOTAL_LOAN                       AS "totalLoan",
                   (PAR_30 + PAR_60 + PAR_90 + NPL)             AS "issuedLoans",
                   PAR_30                                       AS "par30",
                   PAR_60                                       AS "par60",
                   PAR_90                                       AS "par90",
                   NPL                                          AS "npl",
                   ROUND(100 * NPL / TOTAL_LOAN, 1)             AS "nplPercent",
                   ACCRUED_INTEREST                             AS "accruedInterest",
                   ROUND(((100 * BENEFIT /
                           (SELECT DATE '${this.date}' - TRUNC(DATE '${this.date}', 'YYYY') AS DAY
                            FROM DUAL)) * 365) / TOTAL_ASSETS)  AS "roa",
                   ROUND(((100 * BENEFIT /
                           (SELECT DATE '${this.date}' - TRUNC(DATE '${this.date}', 'YYYY') AS DAY
                            FROM DUAL)) * 365) / TOTAL_CAPITAL) AS "roe",
                   RESOURCE_DEBT.RESOURCE_DEBT                  AS "resourceDebt",
                   BENIFIT_FILIAL.BENEFIT                       AS "benefitInMonth"
            FROM CREDIT_PART
                     LEFT OUTER JOIN FILIAL_DICTIONARY FD
                                     ON FD.FILIAL_CODE = CREDIT_PART.FILIAL_CODE
                     LEFT OUTER JOIN RESOURCE_DEBT
                                     ON CREDIT_PART.FILIAL_CODE = RESOURCE_DEBT.FILIAL_CODE
                     LEFT OUTER JOIN BENIFIT_FILIAL
                                     ON BENIFIT_FILIAL.MFO = CREDIT_PART.FILIAL_CODE
                     LEFT OUTER JOIN ADDITIONAL_CLAIMS
                                     ON ADDITIONAL_CLAIMS.MFO = CREDIT_PART.FILIAL_CODE
                     LEFT OUTER JOIN SAVINGS_DEPOSIT
                                     ON SAVINGS_DEPOSIT.MFO = CREDIT_PART.FILIAL_CODE
                     LEFT OUTER JOIN TIME_DEPOSIT
                                     ON TIME_DEPOSIT.MFO = CREDIT_PART.FILIAL_CODE
                     LEFT OUTER JOIN CAPITAL
                                     ON CAPITAL.MFO = CREDIT_PART.FILIAL_CODE
                     LEFT OUTER JOIN ASSETS
                                     ON ASSETS.MFO = CREDIT_PART.FILIAL_CODE`
  }

  protected totalRoaQuery = () => {
    return `SELECT (SELECT ROUND((SELECT SUM(SALDO_ACTIVE + SALDO_PASSIVE)
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
                                 2)
                    FROM DUAL) AS "total"
            FROM IBS.DAY_OPERATIONAL@IABS
            WHERE DAY_STATUS = 1
              AND (OPER_DAY = DATE '${this.date}')
            ORDER BY OPER_DAY
    `
  }

  protected totalRoeQuery = () => {
    return `SELECT (SELECT ROUND((SELECT SUM(SALDO_ACTIVE + SALDO_PASSIVE)
                                  FROM IBS.SVOD_SALDO_DUMP@IABS
                                  WHERE DAT = OPER_DAY
                                    AND (BAL LIKE '4%'
                                      OR BAL LIKE '5%'
                                      OR BAL = '31206')) *
                                 (365 / TO_NUMBER(OPER_DAY - TRUNC(OPER_DAY, 'YYYY'))) /
                                 (SELECT SUM(SALDO_ACTIVE_EQ + SALDO_PASSIVE_EQ)
                                  FROM IBS.SVOD_SALDO_DUMP@IABS
                                  WHERE DAT = OPER_DAY
                                    AND (BAL LIKE '3%')) * 100, 2)
                    FROM DUAL) AS "total"
            FROM IBS.DAY_OPERATIONAL@IABS
            WHERE DAY_STATUS = 1
              AND (OPER_DAY = DATE '${this.date}')
            ORDER BY OPER_DAY
    `
  }

  getRoa = async () => {
    const { total } = await this.getDataInDates<IRoaRoeTotal>(undefined, this.totalRoaQuery)
    return total
  }

  getRoe = async () => {
    const { total } = await this.getDataInDates<IRoaRoeTotal>(undefined, this.totalRoeQuery)
    return total
  }

  async getRows() {
    await this.getBeforeDate()
    const allData = await this.getDataInDates<IFilialEffectivenessData, true>(
      'true',
      undefined,
      true
    )
    const roaTotal = await this.getRoa()
    const roeTotal = await this.getRoe()
    return [allData, roaTotal, roeTotal]
  }
}
