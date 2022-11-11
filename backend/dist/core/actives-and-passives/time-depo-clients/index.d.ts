import { OracleService } from '../../../oracle/oracle.service';
declare const getTimeDepoClientsData: (date: Date, oracleService: OracleService) => Promise<import("./TDC.interface").ITimeDepoClientsData[]>;
export default getTimeDepoClientsData;
