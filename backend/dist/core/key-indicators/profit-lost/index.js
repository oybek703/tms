"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const profit_lost_base_1 = require("./profit-lost.base");
const getProfitAndLostData = async (date, oracleService) => {
    return await new profit_lost_base_1.ProfitAndLostBase(date, oracleService).getRows();
};
exports.default = getProfitAndLostData;
//# sourceMappingURL=index.js.map