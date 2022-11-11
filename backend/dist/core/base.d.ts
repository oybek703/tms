import { OracleService } from '../oracle/oracle.service';
import { OwnQuery } from './core.interface';
export declare abstract class Base {
    protected date: Date;
    protected readonly oracleService: OracleService;
    constructor(date: Date, oracleService: OracleService);
    protected abstract formatQuery(whereQuery: string): string;
    protected beforeDateQuery(): string;
    protected getBeforeDate(): Promise<void>;
    protected getDataInDates<T, K extends boolean = false>(whereQuery: string | undefined, ownQuery?: OwnQuery | undefined, inStream?: K extends true ? true : false): Promise<K extends true ? T[] : T>;
    getRows(): Promise<any[]>;
}
