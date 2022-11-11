import { Base } from '../base';
import { IGapData, IGapFlowData } from './gap.interface';
import { OracleService } from '../../oracle/oracle.service';
export declare class GapBase extends Base {
    constructor(oracleService: OracleService);
    protected formatQuery(whereQuery: string): string;
    protected manualTableQuery(role: string): () => string;
    private monthQuery;
    protected outflowQuery: () => string;
    protected inflowQuery: () => string;
    protected stableFinancingRequiredAmountQuery: () => string;
    protected nsfrQuery: (role?: string) => () => string;
    protected fromOffBalanceSheets15Query: () => string;
    protected returnTempData(indicatorName?: string, total?: number, nationalCurrency?: number, foreignCurrency?: number): Promise<IGapFlowData & {
        indicatorName: string;
    }>;
    protected getGapSubOrDivideByMonth(monthIndex: number, total: IGapData[], left: IGapData[], indicatorName?: string, divide?: boolean): {
        indicatorName: string;
        total: number;
        nationalCurrency: number;
        foreignCurrency: number;
        usd: number;
        eur: number;
        source: string;
        role: string;
    };
    protected getByMonth(monthIndex: number, ...args: IGapData[]): IGapData;
    protected getTotal(months: string[], ...args: IGapData[][]): IGapData[];
    protected getLcrOrNsfrOneRow(indicatorName: string, data: IGapData): {
        indicatorName: string;
        total: number;
        nationalCurrency: number;
        foreignCurrency: number;
        usd: number;
        eur: number;
        source: string;
        role: string;
    };
    protected getOneRow(role: string, fromManual?: boolean): Promise<IGapData[]>;
    protected getMonths(): Promise<string[]>;
    protected vla(): Promise<IGapData[]>;
    protected attraction_of_credit_lines(): Promise<IGapData[]>;
    protected legal_deposits(): Promise<IGapData[]>;
    protected liquidity_source_others(): Promise<IGapData[]>;
    protected return_of_loans(): Promise<IGapData[]>;
    protected interbank_deposits(): Promise<IGapData[]>;
    protected return_of_interbank_deposits(): Promise<IGapData[]>;
    protected placement_of_interbank_deposits(): Promise<IGapData[]>;
    protected return_of_legal_deposits(): Promise<IGapData[]>;
    protected repayment_of_credit_lines(): Promise<IGapData[]>;
    protected post_fin_liabilities(): Promise<IGapData[]>;
    protected issuance_of_loans(): Promise<IGapData[]>;
    protected liquidity_need_others(): Promise<IGapData[]>;
    protected amount_for_vla_lcr(): Promise<IGapData[]>;
    protected outFlow(): Promise<{
        indicatorName: string;
        total: number;
        nationalCurrency: number;
        foreignCurrency: number;
        usd: number;
        eur: number;
        source: string;
        role: string;
    }>;
    protected inFlow(): Promise<{
        indicatorName: string;
        total: number;
        nationalCurrency: number;
        foreignCurrency: number;
        usd: number;
        eur: number;
        source: string;
        role: string;
    }>;
    protected stable_funding_available_amount(): Promise<IGapFlowData>;
    protected own_capital(): Promise<{
        indicatorName: string;
        total: number;
        nationalCurrency: number;
        foreignCurrency: number;
        usd: number;
        eur: number;
        source: string;
        role: string;
    }>;
    protected liabilities_over_1year(): Promise<{
        indicatorName: string;
        total: number;
        nationalCurrency: number;
        foreignCurrency: number;
        usd: number;
        eur: number;
        source: string;
        role: string;
    }>;
    protected other_perpetual_liabilities30(): Promise<{
        indicatorName: string;
        total: number;
        nationalCurrency: number;
        foreignCurrency: number;
        usd: number;
        eur: number;
        source: string;
        role: string;
    }>;
    protected other_liabilities_less_than_1year(): Promise<{
        indicatorName: string;
        total: number;
        nationalCurrency: number;
        foreignCurrency: number;
        usd: number;
        eur: number;
        source: string;
        role: string;
    }>;
    protected stable_funding_required_amount(): Promise<IGapFlowData>;
    protected assets_over_1year(): Promise<IGapFlowData & {
        indicatorName: string;
    }>;
    protected bank_things(): Promise<{
        indicatorName: string;
        total: number;
        nationalCurrency: number;
        foreignCurrency: number;
        usd: number;
        eur: number;
        source: string;
        role: string;
    }>;
    protected loan_things(): Promise<{
        indicatorName: string;
        total: number;
        nationalCurrency: number;
        foreignCurrency: number;
        usd: number;
        eur: number;
        source: string;
        role: string;
    }>;
    protected other_assets_less_than_1Year30(): Promise<IGapFlowData & {
        indicatorName: string;
    }>;
    protected from_off_balance_sheets_15(): Promise<{
        indicatorName: string;
        total: number;
        nationalCurrency: number;
        foreignCurrency: number;
        usd: number;
        eur: number;
        source: string;
        role: string;
    }>;
    getRows(): Promise<any[][]>;
}
