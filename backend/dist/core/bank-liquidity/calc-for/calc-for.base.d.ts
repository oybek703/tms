import { Base } from '../../base';
import { ICalcForRow } from './calc-for.interface';
export declare class CalcForBase extends Base {
    protected formatQuery(date: string): string;
    private startEndDateQuery;
    private getDatesBetweenDates;
    private getDates;
    private getOneRow;
    getRows(): Promise<ICalcForRow[]>;
}
