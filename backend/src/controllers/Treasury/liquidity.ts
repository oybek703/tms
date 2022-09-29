import { Request, Response } from 'express'
import asyncMiddleware from '../../utils/async'
import getLiquidityTable from '../../utils/liquidity'
import { RequestWithDateQuery } from '../controllers.interface'

// @desc Get liquidity
// @route /api/liquidity
// access Private
export const getLiquidity = asyncMiddleware(async (req: RequestWithDateQuery, res: Response) => {
	const { date } = req.query
	const liquidityTable = await getLiquidityTable(date)
	res.status(200).json({ success: true, rows: liquidityTable })
})

// @desc Get liquidity current state
// @route /api/liquidity/current_state
// access Private
export const getLiquidityCurrentState = asyncMiddleware(async (req: Request, res: Response) => {
	const currentStateTable = await getLiquidityTable('', true)
	res.status(200).json({ success: true, rows: currentStateTable })
})
