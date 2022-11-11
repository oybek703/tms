import { LiquidityBase } from './liquidity.base';
import { ILiquidityRow } from './liquidity.interface';
export declare class Obligations extends LiquidityBase {
    protected demand_deposits(): Promise<{
        count: string;
        indicatorName: string;
        total: number;
        natCurr: number;
        forCurr: number;
        usaDollar: number;
        evro: number;
        isTableHead: boolean;
    }>;
    protected individuals(): Promise<{
        count: string;
        indicatorName: string;
        total: number;
        natCurr: number;
        forCurr: number;
        usaDollar: number;
        evro: number;
        isTableHead: boolean;
    }>;
    protected legal_entities(total_depos: ILiquidityRow, indvdls: ILiquidityRow): ILiquidityRow;
    protected state_owned_companies(): Promise<{
        count: string;
        indicatorName: string;
        total: number;
        natCurr: number;
        forCurr: number;
        usaDollar: number;
        evro: number;
        isTableHead: boolean;
    }>;
    protected joint_ventures(): Promise<{
        count: string;
        indicatorName: string;
        total: number;
        natCurr: number;
        forCurr: number;
        usaDollar: number;
        evro: number;
        isTableHead: boolean;
    }>;
    protected other_clients(legal_entities: ILiquidityRow, state_owned_comp: ILiquidityRow, joint_vn: ILiquidityRow): ILiquidityRow;
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
    protected other_client_deposits(): Promise<{
        count: string;
        indicatorName: string;
        total: number;
        natCurr: number;
        forCurr: number;
        usaDollar: number;
        evro: number;
        isTableHead: boolean;
    }>;
    protected accredit_coverage(): Promise<{
        count: string;
        indicatorName: string;
        total: number;
        natCurr: number;
        forCurr: number;
        usaDollar: number;
        evro: number;
        isTableHead: boolean;
    }>;
    protected funds_on_pc(): Promise<{
        count: string;
        indicatorName: string;
        total: number;
        natCurr: number;
        forCurr: number;
        usaDollar: number;
        evro: number;
        isTableHead: boolean;
    }>;
    protected funds_on_conversion(): Promise<{
        count: string;
        indicatorName: string;
        total: number;
        natCurr: number;
        forCurr: number;
        usaDollar: number;
        evro: number;
        isTableHead: boolean;
    }>;
    protected converted_funds(): Promise<{
        count: string;
        indicatorName: string;
        total: number;
        natCurr: number;
        forCurr: number;
        usaDollar: number;
        evro: number;
        isTableHead: boolean;
    }>;
    protected others(other_cl_depos: ILiquidityRow, accr_cover: ILiquidityRow, fd_onpc: ILiquidityRow, fd_onconv: ILiquidityRow, conved_fd: ILiquidityRow): ILiquidityRow;
    protected other_obligations(): Promise<{
        count: string;
        indicatorName: string;
        total: number;
        natCurr: number;
        forCurr: number;
        usaDollar: number;
        evro: number;
        isTableHead: boolean;
    }>;
    protected total_demand_liabilities(demand_depos: ILiquidityRow, vostro_accs: ILiquidityRow, other_cl_depos: ILiquidityRow, other_obls: ILiquidityRow): ILiquidityRow;
    getRows(): Promise<ILiquidityRow[]>;
}
