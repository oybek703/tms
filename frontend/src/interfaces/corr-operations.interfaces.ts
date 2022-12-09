export interface IBankList {
	clientCode: string
	bankName: string
}

export interface ITransactionData {
	bankNameOrYear: string
	debit: number
	credit: number
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
	remainder: IRemainderData[]
}
