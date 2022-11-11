import { OracleService } from '../oracle/oracle.service'
import { OwnQuery } from './core.interface'

export abstract class Base {
  constructor(protected date: Date, protected readonly oracleService: OracleService) {}

  protected abstract formatQuery(whereQuery: string): string

  protected beforeDateQuery() {
    return `SELECT TO_CHAR(OPER_DAY, 'YYYY-MM-DD') AS "beforeDate"
            FROM IBS.DAY_OPERATIONAL@IABS
            WHERE DAY_STATUS != 0 AND OPER_DAY< DATE '${this.date}'
            ORDER BY OPER_DAY DESC FETCH FIRST ROWS ONLY`
  }

  protected async getBeforeDate() {
    const { beforeDate } = await this.oracleService.executeQuery<{ beforeDate: Date }>(
      this.beforeDateQuery()
    )
    this.date = beforeDate
  }

  protected async getDataInDates<T, K extends boolean = false>(
    whereQuery: string | undefined,
    ownQuery?: OwnQuery | undefined,
    inStream?: K extends true ? true : false
  ): Promise<K extends true ? T[] : T> {
    let query: string
    if (whereQuery) {
      query = this.formatQuery(whereQuery)
    } else {
      query = ownQuery(this.date)
    }
    if (inStream)
      return (await this.oracleService.executeQueryInStream<T>(query)) as K extends true ? T[] : T
    return (await this.oracleService.executeQuery<T>(query)) as K extends true ? T[] : T
  }

  async getRows() {
    return []
  }
}
