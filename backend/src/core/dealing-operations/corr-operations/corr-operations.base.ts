import { Base } from '../../base'
import { OracleService } from '../../../oracle/oracle.service'
import {
  CorrOperationsQueries,
  IBankList,
  ICorrOperationsDbData
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
    return `SELECT BI.SHORT_NAME                      AS "bankName",
                   ROUND(SUM(NVL(DEBIT, 0)) / POWER(10, 8), 2)  AS "debit",
                   ROUND(SUM(NVL(CREDIT, 0)) / POWER(10, 8), 2) AS "credit"
            FROM IBS.DWH_PERSONAL_ACCOUNTS@IABS
                     JOIN BANK_INFO_RATING BI
                          ON BI.CLIENT_CODE = SUBSTR(ACCOUNT_CODE, 10, 8)
            WHERE ACC_ID IN (SELECT ID
                             FROM IBS.ACCOUNTS@IABS
                             WHERE CODE_COA = '10501'
                               AND CODE_FILIAL = '00873') AND ${whereQuery}
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

  async getRows() {
    const [
      bankList,
      volume,
      fx,
      physicalPayments,
      legalPayments,
      interbankOperations,
      loroAccountsOperations,
      accredetivOperations
    ] = await Promise.all([
      this.bank_list(),
      this.volume(),
      this.fx(),
      this.physical_payments(),
      this.legal_payments(),
      this.interbank_operations(),
      this.loro_accounts_operations(),
      this.accredetiv_operations()
    ])
    return [
      bankList,
      volume,
      fx,
      physicalPayments,
      legalPayments,
      interbankOperations,
      loroAccountsOperations,
      accredetivOperations
    ]
  }
}
