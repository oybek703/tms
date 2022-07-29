import NostroMatrixMainClass from './nostroMatrixMainClass'

async function getNostroMatrixTable(date: string) {
  return await (new NostroMatrixMainClass(date).getRows())
}

export default getNostroMatrixTable
