import CompetitiveAnalysisMainClass from './CompetitiveAnalysisMainClass'

async function getCompetitiveAnalysisTable(date: string) {
	return await new CompetitiveAnalysisMainClass(date).getRows()
}

export default getCompetitiveAnalysisTable
