import MainClass from '../mainClass'

/* eslint-disable camelcase */
class CompetitiveAnalysisMainClass extends MainClass {
	constructor(date: string) {
		super(date)
	}

	formatQuery(date: string, _whereQuery = '1=1') {
		return `SELECT * FROM DUAL`
	}

	async getRows(): Promise<any> {
		return ['data from CompetitiveAnalysisMainClass']
	}
}

export default CompetitiveAnalysisMainClass
