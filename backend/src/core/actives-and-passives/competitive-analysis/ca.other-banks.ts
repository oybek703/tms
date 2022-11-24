import { ICAOtherBanksData, ICARow, ICARowOptions, OtherBanksId } from './ca.interface'
import { CompetitiveAnalysis } from './ca.base'
import { OracleService } from '../../../oracle/oracle.service'

export class CaOtherBanks extends CompetitiveAnalysis {
  constructor(date: Date, oracleService: OracleService, private readonly bankId: OtherBanksId) {
    super(date, oracleService)
  }

  private otherBanksMainQuery = (role: string) => {
    return () => {
      return `SELECT INDICATOR_NAME AS "indicatorName",
                     VALUE          AS "value"
              FROM INDICATORS
                       JOIN INDICATOR_BANKS IB on INDICATORS.ID = IB.INDICATOR_ID
              WHERE BANK_ID = ${this.bankId}
                AND ROLE = '${role}'
                AND OPER_DAY IN (${this.createDates(this.monthFirstDates)})
              ORDER BY OPER_DAY`
    }
  }

  private async getOtherBanksOneRow(role: string, options?: ICARowOptions): Promise<ICARow> {
    let data = await this.getDataInDates<ICAOtherBanksData, true>(
      undefined,
      this.otherBanksMainQuery(role),
      true
    )
    if (data.length < 4) data = data.concat(Array(4 - data.length).fill({ value: 0 }))
    return {
      indicatorName: data[0].indicatorName,
      firstDate: data[0].value,
      secondDate: data[1].value,
      thirdDate: data[2].value,
      fourthDate: data[3].value,
      tabbed: options?.tabbed,
      redBold: options?.redBold
    }
  }

  async getRows() {
    const formattedQuarterDates = await this.getQuarterDates()
    const [
      creditPortfolio,
      corporate,
      retail,
      npl,
      reserve,
      actives,
      totalDeposits,
      corporateDeposits,
      retailDeposits,
      creditLines,
      liabilities,
      capital,
      cleanProfit,
      vla,
      lcr,
      nsfr,
      car,
      roa,
      roe,
      cir,
      activesNational,
      activesForeign,
      liabilitiesNational,
      liabilitiesForeign
    ] = await Promise.all([
      this.getOtherBanksOneRow('P_L'),
      this.getOtherBanksOneRow('P_L_J', { tabbed: true }),
      this.getOtherBanksOneRow('P_L_L', { tabbed: true }),
      this.getOtherBanksOneRow('NPL', { tabbed: true, redBold: true }),
      this.getOtherBanksOneRow('R'),
      this.getOtherBanksOneRow('A_T', { redBold: true }),
      this.getOtherBanksOneRow('C_D'),
      this.getOtherBanksOneRow('C_D_J', { tabbed: true }),
      this.getOtherBanksOneRow('C_D_L', { tabbed: true }),
      this.getOtherBanksOneRow('C_L'),
      this.getOtherBanksOneRow('O', { redBold: true }),
      this.getOtherBanksOneRow('C'),
      this.getOtherBanksOneRow('N_P'),
      this.getOtherBanksOneRow('VLA', { redBold: true }),
      this.getOtherBanksOneRow('LCR', { redBold: true }),
      this.getOtherBanksOneRow('NSFR', { redBold: true }),
      this.getOtherBanksOneRow('CAR', { redBold: true }),
      this.getOtherBanksOneRow('ROA', { redBold: true }),
      this.getOtherBanksOneRow('ROE', { redBold: true }),
      this.getOtherBanksOneRow('CIR'),
      this.getOtherBanksOneRow('A_N'),
      this.getOtherBanksOneRow('A_F'),
      this.getOtherBanksOneRow('O_N'),
      this.getOtherBanksOneRow('O_F')
    ])
    const totalData = {
      creditPortfolio,
      corporate,
      retail,
      npl,
      reserve,
      actives,
      totalDeposits,
      corporateDeposits,
      retailDeposits,
      creditLines,
      liabilities,
      capital,
      cleanProfit,
      vla,
      lcr,
      nsfr,
      car,
      roa,
      roe,
      cir
    }
    const chartData = {
      creditPortfolioGrow: {
        corporate: this.getRowNums(corporate),
        retail: this.getRowNums(retail)
      },
      depositGrow: {
        corporate: this.getRowNums(corporateDeposits),
        retail: this.getRowNums(retailDeposits)
      },
      actives: {
        national: this.getRowNums(activesNational),
        foreign: this.getRowNums(activesForeign)
      },
      liabilities: {
        national: this.getRowNums(liabilitiesNational),
        foreign: this.getRowNums(liabilitiesForeign)
      }
    }
    return [formattedQuarterDates, totalData, chartData]
  }
}
