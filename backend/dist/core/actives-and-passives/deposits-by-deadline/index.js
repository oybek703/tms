"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DBD_base_1 = require("./DBD.base");
const getDepositsByDeadlineData = async (date, oracleService) => {
    return new DBD_base_1.DepositsByDeadlineBase(date, oracleService).getRows();
};
exports.default = getDepositsByDeadlineData;
//# sourceMappingURL=index.js.map