import { OracleService } from '../../../oracle/oracle.service';
declare const getTopDepositsData: (date: Date, oracleService: OracleService) => Promise<import("./top-deposits.interface").ITopDepositsData>;
export default getTopDepositsData;
