import { Base } from '../../base';
import { OwnQuery } from '../../core.interface';
import { DBData, MainIndicatorRow } from './main-indicators.interfaces';
export declare class MainIndicatorsBase extends Base {
    private yearFirstDate;
    private monthFirstDate;
    protected formatQuery(whereQuery: string): string;
    protected mainIndicatorsQuery: (role: string) => () => string;
    private createData;
    protected getTotalData(...args: DBData[]): {
        yearBegin: string | number;
        monthBegin: string | number;
        selectedDate: string | number;
        differ: string | number;
        differPercent: string;
    };
    protected getOneRow(count: string, indicatorName: string, whereQuery: string, ownQuery?: OwnQuery, isTableHead?: boolean): Promise<MainIndicatorRow>;
}
