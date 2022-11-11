import { OracleService } from '../../../oracle/oracle.service';
export declare const getPlacedAttractedData: (date: Date, oracleService: OracleService) => Promise<{
    involvedFunds: import("./placed-attracted.interface").IPlacedAttractedRow[];
    placedFunds: import("./placed-attracted.interface").IPlacedAttractedRow[];
}>;
export default getPlacedAttractedData;
