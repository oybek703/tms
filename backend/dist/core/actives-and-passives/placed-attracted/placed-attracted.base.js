"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlacedAttractedBase = void 0;
const base_1 = require("../../base");
class PlacedAttractedBase extends base_1.Base {
    constructor() {
        super(...arguments);
        this.platQuery = (role) => {
            return () => {
                return `SELECT SALDO_EQUIVAL_OUT AS "sum" 
              FROM (SELECT * FROM PLACED_ATTRACTED ORDER BY OPER_DAY DESC)
                            WHERE OPER_DAY<DATE '${this.date}' 
                              AND ROLE='${role}' 
                              AND ROWNUM=1`;
            };
        };
    }
    formatQuery(whereQuery) {
        return `SELECT
                    ABS(ROUND(NVL(SUM(SALDO_EQUIVAL_OUT)/POWER(10, 5), 0), 2)) "sum"
                FROM
                    (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                    SALDO_EQUIVAL_OUT
                             FROM IBS.SALDO@IABS sl
                             WHERE sl.account_code=ac.code
                               AND sl.OPER_DAY < DATE '${this.date}'
                               AND ROWNUM = 1) AS SALDO_EQUIVAL_OUT
                     FROM IBS.ACCOUNTS@IABS AC
                     WHERE ${whereQuery})`;
    }
    async getOneRow(fundName, balanceCode, whereQuery, ownQuery, forChart = false) {
        let sum;
        if (whereQuery) {
            sum = (await this.getDataInDates(whereQuery, undefined)).sum;
        }
        else {
            sum = (await this.getDataInDates(undefined, ownQuery)).sum;
        }
        return { fundName, balanceCode, sum, percent: '', forChart };
    }
    async demand_deposits() {
        return await this.getOneRow('Депозиты до востребования', '202', undefined, this.platQuery('DD'), true);
    }
    async organization_deposits() {
        return await this.getOneRow('в т.ч. счета государственных и бюджетных организаций', '203-205, 20207, 20210', `code_coa='20203' or 
        code_coa='20204' or code_coa='20205' 
        or code_coa='20207' or code_coa='20210'`);
    }
    async saving_deposits() {
        return await this.getOneRow('Сберегательные депозиты', '204', undefined, this.platQuery('SD'));
    }
    async time_deposits() {
        return await this.getOneRow('Срочные депозиты', '206', undefined, this.platQuery('TD'), true);
    }
    async other_corr_accounts() {
        return await this.getOneRow('Коррсчета других банков', '210', `code_coa like '210%'`);
    }
    async payable_loans() {
        return await this.getOneRow('Кредиты к оплате', '216, 220, 23602', `code_coa like '216%' or code_coa like '220%' or code_coa='23602'`, null, true);
    }
    async interests_taxes() {
        return await this.getOneRow('Начисленные проценты и налоги к оплате', '224, 225', undefined, this.platQuery('IT'));
    }
    async other_client_deposits() {
        return await this.getOneRow('Другие депозиты клиентов', '226', undefined, this.platQuery('OCD'), true);
    }
    async issued_bills() {
        return await this.getOneRow('Выпущенные ценные бумаги', '236', `code_coa like '236%'`);
    }
    async own_resources() {
        return await this.getOneRow('Собственные ресурсы (Капитал)', '300+400-500', undefined, this.platQuery('OWR'), true);
    }
    async cash_on_hand() {
        return await this.getOneRow('Кассовая наличность', '101', `code_coa like '101%'`, null, true);
    }
    async funds_in_cb() {
        return await this.getOneRow('Средства в ЦБ РУз', '103', `code_coa like '103%'`, null, true);
    }
    async corr_accounts() {
        return await this.getOneRow('Коррсчета в других банках', '105', `code_coa like '105%'`, null, true);
    }
    async bills_investments() {
        return await this.getOneRow('Вложения в ценные бумаги', '108, 118', `code_coa like '108%' or code_coa like '118%'`);
    }
    async promissory_obligations() {
        return await this.getOneRow('Обязательства клиентов по векселям', '115', `code_coa like '115%'`);
    }
    async factoring_leasing() {
        return await this.getOneRow('Факторинг, кредиты и лизинг', '111, 119-156', undefined, this.platQuery('FL'), true);
    }
    async litigation_loans() {
        return await this.getOneRow('Кредиты в судебном разбирательстве', '157', undefined, this.platQuery('LL'));
    }
    async investments() {
        return await this.getOneRow('Инвестиции', '158', `code_coa like '158%'`);
    }
    async interest_charges() {
        return await this.getOneRow('Начисленные проценты', '163, 164', undefined, this.platQuery('ICH'), true);
    }
    async main_assets() {
        return await this.getOneRow('Основные средства', '165, 166, 167', `code_coa like '165%' or code_coa like '166%' or code_coa like '167%'`);
    }
    async requirements() {
        return await this.getOneRow('МАЖБУРИЯТЛАР (2)', undefined, undefined, this.platQuery('RQ'));
    }
    async received_funds() {
        return await this.getOneRow('Бош банк/филиаллардан олинадиган маблаглар (161)', undefined, undefined, this.platQuery('RF'));
    }
    async payed_funds() {
        return await this.getOneRow('Бош банк/филиалларга туланадиган маблаглар (222)', undefined, undefined, this.platQuery('PF'));
    }
    async getRows() {
        const [demandDeposits, organizationDeposits, savingDeposits, timeDeposits, otherCorrAccounts, payableLoans, interestTaxes, otherClientDeposits, issuedBills, ownResources, cashOnHand, fundsInCB, corrAccounts, billsInvestments, promissoryObligations, factoringLeasing, litigationLoans, investments, interestCharges, mainAssets, requirements, receivedFunds, payedFunds] = await Promise.all([
            this.demand_deposits(),
            this.organization_deposits(),
            this.saving_deposits(),
            this.time_deposits(),
            this.other_corr_accounts(),
            this.payable_loans(),
            this.interests_taxes(),
            this.other_client_deposits(),
            this.issued_bills(),
            this.own_resources(),
            this.cash_on_hand(),
            this.funds_in_cb(),
            this.corr_accounts(),
            this.bills_investments(),
            this.promissory_obligations(),
            this.factoring_leasing(),
            this.litigation_loans(),
            this.investments(),
            this.interest_charges(),
            this.main_assets(),
            this.requirements(),
            this.received_funds(),
            this.payed_funds()
        ]);
        let involvedFunds = [
            demandDeposits,
            organizationDeposits,
            savingDeposits,
            timeDeposits,
            otherCorrAccounts,
            payableLoans,
            interestTaxes,
            otherClientDeposits,
            issuedBills,
            ownResources
        ];
        let placedFunds = [
            cashOnHand,
            fundsInCB,
            corrAccounts,
            billsInvestments,
            promissoryObligations,
            factoringLeasing,
            litigationLoans,
            investments,
            interestCharges,
            mainAssets
        ];
        const involvedMiddleValue = [...involvedFunds]
            .filter((_, i) => i !== 1)
            .reduce((acc, val) => (acc += val['sum']), 0);
        const minOfTwoFunds = Math.min(receivedFunds['sum'], payedFunds['sum']);
        const otherLiabilitiesTemp = +(ownResources['sum'] +
            requirements['sum'] -
            (involvedMiddleValue + minOfTwoFunds)).toFixed(2);
        const otherLiabilities = {
            fundName: 'Прочие обязательства',
            balanceCode: undefined,
            sum: otherLiabilitiesTemp,
            percent: 'no_calc'
        };
        involvedFunds.push(otherLiabilities);
        const involvedFundsSum = [...involvedFunds]
            .filter((_, i) => i !== 1)
            .reduce((acc, val) => (acc += val['sum']), 0);
        const otherActivesTemp = +(involvedFundsSum - [...placedFunds].reduce((acc, val) => (acc += val['sum']), 0)).toFixed(2);
        const otherActives = {
            fundName: 'Прочие активы',
            balanceCode: undefined,
            sum: otherActivesTemp,
            percent: 'no_calc'
        };
        placedFunds.push(otherActives);
        const placedFundsSum = +placedFunds
            .reduce((acc, val) => (acc += val['sum']), 0)
            .toFixed(2);
        involvedFunds = involvedFunds.map((v, i) => {
            if (i !== 1) {
                v['percent'] = ((v['sum'] * 100) / involvedFundsSum).toFixed(2);
            }
            return v;
        });
        placedFunds = placedFunds.map((v) => {
            v['percent'] = ((v['sum'] * 100) / placedFundsSum).toFixed(2);
            return v;
        });
        involvedFunds.push({
            fundName: 'ВСЕГО РЕСУРСОВ',
            balanceCode: undefined,
            sum: involvedFundsSum,
            percent: '100.00'
        });
        placedFunds.push({
            fundName: 'ВСЕГО ВЛОЖЕНИЙ',
            balanceCode: undefined,
            sum: placedFundsSum,
            percent: '100.00'
        });
        return [involvedFunds, placedFunds];
    }
}
exports.PlacedAttractedBase = PlacedAttractedBase;
//# sourceMappingURL=placed-attracted.base.js.map