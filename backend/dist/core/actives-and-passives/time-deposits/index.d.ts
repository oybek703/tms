import { OracleService } from '../../../oracle/oracle.service';
declare const getTimeDepositsData: (date: Date, oracleService: OracleService) => Promise<{
    currentBalance: number[] | import("./time-deposits.interface").ITimeDepositsData[];
    balanceInMonthBegin: number[] | import("./time-deposits.interface").ITimeDepositsData[];
    tableData: number[] | import("./time-deposits.interface").ITimeDepositsData[];
}>;
export default getTimeDepositsData;
