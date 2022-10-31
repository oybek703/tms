export enum APIRoutes {
	dashboard = 'dashboard',
	creditData = 'creditData',
	fcrb = 'fcrb',
	mainIndicators = 'mainIndicators',
	calcFor = 'calcFor',
	capital = 'capital',
	profitAndLost = 'profitAndLost',
	liquidity = 'liquidity',
	liquidityCurrent = '/api/liquidity/current_state',
	correspondent = 'correspondent',
	correspondentCurrent = '/api/correspondent/current_state',
	currencyPosition = 'currencyPosition',
	vlaBuffer = 'vlaBuffer',
	plat = 'plat',
	interbankDeposits = 'interbankDeposits',
	topDeposits = 'topDeposits',
	timeDepoClients = 'timeDepoClients',
	timeDeposits = 'timeDeposits',
	depositsByDeadline = 'depositsByDeadline',
	reportLiabilities = 'reportLiabilities',
	filialEffectiveness = 'filialEffectiveness',
	gm = 'gm',
	gap = '/api/gap',
	gapLastUpdate = '/api/gap/lastGapUpdate',
	gapSimulation = '/api/gapSimulation'
}

export type ApiRoutesType = keyof typeof APIRoutes
