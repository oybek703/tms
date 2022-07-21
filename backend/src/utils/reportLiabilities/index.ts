import ReportLiabilitiesMainClass from './ReportLiabilitiesMainClass'

async function getReportLiabilitiesTable(date: string) {
    return  await (new ReportLiabilitiesMainClass(date).getRows())
}

export default getReportLiabilitiesTable