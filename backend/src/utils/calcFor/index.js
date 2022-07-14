const CalcForMainClass = require("./CalcForMainClass")

async function getCalcForTable(date) {
    return await new CalcForMainClass(date).getRows()
}

module.exports = getCalcForTable