import { Base } from '../../base'
import { IDepositsByDeadline } from './DBD.interface'

export class DepositsByDeadlineBase extends Base {
  protected formatQuery(whereQuery: string): string {
    return ''
  }

  private depositsByDeadlineQuery(state: string, dateType: string) {
    const natColName = `${dateType}_NATIONAL`
    const forColName = `${dateType}_FOREIGN`
    return `SELECT
                       DATA_206.STATE AS "indicatorName",
                       DATA_206.${natColName} AS "tdNat",
                       DATA_206.${forColName} AS "tdFor",
                       DATA_23606.${natColName} AS "dcNat",
                       DATA_23606.${forColName} AS "dcFor",
                       DATA_204.${natColName} AS "sdNat",
                       DATA_204.${forColName} AS "sdFor"
                FROM (SELECT
                                      '${state}' STATE,
                                      ${natColName},
                                      ${forColName}
                                  FROM (SELECT * FROM SCHEDULES_DEPOSITS ORDER BY OPER_DAY DESC)
                                  WHERE OPER_DAY < DATE '${this.date}'
                                    AND CODE_COA = '206' AND ROWNUM=1) DATA_206
                LEFT JOIN (SELECT
                               '${state}' STATE,
                               ${natColName},
                               ${forColName}
                           FROM (SELECT * FROM SCHEDULES_DEPOSITS ORDER BY OPER_DAY DESC)
                           WHERE OPER_DAY < DATE '${this.date}'
                             AND CODE_COA = '23606' AND ROWNUM=1) DATA_23606 ON DATA_206.STATE=DATA_23606.STATE
                LEFT JOIN (SELECT
                               '${state}' STATE,
                               ${natColName},
                               ${forColName}
                           FROM (SELECT * FROM SCHEDULES_DEPOSITS ORDER BY OPER_DAY DESC)
                           WHERE OPER_DAY < DATE '${this.date}'
                             AND CODE_COA = '204' AND ROWNUM=1) DATA_204 ON DATA_206.STATE=DATA_204.STATE`
  }

  private async getOneRow(state: string, dateType: string) {
    return await this.getDataInDates<IDepositsByDeadline>(
      undefined,
      this.depositsByDeadlineQuery.bind(this, state, dateType)
    )
  }

  async getRows(): Promise<IDepositsByDeadline[]> {
    const dbData = await Promise.all([
      this.getOneRow('Бессрочные', 'INDEFINITELY'),
      this.getOneRow('От 1 до 7 дней', 'DAY_7'),
      this.getOneRow('От 8 до 30 дней', 'DAY_30'),
      this.getOneRow('От 31 до 90 дней', 'DAY_90'),
      this.getOneRow('От 91 до 180 дней', 'DAY_180'),
      this.getOneRow('От 181 до 365 дней', 'DAY_365'),
      this.getOneRow('От 366 до 730 дней', 'DAY_730'),
      this.getOneRow('Свыше 2 лет', 'DAY_MORE_730')
    ])
    const totalData: IDepositsByDeadline = dbData.reduce(
      (acc, val) => {
        for (const accKey in acc) {
          acc[accKey] += val[accKey]
        }
        return acc
      },
      <IDepositsByDeadline>{ tdNat: 0, tdFor: 0, dcNat: 0, dcFor: 0, sdNat: 0, sdFor: 0 }
    )
    totalData['indicatorName'] = isNaN(totalData['tdNat']) ? '' : 'Итого'
    return [...dbData, totalData]
  }
}
