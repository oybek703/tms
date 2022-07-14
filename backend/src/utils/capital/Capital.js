const MainClass = require("../mainClass")
const {isYearEnd} = require("../dateFormatter")
const {getCapitalTotal} = require("./capital_pure_functions")
const {createCapitalData} = require("./capital_pure_functions")

class Capital extends MainClass {
    constructor(date) {
        super(date)
    }

    formatQuery(date, where_query = `code_coa like '303%'`) {
        return `SELECT sum(saldo_equival_out) SALDO_EQ_OUT
                FROM
              (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                saldo_equival_out
                  FROM ibs.saldo@iabs sl
                  WHERE sl.account_code=ac.code
                    AND sl.oper_day<to_date('${date}', 'DD-MM-YYYY')
                    AND rownum =1 ) AS saldo_equival_out
               FROM ibs.accounts@iabs AC
               WHERE ${where_query})`
    }

    fullPaidSharesQuery(date) {
        return `SELECT NVL(col1, 0) + NVL(col2, 0) - NVL(col3, 0) AS SALDO_EQ_OUT
                FROM  (SELECT (SELECT SUM(saldo_equival_out)
               FROM  (SELECT AC.code,
                             (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                     saldo_equival_out
                              FROM   ibs.saldo@iabs sl
                              WHERE  sl.account_code = ac.code
                                AND sl.oper_day < TO_DATE('${date}',
                                                          'DD-MM-YYYY'
                                  )
                                AND ROWNUM = 1) AS saldo_equival_out
                      FROM   ibs.accounts@iabs AC
                      WHERE  code_coa = '30312')) AS col1,
              (SELECT SUM(saldo_equival_out)
               FROM  (SELECT AC.code,
                             (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                     oper_day
                              FROM   ibs.saldo@iabs sl
                              WHERE  sl.account_code = ac.code
                                AND sl.oper_day < TO_DATE('${date}',
                                                          'DD-MM-YYYY'
                                  )
                                AND ROWNUM = 1) AS oper_day,
                             (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                     saldo_equival_out
                              FROM   ibs.saldo@iabs sl
                              WHERE  sl.account_code = ac.code
                                AND sl.oper_day < TO_DATE('${date}',
                                                          'DD-MM-YYYY'
                                  )
                                AND ROWNUM = 1) AS saldo_equival_out
                      FROM   ibs.accounts@iabs AC
                      WHERE  code_coa = '30318')) AS col2,
              (SELECT SUM(saldo_equival_out)
               FROM  (SELECT AC.code,
                             (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                     oper_day
                              FROM   ibs.saldo@iabs sl
                              WHERE  sl.account_code = ac.code
                                AND sl.oper_day < TO_DATE('${date}',
                                                          'DD-MM-YYYY'
                                  )
                                AND ROWNUM = 1) AS oper_day,
                             (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                     saldo_equival_out
                              FROM   ibs.saldo@iabs sl
                              WHERE  sl.account_code = ac.code
                                AND sl.oper_day < TO_DATE('${date}',
                                                          'DD-MM-YYYY'
                                  )
                                AND ROWNUM = 1) AS saldo_equival_out
                      FROM   ibs.accounts@iabs AC
                      WHERE  code_coa = '30306')) AS col3
       FROM   ibs.saldo@iabs s,
              ibs.accounts@iabs a
       WHERE  a.code = s.account_code
         AND ROWNUM = 1)`
    }

    reversePurchasedQuery(date) {
        return `select nvl(sum(saldo_equival_out),0) as SALDO_EQ_OUT from(
                select 
                (select --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                saldo_equival_out
                from ibs.saldo@iabs sl 
                where
                sl.account_code=ac.code
                and sl.oper_day<to_date('${date}', 'DD-MM-YYYY')
                and rownum =1)
                as saldo_equival_out
                from ibs.accounts@iabs  AC
                where code_coa='30324')`
    }

    pastPeriodsQuery(date) {
        return `SELECT decode(sign(sum(saldo_equival_out)), -1, sum(saldo_equival_out), 0) AS SALDO_EQ_OUT
                FROM
                    (SELECT
                         (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                 saldo_equival_out
                          FROM ibs.saldo@iabs sl
                          WHERE sl.account_code=ac.code
                            AND sl.oper_day<to_date('${date}', 'DD-MM-YYYY')
                            AND rownum =1) AS saldo_equival_out
                     FROM ibs.accounts@iabs AC
                     WHERE code_coa='31203')`
    }

    currentYearQuery(date) {
        return `SELECT
                    DECODE(SUM_31206, 0, SUM_4_5, SUM_31206) SALDO_EQ_OUT
                FROM (SELECT DECODE(SIGN(SUM(SALDO_EQUIVAL_OUT)), -1, SUM(SALDO_EQUIVAL_OUT),
                                    0) AS SUM_31206
                      FROM (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                           SALDO_EQUIVAL_OUT
                                    FROM IBS.SALDO@IABS SL
                                    WHERE SL.ACCOUNT_CODE = AC.CODE
                                      AND SL.OPER_DAY < TO_DATE('${date}', 'DD-MM-YYYY')
                                      AND ROWNUM = 1) AS saldo_equival_out
                            FROM IBS.ACCOUNTS@IABS AC
                            WHERE CODE_COA = '31206')), (SELECT DECODE(SIGN(SUM(SALDO_EQUIVAL_OUT)), -1, ABS(SUM(SALDO_EQUIVAL_OUT)),
                                                                       0) AS SUM_4_5
                                                         FROM (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                                              SALDO_EQUIVAL_OUT
                                                                       FROM IBS.SALDO@IABS SL
                                                                       WHERE SL.ACCOUNT_CODE = AC.CODE
                                                                         AND SL.OPER_DAY < TO_DATE('${date}', 'DD-MM-YYYY')
                                                                         AND ROWNUM = 1) AS saldo_equival_out
                                                               FROM IBS.ACCOUNTS@IABS AC
                                                               WHERE CODE_COA LIKE '4%'
                                                                  OR CODE_COA LIKE '5%'))`
    }

    fullyPaidSharesQuery(date) {
        return `SELECT
                nvl(((SELECT sum(saldo_equival_out)
                 FROM
                     (SELECT
                          (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                  saldo_equival_out
                           FROM ibs.saldo@iabs sl
                           WHERE sl.account_code=ac.code
                             AND sl.oper_day<to_date('${date}', 'DD-MM-YYYY')
                             AND rownum =1 ) AS saldo_equival_out
                      FROM ibs.accounts@iabs AC
                      WHERE code_coa in ('30315', '30309')))-(SELECT sum(saldo_equival_out)
                 FROM
                     (SELECT
                          (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                  saldo_equival_out
                           FROM ibs.saldo@iabs sl
                           WHERE sl.account_code=ac.code
                             AND sl.oper_day<to_date('${date}', 'DD-MM-YYYY')
                             AND rownum =1 ) AS saldo_equival_out
                      FROM ibs.accounts@iabs AC
                      WHERE code_coa='30303'))), 0) AS SALDO_EQ_OUT
        FROM dual`
    }

    totalCapitalInvestmentQuery(date) {
        return `SELECT
                    (SELECT sum(saldo_equival_out)
                     FROM (SELECT
                               (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                       saldo_equival_out
                                FROM ibs.saldo@iabs sl
                                WHERE sl.account_code=ac.code
                                  AND sl.oper_day<to_date('${date}', 'DD-MM-YYYY')
                                  AND rownum =1 ) AS saldo_equival_out
                           FROM ibs.accounts@iabs AC
                           WHERE code_coa in ('10711',
                                              '10719',
                                              '10779',
                                              '10821',
                                              '10813',
                                              '10823',
                                              '10825',
                                              '10879',
                                              '10899')
                              OR code_coa like '158%'
                              OR code_coa like '159%'))-(SELECT sum(saldo_equival_out)
                     FROM
                         (SELECT
                              (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                      saldo_equival_out
                               FROM ibs.saldo@iabs sl
                               WHERE sl.account_code=ac.code
                                 AND sl.oper_day<to_date('${date}', 'DD-MM-YYYY')
                                 AND rownum =1 ) AS saldo_equival_out
                          FROM ibs.accounts@iabs AC
                          WHERE code_coa in ('10723',
                                             '10725',
                                             '10799',
                                             '10823',
                                             '10825',
                                             '15913',
                                             '10899'))) AS SALDO_EQ_OUT
                FROM dual`
    }

    currentYearProfitQuery(date) {
        return !isYearEnd(this.pureDate)
        ? `SELECT decode(sign(summ), 1, summ, 0) SALDO_EQ_OUT
           FROM (SELECT nvl(col1, 0)+nvl(col2, 0)+nvl(col3, 0) AS summ
                 FROM (SELECT
                  (SELECT sum(saldo_equival_out)
                           FROM
                               (SELECT
                                    (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                            saldo_equival_out
                                     FROM ibs.saldo@iabs sl
                                     WHERE sl.account_code=ac.code
                                       AND sl.oper_day<to_date('${date}', 'DD-MM-YYYY')
                                       AND rownum =1 ) AS saldo_equival_out
                                FROM ibs.accounts@iabs AC
                                WHERE code_coa='30907' )) AS col1,
                  (SELECT sum(saldo_equival_out)
                   FROM
                       (SELECT
                            (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                    saldo_equival_out
                             FROM ibs.saldo@iabs sl
                             WHERE sl.account_code=ac.code
                               AND sl.oper_day<to_date('${date}', 'DD-MM-YYYY')
                               AND rownum =1 ) AS saldo_equival_out
                        FROM ibs.accounts@iabs AC
                        WHERE code_coa='30909' )) AS col2,
                  (SELECT col2+col1  FROM  (SELECT
                                    (SELECT sum(saldo_equival_out) FROM (SELECT
                                              (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                      saldo_equival_out  FROM ibs.saldo@iabs sl WHERE sl.account_code=ac.code
                                                 AND sl.oper_day<to_date('${date}', 'DD-MM-YYYY')
                                                 AND rownum =1 ) AS saldo_equival_out
                                          FROM ibs.accounts@iabs AC
                                          WHERE code_coa like '4%' )) AS col1,
                                    (SELECT sum(saldo_equival_out)
                                     FROM
                                         (SELECT
                                              (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                      saldo_equival_out
                                               FROM ibs.saldo@iabs sl
                                               WHERE sl.account_code=ac.code
                                                 AND sl.oper_day<to_date('${date}', 'DD-MM-YYYY')
                                                 AND rownum =1 ) AS saldo_equival_out
                                          FROM ibs.accounts@iabs AC
                                          WHERE code_coa like '5%' )) AS col2
                                FROM ibs.saldo@iabs s,
                                     ibs.accounts@iabs a
                                WHERE s.account_code=a.code
                                  AND rownum=1 )) AS col3  
             FROM ibs.saldo@iabs s, ibs.accounts@iabs a WHERE s.account_code=a.code AND rownum=1))`
        : `SELECT decode(sign(summ), 1, summ, 0) SALDO_EQ_OUT
                FROM (SELECT nvl(col1, 0)+nvl(col2, 0)+nvl(col3, 0) AS summ FROM (SELECT
                  (SELECT sum(saldo_equival_out)
                   FROM
                       (SELECT
                            (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                    saldo_equival_out
                             FROM ibs.saldo@iabs sl
                             WHERE sl.account_code=ac.code
                               AND sl.oper_day<to_date('${date}', 'DD-MM-YYYY')
                               AND rownum =1 ) AS saldo_equival_out
                        FROM ibs.accounts@iabs AC
                        WHERE code_coa='30907' )) AS col1,
                  (SELECT sum(saldo_equival_out)
                   FROM
                       (SELECT
                            (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                    saldo_equival_out
                             FROM ibs.saldo@iabs sl
                             WHERE sl.account_code=ac.code
                               AND sl.oper_day<to_date('${date}', 'DD-MM-YYYY')
                               AND rownum =1 ) AS saldo_equival_out
                        FROM ibs.accounts@iabs AC
                        WHERE code_coa='30909' )) AS col2,
                  (SELECT sum(saldo_equival_out)
               FROM
                   (SELECT
                        (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                saldo_equival_out
                         FROM ibs.saldo@iabs sl
                         WHERE sl.account_code=ac.code
                           AND sl.oper_day<to_date('${date}', 'DD-MM-YYYY')
                           AND rownum =1 ) AS saldo_equival_out
                    FROM ibs.accounts@iabs AC
                    WHERE code_coa='31206' )) AS col3  
            FROM ibs.saldo@iabs s, ibs.accounts@iabs a WHERE s.account_code=a.code AND rownum=1 ))`
    }

    async getOneRow(first_row, character, code_coa, ownQuery , isTableHead = false) {
        if(!code_coa) {
            const {SALDO_EQ_OUT} = await this.getDataInDates('', false, ownQuery)
            return createCapitalData(first_row, character, SALDO_EQ_OUT, isTableHead)
        }
        const {SALDO_EQ_OUT} = await this.getDataInDates(code_coa)
        return createCapitalData(first_row, character, SALDO_EQ_OUT, isTableHead)
    }

    ordinary_shares(full_paid, rev_purchased) { /* Обыкновенные Акции, чистые */
        return createCapitalData(
            '1.1.',
            'Обыкновенные Акции, чистые',
            getCapitalTotal(full_paid, rev_purchased),
            true
        )
    } /* Обыкновенные Акции, чистые */

    async full_paid_shares() { /* Полностью оплаченные обыкновенные акции */
        return await this.getOneRow(
            'а',
            'Полностью оплаченные обыкновенные акции',
            '',
            this.fullPaidSharesQuery
        )
    } /* Полностью оплаченные обыкновенные акции */

    async reverse_repurchased() { /* Минус: Обратно Выкупленные обыкновенные акции */
        return await this.getOneRow(
            'б',
            'Минус: Обратно Выкупленные обыкновенные акции',
            '',
            this.reversePurchasedQuery
        )
    } /* Минус: Обратно Выкупленные обыкновенные акции */

    async capital_added() { /* Добавленный капитал - Обыкновенные */
        return await this.getOneRow(
            '1.2.',
            'Добавленный капитал - Обыкновенные',
            `code_coa='30606'`,
            '',
            true
        )
    } /* Добавленный капитал - Обыкновенные */

    async capital_reserves() { /* Капитальные резервы  */
        return await this.getOneRow(
            'а',
            'Капитальные резервы ',
            `code_coa in ('30903', '30904', '30910')`
        )
    } /* Капитальные резервы  */

    async undistributed_profits() { /* Нераспределенная прибыль */
        return await this.getOneRow(
            'б',
            'Нераспределенная прибыль',
            `code_coa='31203'`
        )
    } /* Нераспределенная прибыль */

    async los_for_past_periods() { /* Убыток за прошлый год */
        return await this.getOneRow(
            'в',
            'Убыток за прошлый год',
            '',
            this.pastPeriodsQuery
        )
    } /* Убыток за прошлый год */

    async los_for_current_year() { /* Убыток за текущий год  */
        return await this.getOneRow(
            'г',
            'Убыток за текущий год',
            '',
            this.currentYearQuery
        )
    } /* Убыток за текущий год  */

    retained_earnings(reserves, profit, los1, los2) { /* Нераспределенная прибыль (убыток), в том числе капитальные резервы */
        return createCapitalData(
            '1.3.',
            'Нераспределенная прибыль (убыток), в том числе капитальные резервы',
            getCapitalTotal(reserves, profit)-getCapitalTotal(los1, los2),
            true
        )
    } /* Нераспределенная прибыль (убыток), в том числе капитальные резервы */

    async subsidy_minor_interest() { /* Интерес меньшинства в консолидированных дочерних компаниях (согласно МБС)  */
        /* TODO requires to calc */
        return new Promise(resolve => {
            resolve({
                first_row: '1.4.',
                name: 'Интерес меньшинства в консолидированных дочерних компаниях (согласно МБС)',
                total: 0.00
            })
        })
    } /* Интерес меньшинства в консолидированных дочерних компаниях (согласно МБС)  */

    async devaluation_reserve() { /* Резерв на девальвацию */
        return await this.getOneRow(
            '1.5.',
            'Резерв на девальвацию',
            `code_coa='30906'`,
            '',
            true
        )
    } /* Резерв на девальвацию */

    capital_before_deduction(...args) { /* Итого основного капитала уровня I до вычетов  */
        return createCapitalData(
            '',
            'Итого основного капитала уровня I до вычетов',
            getCapitalTotal(...args)
        )
    } /* Итого основного капитала уровня I до вычетов  */

    deduction_from_tier1(investment_total, investment_for_other_banks) { /* Вычеты из суммы основного капитала уровня I */
        return createCapitalData(
            '1.6.',
            'Вычеты из суммы основного капитала уровня I',
            getCapitalTotal(investment_total, investment_for_other_banks),
            true
        )
    } /* Вычеты из суммы основного капитала уровня I */

    async intangible_assets() { /* Нематериальные активы */
        return await this.getOneRow(
            'а',
            'Нематериальные активы',
            `acc_external IN ( '16601000300000873002', '16605000300000873002' )`
        )
    } /* Нематериальные активы */

    async total_capital_investment() { /* Все инвестиции в капитал неконсолидированных хозяйствующих субъектов, в том числе в долговые обязательства, которые образуют капитал хозяйствующих субъектов */
        return await this.getOneRow(
            'б',
            'Все инвестиции в капитал неконсолидированных хозяйствующих субъектов, в том числе в долговые обязательства, которые образуют капитал хозяйствующих субъектов',
            '',
            this.totalCapitalInvestmentQuery
        )
    } /* Все инвестиции в капитал неконсолидированных хозяйствующих субъектов, в том числе в долговые обязательства, которые образуют капитал хозяйствующих субъектов */

    async investment_for_other_banks() { /* Инвестиции в капитал других банков */
        return await this.getOneRow(
            'в',
            'Инвестиции в капитал других банков',
            `code_coa in ('10723', '10725', '10799', '10823', '10825', '10899')`
        )
    } /* Инвестиции в капитал других банков */

    total_corrected_capital(capital_before_ded, ded_from_t1) { /* ВСЕГО СКОРРЕКТИРОВАННЫЙ ОСНОВНОЙ КАПИТАЛ УРОВНЯ I */
        return createCapitalData(
            'I',
            'ВСЕГО СКОРРЕКТИРОВАННЫЙ ОСНОВНОЙ КАПИТАЛ УРОВНЯ I',
            getCapitalTotal(capital_before_ded)-getCapitalTotal(ded_from_t1),
            true
        )
    } /* ВСЕГО СКОРРЕКТИРОВАННЫЙ ОСНОВНОЙ КАПИТАЛ УРОВНЯ I */

    added_capital_level1() { /* ДОБАВЛЕННЫЙ КАПИТАЛ УРОВНЯ 1 */
        return {
            first_row: '2',
            name: 'ДОБАВЛЕННЫЙ КАПИТАЛ УРОВНЯ 1',
            total: ''
        }
    } /* ДОБАВЛЕННЫЙ КАПИТАЛ УРОВНЯ 1 */

    non_cumulative_shares(fully_paid_shares, reverse_repurchased_assets) { /* Некумулятивные бессрочные привилегированные акции  */
        return createCapitalData(
            '2.1.',
            'Некумулятивные бессрочные привилегированные акции',
            getCapitalTotal(fully_paid_shares)-getCapitalTotal(reverse_repurchased_assets),
            true
        )
    } /* Некумулятивные бессрочные привилегированные акции  */

    async fully_paid_shares() { /* Полностью оплаченные привилегированные акции */
        return await this.getOneRow(
            'а',
            'Полностью оплаченные привилегированные акции',
            '',
            this.fullyPaidSharesQuery
        )
    } /* Полностью оплаченные привилегированные акции */

    async reverse_repurchased_assets() { /* Минус: Обратно Выкупленные привилегированные акции */
        return await this.getOneRow(
            'б',
            'Минус: Обратно Выкупленные привилегированные акции',
            `code_coa='30321'`
        )
    } /* Минус: Обратно Выкупленные привилегированные акции */

    async added_capital_preferred() { /* Добавленный капитал - Привилегированные  */
        return await this.getOneRow(
            '2.2.',
            'Добавленный капитал - Привилегированные',
            `code_coa='30603'`
        )
    } /* Добавленный капитал - Привилегированные  */

    async interest_in_consolidated_subsidiary() { /* Интерес меньшинства в консолидированных дочерних компаниях  */
        /* TODO requires to calc */
        return new Promise(resolve => {
            resolve({
                first_row: '2.3.',
                name: 'Интерес меньшинства в консолидированных дочерних компаниях',
                total: 0.00,
                isTableHead: true
            })
        })
    } /* Интерес меньшинства в консолидированных дочерних компаниях  */

    async interest_of_subsidiaries() { /* Доля участия дочерних предприятий (выпущенные дочерними предприятиями и находящиеся во владении третьих лиц инструменты, приравненные к капиталу)  */
        /* TODO requires to calc */
        return new Promise(resolve => {
            resolve({
                first_row: '2.4.',
                name: 'Доля участия дочерних предприятий (выпущенные дочерними предприятиями и находящиеся во владении третьих лиц инструменты, приравненные к капиталу)',
                total: 0.00
            })
        })
    } /* Доля участия дочерних предприятий (выпущенные дочерними предприятиями и находящиеся во владении третьих лиц инструменты, приравненные к капиталу)  */

    capital_added_total_level1(...args) { /* ВСЕГО ДОБАВЛЕННЫЙ КАПИТАЛ УРОВНЯ I */
        return createCapitalData(
            'II',
            'ВСЕГО ДОБАВЛЕННЫЙ КАПИТАЛ УРОВНЯ I',
            getCapitalTotal(...args)
        )
    } /* ВСЕГО ДОБАВЛЕННЫЙ КАПИТАЛ УРОВНЯ I */

    total_adjusted_capital_level1(level1, level2) { /* ВСЕГО СКОРРЕКТИРОВАННЫЙ КАПИТАЛ УРОВНЯ I */
        return createCapitalData(
            'III',
            'ВСЕГО СКОРРЕКТИРОВАННЫЙ КАПИТАЛ УРОВНЯ I',
            getCapitalTotal(level1, level2),
            true
        )
    } /* ВСЕГО СКОРРЕКТИРОВАННЫЙ КАПИТАЛ УРОВНЯ I */

    capital_level2() { /* КАПИТАЛ УРОВНЯ II */
        return {
            first_row: '',
            name: 'КАПИТАЛ УРОВНЯ II',
            total: '',
            isTableHead: true
        }
    } /* КАПИТАЛ УРОВНЯ II */

    async current_year_profit() { /* Прибыль за текущий год (при подтверждении аудиторами - 100%, в противном случае 50% от суммы) */
        return await this.getOneRow(
            '3.1.',
            'Прибыль за текущий год (при подтверждении аудиторами - 100%, в противном случае 50% от суммы)',
            '',
            this.currentYearProfitQuery.bind(this)
        )
    } /* Прибыль за текущий год (при подтверждении аудиторами - 100%, в противном случае 50% от суммы) */

    async provisions_for_loans() { /* Резервы, создаваемые на стандартные кредиты (активы), в размере не более 1.25% от общей суммы активов, взвешенных с учетом риска */
        return await this.getOneRow(
            '3.2.',
            'Резервы, создаваемые на стандартные кредиты (активы), в размере не более 1.25% от общей суммы активов, взвешенных с учетом риска',
            `code_coa='30911' or code_coa like '177%'`
        )
    } /* Резервы, создаваемые на стандартные кредиты (активы), в размере не более 1.25% от общей суммы активов, взвешенных с учетом риска */

    async surplus_over_cost() { /* Излишки оценочной стоимости прироста над первоначальной стоимостью */
        const res = await this.getOneRow(
            '3.3.',
            'Излишки оценочной стоимости прироста над первоначальной стоимостью',
            `code_coa='30908'`
        )
        return {
            ...res,
            total: 0.45*res.total
        }
    } /* Излишки оценочной стоимости прироста над первоначальной стоимостью */

    async other_capital_instruments() { /* Другие инструменты капитала (не более 1/3 части капитала 1 уровня после вычетов) */
        return new Promise(resolve => {
            resolve({
                first_row: '3.4.',
                name: 'Другие инструменты капитала (не более 1/3 части капитала 1 уровня после вычетов)',
                total: 0.00
            })
        })
    }/* Другие инструменты капитала (не более 1/3 части капитала 1 уровня после вычетов) */

    async subordinated_debt() { /* Субординированный долг */
        const res = await this.getOneRow(
            '3.5.',
            'Субординированный долг',
            `code_coa='23702'`
        )
        return {
            ...res,
            total: 0.2*res.total
        }
    } /* Субординированный долг */

    deductions_of_excess() { /* Вычеты превышения Капитала Уровня II над Капиталом Уровня I  */
        return {
            first_row: '3.6.',
            name: 'Вычеты превышения Капитала Уровня II над Капиталом Уровня I',
            total: ''
        }
    } /* Вычеты превышения Капитала Уровня II над Капиталом Уровня I  */

    total_capital_level2(...args) { /* Итого капитала Уровня II */
        return createCapitalData(
            '',
            'Итого капитала Уровня II',
            getCapitalTotal(...args),
            true
        )
    } /* Итого капитала Уровня II */

    corrected_capital_level2(...args) { /* СКОРРЕКТИРОВАННЫЙ КАПИТАЛ УРОВНЯ II */
        return createCapitalData(
            'IV',
            'СКОРРЕКТИРОВАННЫЙ КАПИТАЛ УРОВНЯ II',
            getCapitalTotal(...args),
            true
        )
    } /* СКОРРЕКТИРОВАННЫЙ КАПИТАЛ УРОВНЯ II */

    total_regular_capital(...args) { /* ВСЕГО РЕГУЛЯТИВНЫЙ КАПИТАЛ */
        return createCapitalData(
            'V',
            'ВСЕГО РЕГУЛЯТИВНЫЙ КАПИТАЛ',
            getCapitalTotal(...args),
            true
        )
    } /* ВСЕГО РЕГУЛЯТИВНЫЙ КАПИТАЛ */

    async getRows() {
        const [
            fullPaidShares,
            reverseRepurchased,
            capitalAdded,
            capitalReserves,
            undistributedProfits,
            lostForPastPeriods,
            lostForCurrentYear,
            subsidyMinorInterest,
            devaluation_Reserve,
            intangibleAssets,
            totalCapitalInvestment,
            investmentForOtherBanks,
            fullyPaidShares,
            reverseRepurchasedAssets,
            addedCapitalPreferred,
            interestInConsolidatedSubsidiary,
            interestOfSubsidiaries,
            currentYearProfit,
            provisionForLoans,
            surplusOverCost,
            otherCapitalInstruments,
            subordinatedDebt
        ] = await Promise.all([
            this.full_paid_shares(),
            this.reverse_repurchased(),
            this.capital_added(),
            this.capital_reserves(),
            this.undistributed_profits(),
            this.los_for_past_periods(),
            this.los_for_current_year(),
            this.subsidy_minor_interest(),
            this.devaluation_reserve(),
            this.intangible_assets(),
            this.total_capital_investment(),
            this.investment_for_other_banks(),
            this.fully_paid_shares(),
            this.reverse_repurchased_assets(),
            this.added_capital_preferred(),
            this.interest_in_consolidated_subsidiary(),
            this.interest_of_subsidiaries(),
            this.current_year_profit(),
            this.provisions_for_loans(),
            this.surplus_over_cost(),
            this.other_capital_instruments(),
            this.subordinated_debt()
        ])
        const ordinaryShares = this.ordinary_shares(fullPaidShares, reverseRepurchased)
        const retainedEarnings = this.retained_earnings(
            capitalReserves,
            undistributedProfits,
            lostForPastPeriods,
            lostForCurrentYear
        )
        const capitalBeforeDeduction = this.capital_before_deduction(
            ordinaryShares,
            capitalAdded,
            retainedEarnings,
            subsidyMinorInterest,
            devaluation_Reserve
        )
        const deductionFromTier1 = this.deduction_from_tier1(totalCapitalInvestment, investmentForOtherBanks)
        const totalCorrectedTotal = this.total_corrected_capital(capitalBeforeDeduction, deductionFromTier1)
        const addedCapitalLevel1 = this.added_capital_level1()
        const nonCumulativeShares = this.non_cumulative_shares(fullyPaidShares, reverseRepurchasedAssets)
        const capitalTotalAddedLevel1 = this.capital_added_total_level1(
            nonCumulativeShares,
            addedCapitalPreferred,
            interestInConsolidatedSubsidiary,
            interestOfSubsidiaries
        )
        const totalAdjustedCapitalLevel1 = this.total_adjusted_capital_level1(
            totalCorrectedTotal,
            capitalTotalAddedLevel1
        )
        const capitalLevel2 = this.capital_level2()
        const deductionsOfExcess = this.deductions_of_excess()
        const totalCapitalLevel2 = this.total_capital_level2(
            currentYearProfit,
            provisionForLoans,
            surplusOverCost,
            otherCapitalInstruments,
            subordinatedDebt,
            deductionsOfExcess
        )
        const correctedCapitalLevel2 = this.corrected_capital_level2(totalCapitalLevel2)
        const totalRegularCapital = this.total_regular_capital(
            totalAdjustedCapitalLevel1,
            totalCapitalLevel2
        )
        return [
            ordinaryShares,
            fullPaidShares,
            reverseRepurchased,
            capitalAdded,
            retainedEarnings,
            capitalReserves,
            undistributedProfits,
            lostForPastPeriods,
            lostForCurrentYear,
            subsidyMinorInterest,
            devaluation_Reserve,
            capitalBeforeDeduction,
            deductionFromTier1,
            intangibleAssets,
            totalCapitalInvestment,
            investmentForOtherBanks,
            totalCorrectedTotal,
            addedCapitalLevel1,
            nonCumulativeShares,
            fullyPaidShares,
            reverseRepurchasedAssets,
            addedCapitalPreferred,
            interestInConsolidatedSubsidiary,
            interestOfSubsidiaries,
            capitalTotalAddedLevel1,
            totalAdjustedCapitalLevel1,
            capitalLevel2,
            currentYearProfit,
            provisionForLoans,
            surplusOverCost,
            otherCapitalInstruments,
            subordinatedDebt,
            deductionsOfExcess,
            totalCapitalLevel2,
            correctedCapitalLevel2,
            totalRegularCapital
        ]
    }
}

module.exports = Capital