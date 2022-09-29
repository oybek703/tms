import FilialEffectivenessMainClass from './FilialEffectivenessMainClass'

async function getFilialEffectivenessTable(date: string) {
	return await new FilialEffectivenessMainClass(date).getRows()
}

export default getFilialEffectivenessTable
