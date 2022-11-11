"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGapManualData = void 0;
const gap_base_1 = require("./gap.base");
const gap_manual_1 = require("./gap-manual");
const getGapData = async (oracleService) => {
    const [months, sourceOfLiquidity, sourceOfLiquidityTotal, needsOfLiquidity, needsOfLiquidityTotal, vlaLcrData, lcrData, nsfrData] = await new gap_base_1.GapBase(oracleService).getRows();
    return {
        months,
        sourceOfLiquidity,
        sourceOfLiquidityTotal,
        needsOfLiquidity,
        needsOfLiquidityTotal,
        vlaLcrData,
        lcrData,
        nsfrData
    };
};
const getGapManualData = async (forEditing, oracleService) => {
    const [months, sourceOfLiquidity, sourceOfLiquidityTotal, needsOfLiquidity, needsOfLiquidityTotal, vlaLcrData] = await new gap_manual_1.GapManual(oracleService, forEditing).getRows();
    return {
        months,
        sourceOfLiquidity,
        sourceOfLiquidityTotal,
        needsOfLiquidity,
        needsOfLiquidityTotal,
        vlaLcrData
    };
};
exports.getGapManualData = getGapManualData;
exports.default = getGapData;
//# sourceMappingURL=index.js.map