import { LiquidityBase } from './liquidity.base';
import { ILiquidityRow } from './liquidity.interface';
export declare class LiquidityAssets extends LiquidityBase {
    protected governmentBillsQuery: () => string;
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
    protected cash_box(): Promise<{
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
    protected drag_metals(): Promise<{
        count: string;
        indicatorName: string;
        total: number;
        natCurr: number;
        forCurr: number;
        usaDollar: number;
        evro: number;
        isTableHead: boolean;
    }>;
    protected over_night(): Promise<{
        count: string;
        indicatorName: string;
        total: number;
        natCurr: number;
        forCurr: number;
        usaDollar: number;
        evro: number;
        isTableHead: boolean;
    }>;
    protected cb_accounts(): Promise<{
        count: string;
        indicatorName: string;
        total: number;
        natCurr: number;
        forCurr: number;
        usaDollar: number;
        evro: number;
        isTableHead: boolean;
    }>;
    protected correspondent_accounts(): Promise<{
        count: string;
        indicatorName: string;
        total: number;
        natCurr: number;
        forCurr: number;
        usaDollar: number;
        evro: number;
        isTableHead: boolean;
    }>;
    protected f_o_r(): Promise<{
        count: string;
        indicatorName: string;
        total: number;
        natCurr: number;
        forCurr: number;
        usaDollar: number;
        evro: number;
        isTableHead: boolean;
    }>;
    protected funds_to_receive(): Promise<{
        count: string;
        indicatorName: string;
        total: number;
        natCurr: number;
        forCurr: number;
        usaDollar: number;
        evro: number;
        isTableHead: boolean;
    }>;
    protected repo_transaction(): Promise<{
        count: string;
        indicatorName: string;
        total: number;
        natCurr: number;
        forCurr: number;
        usaDollar: number;
        evro: number;
        isTableHead: boolean;
    }>;
    protected interbank_deposits(): Promise<{
        count: string;
        indicatorName: string;
        total: number;
        natCurr: number;
        forCurr: number;
        usaDollar: number;
        evro: number;
        isTableHead: boolean;
    }>;
    protected nostro_accounts(): Promise<{
        count: string;
        indicatorName: string;
        total: number;
        natCurr: number;
        forCurr: number;
        usaDollar: number;
        evro: number;
        isTableHead: boolean;
    }>;
    protected vostro_accounts(): Promise<{
        count: string;
        indicatorName: string;
        total: number;
        natCurr: number;
        forCurr: number;
        usaDollar: number;
        evro: number;
        isTableHead: boolean;
    }>;
    protected local_banks(): Promise<{
        count: string;
        indicatorName: string;
        total: number;
        natCurr: number;
        forCurr: number;
        usaDollar: number;
        evro: number;
        isTableHead: boolean;
    }>;
    protected vostro_filtered(): Promise<{
        count: string;
        indicatorName: string;
        total: number;
        natCurr: number;
        forCurr: number;
        usaDollar: number;
        evro: number;
        isTableHead: boolean;
    }>;
    protected liquidity_assets_total(...args: ILiquidityRow[]): ILiquidityRow;
    protected high_liq_assets_total(total_assets: ILiquidityRow, f_o_r: ILiquidityRow, repo_tr: ILiquidityRow, vostr_accounts: ILiquidityRow, localBanks: ILiquidityRow): ILiquidityRow;
    protected high_liq_assets_share(high_liq_assets_total: ILiquidityRow, total_actives: ILiquidityRow): ILiquidityRow;
    getRows(): Promise<ILiquidityRow[]>;
}
