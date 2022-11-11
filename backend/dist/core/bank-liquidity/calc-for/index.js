"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCalcFor = void 0;
const calc_for_base_1 = require("./calc-for.base");
const getCalcFor = async (date, oracleService) => {
    return await new calc_for_base_1.CalcForBase(date, oracleService).getRows();
};
exports.getCalcFor = getCalcFor;
exports.default = exports.getCalcFor;
//# sourceMappingURL=index.js.map