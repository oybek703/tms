import { TotalCash } from './total-cash';
import { OracleService } from '../../../oracle/oracle.service';
import { ICorrespondentRow } from './correspondent.interface';
export declare class TotalCashCurrent extends TotalCash {
    constructor(oracleService: OracleService);
    formatQuery(whereQuery?: string): string;
    corrAccountsWithOtherBanksQuery: () => string;
    cash_on_road(): Promise<{
        count: string;
        indicatorName: string;
        uzs: number;
        cny: number;
        jpy: number;
        kzt: number;
        rub: number;
        chf: number;
        gbp: number;
        usd: number;
        eur: number;
        isTableHead: boolean;
    }>;
    nostro(): Promise<{
        count: string;
        indicatorName: string;
        uzs: number;
        cny: number;
        jpy: number;
        kzt: number;
        rub: number;
        chf: number;
        gbp: number;
        usd: number;
        eur: number;
        isTableHead: boolean;
    }>;
    f_o_r(): Promise<{
        count: string;
        indicatorName: string;
        uzs: number;
        cny: number;
        jpy: number;
        kzt: number;
        rub: number;
        chf: number;
        gbp: number;
        usd: number;
        eur: number;
        isTableHead: boolean;
    }>;
    corr_accounts_with_other_banks(): Promise<ICorrespondentRow[]>;
    getRows(): Promise<[[ICorrespondentRow, ICorrespondentRow], ICorrespondentRow[]]>;
}
