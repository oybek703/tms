import CurrencyPositionMainClass from './CurrencyPositionMainClass'

async function getCurrencyPositionTable(date: string) {
	return await new CurrencyPositionMainClass(date).getRows()
}

export default getCurrencyPositionTable
