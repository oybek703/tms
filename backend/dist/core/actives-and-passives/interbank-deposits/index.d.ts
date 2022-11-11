import { OracleService } from '../../../oracle/oracle.service';
export declare const getInterbankDepositsData: (date: Date, oracleService: OracleService) => Promise<{
    land: import("./IB.interface").IRowsData[];
    borrow: import("./IB.interface").IRowsData[];
    fullBorrowData: import("./IB.interface").IRowsData[];
    fullLandData: import("./IB.interface").IRowsData[];
}>;
