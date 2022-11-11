import { Base } from '../../base';
import { OracleService } from '../../../oracle/oracle.service';
import { IInterbankDepositsDbData, InterbankDepositsTypes, IRowsData } from './IB.interface';
export declare class InterbankDepositsBase extends Base {
    protected type: InterbankDepositsTypes;
    protected currencyCodes: string[];
    constructor(date: Date, oracleService: OracleService, type?: InterbankDepositsTypes);
    protected formatQuery(whereQuery: string): string;
    protected formatMappedBanks(allMappedBanks: IInterbankDepositsDbData[]): {
        allMappedBanks: IInterbankDepositsDbData[];
        sumRow: (string | number)[];
    };
    protected mapBanks(currencyCode: string): Promise<{
        allMappedBanks: IInterbankDepositsDbData[];
        sumRow: (string | number)[];
    }>;
    getRows(type?: string): Promise<IRowsData[]>;
}
