import Capital from './Capital'

async function getCapitalTable(date: string) {
  return await (new Capital(date).getRows())
}

export default getCapitalTable
