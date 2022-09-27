import InterbankDeposits from './InterbankDeposits'

async function getInterbankDepositsTable(date: string) {
	return await new InterbankDeposits(date).getRows(date)
}

export default getInterbankDepositsTable
