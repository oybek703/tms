import { ILiquidityRow } from './liquidity.interfaces'

export interface IVlaAndForRow extends ILiquidityRow {
	currentTotal: number
	currentForCurr: number
	currentNatCurr: number
}
