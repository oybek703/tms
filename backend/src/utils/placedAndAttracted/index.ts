import PlatMainClass from './PlatMainClass'

async function getPlatTable(date: string) {
    return await new PlatMainClass(date).getRows()
}

export default getPlatTable