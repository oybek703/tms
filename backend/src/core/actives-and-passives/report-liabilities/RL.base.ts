import { Base } from '../../base'
import { IReportLiabilitiesData } from './RL.interface'

export class ReportLiabilitiesBase extends Base {
  protected formatQuery() {
    return `BEGIN
                LIABILITIES_PACKAGE.LIABILITIES_PROCEDURE(DATE '${this.date}');
            END;`
  }

  private async fillTable() {
    await this.oracleService.executeQuery(this.formatQuery())
  }

  private reportLiabilitiesQuery = () => {
    return `SELECT SUBSTR(ACCOUNT_CODE, 8, 20) AS "accountCode",
                       NAME_LINE                   AS "name",
                       CURRENCY_TYPE               AS "currency",
                       SALDO_NOMINAL               AS "saldoNominal",
                       SALDO_EQUIVAL               AS "saldoEquival",
                       DAY_7_SALDO_NOMINAL         AS "day7SaldoNominal",
                       DAY_7_SALDO_EQUIVAL         AS "day7SaldoEquival",
                       MONTH_1_SALDO_NOMINAL       AS "month1SaldoNominal",
                       MONTH_1_SALDO_EQUIVAL       AS "month1SaldoEquival",
                       MONTH_2_SALDO_NOMINAL       AS "month2SaldoNominal",
                       MONTH_2_SALDO_EQUIVAL       AS "month2SaldoEquival",
                       MONTH_3_SALDO_NOMINAL       AS "month3SaldoNominal",
                       MONTH_3_SALDO_EQUIVAL       AS "month3SaldoEquival",
                       MONTH_4_SALDO_NOMINAL       AS "month4SaldoNominal",
                       MONTH_4_SALDO_EQUIVAL       AS "month4SaldoEquival",
                       MONTH_5_SALDO_NOMINAL       AS "month5SaldoNominal",
                       MONTH_5_SALDO_EQUIVAL       AS "month5SaldoEquival",
                       MONTH_6_SALDO_NOMINAL       AS "month6SaldoNominal",
                       MONTH_6_SALDO_EQUIVAL       AS "month6SaldoEquival",
                       MONTH_7_SALDO_NOMINAL       AS "month7SaldoNominal",
                       MONTH_7_SALDO_EQUIVAL       AS "month7SaldoEquival",
                       MONTH_8_SALDO_NOMINAL       AS "month8SaldoNominal",
                       MONTH_8_SALDO_EQUIVAL       AS "month8SaldoEquival",
                       MONTH_9_SALDO_NOMINAL       AS "month9SaldoNominal",
                       MONTH_9_SALDO_EQUIVAL       AS "month9SaldoEquival",
                       MONTH_10_SALDO_NOMINAL      AS "month10SaldoNominal",
                       MONTH_10_SALDO_EQUIVAL      AS "month10SaldoEquival",
                       MONTH_11_SALDO_NOMINAL      AS "month11SaldoNominal",
                       MONTH_11_SALDO_EQUIVAL      AS "month11SaldoEquival",
                       MONTH_12_SALDO_NOMINAL      AS "month12SaldoNominal",
                       MONTH_12_SALDO_EQUIVAL      AS "month12SaldoEquival",
                       BETWEEN_1_2_YEAR_NOMINAL    AS "between1_2YearNominal",
                       BETWEEN_1_2_YEAR_EQUIVAL    AS "between1_2YearEquival",
                       GREAT_2_YEAR_NOMINAL        AS "great2YearNominal",
                       GREAT_2_YEAR_EQUIVAL        AS "great2YearEquival"
                FROM LIABILITIES`
  }

  private async getTableData() {
    return await this.getDataInDates<IReportLiabilitiesData, true>(
      '',
      this.reportLiabilitiesQuery,
      true
    )
  }

  async getRows(): Promise<IReportLiabilitiesData[]> {
    await this.fillTable()
    return await this.getTableData()
  }
}
