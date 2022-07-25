import GmMainClass from './GmMainClass'

async function getGMTable(date: string) {
  return await new GmMainClass(date).getRows()
}

export default getGMTable
