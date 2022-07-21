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
            this.getOneRow('Бессрочные', 'INDEFINITELY'),
            this.getOneRow('От 1 до 7 дней', 'DAY_7'),
            this.getOneRow('От 8 до 30 дней', 'DAY_30'),
            this.getOneRow('От 31 до 90 дней', 'DAY_90'),
            this.getOneRow('От 91 до 180 дней', 'DAY_180'),
            this.getOneRow('От 181 до 365 дней', 'DAY_365'),
            this.getOneRow('От 366 до 730 дней', 'DAY_730'),
            this.getOneRow('Свыше 2 лет', 'DAY_MORE_730')
        ])
        const totalData = dbData.reduce((acc, val) => {
                for (const accKey in acc) {
                    acc[accKey]+=val[accKey]
                }
                return acc
            }, {TD_NAT: 0, TD_FOR: 0, DC_NAT: 0, DC_FOR: 0, SD_NAT: 0, SD_FOR: 0})
        totalData['STATE'] = isNaN(totalData['TD_NAT']) ? '' : 'Итого'
        return [
            ...dbData,
            totalData
        ]
    }
}

export default DepositsByDeadlineMainClass