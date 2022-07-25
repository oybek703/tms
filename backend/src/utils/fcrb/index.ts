import FcrbMainClass from './FcrbMainClass'

async function getFcrbTable(date: string) {
  return await (new FcrbMainClass(date).getRows())
}

export default getFcrbTable
