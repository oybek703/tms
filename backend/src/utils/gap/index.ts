import GapMainClass from './GapMainClass'

async function getGapTable() {
  return await (new GapMainClass().getRows())
}

export default getGapTable
