import { OracleService } from '../../../oracle/oracle.service'
import { CompetitiveAnalysis } from './ca.base'
import { CaOtherBanks } from './ca.other-banks'
import { OtherBanksId } from './ca.interface'

async function getOtherBanksData(date: Date, oracleService: OracleService, bankId: OtherBanksId) {
  const [quarterDates, totalData, chartData] = await new CaOtherBanks(
    date,
    oracleService,
    bankId
  ).getRows()
  return { quarterDates, totalData, chartData }
}

const getCompetitiveAnalysisData = async (date: Date, oracleService: OracleService) => {
  const [quarterDates, totalData, chartData] = await new CompetitiveAnalysis(
    date,
    oracleService
  ).getRows()
  const nbu = await getOtherBanksData(date, oracleService, OtherBanksId.NBU)
  const psb = await getOtherBanksData(date, oracleService, OtherBanksId.PSB)
  return { quarterDates, main: { totalData, chartData }, nbu, psb }
}

export default getCompetitiveAnalysisData
