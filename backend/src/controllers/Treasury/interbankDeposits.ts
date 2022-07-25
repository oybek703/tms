import { Request, Response } from 'express'
import asyncMiddleware from '../../utils/async'
import getInterbankDepositsTable from '../../utils/interbankDeposits'

// @desc Get Interbank Deposits
// @route /api/interbankdeposits
// access Private
const getInterbankDeposits = asyncMiddleware(async (req: Request, res: Response) => {
  const date = req.query.date as string
  const interbankDepositsTable = await getInterbankDepositsTable(date)
  res.status(200).json({ success: true, rows: interbankDepositsTable })
})

export default getInterbankDeposits


