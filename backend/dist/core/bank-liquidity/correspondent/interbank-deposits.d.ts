import { CorrespondentBase } from './correspondent.base';
import { ICorrespondentRow } from './correspondent.interface';
export declare class InterbankDeposits extends CorrespondentBase {
    innerBanks: {
        name: string;
        code: string;
    }[];
    formatQuery(whereQuery?: string): string;
    agroBankQuery: () => string;
    customerFundsQuery: () => string;
    inner_bank_deposits(...args: ICorrespondentRow[]): {
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
    agro_bank(): Promise<{
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
    liq_assets_total(...args: ICorrespondentRow[]): {
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
    accounts_settlement(): Promise<{
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
    customer_funds(): Promise<{
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
    getRows(others?: ICorrespondentRow[]): Promise<ICorrespondentRow[]>;
}
