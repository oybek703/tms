import { InterbankDeposits } from './interbank-deposits';
import { OracleService } from '../../../oracle/oracle.service';
import { ICorrespondentRow } from './correspondent.interface';
export declare class InterbankDepositsCurrent extends InterbankDeposits {
    constructor(oracleService: OracleService);
    formatQuery(whereQuery?: string): string;
    innerBanksQuery: () => string;
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
    inner_banks_data(): Promise<ICorrespondentRow[]>;
    inter_bank_deposits(...args: ICorrespondentRow[]): ICorrespondentRow;
    getRows(others?: ICorrespondentRow[]): Promise<ICorrespondentRow[]>;
}
