import { Base } from '../base';
export declare class DashboardCurrencyPosition extends Base {
    protected currencyCodes: {
        code: string;
        label: string;
    }[];
    protected formatQuery(whereQuery?: string): string;
    protected positionQuery: () => string;
    protected matchLabel(currencyCode: string): string;
    protected getOneRow(whereQuery: string): Promise<string>;
    getRows(): Promise<(string[] | {
        name: string;
        currencyCode: string;
        equival: number;
        sumEquival: number;
        percent: number;
    }[])[]>;
}
