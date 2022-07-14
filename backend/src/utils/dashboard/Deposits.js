const DashboardMainClass = require("./dashboardMainClass")

class Deposits extends DashboardMainClass {
    constructor(date) {
        super(date)
    }

    timeDepositsQuery(date) {
        return `SELECT TRUNC((USD + EUR + JPY) / POWER(10, 11), 2) OTHERS,
                       TRUNC(UZS / POWER(10, 11), 2)               UZS
                FROM (SELECT * FROM DASHBOARD_DEPOSIT ORDER BY OPER_DAY DESC)
                WHERE ROLE = 'T_D'
                  AND OPER_DAY <= TO_DATE('${date}', 'DD-MM-YYYY')
                  AND ROWNUM = 1`
    }

    currencyMfiQuery(date) {
        return `SELECT
                    TRUNC(SUM(UZS)/POWER(10, 11), 2) UZS,
                    TRUNC(SUM(USD)/POWER(10, 11), 2) USD,
                    TRUNC(SUM(EUR)/POWER(10, 11), 2) EUR,
                    TRUNC(SUM(JPY)/POWER(10, 11), 2) JPY
                FROM DASHBOARD_DEPOSIT
                WHERE OPER_DAY = TO_DATE('${date}', 'DD-MM-YYYY') AND ROLE IN ('IFI_short', 'IFI_long')`
    }

    currencyTimeDepositsQuery(date) {
        return `SELECT TRUNC(UZS/POWER(10, 11), 2) UZS,
                       TRUNC(USD/POWER(10, 11), 2) USD,
                       TRUNC(EUR/POWER(10, 11), 2) EUR
                FROM (SELECT * FROM DASHBOARD_DEPOSIT ORDER BY OPER_DAY DESC)
                WHERE ROLE='T_D' AND OPER_DAY<=TO_DATE('${date}', 'DD-MM-YYYY') AND ROWNUM=1`
    }

    interbankDepositsQuery(date) {
        return `SELECT
                       (SELECT
                            ROUND((UZS+USD+EUR+JPY)/POWER(10, 9), 2)
                        FROM (SELECT * FROM DASHBOARD_DEPOSIT ORDER BY OPER_DAY DESC)
                        WHERE ROLE='Land' AND OPER_DAY<=TO_DATE('${date}', 'DD-MM-YYYY') AND ROWNUM=1) borrow,
                       (SELECT
                            ROUND((UZS+USD+EUR+JPY)/POWER(10, 9), 2)
                        FROM (SELECT * FROM DASHBOARD_DEPOSIT ORDER BY OPER_DAY DESC)
                        WHERE ROLE='Borrow' AND OPER_DAY<=TO_DATE('${date}', 'DD-MM-YYYY') AND ROWNUM=1) land
                FROM DUAL`
    }

    fundingStructureQuery(date) {
        return `SELECT
                    ((SELECT
                         ROUND((UZS+USD+EUR+JPY)/POWER(10, 9), 2)
                     FROM (SELECT * FROM DASHBOARD_DEPOSIT ORDER BY OPER_DAY DESC)
                     WHERE ROLE='Land' AND OPER_DAY<=TO_DATE('${date}', 'DD-MM-YYYY') AND ROWNUM=1) + (SELECT
                         ROUND((UZS+USD+EUR+JPY)/POWER(10, 9), 2)
                     FROM (SELECT * FROM DASHBOARD_DEPOSIT ORDER BY OPER_DAY DESC)
                     WHERE ROLE='Borrow' AND OPER_DAY<=TO_DATE('${date}', 'DD-MM-YYYY') AND ROWNUM=1)) mbd,
                    (SELECT TRUNC((USD + EUR + JPY + UZS) / POWER(10, 11), 2)
                        FROM (SELECT * FROM DASHBOARD_DEPOSIT ORDER BY OPER_DAY DESC)
                        WHERE ROLE = 'T_D' AND OPER_DAY <= TO_DATE('${date}', 'DD-MM-YYYY') AND ROWNUM = 1) td,
                    (SELECT
                            TRUNC(SUM(UZS+USD+EUR+JPY)/POWER(10, 11), 2)
                        FROM DASHBOARD_DEPOSIT
                        WHERE OPER_DAY = TO_DATE('${date}', 'DD-MM-YYYY') AND ROLE='IFI_short') mfi_short,
                    (SELECT
                            TRUNC(SUM(UZS+USD+EUR+JPY)/POWER(10, 11), 2)
                        FROM DASHBOARD_DEPOSIT
                        WHERE OPER_DAY = TO_DATE('${date}', 'DD-MM-YYYY') AND ROLE='IFI_long') mfi_long
                FROM DUAL`
        
    }

    currencyMBDQuery(date) {
        return `SELECT
                    ((SELECT
                         ROUND(UZS/POWER(10, 9), 2)
                     FROM (SELECT * FROM DASHBOARD_DEPOSIT ORDER BY OPER_DAY DESC)
                     WHERE ROLE='Land' AND OPER_DAY<=TO_DATE('${date}', 'DD-MM-YYYY') AND ROWNUM=1) + (SELECT
                         ROUND(UZS/POWER(10, 9), 2)
                     FROM (SELECT * FROM DASHBOARD_DEPOSIT ORDER BY OPER_DAY DESC)
                     WHERE ROLE='Borrow' AND OPER_DAY<=TO_DATE('${date}', 'DD-MM-YYYY') AND ROWNUM=1)) UZS,
                    ((SELECT
                         ROUND(USD/POWER(10, 9), 2)
                     FROM (SELECT * FROM DASHBOARD_DEPOSIT ORDER BY OPER_DAY DESC)
                     WHERE ROLE='Land' AND OPER_DAY<=TO_DATE('${date}', 'DD-MM-YYYY') AND ROWNUM=1) + (SELECT
                         ROUND(USD/POWER(10, 9), 2)
                     FROM (SELECT * FROM DASHBOARD_DEPOSIT ORDER BY OPER_DAY DESC)
                     WHERE ROLE='Borrow' AND OPER_DAY<=TO_DATE('${date}', 'DD-MM-YYYY') AND ROWNUM=1)) USD,
                    ((SELECT
                         ROUND(EUR/POWER(10, 9), 2)
                     FROM (SELECT * FROM DASHBOARD_DEPOSIT ORDER BY OPER_DAY DESC)
                     WHERE ROLE='Land' AND OPER_DAY<=TO_DATE('${date}', 'DD-MM-YYYY') AND ROWNUM=1) + (SELECT
                         ROUND(EUR/POWER(10, 9), 2)
                     FROM (SELECT * FROM DASHBOARD_DEPOSIT ORDER BY OPER_DAY DESC)
                     WHERE ROLE='Borrow' AND OPER_DAY<=TO_DATE('${date}', 'DD-MM-YYYY') AND ROWNUM=1)) EUR
                FROM DUAL`
    }

    async time_deposits() {
        const {
            OTHERS, UZS
        } = await this.getDataInDates(
            '',
            false,
            this.timeDepositsQuery
        )
        return [OTHERS, UZS].map(v=> Number(v || 0).toFixed(2))
    }

    async currency_mfi() {
        const {
            UZS, USD, EUR, JPY,
        } = await this.getDataInDates(
            '',
            false,
            this.currencyMfiQuery
        )
        return [UZS, USD, EUR, JPY].map(v => Number(v || 0).toFixed(2))
    }

    async currency_time_deposits() {
        const {
            UZS, USD, EUR
        } = await this.getDataInDates(
            '',
            false,
            this.currencyTimeDepositsQuery
        )
        return [UZS, USD, EUR].map(v => Number(v || 0).toFixed(2))
    }

    async interbank_deposits() {
        const {
            LAND, BORROW
        } = await this.getDataInDates(
            '',
            false,
            this.interbankDepositsQuery
        )
        return [LAND, BORROW].map(v => Number(v || 0).toFixed(2))
    }

    async funding_structure() {
        const {
            MBD, TD, MFI_SHORT, MFI_LONG
        } = await this.getDataInDates(
            '',
            false,
            this.fundingStructureQuery
        )
        return [MBD, TD, MFI_SHORT, MFI_LONG].map(v => Number(v || 0).toFixed(2))
    }

    async currency_mbd() {
        const {
            UZS, USD, EUR
        } = await this.getDataInDates(
            '',
            false,
            this.currencyMBDQuery
        )
        return [UZS, USD, EUR].map(v => Number(v || 0).toFixed(2))
    }

    async getRows() {
        const [
            timeDeposits,
            currencyMfi,
            currencyTimeDeposits,
            interbankDeposits,
            fundingStructure,
            currencyMBD
        ] = await Promise.all([
            this.time_deposits(),
            this.currency_mfi(),
            this.currency_time_deposits(),
            this.interbank_deposits(),
            this.funding_structure(),
            this.currency_mbd()
        ])
        return {
            timeDeposits,
            currencyMfi,
            currencyTimeDeposits,
            interbankDeposits,
            fundingStructure,
            currencyMBD
        }
    }

}

module.exports = Deposits