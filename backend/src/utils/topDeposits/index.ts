import TopDepositsMainClass from './TopDepositsMainClass'

async function getTopDepositsTable(date: string) {
  return await new TopDepositsMainClass(date).getRows()
}

export default getTopDepositsTable
