import { Base } from '../base'
import { OracleService } from '../../oracle/oracle.service'
import { BankData, ICorrAccountsAnalyze } from './caa.interface'

export class CaaBase extends Base {
  constructor(oracleService: OracleService) {
    super(new Date(), oracleService)
  }

  protected formatQuery(codeCurrency: string): string {
    return `SELECT b.short_name       AS "bankName",
                   COUNTRY_CODE       AS "countryCode",
                   IMPORTS            AS "imports",
                   EXPORTS            AS "exports",
                   TRADING_FIN        AS "tradingFin",
                   INTER_BANK_DEPOSIT AS "mbd",
                   FX                 AS "fx",
                   CREDIT_LINE        AS "creditLine",
                   VOSTRO             AS "vostro",
                   OTHER_OPERATIONS   AS "otherOperations",
                   CORR_ACCOUNTS      AS "corrAccounts",
                   GEN_AGREEMENT      AS "genAgreement",
                   ISDA               AS "isda",
                   OTHER_AGREEMENT    AS "otherAgreement",
                   VOLUME_OPERATIONS  AS "serviceSize",
                   SERVICE_SPEED      AS "serviceSpeed",
                   SERVICE_QUALITY    AS "serviceQuality",
                   SERVICE_COST       AS "serviceCost"
            FROM MATRIX_CORR_ACC M
                     JOIN BANK_INFO_RATING B ON M.BANK_ID = B.ID
            WHERE CODE_CURRENCY = '${codeCurrency}'`
  }

  private codeCurrenciesQuery = () => {
    return `SELECT DISTINCT CODE_CURRENCY AS "codeCurrency"
            FROM MATRIX_CORR_ACC`
  }

  private async getCodeCurrencies() {
    return await this.getDataInDates<{ codeCurrency: string }, true>(
      undefined,
      this.codeCurrenciesQuery,
      true
    )
  }

  async getRows(): Promise<ICorrAccountsAnalyze[]> {
    const currencyCodes = await this.getCodeCurrencies()
    return await Promise.all(
      currencyCodes.map(async ({ codeCurrency }) => {
        const banks = await this.getDataInDates<BankData, true>(codeCurrency, undefined, true)
        return { codeCurrency, banks }
      })
    )
  }
}
