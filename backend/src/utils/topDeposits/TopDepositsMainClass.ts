import MainClass from '../mainClass'

class TopDepositsMainClass extends MainClass {
    currencyCodes: string[]
    codes: string[]
    accounts: any

    constructor(date: string) {
      super(date)
      this.currencyCodes = ['000', '840', '978']
      this.codes = ['20200', '20600', '20400', '22602', '22613', '22614']
      this.accounts = this.codes.reduce((acc: any, val) => {
        acc[val] = this.currencyCodes
            .map((currency, index) => ({
              code_code: val,
              currency: (val === '22614' && index === 0) ? '643' : currency }))
        return acc
      }, {})
    }

    topDepositsQuery(codeCoa: string, currency: string) {
      return function(date: string) {
        return `SELECT
                    NAME, SALDO_OUT, PERCENT
                FROM TOP_DEPOSITS
                WHERE OPER_DAY=(SELECT MAX(OPER_DAY) FROM TOP_DEPOSITS
                WHERE OPER_DAY<TO_DATE('${date}', 'DD.MM.YYYY'))
                  AND CODE_COA='${codeCoa}' 
                  AND CURRENCY_CODE='${currency}' ORDER BY PERCENT DESC`
      }
    }

    async getOneRow(codeCoa: string, currency: string) {
      return await this.getDataInDates(
          '',
          this.topDepositsQuery(codeCoa, currency),
          true
      )
    }

    async getRows() {
      const accountsWithData: any = {}
      for (const accountsKey in this.accounts) {
        if (this.accounts.hasOwnProperty(accountsKey)) {
          accountsWithData[accountsKey] = await Promise.all(
              this.accounts[accountsKey].map((a: any) => this.getOneRow(a.code_code, a.currency))
          )
        }
      }
      return accountsWithData
    }
}

export default TopDepositsMainClass
