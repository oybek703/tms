import CalcForMainClass from './CalcForMainClass'

async function getCalcForTable(date: string) {
    return await new CalcForMainClass(date).getRows()
}

export default getCalcForTable