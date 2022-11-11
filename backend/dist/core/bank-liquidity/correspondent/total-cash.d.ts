import { CorrespondentBase } from './correspondent.base';
import { ICorrespondentRow } from './correspondent.interface';
export declare class TotalCash extends CorrespondentBase {
    otherBanks: {
        name: string;
        code: string;
    }[];
    formatQuery(whereQuery: string): string;
    nostroQuery: () => string;
    forQuery: () => string;
    total_cash_on_hand(): Promise<{
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
    cash_at_checkout(total: ICorrespondentRow, on_hand: ICorrespondentRow): ICorrespondentRow;
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
    total_correspondent_accounts(nostro: ICorrespondentRow, ob_nostro: ICorrespondentRow): ICorrespondentRow;
    corres_accounts_inCB(): ICorrespondentRow;
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
    corres_accounts_inOB(): {
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
    };
    ob_nostro(...args: ICorrespondentRow[]): ICorrespondentRow;
    getRows(): Promise<[[ICorrespondentRow, ICorrespondentRow], ICorrespondentRow[]]>;
}
