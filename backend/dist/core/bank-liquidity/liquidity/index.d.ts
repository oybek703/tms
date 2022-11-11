import { OracleService } from '../../../oracle/oracle.service';
declare const getLiquidityData: (date: Date, oracleService: OracleService) => Promise<{
    liquidityAssets: import("./liquidity.interface").ILiquidityRow[];
    obligations: import("./liquidity.interface").ILiquidityRow[];
}>;
export declare const getLiquidityCurrentData: (oracleService: OracleService) => Promise<{
    liquidityAssets: import("./liquidity.interface").ILiquidityRow[];
    obligations: import("./liquidity.interface").ILiquidityRow[];
}>;
export default getLiquidityData;
