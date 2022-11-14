import { Base } from '../../base'
import { ITopDepositsData, ITopDepositsDbData } from './top-deposits.interface'

export class TopDepositsBase extends Base {
  private readonly currencyCodes = ['000', '840', '978']
  private readonly codes = ['20200', '20600', '20400', '22602', '22613', '22614']
  private readonly accounts = this.codes.reduce((acc, val) => {
    acc[val] = this.currencyCodes.map((currency, index) => ({
      codeCoa: val,
      currency: val === '22614' && index === 0 ? '643' : currency
    }))
    return acc
  }, {})

  protected formatQuery(whereQuery: string): string {
    return ''
  }

  private topDepositsQuery = (codeCoa: string, currency: string) => {
    return () => {
      return `SELECT
                    NAME AS "name", 
                    SALDO_OUT AS "saldoOut", 
                    PERCENT AS "percent"
                FROM TOP_DEPOSITS
                WHERE OPER_DAY=(SELECT MAX(OPER_DAY) FROM TOP_DEPOSITS
                WHERE OPER_DAY<DATE '${this.date}')
                  AND CODE_COA='${codeCoa}' 
                  AND CURRENCY_CODE='${currency}' ORDER BY PERCENT DESC`
    }
  }

  private async getOneRow(codeCoa: string, currency: string) {
    return await this.getDataInDates<ITopDepositsDbData, true>(
      undefined,
      this.topDepositsQuery(codeCoa, currency),
      true
    )
  }

  async getRows() {
    const accountsWithData: ITopDepositsData = {}
    for (const accountsKey in this.accounts) {
      accountsWithData[accountsKey] = await Promise.all(
        this.accounts[accountsKey].map((a: any) => this.getOneRow(a.codeCoa, a.currency))
      )
    }
    return [accountsWithData]
  }
}
