"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlacedAttractedData = void 0;
const placed_attracted_base_1 = require("./placed-attracted.base");
const getPlacedAttractedData = async (date, oracleService) => {
    const [involvedFunds, placedFunds] = await new placed_attracted_base_1.PlacedAttractedBase(date, oracleService).getRows();
    return { involvedFunds, placedFunds };
};
exports.getPlacedAttractedData = getPlacedAttractedData;
exports.default = exports.getPlacedAttractedData;
//# sourceMappingURL=index.js.map