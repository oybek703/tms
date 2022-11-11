import { OracleService } from '../../../oracle/oracle.service';
declare const getCapitalData: (date: Date, oracleService: OracleService) => Promise<import("./capital.interface").ICapitalRow[]>;
export default getCapitalData;
