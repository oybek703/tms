"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gm_base_1 = require("./gm.base");
const getGmData = async (date, oracleService) => {
    const [updatedTableData, accredetiv, currRates] = await new gm_base_1.GmBase(date, oracleService).getRows();
    return {
        tableData: updatedTableData,
        accredetiv,
        currRates
    };
};
exports.default = getGmData;
//# sourceMappingURL=index.js.map