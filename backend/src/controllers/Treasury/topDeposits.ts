import {Request, Response} from 'express'
import asyncMiddleware from '../../utils/async'
import getTopDepositsTable from '../../utils/topDeposits'

// @desc Get Top Deposits
// @route /api/topdeposits
// access Private
const getTopDeposits = asyncMiddleware(async (req: Request, res: Response) => {
    const {date} = req.query
    // @ts-ignore
    const topDepositsTable = await getTopDepositsTable(date)
    res.status(200).json({success: true, rows: topDepositsTable})
})

export default getTopDeposits


