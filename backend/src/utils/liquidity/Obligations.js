const LiquidityMainClass = require("./LiquidityMainClass")
const {getLiquidityTotal} = require("./liq_pure_functions")
const {liq_include} = require("./liq_pure_functions")

class Obligations extends LiquidityMainClass {
    constructor(date) {
        super(date)
    }

    async demand_deposits() { /* Депозиты до востребования */
        return await this.getOneRow(
            10,
            'Депозиты до востребования',
            '',
            this.liquidityQuery('D_D'),
            true
        )
    } /* Депозиты до востребования */

    async individuals() { /* Физические лица */
        return await this.getOneRow(
            '',
            'Физические лица',
            '',
            this.liquidityQuery('P_P')
        )
    } /* Физические лица */

    legal_entities(total_depos, indvdls) { /* Юридические лица */
        const [total, nat_curr, for_curr, usa_dollar, evro] =
            ['total', 'nat_curr', 'for_curr', 'usa_dollar', 'evro']
                .map(p => total_depos[p]-indvdls[p])
        return {
            count: '-', state: 'Юридические лица', total, nat_curr, for_curr, usa_dollar,
            evro, isTableHead: true
        }
    } /* Юридические лица */

    async state_owned_companies() { /* Государственные компании */
        return await this.getOneRow(
            '-',
            'Государственные компании',
            `code_coa='20210'`
        )
    } /* Государственные компании */

    async joint_ventures() { /* Совместные предприятия */
        return await this.getOneRow(
            '-',
            'Совместные предприятия',
            `code_coa='20214'`
        )
    } /* Совместные предприятия */

    other_clients(legal_entities, state_owned_comp, joint_vn) { /* Прочие клиенты */
        const [total, nat_curr, for_curr, usa_dollar, evro] = this.columns
                .map(p => legal_entities[p]-getLiquidityTotal(p, state_owned_comp, joint_vn))
        return {
            count: '-', state: 'Прочие клиенты', total, nat_curr, for_curr, usa_dollar,
            evro
        }
    } /* Прочие клиенты */

    async vostro_accounts() { /* ВОСТРО счета */
        return await this.getOneRow(
            11,
            'ВОСТРО счета',
            `code_coa='21002'`,
            '',
            true
        )
    } /* ВОСТРО счета */

    async other_client_deposits() { /* Другие депозиты клиентов */
        return await this.getOneRow(
            12,
            'Другие депозиты клиентов',
            '',
            this.liquidityQuery('O_C_D'),
            true
        )
    } /* Другие депозиты клиентов */

    async accredit_coverage() { /* Покрытие по аккредитивам */
        return await this.getOneRow(
            '-',
            'Покрытие по аккредитивам',
            `code_coa='22602'`
        )
    } /* Покрытие по аккредитивам */

    async funds_on_pc() { /* Средства на ПК */
        return await this.getOneRow(
            '-',
            'Средства на ПК',
            '',
            this.liquidityQuery('F_PC')
        )
    } /* Средства на ПК */

    async funds_on_conversion() { /* Средства на конвертацию */
        return await this.getOneRow(
            '-',
            'Средства на конвертацию',
            `code_coa='22613'`
        )
    } /* Средства на конвертацию */

    async converted_funds() { /* Сконвертированные средства */
        return await this.getOneRow(
            '-',
            'Сконвертированные средства',
            `code_coa='22614'`
        )
    } /* Сконвертированные средства */

    others(other_cl_depos, accr_cover, fd_onpc, fd_onconv, conved_fd) { /* Прочее */
        const [total, nat_curr, for_curr, usa_dollar, evro] = this.columns
                .map(p => other_cl_depos[p] - getLiquidityTotal(p, accr_cover, fd_onpc, fd_onconv, conved_fd))
        return {
            count: '-', state: 'Прочее', total, nat_curr, for_curr, usa_dollar,
            evro
        }
    } /* Прочее */

    async other_obligations() { /* Другие обязательства */
        return await this.getOneRow(
            '-',
            'Другие обязательства',
            '',
            this.liquidityQuery('O_O'),
            true
        )
    } /* Другие обязательства */

    total_demand_liabilities(demand_depos, vostro_accs, other_cl_depos, other_obls) { /* ИТОГО обязательств до востребования */
        const [total, nat_curr, for_curr, usa_dollar, evro] = this.columns
            .map(p => getLiquidityTotal(p, demand_depos, vostro_accs, other_cl_depos, other_obls))
        return {
            count: 14,
            state: 'ИТОГО обязательств до востребования',
            total,
            nat_curr,
            for_curr,
            usa_dollar,
            evro,
            isTableHead: true
        }
    } /* ИТОГО обязательств до востребования */

    async getRows() {
        const [
            demandDeposits,
            individuals,
            stateOwnedCompanies,
            jointVentures,
            vostroAccounts,
            otherClientDeposits,
            accreditCoverage,
            fundsOnPc,
            fundsOnConversion,
            convertedFunds,
            otherObligations
        ] = await Promise.all([
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
        ])
        const legalEntities = this.legal_entities(demandDeposits, individuals)
        const otherClients = this.other_clients(legalEntities, stateOwnedCompanies, jointVentures)
        const others = this.others(
            otherClientDeposits,
            accreditCoverage,
            fundsOnPc,
            fundsOnConversion,
            convertedFunds
        )
        const totalDemandLiabilities = this.total_demand_liabilities(
            demandDeposits,
            vostroAccounts,
            otherClientDeposits,
            otherObligations
        )
        return [
            demandDeposits,
            liq_include(),
            individuals,
            legalEntities,
            liq_include(),
            stateOwnedCompanies,
            jointVentures,
            otherClients,
            vostroAccounts,
            otherClientDeposits,
            liq_include(),
            accreditCoverage,
            fundsOnPc,
            fundsOnConversion,
            convertedFunds,
            others,
            otherObligations,
            totalDemandLiabilities
        ]
    }
}

module.exports = Obligations