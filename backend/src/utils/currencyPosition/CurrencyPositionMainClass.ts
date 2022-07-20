import MainClass from '../mainClass'

class CurrencyPositionMainClass extends MainClass {

    currencyCodes: {code: string, isHead: boolean}[]

    constructor(date: string) {
        super(date)
        this.currencyCodes = [
            {code: '036', isHead: false},
            {code: '051', isHead: false},
            {code: '124', isHead: false},
            {code: '156', isHead: true},
            {code: '203', isHead: false},
            {code: '344', isHead: false},
            {code: '356', isHead: false},
            {code: '364', isHead: false},
            {code: '376', isHead: false},
            {code: '392', isHead: true},
            {code: '398', isHead: true},
            {code: '410', isHead: false},
            {code: '417', isHead: false},
            {code: '458', isHead: false},
            {code: '643', isHead: true},
            {code: '682', isHead: false},
            {code: '752', isHead: false},
            {code: '756', isHead: true},
            {code: '760', isHead: false},
            {code: '764', isHead: false},
            {code: '784', isHead: false},
            {code: '818', isHead: false},
            {code: '826', isHead: true},
            {code: '840', isHead: true},
            {code: '934', isHead: false},
            {code: '944', isHead: false},
            {code: '949', isHead: false},
            {code: '960', isHead: false},
            {code: '971', isHead: false},
            {code: '972', isHead: false},
            {code: '933', isHead: false},
            {code: '978', isHead: true},
            {code: '980', isHead: false}
        ]
    }

    regularCapitalQuery = () => {
        return `SELECT 
                   EQUIVAL  AS REG_CAP
                FROM (SELECT * FROM REGULATORYCAPITAL ORDER BY OPER_DAY DESC) 
                WHERE 
                      OPER_DAY<TO_DATE('${this.date}', 'DD-MM-YYYY') AND ROLE='R_C'
                  AND 
                      ROWNUM=1`
    }

    async regular_capital() {
        return await this.getDataInDates('', this.regularCapitalQuery)
    }

    formatQuery(date: string, whereQuery: string) {
        return `SELECT
                       CURRENCY_CODE,
                       CURRENCY_NAME,
                       RCC,
                       REQUIREMENTS,
                       CONTINGENCY_CLAIMS,
                       L_CL,
                       LIABILITIES,
                       CONTINGENCY_LIABILITIES,
                       ZERO8,
                       OPEN_CUR_RATE,
                       FOR_CURR_RATE,
                       LONG_VAL,
                       SHORT_VAL,
                       ROUND(((LONG_VAL+SHORT_VAL)*POWER(10, -1))/REG_CAP, 2) AS POS_RATIO /* TODO THIS REQUIRES TO FIX REGULAR CAPITAL */
                       /* ONE MORE TODO THIS IS CHANGED IN 10.02.2022 DUE TO REGULATORY CAPITAL */
                FROM (SELECT
                   CURRENCY_CODE,
                   CURRENCY_NAME,
                   (REQUIREMENTS+CONTINGENCY_CLAIMS) AS RCC /* Требования банка в иностранной валюте, всего (в единицах ин. валюты) */,
                   REQUIREMENTS,
                   CONTINGENCY_CLAIMS,
                   (LIABILITIES+CONTINGENCY_LIABILITIES)  AS L_CL, /* Обязательства банка в иностранной валюте, всего (в единицах ин.валюты) */
                   LIABILITIES,
                   CONTINGENCY_LIABILITIES,
                   0 AS ZERO8 /* Сумма сформированного банковского капитала в иностранной валюте */,
                   (REQUIREMENTS+CONTINGENCY_CLAIMS-(LIABILITIES+CONTINGENCY_LIABILITIES)) AS OPEN_CUR_RATE, /* Открытая валютная позиция (в единицах ин.валюты,+,-) */
                   FOR_CURR_RATE,
                   (SELECT
                        CASE
                            WHEN (REQUIREMENTS+CONTINGENCY_CLAIMS-(LIABILITIES+CONTINGENCY_LIABILITIES))*FOR_CURR_RATE<0 THEN 0
                            ELSE TRUNC((REQUIREMENTS+CONTINGENCY_CLAIMS-(LIABILITIES+CONTINGENCY_LIABILITIES))*FOR_CURR_RATE, 2)
                            END
                    FROM DUAL) AS LONG_VAL, /* длинная */
                   (SELECT
                        CASE
                            WHEN (REQUIREMENTS+CONTINGENCY_CLAIMS-(LIABILITIES+CONTINGENCY_LIABILITIES))*FOR_CURR_RATE>0 THEN 0
                            ELSE TRUNC((REQUIREMENTS+CONTINGENCY_CLAIMS-(LIABILITIES+CONTINGENCY_LIABILITIES))*FOR_CURR_RATE, 2)
                            END
                    FROM DUAL) AS SHORT_VAL, /* короткая */
                   (SELECT EQUIVAL FROM REGULATORYCAPITAL WHERE OPER_DAY<TO_DATE('${date}', 'DD-MM-YYYY') AND ROWNUM=1) AS REG_CAP
               FROM (SELECT * FROM CURRENCYPOSITION ORDER BY OPER_DAY DESC)
               WHERE OPER_DAY<TO_DATE('${date}', 'DD-MM-YYYY') AND CURRENCY_CODE='${whereQuery}' AND ROWNUM=1)`
    }

    async getOneRow(currencyCode: string, isTableHead: boolean) {
        const {
            CURRENCY_CODE = currencyCode,
            CURRENCY_NAME = 'no_data',
            RCC = 0,
            REQUIREMENTS = 0,
            CONTINGENCY_CLAIMS = 0,
            L_CL = 0,
            LIABILITIES = 0,
            CONTINGENCY_LIABILITIES = 0,
            ZERO8 = 0,
            OPEN_CUR_RATE = 0,
            FOR_CURR_RATE = 0,
            LONG_VAL = 0,
            SHORT_VAL = 0,
            POS_RATIO = 0
        } =  await this.getDataInDates(currencyCode)
        return {
            CURRENCY_CODE,
            CURRENCY_NAME,
            RCC,
            REQUIREMENTS,
            CONTINGENCY_CLAIMS,
            L_CL,
            LIABILITIES,
            CONTINGENCY_LIABILITIES,
            ZERO8,
            OPEN_CUR_RATE,
            FOR_CURR_RATE,
            LONG_VAL,
            SHORT_VAL,
            POS_RATIO,
            isTableHead
        }
    }

    async getRows() {
        const allRows = (await Promise.all(this.currencyCodes
            .map(({code, isHead}) => this.getOneRow(code, isHead))))
            .map(currency => {
                if(currency.CURRENCY_CODE === 392) {
                    // Японская йена exception
                    currency['RCC'] = currency['RCC']*100
                    currency['REQUIREMENTS'] = currency['REQUIREMENTS']*100
                    currency['CONTINGENCY_CLAIMS'] = currency['CONTINGENCY_CLAIMS']*100
                    currency['L_CL'] = currency['L_CL']*100
                    currency['LIABILITIES'] = currency['LIABILITIES']*100
                    currency['CONTINGENCY_LIABILITIES'] = currency['CONTINGENCY_LIABILITIES']*100
                    currency['ZERO8'] = currency['ZERO8']*100
                    currency['OPEN_CUR_RATE'] = currency['OPEN_CUR_RATE']*100
                    currency['LONG_VAL'] = currency['LONG_VAL']*100
                    currency['SHORT_VAL'] = currency['SHORT_VAL']*100
                }
                return currency
            })
        const shortTotal = allRows.reduce((acc, val) => {
            acc+=val['SHORT_VAL']
            return acc
        }, 0)
        const longTotal = allRows.reduce((acc, val) => {
            acc+=val['LONG_VAL']
            return acc
        }, 0)
        const longAndShortTotal = shortTotal+longTotal
        const {REG_CAP} = await this.regular_capital()
        const tableSumData = [
            {title: 'Суммарная величина всех длинных валютных позиций (маx - 15%)',
                sum: longTotal, percent: Number((longTotal/REG_CAP)*100).toFixed(2)},
            {title: 'Суммарная величина всех коротких валютных позиций (маx - 15%)',
                sum: shortTotal, percent: Number((shortTotal/REG_CAP)*100).toFixed(2)},
            {title: 'Суммарная величина открытых валютных позиций (маx - 15%)',
                sum: longAndShortTotal, percent: Number((longAndShortTotal/REG_CAP)*100).toFixed(2)},
            {title: 'Регулятивный капитал банка на отчетную дату (в сумах)',
                sum: REG_CAP, percent: 0}
        ]
        return {
            allRows,
            tableSumData
        }
    }
}

export default CurrencyPositionMainClass