"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const capital_base_1 = require("./capital.base");
const getCapitalData = async (date, oracleService) => {
    return await new capital_base_1.CapitalBase(date, oracleService).getRows();
};
exports.default = getCapitalData;
//# sourceMappingURL=index.js.map