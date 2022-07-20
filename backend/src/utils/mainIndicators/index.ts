import Actives from './Actives'

async function getMainIndicatorsTable(date: string) {
    return await new Actives(date).getRows()
}

export default getMainIndicatorsTable