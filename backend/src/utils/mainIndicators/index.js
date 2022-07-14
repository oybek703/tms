const Actives = require('./Actives')

async function getMainIndicatorsTable(date) {
    return await new Actives(date).getRows()
}

module.exports = getMainIndicatorsTable