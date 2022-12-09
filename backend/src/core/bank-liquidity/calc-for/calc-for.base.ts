import { Base } from '../../base'
import { format } from 'date-fns'
import { ICalcForRow } from './calc-for.interface'

export class CalcForBase extends Base {
  protected formatQuery(date: string): string {
    const formattedDateValue = format(new Date(date), 'dd.MM.yyyy')
    return `SELECT DATE_VALUE AS "date",
                   F_O_R AS "forValue",
                   NVL(CB_STANDARD, 0) AS "cbStandard",
                   NVL(ST_DEVIATION, 0) AS "stDeviation",
                   (SELECT CASE
                               WHEN ST_DEVIATION > 0 THEN ROUND((ST_DEVIATION * 0.135) / 365, 2)
                               ELSE 0
                               END
                    FROM DUAL) AS       "avgConsumption"
            FROM (SELECT DATE_VALUE,
                         F_O_R,
                         CB_STANDARD,
                         (F_O_R - CB_STANDARD) ST_DEVIATION
                  FROM (SELECT '${formattedDateValue}'                            DATE_VALUE,
                               (SELECT CB_STANDARD
                                FROM (SELECT * FROM FOR_STANDARD ORDER BY FROM_DATE)
                                WHERE DATE '${date}' >= FROM_DATE
                                  AND DATE '${date}' <= END_DATE
                                  AND ROWNUM = 1)                   CB_STANDARD,
                               (SELECT ABS(ROUND(SUM(SALDO_OUT) / POWER(10, 5), 2))
                                FROM (SELECT AC.CODE,
                                             (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                     SALDO_OUT
                                              FROM IBS.SALDO@IABS SL
                                              WHERE SL.ACCOUNT_CODE = AC.CODE
                                                AND SL.OPER_DAY <= DATE '${date}'
                                                AND ROWNUM = 1) AS SALDO_OUT
                                      FROM IBS.ACCOUNTS@IABS AC
                                      WHERE CODE_COA = '10301'
                                        AND CODE_CURRENCY = '000')) F_O_R
                        FROM DUAL))`
  }

  private startEndDateQuery = () => {
    return `SELECT FROM_DATE AS "fromDate", END_DATE AS "endDate" FROM FOR_STANDARD
                WHERE DATE '${this.date}'>=FROM_DATE
                  AND DATE '${this.date}'<=END_DATE`
  }

  private getDatesBetweenDates = (startDate: string, endDate: string) => {
    let dates: Date[] = []
    const theDate = new Date(startDate)
    while (theDate <= new Date(endDate)) {
      dates = [...dates, new Date(theDate)]
      theDate.setDate(theDate.getDate() + 1)
    }
    return dates
  }

  private async getDates() {
    const res = await this.getDataInDates<{ fromDate: string; endDate: string }>(
      undefined,
      this.startEndDateQuery
    )
    const { fromDate, endDate } = res ?? {}
    return this.getDatesBetweenDates(fromDate, endDate)
  }

  private async getOneRow(date: Date) {
    return await this.getDataInDates<ICalcForRow>('', this.formatQuery.bind(this, date))
  }

  async getRows(): Promise<ICalcForRow[]> {
    const dates = await this.getDates()
    return await Promise.all(
      dates.map(date => {
        const formattedDate = format(date, 'dd.MM.yyyy') as unknown as Date
        const dbFormattedDate = format(date, 'yyyy-MM-dd') as unknown as Date
        if (new Date(date) <= new Date(Date.now() - 86400000)) {
          return this.getOneRow(dbFormattedDate)
        }
        return {
          date: formattedDate,
          forValue: 0,
          cbStandard: 0,
          stDeviation: 0,
          avgConsumption: 0
        }
      })
    )
  }
}
