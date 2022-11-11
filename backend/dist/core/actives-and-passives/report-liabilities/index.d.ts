import { OracleService } from '../../../oracle/oracle.service';
declare const getReportLiabilitiesData: (date: Date, oracleService: OracleService) => Promise<import("./RL.interface").IReportLiabilitiesData[]>;
export default getReportLiabilitiesData;
