import { GapBase } from './gap.base';
import { OracleService } from '../../oracle/oracle.service';
export declare class GapManual extends GapBase {
    private readonly forEditing;
    constructor(oracleService: OracleService, forEditing?: boolean);
    protected formatQuery(whereQuery: string): string;
    protected manualTableQuery(role: string): () => string;
    getRows(): Promise<any[]>;
}
