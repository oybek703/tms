import { Base } from '../base';
export declare class DashboardLiquidity extends Base {
    protected formatQuery(whereQuery: string): string;
    protected dashboardLiquidityQuery: (liquidityCategory: string) => () => string;
    protected vlaCurrentStateQuery: () => string;
    protected liquidityByCategory<K extends boolean = false>(liquidityCategory: string, withCategory?: boolean): Promise<K extends true ? number[] : {
        values: number[];
        categories: string[];
    }>;
    protected vlaCurrentState(): Promise<any[]>;
    getRows(): Promise<{
        total: number[];
        nat: {
            values: number[];
            categories: string[];
        };
        foreign: {
            values: number[];
            categories: string[];
        };
        categories: string[];
    }[]>;
}
