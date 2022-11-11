import { Base } from '../../base';
import { IFilialEffectivenessData } from './FL.interface';
export declare class FilialEffectivenessBase extends Base {
    protected formatQuery(): string;
    getRows(): Promise<IFilialEffectivenessData[]>;
}
