import CurrencyRate from './CurrencyRate'
import CorrespondentInterbankDeposits from './CorrespondentInterbankDeposits'
import TotalCashCurrent from './TotalCashCurrent'
import CorrespondentInterbankDepositsCurrent from './CorrespondentInterbankDepositsCurrent'
import TotalCash from './TotalCash'

async function getCorrespondentTable(date: string, currentState = false) {
	if (currentState) {
		const currencyRate = await new CurrencyRate(String(new Date()), currentState).getRows()
		const [total, totalCash] = await new TotalCashCurrent().getRows()
		const interbankDeposits = await new CorrespondentInterbankDepositsCurrent().getRows(total)
		return {
			currencyRate,
			totalCash,
			interbankDeposits
		}
	}
	const [total, totalCash] = await new TotalCash(date).getRows()
	const [currencyRate, interbankDeposits] = await Promise.all([
		new CurrencyRate(date).getRows(),
		new CorrespondentInterbankDeposits(date).getRows(total)
	])
	return {
		currencyRate,
		totalCash,
		interbankDeposits
	}
}

export default getCorrespondentTable
