export enum Status {
	none,
	safe,
	warn,
	danger
}

function getEmptyBankData() {
	return { value: '', status: Status.none }
}

function getStatus(percent: number) {
	if (percent >= 0 && percent <= 85) return Status.safe
	if (percent > 85 && percent < 95) return Status.warn
	if (percent >= 95) return Status.danger
	return Status.none
}

function getMinBankData(mainBankValue: number, bankValue: number) {
	let status: Status = Status.none
	const percent = Number(((bankValue * 100) / mainBankValue).toFixed(2))
	status = getStatus(percent)
	return {
		value: `мин ${bankValue}%`,
		status
	}
}

function getMaxBankData(mainBankValue: number, bankValue: number) {
	let status: Status = Status.none
	const percent = Number(((mainBankValue * 100) / bankValue).toFixed(2))
	status = getStatus(percent)
	return {
		value: `мах ${bankValue}%`,
		status
	}
}

function getPureBankData(pureValue: string = '', status: Status) {
	return {
		value: pureValue,
		status
	}
}

export const covenantData = [
	{
		title: 'Коэффициенты достаточности капитала',
		main_bank: 16.98,
		bank_1: getMinBankData(16.98, 10),
		bank_2: getEmptyBankData(),
		bank_3: getEmptyBankData(),
		bank_4: getMinBankData(16.98, 13),
		bank_5: getMinBankData(16.98, 13),
		bank_6: getMinBankData(16.98, 13),
		bank_7: getMinBankData(16.98, 14),
		bank_8: getMinBankData(16.98, 13),
		bank_9: getMinBankData(16.98, 13),
		bank_10: getMinBankData(16.98, 13)
	},
	{
		title: 'Коэффициенты достаточности капитала уровня I',
		main_bank: 13.45,
		bank_1: getMinBankData(13.45, 7.5),
		bank_2: getEmptyBankData(),
		bank_3: getEmptyBankData(),
		bank_4: getEmptyBankData(),
		bank_5: getEmptyBankData(),
		bank_6: getMinBankData(13.45, 10),
		bank_7: getEmptyBankData(),
		bank_8: getEmptyBankData(),
		bank_9: getMinBankData(13.45, 10),
		bank_10: getMinBankData(13.45, 10)
	},
	{
		title: 'Коэффициенты достаточности основного капитала уровня I',
		main_bank: 13.44,
		bank_1: getEmptyBankData(),
		bank_2: getEmptyBankData(),
		bank_3: getEmptyBankData(),
		bank_4: getEmptyBankData(),
		bank_5: getEmptyBankData(),
		bank_6: getEmptyBankData(),
		bank_7: getEmptyBankData(),
		bank_8: getEmptyBankData(),
		bank_9: getMinBankData(13.44, 8),
		bank_10: getMinBankData(13.44, 8)
	},
	{
		title: 'Соотношение обязательство по одному инсайдеру капиталу уровня I',
		main_bank: 11.81,
		bank_1: getEmptyBankData(),
		bank_2: getEmptyBankData(),
		bank_3: getMaxBankData(11.81, 25),
		bank_4: getEmptyBankData(),
		bank_5: getEmptyBankData(),
		bank_6: getEmptyBankData(),
		bank_7: getEmptyBankData(),
		bank_8: getEmptyBankData(),
		bank_9: getEmptyBankData(),
		bank_10: getEmptyBankData()
	},
	{
		title: 'Соотношение портфеля всех инсайдеров капиталу уровня I',
		main_bank: 25.99,
		bank_1: getEmptyBankData(),
		bank_2: getEmptyBankData(),
		bank_3: getMaxBankData(25.99, 50),
		bank_4: getEmptyBankData(),
		bank_5: getEmptyBankData(),
		bank_6: getEmptyBankData(),
		bank_7: getEmptyBankData(),
		bank_8: getEmptyBankData(),
		bank_9: getEmptyBankData(),
		bank_10: getEmptyBankData()
	},
	{
		title: 'Собственный капитал',
		main_bank: '6.5 трлн.сум',
		bank_1: getEmptyBankData(),
		bank_2: getEmptyBankData(),
		bank_3: getEmptyBankData(),
		bank_4: getEmptyBankData(),
		bank_5: getEmptyBankData(),
		bank_6: getEmptyBankData(),
		bank_7: getEmptyBankData(),
		bank_8: getPureBankData('мин 6.2 трлн.сум', Status.safe)
	},
	{
		title: 'Коэффициент не действующих активов (NPL) МСФО',
		main_bank: 4.79,
		bank_1: getMaxBankData(4.79, 5),
		bank_2: getEmptyBankData(),
		bank_3: getEmptyBankData(),
		bank_4: getEmptyBankData(),
		bank_5: getEmptyBankData(),
		bank_6: getEmptyBankData(),
		bank_7: getEmptyBankData(),
		bank_8: getEmptyBankData(),
		bank_9: getMaxBankData(4.79, 5),
		bank_10: getMaxBankData(4.79, 5)
	},
	{
		title: 'Высоколиквыдные активы',
		main_bank: 13.73,
		bank_1: getEmptyBankData(),
		bank_2: getEmptyBankData(),
		bank_3: getEmptyBankData(),
		bank_4: getEmptyBankData(),
		bank_5: getEmptyBankData(),
		bank_6: getEmptyBankData(),
		bank_7: getEmptyBankData(),
		bank_8: getEmptyBankData(),
		bank_9: getMinBankData(13.73, 10),
		bank_10: getMinBankData(13.73, 10)
	},
	{
		title: 'LCR',
		main_bank: 158.58,
		bank_1: getEmptyBankData(),
		bank_2: getEmptyBankData(),
		bank_3: getEmptyBankData(),
		bank_4: getEmptyBankData(),
		bank_5: getEmptyBankData(),
		bank_6: getEmptyBankData(),
		bank_7: getEmptyBankData(),
		bank_8: getEmptyBankData(),
		bank_9: getMinBankData(158.58, 100),
		bank_10: getMinBankData(158.58, 100)
	},
	{
		title: 'NSFR',
		main_bank: 113.08,
		bank_1: getEmptyBankData(),
		bank_2: getEmptyBankData(),
		bank_3: getEmptyBankData(),
		bank_4: getEmptyBankData(),
		bank_5: getEmptyBankData(),
		bank_6: getEmptyBankData(),
		bank_7: getEmptyBankData(),
		bank_8: getEmptyBankData(),
		bank_9: getMinBankData(113.08, 100),
		bank_10: getMinBankData(113.08, 100)
	},
	{
		title: `Правительству Республики Узбекистан 
    прямо или косвенно должно принадлежать 
    не менее 80% установного капитала Заемщика. (МСФО)`,
		main_bank: 97.15,
		bank_1: getEmptyBankData(),
		bank_2: getMinBankData(97.15, 80),
		bank_3: getEmptyBankData(),
		bank_4: getEmptyBankData(),
		bank_5: getEmptyBankData(),
		bank_6: getEmptyBankData(),
		bank_7: getEmptyBankData(),
		bank_8: getEmptyBankData(),
		bank_9: getEmptyBankData(),
		bank_10: getEmptyBankData()
	},
	{
		title: 'Соотношение расходов и доходов',
		main_bank: 56.64,
		bank_1: getEmptyBankData(),
		bank_2: getEmptyBankData(),
		bank_3: getMaxBankData(56.64, 75),
		bank_4: getEmptyBankData(),
		bank_5: getEmptyBankData(),
		bank_6: getEmptyBankData(),
		bank_7: getEmptyBankData(),
		bank_8: getEmptyBankData(),
		bank_9: getEmptyBankData(),
		bank_10: getEmptyBankData()
	},
	{
		title: 'Соотношение среднего показателя доходности активов (ROA) (получено waiver letter)',
		main_bank: 0.74,
		bank_1: getEmptyBankData(),
		bank_2: getEmptyBankData(),
		bank_3: getMinBankData(0.74, 1),
		bank_4: getEmptyBankData(),
		bank_5: getEmptyBankData(),
		bank_6: getEmptyBankData(),
		bank_7: getEmptyBankData(),
		bank_8: getEmptyBankData(),
		bank_9: getEmptyBankData(),
		bank_10: getEmptyBankData()
	},
	{
		title: 'Чистая доля проблемной задолженности в общем объеме выданных кредитов (NPL) НСБУ',
		main_bank: 2.61,
		bank_1: getEmptyBankData(),
		bank_2: getEmptyBankData(),
		bank_3: getMaxBankData(2.61, 5),
		bank_4: getEmptyBankData(),
		bank_5: getEmptyBankData(),
		bank_6: getEmptyBankData(),
		bank_7: getEmptyBankData(),
		bank_8: getEmptyBankData(),
		bank_9: getEmptyBankData(),
		bank_10: getEmptyBankData()
	},
	{
		title: 'Максимальный предел по индивидуальному размеру риска на группу связанных заёмщиков',
		main_bank: 3.25,
		bank_1: getEmptyBankData(),
		bank_2: getEmptyBankData(),
		bank_3: getMaxBankData(3.25, 25),
		bank_4: getEmptyBankData(),
		bank_5: getEmptyBankData(),
		bank_6: getEmptyBankData(),
		bank_7: getEmptyBankData(),
		bank_8: getEmptyBankData(),
		bank_9: getEmptyBankData(),
		bank_10: getEmptyBankData()
	},
	{
		title: 'Левераж',
		main_bank: 9.42,
		bank_1: getEmptyBankData(),
		bank_2: getEmptyBankData(),
		bank_3: getEmptyBankData(),
		bank_4: getEmptyBankData(),
		bank_5: getEmptyBankData(),
		bank_6: getMinBankData(9.42, 6),
		bank_7: getEmptyBankData(),
		bank_8: getEmptyBankData(),
		bank_9: getMinBankData(9.42, 6),
		bank_10: getMinBankData(9.42, 6)
	},
	{
		title: 'Коэффициент открытого кредитного риска',
		main_bank: 12.23,
		bank_1: getEmptyBankData(),
		bank_2: getEmptyBankData(),
		bank_3: getEmptyBankData(),
		bank_4: getEmptyBankData(),
		bank_5: getEmptyBankData(),
		bank_6: getEmptyBankData(),
		bank_7: getMaxBankData(12.23, 20),
		bank_8: getEmptyBankData(),
		bank_9: getEmptyBankData(),
		bank_10: getEmptyBankData()
	},
	{
		title: 'Коэффициент мгновенной ликвидности',
		main_bank: 161.85,
		bank_1: getEmptyBankData(),
		bank_2: getEmptyBankData(),
		bank_3: getEmptyBankData(),
		bank_4: getEmptyBankData(),
		bank_5: getEmptyBankData(),
		bank_6: getEmptyBankData(),
		bank_7: getMinBankData(161.85, 50),
		bank_8: getEmptyBankData(),
		bank_9: getEmptyBankData(),
		bank_10: getEmptyBankData()
	},
	{
		title: `Максимальный размер риска на одного заемщика или группу взаимосвязанных заемщиков / 
  Регулятивный капитал`,
		main_bank: 13.72,
		bank_1: getEmptyBankData(),
		bank_2: getEmptyBankData(),
		bank_3: getEmptyBankData(),
		bank_4: getEmptyBankData(),
		bank_5: getEmptyBankData(),
		bank_6: getEmptyBankData(),
		bank_7: getMaxBankData(13.72, 20),
		bank_8: getEmptyBankData(),
		bank_9: getEmptyBankData(),
		bank_10: getEmptyBankData()
	},
	{
		title: `Максимальный размер риска на одного заемщика или группу взаимосвязанных заемщиков / 
  Регулятивный капитал (согласно контракту 20% при этом, 
  получено письмо об изменении требования до 26% до 01.01.2023г).(ТМЗ)`,
		main_bank: 17.68,
		bank_1: getEmptyBankData(),
		bank_2: getEmptyBankData(),
		bank_3: getEmptyBankData(),
		bank_4: getEmptyBankData(),
		bank_5: getEmptyBankData(),
		bank_6: getEmptyBankData(),
		bank_7: getMaxBankData(17.68, 20),
		bank_8: getEmptyBankData(),
		bank_9: getEmptyBankData(),
		bank_10: getEmptyBankData()
	},
	{
		title: 'Максимальный размер риска для всех крупных активов / Регулятивный капитал',
		main_bank: 322.42,
		bank_1: getEmptyBankData(),
		bank_2: getEmptyBankData(),
		bank_3: getEmptyBankData(),
		bank_4: getEmptyBankData(),
		bank_5: getEmptyBankData(),
		bank_6: getEmptyBankData(),
		bank_7: getMaxBankData(322.42, 800),
		bank_8: getEmptyBankData(),
		bank_9: getEmptyBankData(),
		bank_10: getEmptyBankData()
	},
	{
		title: `Выданные кредиты (UzAutoMotors) (согласно контракту 20% при этом, получено письмо об изменении требования до 50% до 31.12.2023г).`,
		main_bank: 47.96,
		bank_1: getEmptyBankData(),
		bank_2: getEmptyBankData(),
		bank_3: getEmptyBankData(),
		bank_4: getEmptyBankData(),
		bank_5: getEmptyBankData(),
		bank_6: getEmptyBankData(),
		bank_7: getMaxBankData(47.96, 50),
		bank_8: getEmptyBankData(),
		bank_9: getEmptyBankData(),
		bank_10: getEmptyBankData()
	},
	{
		title: 'Чистый доход за последние два года',
		main_bank: 'в соответствии',
		bank_1: getEmptyBankData(),
		bank_2: getEmptyBankData(),
		bank_3: getPureBankData('больше чем 0', Status.safe),
		bank_4: getEmptyBankData(),
		bank_5: getEmptyBankData(),
		bank_6: getEmptyBankData(),
		bank_7: getEmptyBankData(),
		bank_8: getEmptyBankData(),
		bank_9: getEmptyBankData(),
		bank_10: getEmptyBankData()
	},
	{
		title: 'Чистый доход за текущий год',
		main_bank: 'в соответствии',
		bank_1: getEmptyBankData(),
		bank_2: getEmptyBankData(),
		bank_3: getPureBankData('больше чем 0', Status.safe),
		bank_4: getEmptyBankData(),
		bank_5: getEmptyBankData(),
		bank_6: getEmptyBankData(),
		bank_7: getEmptyBankData(),
		bank_8: getEmptyBankData(),
		bank_9: getEmptyBankData(),
		bank_10: getEmptyBankData()
	},
	{
		title: 'Соблюдение всем требованиям ЦБРУз',
		main_bank: 'в соответствии',
		bank_1: getEmptyBankData(),
		bank_2: getEmptyBankData(),
		bank_3: getEmptyBankData(),
		bank_4: getEmptyBankData(),
		bank_5: getEmptyBankData(),
		bank_6: getEmptyBankData(),
		bank_7: getEmptyBankData(),
		bank_8: getEmptyBankData(),
		bank_9: getEmptyBankData(),
		bank_10: getEmptyBankData()
	}
]

//Выданные кредиты (не включая государственных гарантий обеспеченных Правительством
//   Узбекистан) компании UzAutoMotors не превышает 65% регулятивного капитала до 01.01.2021.
//   (согласно контракту 20% при этом,
//   получено письмо об изменении требования до 55% до 31.12.2021г).
