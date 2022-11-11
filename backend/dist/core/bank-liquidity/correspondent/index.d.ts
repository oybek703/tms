import { OracleService } from '../../../oracle/oracle.service';
declare const getCorrespondentData: (date: Date, oracleService: OracleService) => Promise<{
    currencyRate: import("./correspondent.interface").ICorrespondentRow[];
    totalCash: import("./correspondent.interface").ICorrespondentRow[];
    interbankDeposits: import("./correspondent.interface").ICorrespondentRow[];
}>;
export declare const getCorrespondentCurrentData: (oracleService: OracleService) => Promise<{
    currencyRate: import("./correspondent.interface").ICorrespondentRow[];
    totalCash: import("./correspondent.interface").ICorrespondentRow[];
    interbankDeposits: import("./correspondent.interface").ICorrespondentRow[];
}>;
export default getCorrespondentData;
