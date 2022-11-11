"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLiquidityCurrentData = void 0;
const liquidity_assets_1 = require("./liquidity-assets");
const obligations_1 = require("./obligations");
const liquidity_assets_current_1 = require("./liquidity-assets-current");
const obligations_current_1 = require("./obligations-current");
const getLiquidityData = async (date, oracleService) => {
    const [liquidityAssets, obligations] = await Promise.all([
        new liquidity_assets_1.LiquidityAssets(date, oracleService).getRows(),
        new obligations_1.Obligations(date, oracleService).getRows()
    ]);
    return {
        liquidityAssets,
        obligations
    };
};
const getLiquidityCurrentData = async (oracleService) => {
    const [liquidityAssets, obligations] = await Promise.all([
        new liquidity_assets_current_1.LiquidityAssetsCurrent(oracleService).getRows(),
        new obligations_current_1.ObligationsCurrent(oracleService).getRows()
    ]);
    return {
        liquidityAssets,
        obligations
    };
};
exports.getLiquidityCurrentData = getLiquidityCurrentData;
exports.default = getLiquidityData;
//# sourceMappingURL=index.js.map