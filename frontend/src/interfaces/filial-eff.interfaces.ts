export interface IFililiaEffRow {
	accruedInterest: number
	benefitInMonth: number
	deposit202: number
	deposit204: number
	deposit206: number
	filialName: string
	issuedLoans: number
	mfo: string
	npl: number
	nplPercent: number
	par30: number
	par60: number
	par90: number
	resourceDebt: number
	roa: number
	roe: number
	totalLoan: number
}

export interface IFilialEffData {
	allData: IFililiaEffRow[]
	roaTotal: number
	roeTotal: number
}

export enum FilialEffProperties {
	accruedInterest = 'Начисленные проценты',
	benefitInMonth = 'Прибыль за месяц',
	deposit202 = 'Депозиты довостребования',
	deposit204 = 'Сберегательные депозиты',
	deposit206 = 'Срочные депозиты клиентов',
	filialName = 'Наименование филиалов',
	issuedLoans = 'Всего проблеманые кредиты',
	mfo = 'МФО',
	npl = 'NPL > 90',
	nplPercent = 'NPL (%)',
	par30 = 'PAR < 30',
	par60 = 'PAR < 60',
	par90 = 'PAR < 90',
	resourceDebt = 'Задолженность по ресурсам перед ГО',
	roa = 'ROA',
	roe = 'ROE',
	totalLoan = 'Кредитний портфель'
}
