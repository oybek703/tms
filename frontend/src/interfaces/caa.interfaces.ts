export interface BankData {
	bankName: string
	countryCode: string | null
	imports: string | null
	exports: string | null
	tradingFin: string | null
	mbd: string | null
	fx: string | null
	creditLine: string | null
	vostro: string | null
	otherOperations: string | null
	corrAccounts: string | null
	genAgreement: string | null
	isda: string | null
	otherAgreement: string | null
	serviceSize: string | null
	serviceSpeed: string | null
	serviceQuality: string | null
	serviceCost: string | null
}
export interface ICorrAccountsAnalyze {
	codeCurrency: string
	banks: BankData[]
}
