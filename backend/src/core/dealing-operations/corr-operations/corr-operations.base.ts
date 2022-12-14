import { Base } from '../../base'
import { OracleService } from '../../../oracle/oracle.service'
import {
  CorrOperationsQueries,
  IBankDbData,
  IBankList,
  ICorrOperationsDbData,
  IRemainderDbData
} from './corr-operations.interface'

export class CorrOperationsBase extends Base {
  constructor(
    private readonly firstDate: Date,
    private readonly secondDate: Date,
    private readonly currencyCode: string,
    oracleService: OracleService,
    private readonly clientCode: string | undefined
  ) {
    super(firstDate, oracleService)
  }

  protected formatQuery(whereQuery: CorrOperationsQueries) {
    return `SELECT BI.SHORT_NAME                                AS "bankNameOrYear",
                   ROUND(SUM(NVL(DEBIT, 0)) / POWER(10, 8), 2)  AS "debit",
                   ROUND(SUM(NVL(CREDIT, 0)) / POWER(10, 8), 2) AS "credit"
            FROM IBS.DWH_PERSONAL_ACCOUNTS@IABS
                     JOIN BANK_INFO_RATING BI
                          ON BI.CLIENT_CODE = SUBSTR(ACCOUNT_CODE, 10, 8)
            WHERE ACC_ID IN (SELECT ID
                             FROM IBS.ACCOUNTS@IABS
                             WHERE CODE_COA = '10501'
                               AND CODE_FILIAL = '00873')
              AND ${whereQuery}
              AND OPER_DAY BETWEEN DATE '${this.firstDate}' AND DATE '${this.secondDate}'
              AND CURRENCY_CODE = '${this.currencyCode}'
            GROUP BY SUBSTR(ACCOUNT_CODE, 10, 8),
                     BI.SHORT_NAME
            ORDER BY "debit" DESC`
  }

  protected bankListQuery = () => {
    return `SELECT DISTINCT AC.CLIENT_CODE AS "clientCode",
                            BR.SHORT_NAME  AS "bankName"
            FROM IBS.ACCOUNTS@IABS AC
                     LEFT OUTER JOIN BANK_INFO_RATING BR
                                     ON BR.CLIENT_CODE = AC.CLIENT_CODE
            WHERE AC.CODE_COA = '10501'
              AND AC.CONDITION = 'A'
              AND AC.CODE_FILIAL = '00873'`
  }

  protected bankDataQuery = () => {
    return `SELECT COUNTRY            AS "country",
                   CLIENT_CODE        AS "clientCode",
                   SWIFT_CODE         AS "swiftCode",
                   DATE_OPEN          AS "dateOpen",
                   VOLUME_OPERATIONS  AS "volumeOperations",
                   SERVICE_SPEED      AS "serviceSpeed",
                   SERVICE_QUALITY    AS "serviceQuality",
                   SERVICE_COST       AS "serviceCost",
                   CORR_ACCOUNTS      AS "corrAccounts",
                   GEN_AGREEMENT      AS "genAgreement",
                   ISDA               AS "isda",
                   OTHER_AGREEMENT    AS "otherAgrement",
                   IMPORTS            AS "imports",
                   EXPORTS            AS "exports",
                   TRADING_FIN        AS "tradingFin",
                   INTER_BANK_DEPOSIT AS "interbankDeposits",
                   CREDIT_LINE        AS "creditLine",
                   FX                 AS "conversionAccounts",
                   VOSTRO             AS "vostro",
                   OTHER_OPERATIONS   AS "otherOperations"
            FROM (SELECT C.NAME AS country,
                         BR.CLIENT_CODE,
                         BR.SWIFT_CODE,
                         BR.DATE_OPEN
                  FROM BANK_INFO_RATING BR
                           JOIN IBS.CLIENT_CURRENT@IABS CC
                                ON CC.CODE = BR.CLIENT_CODE
                           JOIN S_COUNTRYS C
                                ON C.CODE = CC.COUNTRY_CODE
                  WHERE CLIENT_CODE = '${this.clientCode}'),
                 (SELECT VOLUME_OPERATIONS,
                         SERVICE_SPEED,
                         SERVICE_QUALITY,
                         SERVICE_COST
                  FROM MATRIX_CORR_ACC
                  WHERE BANK_ID = (SELECT ID
                                   FROM BANK_INFO_RATING
                                   WHERE CLIENT_CODE = '${this.clientCode}')
                    AND CODE_CURRENCY = '${this.currencyCode}'),
                 (SELECT CORR_ACCOUNTS,
                         GEN_AGREEMENT,
                         ISDA,
                         OTHER_AGREEMENT
                  FROM MATRIX_CORR_ACC
                  WHERE BANK_ID = (SELECT ID
                                   FROM BANK_INFO_RATING
                                   WHERE CLIENT_CODE = '${this.clientCode}')
                    AND CODE_CURRENCY = '${this.currencyCode}'),
                 (SELECT IMPORTS,
                         EXPORTS,
                         TRADING_FIN,
                         INTER_BANK_DEPOSIT,
                         FX,
                         CREDIT_LINE,
                         VOSTRO,
                         OTHER_OPERATIONS
                  FROM MATRIX_CORR_ACC
                  WHERE BANK_ID = (SELECT ID
                                   FROM BANK_INFO_RATING
                                   WHERE CLIENT_CODE = '${this.clientCode}')
                    AND CODE_CURRENCY = '${this.currencyCode}') `
  }

  protected remainderQuery = () => {
    return `SELECT DECODE(CODE_CURRENCY, '392', 'JPY',
                          '840', 'USD',
                          '978', 'EUR',
                          '398', 'KZT',
                          '643', 'RUB',
                          '756', 'CHF',
                          '826', 'GBP',
                          '156', 'CNY',
                          CODE_CURRENCY)                                                         AS "currencyName",
                   ROUND(ABS(SUM((SELECT /*+index_desc(s UK_SALDO_ACCOUNT_DAY)*/ SALDO_OUT
                                  FROM IBS.SALDO@IABS S
                                  WHERE S.ACCOUNT_CODE = AC.CODE
                                    AND OPER_DAY <= DATE '${this.date}'
                                    AND ROWNUM = 1))) / DECODE(CODE_CURRENCY, '392', 1, 100), 2) AS "saldoOut"
            FROM IBS.ACCOUNTS@IABS AC
            WHERE CLIENT_CODE = '${this.clientCode}'
              AND CODE_COA = '10501'
            GROUP BY CODE_CURRENCY`
  }

  protected async bank_list() {
    return this.getDataInDates<IBankList, true>(undefined, this.bankListQuery, true)
  }

  protected async volume() {
    return await this.getDataInDates<ICorrOperationsDbData, true>(
      CorrOperationsQueries.volume,
      undefined,
      true
    )
  } /* Обьем */

  protected async fx() {
    return await this.getDataInDates<ICorrOperationsDbData, true>(
      CorrOperationsQueries.fx,
      undefined,
      true
    )
  } /* FX транзакции */

  protected async physical_payments() {
    return await this.getDataInDates<ICorrOperationsDbData, true>(
      CorrOperationsQueries.physicalPayments,
      undefined,
      true
    )
  } /* Платежи физ. лиц */

  protected async legal_payments() {
    return await this.getDataInDates<ICorrOperationsDbData, true>(
      CorrOperationsQueries.legalPayments,
      undefined,
      true
    )
  } /* Платежи юр. лиц */

  protected async interbank_operations() {
    return await this.getDataInDates<ICorrOperationsDbData, true>(
      CorrOperationsQueries.interbankOperations,
      undefined,
      true
    )
  } /* Межбанковские операции */

  protected async loro_accounts_operations() {
    return await this.getDataInDates<ICorrOperationsDbData, true>(
      CorrOperationsQueries.loroAccountsOperations,
      undefined,
      true
    )
  } /* Операции по лоро счётам */

  protected async accredetiv_operations() {
    return await this.getDataInDates<ICorrOperationsDbData, true>(
      CorrOperationsQueries.accredetivOperations,
      undefined,
      true
    )
  } /* Операции по аккредитивам */

  protected async bank_data() {
    if (this.clientCode) {
      const bankData = await this.getDataInDates<IBankDbData>(undefined, this.bankDataQuery)
      if (!bankData) return {}
      return bankData
    }
    return {}
  }

  protected async remainder() {
    if (this.clientCode) {
      return await this.getDataInDates<IRemainderDbData, true>(undefined, this.remainderQuery, true)
    }
    return []
  }

  async getRows() {
    const [
      bankList,
      volume,
      fx,
      physicalPayments,
      legalPayments,
      interbankOperations,
      loroAccountsOperations,
      accredetivOperations,
      bankData,
      remainder
    ] = await Promise.all([
      this.bank_list(),
      this.volume(),
      this.fx(),
      this.physical_payments(),
      this.legal_payments(),
      this.interbank_operations(),
      this.loro_accounts_operations(),
      this.accredetiv_operations(),
      this.bank_data(),
      this.remainder()
    ])
    return [
      bankList,
      volume,
      fx,
      physicalPayments,
      legalPayments,
      interbankOperations,
      loroAccountsOperations,
      accredetivOperations,
      bankData,
      remainder
    ]
  }
}
