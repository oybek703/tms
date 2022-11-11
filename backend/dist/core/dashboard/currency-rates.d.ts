import { Base } from '../base';
import { IConfigOptions, IDashboardCurrencyRate } from './dashboard.interface';
import { OracleService } from '../../oracle/oracle.service';
import { HttpService } from '@nestjs/axios';
export declare class CurrencyRates extends Base {
    private readonly configOptions;
    private readonly httpService;
    constructor(date: Date, oracleService: OracleService, configOptions: IConfigOptions, httpService: HttpService);
    protected currencyCodes: {
        code: string;
        currName: string;
        nominal: string;
        equival: number;
        differ: number;
    }[];
    protected formatQuery(): string;
    protected getBeforeDateQuery: () => string;
    protected getLast90Query(currencyCode?: string): string;
    protected getOtherRatesWithDiffer(rate?: any[], rateBeforeDay?: any[]): any[];
    protected getCBRate(): Promise<IDashboardCurrencyRate[]>;
    protected getRatesByType(token?: string, type?: number, date?: Date): Promise<any>;
    protected getOtherRates(): Promise<{
        legalEntitiesRates: any;
        individualsRates: any;
    }>;
    getLast90(): Promise<{}>;
    getRows(): Promise<any[]>;
}
