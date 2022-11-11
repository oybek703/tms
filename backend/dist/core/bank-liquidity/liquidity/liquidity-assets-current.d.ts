import { LiquidityAssets } from './liquidity-assets';
import { OracleService } from '../../../oracle/oracle.service';
export declare class LiquidityAssetsCurrent extends LiquidityAssets {
    constructor(oracleService: OracleService);
    protected formatQuery(whereQuery?: string): string;
    protected localBanksQuery: () => string;
    protected vostroFilteredQuery: () => string;
    protected total_actives(): Promise<{
        count: string;
        indicatorName: string;
        total: number;
        natCurr: number;
        forCurr: number;
        usaDollar: number;
        evro: number;
        isTableHead: boolean;
    }>;
    protected government_bills(): Promise<{
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
