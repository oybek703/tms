"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVlaBufferData = void 0;
const vla_buffer_base_1 = require("./vla-buffer.base");
const getVlaBufferData = async (date, oracleService) => {
    const [liquidityAssets, liabilitiesOnDemand] = await new vla_buffer_base_1.VlaBufferBase(date, oracleService).getRows();
    return { liquidityAssets, liabilitiesOnDemand };
};
exports.getVlaBufferData = getVlaBufferData;
//# sourceMappingURL=index.js.map