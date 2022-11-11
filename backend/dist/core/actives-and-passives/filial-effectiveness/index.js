"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FL_base_1 = require("./FL.base");
const getFilialEffectivenessData = async (date, oracleService) => {
    return await new FL_base_1.FilialEffectivenessBase(date, oracleService).getRows();
};
exports.default = getFilialEffectivenessData;
//# sourceMappingURL=index.js.map