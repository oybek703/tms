import VlaBufferMainClass from './VlaBufferMainClass'

async function getVlaBufferTable(date: string) {
  return await (new VlaBufferMainClass(date).getRows())
}

export default getVlaBufferTable
