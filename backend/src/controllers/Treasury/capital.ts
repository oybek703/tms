import { Request, Response } from 'express'
import asyncMiddleware from '../../utils/async'
import getCapitalTable from '../../utils/capital'

// @desc Get capital
// @route /api/capital
// access Private
const getCapital = asyncMiddleware(async (req: Request, res: Response) => {
  const { date } = req.query
  // @ts-ignore
  const capitalTable = await getCapitalTable(date)
  res.status(200).json({ success: true, rows: capitalTable })
})

export default getCapital
