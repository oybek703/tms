import {Request, Response} from 'express'
import asyncMiddleware from '../../utils/async'
import getCorrespondentTable from '../../utils/correspondent'

// @desc Get correspondent
// @route /api/correspondent
// access Private
export const getCorrespondent = asyncMiddleware(async (req: Request, res: Response) => {
    const {date} = req.query
    // @ts-ignore
    const correspondentTable = await getCorrespondentTable(date)
    res.status(200).json({success: true, rows: correspondentTable})
})

// @desc Get correspondent current state
// @route /api/correspondent/current_state
// access Private
export const getCorrespondentCurrentState = asyncMiddleware(async (req: Request, res: Response) => {
    const currentStateTable = await getCorrespondentTable('', true)
    res.status(200).json({success: true, rows: currentStateTable})
})