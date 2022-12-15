export interface IBankList {
	clientCode: string
	bankName: string
}

export interface ITransactionData {
	bankNameOrYear: string
	debit: number
	credit: number
}

export interface IBankData {
	country: string
	clientCode: string
	swiftCode: string
	dateOpen: string
	volumeOperations: string
	serviceSpeed: string
	serviceQuality: string
	serviceCost: string
	corrAccounts: string
	genAgreement: string
	isda: string
	otherAgrement: string
	imports: string
	exports: string
	tradingFin: string
	interbankDeposits: string
	creditLine: string
	conversionAccounts: string
	vostro: string
	otherOperations: string
}

export interface IRemainderData {
	currencyName: string
	saldoOut: number
}

export interface ICorrOperations {
	bankList: IBankList[]
	volume: ITransactionData[]
	fx: ITransactionData[]
	physicalPayments: ITransactionData[]
	legalPayments: ITransactionData[]
	interbankOperations: ITransactionData[]
	loroAccountsOperations: ITransactionData[]
	accredetivOperations: ITransactionData[]
	bankData: IBankData
	remainder: IRemainderData[]
	paymentCount: ITransactionData[]
}
