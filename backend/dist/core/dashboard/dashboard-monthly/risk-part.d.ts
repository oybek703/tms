import { OracleService } from '../../../oracle/oracle.service';
import { DashboardMonthly } from './dashboard-monthly';
export declare class RiskPart extends DashboardMonthly {
    protected readonly firstDate: any;
    protected readonly secondDate: any;
    protected readonly dateOption?: any;
    constructor(firstDate: any, secondDate: any, oracleService: OracleService, dateOption?: any);
    private creditPortfolioQuery;
    private creditPortfolioRateQuery;
    private PARQuery;
    private NPLAndToxicQuery;
    private reserveQuery;
    credit_portfolio(): Promise<{
        count: string;
        indicatorName: string;
        data: any[];
        differ: number;
        differPercent: number;
        isTableHead: boolean;
        withPercent?: undefined;
    } | {
        count: string;
        indicatorName: string;
        data: any;
        differ: number;
        differPercent: number;
        isTableHead: boolean;
        withPercent: boolean;
    }>;
    credit_portfolio_nat_curr(): Promise<{
        count: string;
        indicatorName: string;
        data: any[];
        differ: number;
        differPercent: number;
        isTableHead: boolean;
        withPercent?: undefined;
    } | {
        count: string;
        indicatorName: string;
        data: any;
        differ: number;
        differPercent: number;
        isTableHead: boolean;
        withPercent: boolean;
    }>;
    credit_portfolio_rate_nat_curr(creditPortfolioNatCurr: any): Promise<{
        count: string;
        indicatorName: string;
        data: any[];
        differ: number;
        differPercent: number;
        isTableHead: boolean;
        withPercent?: undefined;
    } | {
        count: string;
        indicatorName: string;
        data: any;
        differ: number;
        differPercent: number;
        isTableHead: boolean;
        withPercent: boolean;
    }>;
    credit_portfolio_for_curr(): Promise<{
        count: string;
        indicatorName: string;
        data: any[];
        differ: number;
        differPercent: number;
        isTableHead: boolean;
        withPercent?: undefined;
    } | {
        count: string;
        indicatorName: string;
        data: any;
        differ: number;
        differPercent: number;
        isTableHead: boolean;
        withPercent: boolean;
    }>;
    credit_portfolio_rate_for_curr(creditPortfolioForCurr: any): Promise<{
        count: string;
        indicatorName: string;
        data: any[];
        differ: number;
        differPercent: number;
        isTableHead: boolean;
        withPercent?: undefined;
    } | {
        count: string;
        indicatorName: string;
        data: any;
        differ: number;
        differPercent: number;
        isTableHead: boolean;
        withPercent: boolean;
    }>;
    par_30(): Promise<{
        count: string;
        indicatorName: string;
        data: any[];
        differ: number;
        differPercent: number;
        isTableHead: boolean;
        withPercent?: undefined;
    } | {
        count: string;
        indicatorName: string;
        data: any;
        differ: number;
        differPercent: number;
        isTableHead: boolean;
        withPercent: boolean;
    }>;
    par_60(): Promise<{
        count: string;
        indicatorName: string;
        data: any[];
        differ: number;
        differPercent: number;
        isTableHead: boolean;
        withPercent?: undefined;
    } | {
        count: string;
        indicatorName: string;
        data: any;
        differ: number;
        differPercent: number;
        isTableHead: boolean;
        withPercent: boolean;
    }>;
    par_90(): Promise<{
        count: string;
        indicatorName: string;
        data: any[];
        differ: number;
        differPercent: number;
        isTableHead: boolean;
        withPercent?: undefined;
    } | {
        count: string;
        indicatorName: string;
        data: any;
        differ: number;
        differPercent: number;
        isTableHead: boolean;
        withPercent: boolean;
    }>;
    npl(): Promise<{
        count: string;
        indicatorName: string;
        data: any[];
        differ: number;
        differPercent: number;
        isTableHead: boolean;
        withPercent?: undefined;
    } | {
        count: string;
        indicatorName: string;
        data: any;
        differ: number;
        differPercent: number;
        isTableHead: boolean;
        withPercent: boolean;
    }>;
    toxic(): Promise<{
        count: string;
        indicatorName: string;
        data: any[];
        differ: number;
        differPercent: number;
        isTableHead: boolean;
        withPercent?: undefined;
    } | {
        count: string;
        indicatorName: string;
        data: any;
        differ: number;
        differPercent: number;
        isTableHead: boolean;
        withPercent: boolean;
    }>;
    npl_share(NPL: any, creditPortfolio: any): {
        count: string;
        indicatorName: string;
        data: any[];
        differ: number;
        differPercent: number;
        isTableHead: boolean;
        withPercent?: undefined;
    } | {
        count: string;
        indicatorName: string;
        data: any;
        differ: number;
        differPercent: number;
        isTableHead: boolean;
        withPercent: boolean;
    };
    reserve(): Promise<{
        count: string;
        indicatorName: string;
        data: any[];
        differ: number;
        differPercent: number;
        isTableHead: boolean;
        withPercent?: undefined;
    } | {
        count: string;
        indicatorName: string;
        data: any;
        differ: number;
        differPercent: number;
        isTableHead: boolean;
        withPercent: boolean;
    }>;
    getRows(): Promise<any[]>;
}
