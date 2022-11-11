import { Base } from '../base';
import { IFcrb } from './dashboard.interface';
export declare class Fcrb extends Base {
    protected formatQuery(whereQuery?: string): string;
    private percentQuery;
    private mfiPercentsQuery;
    private fundingAvgRatePercents;
    private retailPercentsQuery;
    private getOneRow;
    private mfi;
    private mfi_percents;
    private treasury;
    private treasury_percents;
    private retail;
    private retail_percents;
    private capital;
    private obligations;
    private other_actives;
    private investments;
    private bills_and_interbank_deposits;
    private crediting_and_accredetiv;
    private retail_lending;
    private treasury_portfolio;
    private balance_active;
    private funding_avg_rate_percents;
    getRows(): Promise<({
        mfiTotal: number;
        mfiPercents: IFcrb[];
    } | {
        treasuryTotal: number;
        treasuryPercents: IFcrb[];
    } | {
        retailTotal: number;
        retailPercents: IFcrb[];
    } | {
        capital: number;
        obligations: number;
    } | {
        otherActives: number;
        investments: number;
        billsAndInterbankDeposits: number;
        creditingAndAccredetiv: number;
        retailLending: number;
        treasuryPortfolio: number;
        balanceActive: number;
        fundingAvgRatePercents: IFcrb[];
    })[]>;
}
