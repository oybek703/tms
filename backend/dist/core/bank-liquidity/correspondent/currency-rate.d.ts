import { OracleService } from '../../../oracle/oracle.service';
import { CorrespondentBase } from './correspondent.base';
import { ICorrespondentRow } from './correspondent.interface';
export declare class CurrencyRate extends CorrespondentBase {
    private currenState;
    isExactDay: string;
    constructor(date: Date, oracleService: OracleService, currenState?: boolean);
    currencyRateQuery: () => string;
    rateChangeQuery: () => string;
    currency_rate(): Promise<{
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
    rate_change(): Promise<{
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
    getRows(): Promise<ICorrespondentRow[]>;
}
