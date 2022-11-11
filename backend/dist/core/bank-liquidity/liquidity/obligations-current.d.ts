import { OracleService } from '../../../oracle/oracle.service';
import { Obligations } from './obligations';
export declare class ObligationsCurrent extends Obligations {
    constructor(oracleService: OracleService);
    protected formatQuery(whereQuery?: string): string;
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
}
