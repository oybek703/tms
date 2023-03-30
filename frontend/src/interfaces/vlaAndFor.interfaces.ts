import { ILiquidityRow } from './liquidity.interfaces'

export interface IVlaAndForRow extends ILiquidityRow {
	currentTotal: number
	currentForCurr: number
	currentNatCurr: number
}

export interface IFlowsRow {
	indicatorName: string
	indicatorType: number
	indicatorId: number
	uzs: string
	usd: string
	eur: string
	rub: string
}
