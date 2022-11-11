import { Base } from '../../base';
import { ITimeDepositsData } from './time-deposits.interface';
export declare class TimeDepositsBase extends Base {
    monthFirstDate: Date;
    protected formatQuery(): string;
    private getCurrencyRate;
    private getSumByCurrency;
    getRows(): Promise<(number[] | ITimeDepositsData[])[]>;
}
