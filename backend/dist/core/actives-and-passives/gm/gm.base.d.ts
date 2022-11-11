import { Base } from '../../base';
export declare class GmBase extends Base {
    private codes;
    protected formatQuery(whereQuery: string): string;
    private gmQuery;
    private securitySumQuery;
    private accredetivQuery;
    private accredetivLiabilityQuery;
    private collateralSavingsQuery;
    private autoCreditQuery;
    private mioQuery;
    private getOneRow;
    private securitySum;
    private accredetiv;
    private collateralSavings;
    private autoCredit;
    private getCurrencyRate;
    getRows(): Promise<(unknown[] | {
        acs: number[];
        others: {
            indicatorName: string;
            codeCurrency: string;
            parValue: number;
        }[];
    })[]>;
}
