import TimeDepositsMainClass from './TimeDepositsMainClass'

async function getTimeDepositsTable(date: string) {
  return await new TimeDepositsMainClass(date).getRows(date)
}

export default getTimeDepositsTable
