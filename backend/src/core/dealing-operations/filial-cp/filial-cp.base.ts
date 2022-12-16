import { Base } from '../../base'
import { OracleService } from '../../../oracle/oracle.service'
import { IFilialCpDbData } from './filial-cp.interface'

export class FilialCpBase extends Base {
  constructor(
    private readonly firstDate: Date,
    private readonly secondDate: Date,
    private readonly currencyCode: string,
    oracleService: OracleService
  ) {
    super(secondDate, oracleService)
  }

  protected formatQuery() {
    return `SELECT UZB_NAME                                AS "filialName",
                   (SELECT SUM((SELECT SUM(CREDIT) / 100
                                FROM IBS.DWH_PERSONAL_ACCOUNTS@IABS
                                WHERE ACC_ID = AC.ID
                                  AND OPER_DAY BETWEEN DATE '${this.firstDate}' AND DATE
                                        '${this.secondDate}'))
                    FROM IBS.ACCOUNTS@IABS AC
                    WHERE CODE_COA = '17101'
                      AND CODE LIKE '%555'
                      AND CODE_CURRENCY = '${this.currencyCode}'
                      AND AC.CODE_FILIAL = FD.FILIAL_CODE) AS "purchase1",
                   (SELECT SUM((SELECT SUM(DEBIT) / 100
                                FROM IBS.DWH_PERSONAL_ACCOUNTS@IABS
                                WHERE ACC_ID = AC.ID
                                  AND OPER_DAY BETWEEN DATE '${this.firstDate}' AND DATE
                                        '${this.secondDate}'))
                    FROM IBS.ACCOUNTS@IABS AC
                    WHERE CODE_COA = '17101'
                      AND CODE LIKE '%555'
                      AND CODE_CURRENCY = '${this.currencyCode}'
                      AND AC.CODE_FILIAL = FD.FILIAL_CODE) AS "sale1",
                   (SELECT SUM((SELECT SUM(CREDIT) / 100
                                FROM IBS.DWH_PERSONAL_ACCOUNTS@IABS
                                WHERE ACC_ID = AC.ID
                                  AND OPER_DAY BETWEEN DATE '${this.firstDate}' AND DATE
                                        '${this.secondDate}'))
                    FROM IBS.ACCOUNTS@IABS AC
                    WHERE CODE_COA = '17101'
                      AND CODE LIKE '%04'
                      AND CODE_CURRENCY = '${this.currencyCode}'
                      AND AC.CODE_FILIAL = FD.FILIAL_CODE) AS "purchase2",
                   (SELECT SUM((SELECT SUM(DEBIT) / 100
                                FROM IBS.DWH_PERSONAL_ACCOUNTS@IABS
                                WHERE ACC_ID = AC.ID
                                  AND OPER_DAY BETWEEN DATE '${this.firstDate}' AND DATE
                                        '${this.secondDate}'))
                    FROM IBS.ACCOUNTS@IABS AC
                    WHERE CODE_COA = '17101'
                      AND CODE LIKE '%04'
                      AND CODE_CURRENCY = '${this.currencyCode}'
                      AND AC.CODE_FILIAL = FD.FILIAL_CODE) AS "sale2",
                   (SELECT SUM((SELECT SUM(CREDIT) / 100
                                FROM IBS.DWH_PERSONAL_ACCOUNTS@IABS
                                WHERE ACC_ID = AC.ID
                                  AND OPER_DAY BETWEEN DATE '${this.firstDate}' AND DATE
                                        '${this.secondDate}'))
                    FROM IBS.ACCOUNTS@IABS AC
                    WHERE CODE_COA = '17101'
                      AND CODE LIKE '%07'
                      AND CODE_CURRENCY = '${this.currencyCode}'
                      AND AC.CODE_FILIAL = FD.FILIAL_CODE) AS "purchase3",
                   (SELECT SUM((SELECT SUM(DEBIT) / 100
                                FROM IBS.DWH_PERSONAL_ACCOUNTS@IABS
                                WHERE ACC_ID = AC.ID
                                  AND OPER_DAY BETWEEN DATE '${this.firstDate}' AND DATE
                                        '${this.secondDate}'))
                    FROM IBS.ACCOUNTS@IABS AC
                    WHERE CODE_COA = '17101'
                      AND CODE LIKE '%07'
                      AND CODE_CURRENCY = '${this.currencyCode}'
                      AND AC.CODE_FILIAL = FD.FILIAL_CODE) AS "sale3",
                   (SELECT SUM((SELECT SUM(CREDIT) / 100
                                FROM IBS.DWH_PERSONAL_ACCOUNTS@IABS
                                WHERE ACC_ID = AC.ID
                                  AND OPER_DAY BETWEEN DATE '${this.firstDate}' AND DATE
                                        '${this.secondDate}'))
                    FROM IBS.ACCOUNTS@IABS AC
                    WHERE CODE_COA = '17101'
                      AND CODE LIKE '%14'
                      AND CODE_CURRENCY = '${this.currencyCode}'
                      AND AC.CODE_FILIAL = FD.FILIAL_CODE) AS "purchase4",
                   (SELECT SUM((SELECT SUM(DEBIT) / 100
                                FROM IBS.DWH_PERSONAL_ACCOUNTS@IABS
                                WHERE ACC_ID = AC.ID
                                  AND OPER_DAY BETWEEN DATE '${this.firstDate}' AND DATE
                                        '${this.secondDate}'))
                    FROM IBS.ACCOUNTS@IABS AC
                    WHERE CODE_COA = '17101'
                      AND CODE LIKE '%14'
                      AND CODE_CURRENCY = '${this.currencyCode}'
                      AND AC.CODE_FILIAL = FD.FILIAL_CODE) AS "sale4",
                   (SELECT SUM((SELECT SUM(CREDIT) / 100
                                FROM IBS.DWH_PERSONAL_ACCOUNTS@IABS
                                WHERE ACC_ID = AC.ID
                                  AND OPER_DAY BETWEEN DATE '${this.firstDate}' AND DATE
                                        '${this.secondDate}'))
                    FROM IBS.ACCOUNTS@IABS AC
                    WHERE CODE_COA = '17101'
                      AND CODE LIKE '%158'
                      AND CODE_CURRENCY = '${this.currencyCode}'
                      AND AC.CODE_FILIAL = FD.FILIAL_CODE) AS "purchase5",
                   (SELECT SUM((SELECT SUM(DEBIT) / 100
                                FROM IBS.DWH_PERSONAL_ACCOUNTS@IABS
                                WHERE ACC_ID = AC.ID
                                  AND OPER_DAY BETWEEN DATE '${this.firstDate}' AND DATE
                                        '${this.secondDate}'))
                    FROM IBS.ACCOUNTS@IABS AC
                    WHERE CODE_COA = '17101'
                      AND CODE LIKE '%158'
                      AND CODE_CURRENCY = '${this.currencyCode}'
                      AND AC.CODE_FILIAL = FD.FILIAL_CODE) AS "sale5",
                   (SELECT SUM((SELECT SUM(CREDIT) / 100
                                FROM IBS.DWH_PERSONAL_ACCOUNTS@IABS
                                WHERE ACC_ID = AC.ID
                                  AND OPER_DAY BETWEEN DATE '${this.firstDate}' AND DATE
                                        '${this.secondDate}'))
                    FROM IBS.ACCOUNTS@IABS AC
                    WHERE CODE_COA = '17101'
                      AND SUBSTR(CODE, -3) = DECODE(CODE_CURRENCY, '840', '150',
                                                    '643', '152',
                                                    '978', '153',
                                                    '392', '153')
                      AND CODE_CURRENCY = '${this.currencyCode}'
                      AND AC.CODE_FILIAL = FD.FILIAL_CODE) AS "purchase6",
                   (SELECT SUM((SELECT SUM(DEBIT) / 100
                                FROM IBS.DWH_PERSONAL_ACCOUNTS@IABS
                                WHERE ACC_ID = AC.ID
                                  AND OPER_DAY BETWEEN DATE '${this.firstDate}' AND DATE
                                        '${this.secondDate}'))
                    FROM IBS.ACCOUNTS@IABS AC
                    WHERE CODE_COA = '17101'
                      AND SUBSTR(CODE, -3) = DECODE(CODE_CURRENCY, '840', '150',
                                                    '643', '152',
                                                    '978', '153',
                                                    '392', '153')
                      AND CODE_CURRENCY = '${this.currencyCode}'
                      AND AC.CODE_FILIAL = FD.FILIAL_CODE) AS "sale6",
                   (SELECT SUM((SELECT SUM(CREDIT) / 100
                                FROM IBS.DWH_PERSONAL_ACCOUNTS@IABS
                                WHERE ACC_ID = AC.ID
                                  AND OPER_DAY BETWEEN DATE '${this.firstDate}' AND DATE
                                        '${this.secondDate}'))
                    FROM IBS.ACCOUNTS@IABS AC
                    WHERE CODE_COA = '17101'
                      AND CODE LIKE '%901'
                      AND CODE_CURRENCY = '${this.currencyCode}'
                      AND AC.CODE_FILIAL = FD.FILIAL_CODE) AS "purchase7",
                   (SELECT SUM((SELECT SUM(DEBIT) / 100
                                FROM IBS.DWH_PERSONAL_ACCOUNTS@IABS
                                WHERE ACC_ID = AC.ID
                                  AND OPER_DAY BETWEEN DATE '${this.firstDate}' AND DATE
                                        '${this.secondDate}'))
                    FROM IBS.ACCOUNTS@IABS AC
                    WHERE CODE_COA = '17101'
                      AND CODE LIKE '%901'
                      AND CODE_CURRENCY = '${this.currencyCode}'
                      AND AC.CODE_FILIAL = FD.FILIAL_CODE) AS "sale7",
                   (SELECT SUM((SELECT SUM(CREDIT) / 100
                                FROM IBS.DWH_PERSONAL_ACCOUNTS@IABS
                                WHERE ACC_ID = AC.ID
                                  AND OPER_DAY BETWEEN DATE '${this.firstDate}' AND DATE
                                        '${this.secondDate}'))
                    FROM IBS.ACCOUNTS@IABS AC
                    WHERE CODE_COA = '17101'
                      AND CODE LIKE '%112'
                      AND CODE_CURRENCY = '${this.currencyCode}'
                      AND AC.CODE_FILIAL = FD.FILIAL_CODE) AS "purchase8",
                   (SELECT SUM((SELECT SUM(DEBIT) / 100
                                FROM IBS.DWH_PERSONAL_ACCOUNTS@IABS
                                WHERE ACC_ID = AC.ID
                                  AND OPER_DAY BETWEEN DATE '${this.firstDate}' AND DATE
                                        '${this.secondDate}'))
                    FROM IBS.ACCOUNTS@IABS AC
                    WHERE CODE_COA = '17101'
                      AND CODE LIKE '%112'
                      AND CODE_CURRENCY = '${this.currencyCode}'
                      AND AC.CODE_FILIAL = FD.FILIAL_CODE) AS "sale8",
                   (SELECT SUM((SELECT SUM(CREDIT) / 100
                                FROM IBS.DWH_PERSONAL_ACCOUNTS@IABS
                                WHERE ACC_ID = AC.ID
                                  AND OPER_DAY BETWEEN DATE '${this.firstDate}' AND DATE
                                        '${this.secondDate}'))
                    FROM IBS.ACCOUNTS@IABS AC
                    WHERE CODE_COA = '17101'
                      AND CODE LIKE '%100'
                      AND CODE_CURRENCY = '${this.currencyCode}'
                      AND AC.CODE_FILIAL = FD.FILIAL_CODE) AS "purchase9",
                   (SELECT SUM((SELECT SUM(DEBIT) / 100
                                FROM IBS.DWH_PERSONAL_ACCOUNTS@IABS
                                WHERE ACC_ID = AC.ID
                                  AND OPER_DAY BETWEEN DATE '${this.firstDate}' AND DATE
                                        '${this.secondDate}'))
                    FROM IBS.ACCOUNTS@IABS AC
                    WHERE CODE_COA = '17101'
                      AND CODE LIKE '%100'
                      AND CODE_CURRENCY = '${this.currencyCode}'
                      AND AC.CODE_FILIAL = FD.FILIAL_CODE) AS "sale9"
            FROM FILIAL_DICTIONARY FD`
  }

  protected getSumQuery = () => {
    return `SELECT 'Итого'          AS "filialName",
                   SUM("purchase1") AS "purchase1",
                   SUM("sale1")     AS "sale1",
                   SUM("purchase2") AS "purchase2",
                   SUM("sale2")     AS "sale2",
                   SUM("purchase3") AS "purchase3",
                   SUM("sale3")     AS "sale3",
                   SUM("purchase4") AS "purchase4",
                   SUM("sale4")     AS "sale4",
                   SUM("purchase5") AS "purchase5",
                   SUM("sale5")     AS "sale5",
                   SUM("purchase6") AS "purchase6",
                   SUM("sale6")     AS "sale6",
                   SUM("purchase7") AS "purchase7",
                   SUM("sale7")     AS "sale7",
                   SUM("purchase8") AS "purchase8",
                   SUM("sale8")     AS "sale8",
                   SUM("purchase9") AS "purchase9",
                   SUM("sale9")     AS "sale9"
            FROM (${this.formatQuery()})`
  }

  async getRows() {
    const allData = await this.getDataInDates<IFilialCpDbData, true>('1=1', undefined, true)
    const sumData = await this.getDataInDates<IFilialCpDbData>(undefined, this.getSumQuery)
    allData.push(sumData)
    return allData
  }
}
