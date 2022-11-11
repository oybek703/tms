import { OracleService } from '../../../oracle/oracle.service';
declare const getMainIndicatorsData: (date: Date, oracleService: OracleService) => Promise<import("./main-indicators.interfaces").MainIndicatorRow[]>;
export default getMainIndicatorsData;
