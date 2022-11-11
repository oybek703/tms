import { OracleService } from '../../../oracle/oracle.service';
export declare const getCurrencyPositionData: (date: Date, oracleService: OracleService) => Promise<{
    allRows: import("./CP.interface").ICurrencyPositionRow[];
    tableSumData: import("./CP.interface").ITableSumData[];
}>;
export default getCurrencyPositionData;
