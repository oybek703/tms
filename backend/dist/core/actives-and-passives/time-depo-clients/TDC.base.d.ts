import { Base } from '../../base';
import { ITimeDepoClientsData } from './TDC.interface';
export declare class TimeDepoClientsBase extends Base {
    protected formatQuery(): string;
    getRows(): Promise<ITimeDepoClientsData[]>;
}
