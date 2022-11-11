export interface DashboardCorrespondent {
	value: string
	differ: string
	image: string
}

export interface Position {
	currencyCode: string
	equival: number
	sumEquival: number
	percent: number
	name: string
}

export interface DashboardCurrencyPosition {
	currencyPosition: string[]
	position: Position[]
}

export interface Vla {
	total: number[]
	nat: number[]
	foreign: number[]
	categories: string[]
	vlaCurrent: number[]
}

export interface Lcr {
	total: number[]
	nat: number[]
	foreign: number[]
	categories: string[]
}

export interface Nsfr {
	total: number[]
	nat: number[]
	foreign: number[]
	categories: string[]
}

export interface ForeignBank {
	bankName: string
	saldo: number
	limit22?: number
	differ?: number
	limitPercent22: string
	limitPercent24: string
	limit24: number
}

export interface LocalBank {
	bankName: string
	saldo: any
	limit22: any
	differ: any
	limitPercent22: string
	limitPercent24: string
	limit24: any
}

export interface BankLimits {
	foreignBanks: ForeignBank[]
	localBanks: LocalBank[]
}

export interface dashboard {
	dashboardCorrespondent: DashboardCorrespondent[]
	dashboardCurrencyPosition: DashboardCurrencyPosition
	timeDeposits: string[]
	currencyMfi: string[]
	currencyTimeDeposits: string[]
	interbankDeposits: string[]
	fundingStructure: string[]
	currencyMBD: string[]
	vla: Vla
	lcr: Lcr
	nsfr: Nsfr
	currencyRates: any[][]
	bankLimits: BankLimits
}
