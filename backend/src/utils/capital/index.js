const Capital = require("./Capital")

async function getCapitalTable(date) {
    return  await (new Capital(date).getRows())
}

module.exports = getCapitalTable