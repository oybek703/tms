import {Request, Response} from 'express'
import asyncMiddleware from '../../utils/async'
import getCurrencyPositionTable from '../../utils/currencyPosition'

// @desc Get Currency Position
// @route /api/currencyposition
// access Private
const getCurrencyPosition = asyncMiddleware(async (req: Request, res: Response) => {
    const {date} = req.query
    // @ts-ignore
    const currencyPositionTable = await getCurrencyPositionTable(date)
    res.status(200).json({success: true, rows: currencyPositionTable})
})

export default getCurrencyPosition