const FcrbMainClass = require('./FcrbMainClass')

async function getFcrbTable(date) {
    return  await (new FcrbMainClass(date).getRows())
}

module.exports = getFcrbTable