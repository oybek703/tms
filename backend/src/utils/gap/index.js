const GapMainClass = require('./GapMainClass')

async function getGapTable(date) {
    return await (new GapMainClass(date).getRows())
}

module.exports = getGapTable