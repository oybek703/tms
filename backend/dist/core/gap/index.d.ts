import { OracleService } from '../../oracle/oracle.service';
declare const getGapData: (oracleService: OracleService) => Promise<{
    months: any[];
    sourceOfLiquidity: any[];
    sourceOfLiquidityTotal: any[];
    needsOfLiquidity: any[];
    needsOfLiquidityTotal: any[];
    vlaLcrData: any[];
    lcrData: any[];
    nsfrData: any[];
}>;
export declare const getGapManualData: (forEditing: boolean, oracleService: OracleService) => Promise<{
    months: any;
    sourceOfLiquidity: any;
    sourceOfLiquidityTotal: any;
    needsOfLiquidity: any;
    needsOfLiquidityTotal: any;
    vlaLcrData: any;
}>;
export default getGapData;
