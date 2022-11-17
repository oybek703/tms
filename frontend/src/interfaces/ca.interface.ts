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
		creditPortfolioGrow: [number, number, number, number]
		depositGrow: [number, number, number, number]
	}
}
