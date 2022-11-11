import { OracleService } from '../../../oracle/oracle.service';
declare const getDepositsByDeadlineData: (date: Date, oracleService: OracleService) => Promise<import("./DBD.interface").IDepositsByDeadline[]>;
export default getDepositsByDeadlineData;
