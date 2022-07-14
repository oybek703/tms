const TimeDepoClients = require("./TimeDepoClients")

async function getTimeDepoClientsTable(date) {
    return await (new TimeDepoClients(date).getRows())
}

module.exports = getTimeDepoClientsTable