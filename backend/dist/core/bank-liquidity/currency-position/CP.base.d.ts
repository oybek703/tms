import { Base } from '../../base';
import { ICurrencyPositionRow, ITableSumData } from './CP.interface';
export declare class CurrencyPositionBase extends Base {
    private currencyCodes;
    protected formatQuery(whereQuery: string): string;
    private regularCapitalQuery;
    private regular_capital;
    private getOneRow;
    getRows(): Promise<[ICurrencyPositionRow[], ITableSumData[]]>;
}
