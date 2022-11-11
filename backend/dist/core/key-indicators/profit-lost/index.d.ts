import { OracleService } from '../../../oracle/oracle.service';
declare const getProfitAndLostData: (date: Date, oracleService: OracleService) => Promise<import("./profit-lost.interface").IProfitLostRow[]>;
export default getProfitAndLostData;
