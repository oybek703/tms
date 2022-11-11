import { Base } from '../../base';
import { IReportLiabilitiesData } from './RL.interface';
export declare class ReportLiabilitiesBase extends Base {
    protected formatQuery(): string;
    private fillTable;
    private reportLiabilitiesQuery;
    private getTableData;
    getRows(): Promise<IReportLiabilitiesData[]>;
}
