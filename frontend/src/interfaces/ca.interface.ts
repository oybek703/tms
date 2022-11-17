export interface ICACorporateRetail {
	corporate: [number, number, number, number]
	retail: [number, number, number, number]
}

export interface ICANationalForeign {
	national: [number, number, number, number]
	foreign: [number, number, number, number]
}

export interface ICompetitiveAnalysis {
	quarterDates: string[]
	totalData: {
		[key: string]: {
			indicatorName: string
			firstDate: number
			secondDate: number
			thirdDate: number
			fourthDate: number
			tabbed?: boolean
			redBold?: boolean
		}
	}
	chartData: {
		creditPortfolioGrow: ICACorporateRetail
		depositGrow: ICACorporateRetail
		actives: ICANationalForeign
		liabilities: ICANationalForeign
	}
}
