import { Base } from '../base';
import { OracleService } from '../../oracle/oracle.service';
import { IBankLimits } from './dashboard.interface';
export declare class BankLimits extends Base {
    constructor(oracleService: OracleService);
    protected formatQuery(whereQuery?: string): string;
    protected getBankLimits(localBanks?: boolean): Promise<IBankLimits[]>;
    getRows(): Promise<IBankLimits[][]>;
}
