"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const actives_1 = require("./actives");
const getMainIndicatorsData = async (date, oracleService) => {
    return await new actives_1.Actives(date, oracleService).getRows();
};
exports.default = getMainIndicatorsData;
//# sourceMappingURL=index.js.map