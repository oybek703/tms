import { CurrencyRate } from './currency-rate';
import { OracleService } from '../../../oracle/oracle.service';
export declare class CurrencyRateCurrent extends CurrencyRate {
    constructor(oracleService: OracleService);
    currencyRateQuery: () => string;
    rateChangeQuery: () => string;
}
