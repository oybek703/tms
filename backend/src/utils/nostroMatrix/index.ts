import NostroMatrixMainClass from './nostroMatrixMainClass'

async function getNostroMatrixTable(firstDate: string, secondDate: string) {
	return await new NostroMatrixMainClass(firstDate, secondDate).getRows()
}

export default getNostroMatrixTable
