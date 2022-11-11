"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInterbankDepositsData = void 0;
const interbank_deposits_1 = require("./interbank-deposits");
const getInterbankDepositsData = async (date, oracleService) => {
    const land = await new interbank_deposits_1.InterbankDeposits(date, oracleService).getRows('land');
    const borrow = await new interbank_deposits_1.InterbankDeposits(date, oracleService).getRows('borrow');
    const fullBorrowData = await new interbank_deposits_1.InterbankDeposits(date, oracleService).getRows('fullBorrow');
    const fullLandData = await new interbank_deposits_1.InterbankDeposits(date, oracleService).getRows('fullLand');
    return { land, borrow, fullBorrowData, fullLandData };
};
exports.getInterbankDepositsData = getInterbankDepositsData;
//# sourceMappingURL=index.js.map