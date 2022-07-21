// @desc Get GAP
// @route /api/gap
// access Private
import {Request, Response} from 'express'
import asyncMiddleware from '../../utils/async'
import getGapTable from '../../utils/gap'

const getGap = asyncMiddleware(async (req: Request, res: Response) => {
    const gapTable = await getGapTable()
    res.status(200).json({success: true, rows: gapTable})
})

export default getGap

