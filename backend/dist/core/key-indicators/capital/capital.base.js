"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CapitalBase = void 0;
const base_1 = require("../../base");
const date_fns_1 = require("date-fns");
class CapitalBase extends base_1.Base {
    constructor() {
        super(...arguments);
        this.fullPaidSharesQuery = () => {
            return `SELECT ROUND((NVL(col1, 0) + NVL(col2, 0) - NVL(col3, 0)) / POWER(10, 5), 2) AS "saldoEquivalOut"
                FROM  (SELECT (SELECT SUM(saldo_equival_out)
               FROM  (SELECT AC.code,
                             (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                     saldo_equival_out
                              FROM   ibs.saldo@iabs sl
                              WHERE  sl.account_code = ac.code
                                AND sl.oper_day < DATE '${this.date}'
                                AND ROWNUM = 1) AS saldo_equival_out
                      FROM   ibs.accounts@iabs AC
                      WHERE  code_coa = '30312')) AS col1,
              (SELECT SUM(saldo_equival_out)
               FROM  (SELECT AC.code,
                             (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                     oper_day
                              FROM   ibs.saldo@iabs sl
                              WHERE  sl.account_code = ac.code
                                AND sl.oper_day < DATE '${this.date}'
                                AND ROWNUM = 1) AS oper_day,
                             (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                     saldo_equival_out
                              FROM   ibs.saldo@iabs sl
                              WHERE  sl.account_code = ac.code
                                AND sl.oper_day < DATE '${this.date}'
                                AND ROWNUM = 1) AS saldo_equival_out
                      FROM   ibs.accounts@iabs AC
                      WHERE  code_coa = '30318')) AS col2,
              (SELECT SUM(saldo_equival_out)
               FROM  (SELECT AC.code,
                             (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                     oper_day
                              FROM   ibs.saldo@iabs sl
                              WHERE  sl.account_code = ac.code
                                AND sl.oper_day < DATE '${this.date}'
                                AND ROWNUM = 1) AS oper_day,
                             (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                     saldo_equival_out
                              FROM   ibs.saldo@iabs sl
                              WHERE  sl.account_code = ac.code
                                AND sl.oper_day < DATE '${this.date}'
                                AND ROWNUM = 1) AS saldo_equival_out
                      FROM   ibs.accounts@iabs AC
                      WHERE  code_coa = '30306')) AS col3
       FROM   ibs.saldo@iabs s,
              ibs.accounts@iabs a
       WHERE  a.code = s.account_code
         AND ROWNUM = 1)`;
        };
        this.reversePurchasedQuery = () => {
            return `select round(nvl(sum(saldo_equival_out),0) / power(10, 5), 2) AS "saldoEquivalOut" from(
                select 
                (select --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                saldo_equival_out
                from ibs.saldo@iabs sl 
                where
                sl.account_code=ac.code
                and sl.oper_day< DATE '${this.date}'
                and rownum =1)
                as saldo_equival_out
                from ibs.accounts@iabs  AC
                where code_coa='30324')`;
        };
        this.pastPeriodsQuery = () => {
            return `SELECT 
       round(decode(sign(sum(saldo_equival_out)), -1, sum(saldo_equival_out), 0) / power(10,5), 2) AS "saldoEquivalOut"
                FROM
                    (SELECT
                         (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                 saldo_equival_out
                          FROM ibs.saldo@iabs sl
                          WHERE sl.account_code=ac.code
                            AND sl.oper_day<date '${this.date}'
                            AND rownum =1) AS saldo_equival_out
                     FROM ibs.accounts@iabs AC
                     WHERE code_coa='31203')`;
        };
        this.currentYearQuery = () => {
            return `SELECT
                    ROUND(DECODE(SUM_31206, 0, SUM_4_5, SUM_31206) / POWER(10, 5), 2) AS "saldoEquivalOut"
                FROM (SELECT DECODE(SIGN(SUM(SALDO_EQUIVAL_OUT)), -1, SUM(SALDO_EQUIVAL_OUT),
                                    0) AS SUM_31206
                      FROM (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                           SALDO_EQUIVAL_OUT
                                    FROM IBS.SALDO@IABS SL
                                    WHERE SL.ACCOUNT_CODE = AC.CODE
                                      AND SL.OPER_DAY < DATE '${this.date}'
                                      AND ROWNUM = 1) AS saldo_equival_out
                            FROM IBS.ACCOUNTS@IABS AC
                            WHERE CODE_COA = '31206')), (SELECT DECODE(SIGN(SUM(SALDO_EQUIVAL_OUT)), -1, ABS(SUM(SALDO_EQUIVAL_OUT)),
                                                                       0) AS SUM_4_5
                                                         FROM (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                                              SALDO_EQUIVAL_OUT
                                                                       FROM IBS.SALDO@IABS SL
                                                                       WHERE SL.ACCOUNT_CODE = AC.CODE
                                                                         AND SL.OPER_DAY < DATE '${this.date}'
                                                                         AND ROWNUM = 1) AS saldo_equival_out
                                                               FROM IBS.ACCOUNTS@IABS AC
                                                               WHERE CODE_COA LIKE '4%'
                                                                  OR CODE_COA LIKE '5%'))`;
        };
        this.fullyPaidSharesQuery = () => {
            return `SELECT
                round(nvl(((SELECT sum(saldo_equival_out)
                            FROM
                                (SELECT
                                     (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                             saldo_equival_out
                                      FROM ibs.saldo@iabs sl
                                      WHERE sl.account_code=ac.code
                                        AND sl.oper_day<date '${this.date}'
                                        AND rownum =1 ) AS saldo_equival_out
                                 FROM ibs.accounts@iabs AC
                                 WHERE code_coa in ('30315', '30309')))-(SELECT sum(saldo_equival_out)
                                                                         FROM
                                                                             (SELECT
                                                                                  (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                                                          saldo_equival_out
                                                                                   FROM ibs.saldo@iabs sl
                                                                                   WHERE sl.account_code=ac.code
                                                                                     AND sl.oper_day<date '${this.date}'
                                                                                     AND rownum =1 ) AS saldo_equival_out
                                                                              FROM ibs.accounts@iabs AC
                                                                              WHERE code_coa='30303'))), 0) / power(10, 5), 2) AS "saldoEquivalOut"
        FROM dual`;
        };
        this.totalCapitalInvestmentQuery = () => {
            return `SELECT
                    ROUND(((SELECT sum(saldo_equival_out)
                            FROM (SELECT
                                      (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                              saldo_equival_out
                                       FROM ibs.saldo@iabs sl
                                       WHERE sl.account_code=ac.code
                                         AND sl.oper_day<date '${this.date}'
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
                                                                            AND sl.oper_day<date'${this.date}'
                                                                            AND rownum =1 ) AS saldo_equival_out
                                                                     FROM ibs.accounts@iabs AC
                                                                     WHERE code_coa in ('10723',
                                                                                        '10725',
                                                                                        '10799',
                                                                                        '10823',
                                                                                        '10825',
                                                                                        '15913',
                                                                                        '10899')))) / POWER(10, 5), 2) AS "saldoEquivalOut"
                FROM dual`;
        };
        this.currentYearProfitQuery = () => {
            return !(0, date_fns_1.format)(new Date(this.date), 'dd.mm.yyyy').includes('31.12')
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
                                       AND sl.oper_day<date '${this.date}'
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
                               AND sl.oper_day<date '${this.date}'
                               AND rownum =1 ) AS saldo_equival_out
                        FROM ibs.accounts@iabs AC
                        WHERE code_coa='30909' )) AS col2,
                  (SELECT col2+col1  FROM  (SELECT
                                    (SELECT sum(saldo_equival_out) FROM (SELECT
                                              (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                      saldo_equival_out  FROM ibs.saldo@iabs sl WHERE sl.account_code=ac.code
                                                 AND sl.oper_day<date'${this.date}'
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
                                                 AND sl.oper_day<date '${this.date}'
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
                               AND sl.oper_day<date'${this.date}'
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
                               AND sl.oper_day<date '${this.date}'
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
                           AND sl.oper_day<date '${this.date}'
                           AND rownum =1 ) AS saldo_equival_out
                    FROM ibs.accounts@iabs AC
                    WHERE code_coa='31206' )) AS col3  
            FROM ibs.saldo@iabs s, ibs.accounts@iabs a WHERE s.account_code=a.code AND rownum=1 ))`;
        };
        this.createData = (count, indicatorName, value, isTableHead) => ({
            count,
            indicatorName,
            value,
            isTableHead
        });
    }
    formatQuery(whereQuery) {
        return `SELECT ROUND(SUM(SALDO_EQUIVAL_OUT) / POWER(10, 5), 2) AS "saldoEquivalOut"
            FROM (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                 SALDO_EQUIVAL_OUT
                          FROM IBS.SALDO@IABS SL
                          WHERE SL.ACCOUNT_CODE = AC.CODE
                            AND SL.OPER_DAY < DATE '${this.date}'
                            AND ROWNUM = 1) AS SALDO_EQUIVAL_OUT
                  FROM IBS.ACCOUNTS@IABS AC
                  WHERE ${whereQuery})`;
    }
    getTotal(...args) {
        return args.reduce((previousValue, currentValue) => (previousValue += currentValue.value), 0);
    }
    async getOneRow(count, indicatorName, whereQuery, ownQuery, isTableHead = false) {
        let value;
        if (typeof whereQuery === 'string') {
            const { saldoEquivalOut } = await this.getDataInDates(whereQuery, undefined);
            value = saldoEquivalOut;
        }
        else {
            const { saldoEquivalOut } = await this.getDataInDates(undefined, ownQuery);
            value = saldoEquivalOut;
        }
        if (typeof value === null || typeof value === undefined)
            value = 0;
        if (value < 0)
            value = Math.abs(value);
        return this.createData(count, indicatorName, value, isTableHead);
    }
    ordinary_shares(full_paid, rev_purchased) {
        return this.createData('1.1.', 'Обыкновенные Акции, чистые', this.getTotal(full_paid, rev_purchased), true);
    }
    async full_paid_shares() {
        return await this.getOneRow('а', 'Полностью оплаченные обыкновенные акции', undefined, this.fullPaidSharesQuery);
    }
    async reverse_repurchased() {
        return await this.getOneRow('б', 'Минус: Обратно Выкупленные обыкновенные акции', undefined, this.reversePurchasedQuery);
    }
    async capital_added() {
        return await this.getOneRow('1.2.', 'Добавленный капитал - Обыкновенные', `CODE_COA='30606'`, undefined, true);
    }
    async capital_reserves() {
        return await this.getOneRow('а', 'Капитальные резервы ', `CODE_COA IN ('30903', '30904', '30910')`);
    }
    async undistributed_profits() {
        return await this.getOneRow('б', 'Нераспределенная прибыль', `CODE_COA='31203'`);
    }
    async los_for_past_periods() {
        return await this.getOneRow('в', 'Убыток за прошлый год', undefined, this.pastPeriodsQuery);
    }
    async los_for_current_year() {
        return await this.getOneRow('г', 'Убыток за текущий год', undefined, this.currentYearQuery);
    }
    retained_earnings(reserves, profit, los1, los2) {
        return this.createData('1.3.', 'Нераспределенная прибыль (убыток), в том числе капитальные резервы', this.getTotal(reserves, profit) - this.getTotal(los1, los2), true);
    }
    async subsidy_minor_interest() {
        return new Promise(resolve => {
            resolve({
                count: '1.4.',
                indicatorName: 'Интерес меньшинства в консолидированных дочерних компаниях (согласно МБС)',
                value: 0.0
            });
        });
    }
    async devaluation_reserve() {
        return await this.getOneRow('1.5.', 'Резерв на девальвацию', `CODE_COA='30906'`, undefined, true);
    }
    capital_before_deduction(...args) {
        return this.createData('', 'Итого основного капитала уровня I до вычетов', this.getTotal(...args));
    }
    deduction_from_tier1(investment_total, investment_for_other_banks, intangible_assets) {
        return this.createData('1.6.', 'Вычеты из суммы основного капитала уровня I', this.getTotal(investment_total, investment_for_other_banks, intangible_assets), true);
    }
    async intangible_assets() {
        return await this.getOneRow('а', 'Нематериальные активы', `acc_external IN ( '16601000300000873002', '16605000300000873002' )`);
    }
    async total_capital_investment() {
        return await this.getOneRow('б', `Все инвестиции в капитал неконсолидированных хозяйствующих субъектов, в том 
        числе в долговые обязательства, которые образуют капитал хозяйствующих субъектов`, undefined, this.totalCapitalInvestmentQuery);
    }
    async investment_for_other_banks() {
        return await this.getOneRow('в', 'Инвестиции в капитал других банков', `CODE_COA IN ('10723', '10725', '10799', '10823', '10825', '10899')`);
    }
    total_corrected_capital(capital_before_ded, ded_from_t1) {
        return this.createData('I', 'ВСЕГО СКОРРЕКТИРОВАННЫЙ ОСНОВНОЙ КАПИТАЛ УРОВНЯ I', this.getTotal(capital_before_ded) - this.getTotal(ded_from_t1), true);
    }
    added_capital_level1() {
        return {
            count: '2',
            indicatorName: 'ДОБАВЛЕННЫЙ КАПИТАЛ УРОВНЯ 1',
            value: 0
        };
    }
    non_cumulative_shares(fully_paid_shares, reverse_repurchased_assets) {
        return this.createData('2.1.', 'Некумулятивные бессрочные привилегированные акции', this.getTotal(fully_paid_shares) - this.getTotal(reverse_repurchased_assets), true);
    }
    async fully_paid_shares() {
        return await this.getOneRow('а', 'Полностью оплаченные привилегированные акции', undefined, this.fullyPaidSharesQuery);
    }
    async reverse_repurchased_assets() {
        return await this.getOneRow('б', 'Минус: Обратно Выкупленные привилегированные акции', `CODE_COA='30321'`);
    }
    async added_capital_preferred() {
        return await this.getOneRow('2.2.', 'Добавленный капитал - Привилегированные', `CODE_COA='30603'`);
    }
    async interest_in_consolidated_subsidiary() {
        return new Promise(resolve => {
            resolve({
                count: '2.3.',
                indicatorName: 'Интерес меньшинства в консолидированных дочерних компаниях',
                value: 0.0,
                isTableHead: true
            });
        });
    }
    async interest_of_subsidiaries() {
        return new Promise(resolve => {
            resolve({
                count: '2.4.',
                indicatorName: `Доля участия 
        дочерних предприятий (выпущенные дочерними предприятиями и находящиеся во владении третьих лиц инструменты, приравненные к капиталу)`,
                value: 0.0
            });
        });
    }
    capital_added_total_level1(...args) {
        return this.createData('II', 'ВСЕГО ДОБАВЛЕННЫЙ КАПИТАЛ УРОВНЯ I', this.getTotal(...args));
    }
    total_adjusted_capital_level1(level1, level2) {
        return this.createData('III', 'ВСЕГО СКОРРЕКТИРОВАННЫЙ КАПИТАЛ УРОВНЯ I', this.getTotal(level1, level2), true);
    }
    capital_level2() {
        return {
            count: '',
            indicatorName: 'КАПИТАЛ УРОВНЯ II',
            value: 0,
            isTableHead: true
        };
    }
    async current_year_profit() {
        return await this.getOneRow('3.1.', 'Прибыль за текущий год (при подтверждении аудиторами - 100%, в противном случае 50% от суммы)', undefined, this.currentYearProfitQuery);
    }
    async provisions_for_loans() {
        return await this.getOneRow('3.2.', 'Резервы, создаваемые на стандартные кредиты (активы), в размере не более 1.25% от общей суммы активов, взвешенных с учетом риска', `CODE_COA='30911' OR CODE_COA LIKE '177%' OR CODE_COA=29807`);
    }
    async surplus_over_cost() {
        const res = await this.getOneRow('3.3.', 'Излишки оценочной стоимости прироста над первоначальной стоимостью', `CODE_COA='30908'`);
        return Object.assign(Object.assign({}, res), { value: 0.45 * res.value });
    }
    async other_capital_instruments() {
        return new Promise(resolve => {
            resolve({
                count: '3.4.',
                indicatorName: 'Другие инструменты капитала (не более 1/3 части капитала 1 уровня после вычетов)',
                value: 0.0
            });
        });
    }
    async subordinated_debt() {
        const res = await this.getOneRow('3.5.', 'Субординированный долг', `CODE_COA='23702'`);
        return Object.assign(Object.assign({}, res), { value: 0.2 * res.value });
    }
    deductions_of_excess() {
        return {
            count: '3.6.',
            indicatorName: 'Вычеты превышения Капитала Уровня II над Капиталом Уровня I',
            value: 0
        };
    }
    total_capital_level2(...args) {
        return this.createData('', 'Итого капитала Уровня II', this.getTotal(...args), true);
    }
    corrected_capital_level2(...args) {
        return this.createData('IV', 'СКОРРЕКТИРОВАННЫЙ КАПИТАЛ УРОВНЯ II', this.getTotal(...args), true);
    }
    total_regular_capital(...args) {
        return this.createData('V', 'ВСЕГО РЕГУЛЯТИВНЫЙ КАПИТАЛ', this.getTotal(...args), true);
    }
    async getRows() {
        const [fullPaidShares, reverseRepurchased, capitalAdded, capitalReserves, undistributedProfits, lostForPastPeriods, lostForCurrentYear, subsidyMinorInterest, devaluation_Reserve, intangibleAssets, totalCapitalInvestment, investmentForOtherBanks, fullyPaidShares, reverseRepurchasedAssets, addedCapitalPreferred, interestInConsolidatedSubsidiary, interestOfSubsidiaries, currentYearProfit, provisionForLoans, surplusOverCost, otherCapitalInstruments, subordinatedDebt] = await Promise.all([
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
        ]);
        const ordinaryShares = this.ordinary_shares(fullPaidShares, reverseRepurchased);
        const retainedEarnings = this.retained_earnings(capitalReserves, undistributedProfits, lostForPastPeriods, lostForCurrentYear);
        const capitalBeforeDeduction = this.capital_before_deduction(ordinaryShares, capitalAdded, retainedEarnings, subsidyMinorInterest, devaluation_Reserve);
        const deductionFromTier1 = this.deduction_from_tier1(totalCapitalInvestment, investmentForOtherBanks, intangibleAssets);
        const totalCorrectedTotal = this.total_corrected_capital(capitalBeforeDeduction, deductionFromTier1);
        const addedCapitalLevel1 = this.added_capital_level1();
        const nonCumulativeShares = this.non_cumulative_shares(fullyPaidShares, reverseRepurchasedAssets);
        const capitalTotalAddedLevel1 = this.capital_added_total_level1(nonCumulativeShares, addedCapitalPreferred, interestInConsolidatedSubsidiary, interestOfSubsidiaries);
        const totalAdjustedCapitalLevel1 = this.total_adjusted_capital_level1(totalCorrectedTotal, capitalTotalAddedLevel1);
        const capitalLevel2 = this.capital_level2();
        const deductionsOfExcess = this.deductions_of_excess();
        const totalCapitalLevel2 = this.total_capital_level2(currentYearProfit, provisionForLoans, surplusOverCost, otherCapitalInstruments, subordinatedDebt, deductionsOfExcess);
        const correctedCapitalLevel2 = this.corrected_capital_level2(totalCapitalLevel2);
        const totalRegularCapital = this.total_regular_capital(totalAdjustedCapitalLevel1, totalCapitalLevel2);
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
        ];
    }
}
exports.CapitalBase = CapitalBase;
//# sourceMappingURL=capital.base.js.map