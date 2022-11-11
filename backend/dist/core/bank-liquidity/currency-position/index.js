"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrencyPositionData = void 0;
const CP_base_1 = require("./CP.base");
const getCurrencyPositionData = async (date, oracleService) => {
    const [allRows, tableSumData] = await new CP_base_1.CurrencyPositionBase(date, oracleService).getRows();
    return { allRows, tableSumData };
};
exports.getCurrencyPositionData = getCurrencyPositionData;
exports.default = exports.getCurrencyPositionData;
//# sourceMappingURL=index.js.map