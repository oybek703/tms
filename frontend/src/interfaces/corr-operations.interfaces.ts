export interface IBankList {
	clientCode: string
	bankName: string
}

export interface ITransactionData {
	bankName: string
	debit: number
	credit: number
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
}
