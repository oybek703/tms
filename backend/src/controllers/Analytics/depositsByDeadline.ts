import { Request, Response } from 'express'
import asyncMiddleware from '../../utils/async'
import getDepositsByDeadlineTable from '../../utils/depositsByDeadline'

// @desc Get Deposits By Deadline
// @route /api/depositsbydeadline
// access Private
const getDepositsByDeadline = asyncMiddleware(async (req: Request, res: Response) => {
  const { date } = req.query
  // @ts-ignore
  const depositsByDeadlineTable = await getDepositsByDeadlineTable(date)
  res.status(200).json({ success: true, rows: depositsByDeadlineTable })
})

export default getDepositsByDeadline
