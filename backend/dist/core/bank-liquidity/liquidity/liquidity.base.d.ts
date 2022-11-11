import { Base } from '../../base';
import { OwnQuery } from '../../core.interface';
import { ILiquidityRow } from './liquidity.interface';
export declare class LiquidityBase extends Base {
    protected columns: string[];
    protected formatQuery(whereQuery: string): string;
    protected liquidityQuery(role: string): () => string;
    private createData;
    protected getEmptyRow: () => ILiquidityRow;
    protected getTotal: (propertyName: keyof ILiquidityRow, ...args: ILiquidityRow[]) => number;
    protected getOneRow(count: string, indicatorName: string, whereQuery: string | undefined, ownQuery?: OwnQuery | undefined, isTableHead?: boolean): Promise<{
        count: string;
        indicatorName: string;
        total: number;
        natCurr: number;
        forCurr: number;
        usaDollar: number;
        evro: number;
        isTableHead: boolean;
    }>;
}
