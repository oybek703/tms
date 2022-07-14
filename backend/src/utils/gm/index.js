const GmMainClass = require("./GmMainClass")

async function getGMTable(date) {
    return await new GmMainClass(date).getRows()
}

module.exports = getGMTable