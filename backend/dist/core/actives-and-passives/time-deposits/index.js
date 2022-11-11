"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const time_deposits_base_1 = require("./time-deposits.base");
const getTimeDepositsData = async (date, oracleService) => {
    const [currentBalance, balanceInMonthBegin, tableData] = await new time_deposits_base_1.TimeDepositsBase(date, oracleService).getRows();
    return { currentBalance, balanceInMonthBegin, tableData };
};
exports.default = getTimeDepositsData;
//# sourceMappingURL=index.js.map