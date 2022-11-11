"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TDC_base_1 = require("./TDC.base");
const getTimeDepoClientsData = async (date, oracleService) => {
    return new TDC_base_1.TimeDepoClientsBase(date, oracleService).getRows();
};
exports.default = getTimeDepoClientsData;
//# sourceMappingURL=index.js.map