import DepositsByDeadlineMainClass from './DepositsByDeadlineMainClass'

async function getDepositsByDeadlineTable(date: string) {
	return await new DepositsByDeadlineMainClass(date).getRows()
}

export default getDepositsByDeadlineTable
