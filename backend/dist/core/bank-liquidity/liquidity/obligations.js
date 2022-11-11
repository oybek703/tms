"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Obligations = void 0;
const liquidity_base_1 = require("./liquidity.base");
class Obligations extends liquidity_base_1.LiquidityBase {
    async demand_deposits() {
        return await this.getOneRow('10', 'Депозиты до востребования', '', this.liquidityQuery('D_D'), true);
    }
    async individuals() {
        return await this.getOneRow('', 'Физические лица', '', this.liquidityQuery('P_P'));
    }
    legal_entities(total_depos, indvdls) {
        const [total, natCurr, forCurr, usaDollar, evro] = this.columns.map(p => total_depos[p] - indvdls[p]);
        return {
            count: '-',
            indicatorName: 'Юридические лица',
            total,
            natCurr,
            forCurr,
            usaDollar,
            evro,
            isTableHead: true
        };
    }
    async state_owned_companies() {
        return await this.getOneRow('-', 'Государственные компании', `code_coa='20210'`);
    }
    async joint_ventures() {
        return await this.getOneRow('-', 'Совместные предприятия', `code_coa='20214'`);
    }
    other_clients(legal_entities, state_owned_comp, joint_vn) {
        const [total, natCurr, forCurr, usaDollar, evro] = this.columns.map(p => legal_entities[p] - this.getTotal(p, state_owned_comp, joint_vn));
        return {
            count: '-',
            indicatorName: 'Прочие клиенты',
            total,
            natCurr,
            forCurr,
            usaDollar,
            evro
        };
    }
    async vostro_accounts() {
        return await this.getOneRow('11', 'ВОСТРО счета', `code_coa='21002'`, null, true);
    }
    async other_client_deposits() {
        return await this.getOneRow('12', 'Другие депозиты клиентов', '', this.liquidityQuery('O_C_D'), true);
    }
    async accredit_coverage() {
        return await this.getOneRow('-', 'Покрытие по аккредитивам', `code_coa='22602'`);
    }
    async funds_on_pc() {
        return await this.getOneRow('-', 'Средства на ПК', '', this.liquidityQuery('F_PC'));
    }
    async funds_on_conversion() {
        return await this.getOneRow('-', 'Средства на конвертацию', `code_coa='22613'`);
    }
    async converted_funds() {
        return await this.getOneRow('-', 'Сконвертированные средства', `code_coa='22614'`);
    }
    others(other_cl_depos, accr_cover, fd_onpc, fd_onconv, conved_fd) {
        const [total, natCurr, forCurr, usaDollar, evro] = this.columns.map(p => other_cl_depos[p] -
            this.getTotal(p, accr_cover, fd_onpc, fd_onconv, conved_fd));
        return {
            count: '-',
            indicatorName: 'Прочее',
            total,
            natCurr,
            forCurr,
            usaDollar,
            evro
        };
    }
    async other_obligations() {
        return await this.getOneRow('-', 'Другие обязательства', '', this.liquidityQuery('O_O'), true);
    }
    total_demand_liabilities(demand_depos, vostro_accs, other_cl_depos, other_obls) {
        const [total, natCurr, forCurr, usaDollar, evro] = this.columns.map((p) => this.getTotal(p, demand_depos, vostro_accs, other_cl_depos, other_obls));
        return {
            count: '14',
            indicatorName: 'ИТОГО обязательств до востребования',
            total,
            natCurr,
            forCurr,
            usaDollar,
            evro,
            isTableHead: true
        };
    }
    async getRows() {
        const [demandDeposits, individuals, stateOwnedCompanies, jointVentures, vostroAccounts, otherClientDeposits, accreditCoverage, fundsOnPc, fundsOnConversion, convertedFunds, otherObligations] = await Promise.all([
            this.demand_deposits(),
            this.individuals(),
            this.state_owned_companies(),
            this.joint_ventures(),
            this.vostro_accounts(),
            this.other_client_deposits(),
            this.accredit_coverage(),
            this.funds_on_pc(),
            this.funds_on_conversion(),
            this.converted_funds(),
            this.other_obligations()
        ]);
        const legalEntities = this.legal_entities(demandDeposits, individuals);
        const otherClients = this.other_clients(legalEntities, stateOwnedCompanies, jointVentures);
        const others = this.others(otherClientDeposits, accreditCoverage, fundsOnPc, fundsOnConversion, convertedFunds);
        const totalDemandLiabilities = this.total_demand_liabilities(demandDeposits, vostroAccounts, otherClientDeposits, otherObligations);
        return [
            demandDeposits,
            this.getEmptyRow(),
            individuals,
            legalEntities,
            this.getEmptyRow(),
            stateOwnedCompanies,
            jointVentures,
            otherClients,
            vostroAccounts,
            otherClientDeposits,
            this.getEmptyRow(),
            accreditCoverage,
            fundsOnPc,
            fundsOnConversion,
            convertedFunds,
            others,
            otherObligations,
            totalDemandLiabilities
        ];
    }
}
exports.Obligations = Obligations;
//# sourceMappingURL=obligations.js.map