import { Base } from '../../base';
import { ITopDepositsData } from './top-deposits.interface';
export declare class TopDepositsBase extends Base {
    private readonly currencyCodes;
    private readonly codes;
    private readonly accounts;
    protected formatQuery(whereQuery: string): string;
    private topDepositsQuery;
    private getOneRow;
    getRows(): Promise<ITopDepositsData[]>;
}
