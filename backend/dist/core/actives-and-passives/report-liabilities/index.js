"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RL_base_1 = require("./RL.base");
const getReportLiabilitiesData = async (date, oracleService) => {
    return await new RL_base_1.ReportLiabilitiesBase(date, oracleService).getRows();
};
exports.default = getReportLiabilitiesData;
//# sourceMappingURL=index.js.map