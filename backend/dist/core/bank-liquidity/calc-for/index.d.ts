import { OracleService } from '../../../oracle/oracle.service';
export declare const getCalcFor: (date: Date, oracleService: OracleService) => Promise<import("./calc-for.interface").ICalcForRow[]>;
export default getCalcFor;
