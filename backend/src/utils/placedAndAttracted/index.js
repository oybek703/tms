const PlatMainClass = require("./PlatMainClass")

async function getPlatTable(date) {
    return await new PlatMainClass(date).getRows()
}

module.exports = getPlatTable