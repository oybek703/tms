import { OracleService } from '../../../oracle/oracle.service'
import { CorrOperationsBase } from './corr-operations.base'

export const getCorrOperationsData = async (
  firstDate: Date,
  secondDate: Date,
  currencyCode: string,
  oracleService: OracleService,
  clientCode?: string | undefined
) => {
  const [
    bankList,
    volume,
    fx,
    physicalPayments,
    legalPayments,
    interbankOperations,
    loroAccountsOperations,
    accredetivOperations
  ] = await new CorrOperationsBase(
    firstDate,
    secondDate,
    currencyCode,
    oracleService,
    clientCode
  ).getRows()
  return {
    bankList,
    volume,
    fx,
    physicalPayments,
    legalPayments,
    interbankOperations,
    loroAccountsOperations,
    accredetivOperations
  }
}
