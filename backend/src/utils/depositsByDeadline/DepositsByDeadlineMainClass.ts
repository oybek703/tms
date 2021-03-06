import MainClass from '../mainClass'

class DepositsByDeadlineMainClass extends MainClass {
  constructor(date: string) {
    super(date)
  }

  depositsByDeadlineQuery(state: string, dateType: string, date: string) {
    const natColName = `${dateType}_NATIONAL`
    const forColName = `${dateType}_FOREIGN`
    return `SELECT
                       DATA_206.STATE,
                       DATA_206.${natColName} TD_NAT,
                       DATA_206.${forColName} TD_FOR,
                       DATA_23606.${natColName} DC_NAT,
                       DATA_23606.${forColName} DC_FOR,
                       DATA_204.${natColName} SD_NAT,
                       DATA_204.${forColName} SD_FOR
                FROM (SELECT
                                      '${state}' STATE,
                                      ${natColName},
                                      ${forColName}
                                  FROM (SELECT * FROM SCHEDULES_DEPOSITS ORDER BY OPER_DAY DESC)
                                  WHERE OPER_DAY < TO_DATE('${date}', 'DD.MM.YYYY')
                                    AND CODE_COA = '206' AND ROWNUM=1) DATA_206
                LEFT JOIN (SELECT
                               '${state}' STATE,
                               ${natColName},
                               ${forColName}
                           FROM (SELECT * FROM SCHEDULES_DEPOSITS ORDER BY OPER_DAY DESC)
                           WHERE OPER_DAY < TO_DATE('${date}', 'DD.MM.YYYY')
                             AND CODE_COA = '23606' AND ROWNUM=1) DATA_23606 ON DATA_206.STATE=DATA_23606.STATE
                LEFT JOIN (SELECT
                               '${state}' STATE,
                               ${natColName},
                               ${forColName}
                           FROM (SELECT * FROM SCHEDULES_DEPOSITS ORDER BY OPER_DAY DESC)
                           WHERE OPER_DAY < TO_DATE('${date}', 'DD.MM.YYYY')
                             AND CODE_COA = '204' AND ROWNUM=1) DATA_204 ON DATA_206.STATE=DATA_204.STATE`
  }

  async getOneRow(state: string, dateType: string) {
    return await this.getDataInDates(
        '',
        this.depositsByDeadlineQuery.bind(
            this,
            state,
            dateType,
        ))
  }

  async getRows() {
    const dbData = await Promise.all([
      this.getOneRow('????????????????????', 'INDEFINITELY'),
      this.getOneRow('???? 1 ???? 7 ????????', 'DAY_7'),
      this.getOneRow('???? 8 ???? 30 ????????', 'DAY_30'),
      this.getOneRow('???? 31 ???? 90 ????????', 'DAY_90'),
      this.getOneRow('???? 91 ???? 180 ????????', 'DAY_180'),
      this.getOneRow('???? 181 ???? 365 ????????', 'DAY_365'),
      this.getOneRow('???? 366 ???? 730 ????????', 'DAY_730'),
      this.getOneRow('?????????? 2 ??????', 'DAY_MORE_730')
    ])
    const totalData = dbData.reduce((acc, val) => {
      for (const accKey in acc) {
        if (acc.hasOwnProperty(accKey)) {
          acc[accKey]+=val[accKey]
        }
      }
      return acc
    }, { TD_NAT: 0, TD_FOR: 0, DC_NAT: 0, DC_FOR: 0, SD_NAT: 0, SD_FOR: 0 })
    totalData['STATE'] = isNaN(totalData['TD_NAT']) ? '' : '??????????'
    return [
      ...dbData,
      totalData
    ]
  }
}

export default DepositsByDeadlineMainClass
