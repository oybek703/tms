import { Base } from '../../base';
import { OracleService } from '../../../oracle/oracle.service';
import { INostroMatrixDbData } from './nostro-matrix.interface';
export declare class NostroMatrixBase extends Base {
    private readonly firstDate;
    private readonly secondDate;
    private currencyCodes;
    constructor(firstDate: any, secondDate: any, oracleService: OracleService);
    protected formatQuery(currencyCode?: string): string;
    getRows(): Promise<{
        code: string;
        title: string;
        data: INostroMatrixDbData[];
    }[]>;
}
