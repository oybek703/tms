const ReportLiabilities = require('./ReportLiabilitiesMainClass')

async function getReportLiabilitiesTable(date) {
    return  await (new ReportLiabilities(date).getRows())
}

module.exports = getReportLiabilitiesTable