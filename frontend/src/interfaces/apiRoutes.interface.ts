export enum APIRoutes {
	dashboard = 'dashboard',
	creditData = 'creditData',
	fcrb = 'fcrb',
	mainIndicators = 'mainIndicators',
	calcFor = 'calcFor',
	capital = 'capital',
	profitAndLost = 'profitAndLost',
	liquidity = 'liquidity',
	nostroMatrix = 'nostroMatrix',
	liquidityCurrent = '/api/liquidity/currentState',
	correspondent = 'correspondent',
	correspondentCurrent = '/api/correspondent/currentState',
	currencyPosition = 'currencyPosition',
	vlaBuffer = 'vlaBuffer',
	placedAttracted = 'placedAttracted',
	interbankDeposits = 'interbankDeposits',
	topDeposits = 'topDeposits',
	timeDepoClients = 'timeDepoClients',
	timeDeposits = 'timeDeposits',
	depositsByDeadline = 'depositsByDeadline',
	reportLiabilities = 'reportLiabilities',
	filialEffectiveness = 'filialEffectiveness',
	corrAccountsAnalyze = '/api/corrAccountsAnalyze',
	caaManual = '/api/caaManual',
	corrOperations = 'corrOperations',
	gm = 'gm',
	gap = '/api/gap',
	gapLastUpdate = '/api/gap/lastUpdate',
	gapSimulation = '/api/gapManual',
	competitiveAnalysis = 'competitiveAnalysis'
}

export type ApiRoutesType = keyof typeof APIRoutes
