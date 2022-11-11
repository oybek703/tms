import { Base } from '../base';
export declare class Deposits extends Base {
    protected formatQuery(whereQuery: string): string;
    protected timeDepositsQuery: () => string;
    protected currencyMfiQuery: () => string;
    protected currencyTimeDepositsQuery: () => string;
    protected interbankDepositsQuery: () => string;
    protected fundingStructureQuery: () => string;
    protected currencyMBDQuery: () => string;
    protected time_deposits(): Promise<string[]>;
    protected currency_mfi(): Promise<string[]>;
    protected currency_time_deposits(): Promise<string[]>;
    protected interbank_deposits(): Promise<string[]>;
    protected funding_structure(): Promise<string[]>;
    protected currency_mbd(): Promise<string[]>;
    getRows(): Promise<string[][]>;
}
