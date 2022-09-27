import ProfitLostMainClass from './profitLostMainClass'

async function getProfitAndLostTable(date: string) {
	return await new ProfitLostMainClass(date).getRows()
}

export default getProfitAndLostTable
