import { Base } from '../base';
export declare class CreditData extends Base {
    private queries;
    private currencyCodes;
    protected formatQuery(whereQuery?: string): string;
    private delayedAndToxicQuery;
    private disaggregatedQuery;
    private issuedCreditsQuery;
    private getOneRow;
    private issued_credits;
    private standard_credits;
    private delayed_and_toxic;
    private disaggregated_by_time;
    getRows(): Promise<any[]>;
}
