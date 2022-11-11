"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const top_deposits_base_1 = require("./top-deposits.base");
const getTopDepositsData = async (date, oracleService) => {
    const [accountsWithData] = await new top_deposits_base_1.TopDepositsBase(date, oracleService).getRows();
    return accountsWithData;
};
exports.default = getTopDepositsData;
//# sourceMappingURL=index.js.map