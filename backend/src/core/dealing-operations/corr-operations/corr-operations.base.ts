import { Base } from '../../base'
import { OracleService } from '../../../oracle/oracle.service'

export class CorrOperationsBase extends Base {
  constructor(
    private readonly firstDate,
    private readonly secondDate,
    oracleService: OracleService
  ) {
    super(firstDate, oracleService)
  }

  protected formatQuery(currencyCode = '840') {
    return `SELECT ${currencyCode} FROM DUAL`
  }

  async getRows() {
    return ['data from corr-operations']
  }
}
