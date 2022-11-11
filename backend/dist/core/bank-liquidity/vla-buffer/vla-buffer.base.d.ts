import { Base } from '../../base';
export declare class VlaBufferBase extends Base {
    protected formatQuery(whereQuery: string): string;
    private passivesQuery;
    private totalAssetsQuery;
    private totalPassivesQuery;
    private addValuesByProperty;
    private getOneRow;
    private correspondent_account;
    private cash;
    private income_generating_assets;
    private government_bills;
    private overnight;
    private high_liquidity_assets;
    private total_assets;
    private demand_deposits;
    private other_client_deposits;
    private other_liabilities;
    private total_demand_liabilities;
    private total_passives;
    getRows(): Promise<{
        indicatorName: string;
        totalPercent: number;
        total: number;
        uzsPercent: number;
        uzs: number;
        foreignPercent: number;
        foreign: number;
    }[][]>;
}
