import { Base } from '../../base';
import { IDepositsByDeadline } from './DBD.interface';
export declare class DepositsByDeadlineBase extends Base {
    protected formatQuery(whereQuery: string): string;
    private depositsByDeadlineQuery;
    private getOneRow;
    getRows(): Promise<IDepositsByDeadline[]>;
}
