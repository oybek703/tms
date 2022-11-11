"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNostroMatrixData = void 0;
const nostro_matrix_base_1 = require("./nostro-matrix.base");
const getNostroMatrixData = async (firstDate, secondDate, oracleService) => {
    return await new nostro_matrix_base_1.NostroMatrixBase(firstDate, secondDate, oracleService).getRows();
};
exports.getNostroMatrixData = getNostroMatrixData;
//# sourceMappingURL=index.js.map