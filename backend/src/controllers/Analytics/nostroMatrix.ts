import { Request, Response } from 'express'
import asyncMiddleware from '../../utils/async'
import getNostroMatrixTable from '../../utils/nostroMatrix'

// @desc Get Nostro Accounts Matrix
// @route /api/nostroMatrix
// access Private
const getNostroMatrix = asyncMiddleware(async (req: Request, res: Response) => {
  const { date } = req.query
  // @ts-ignore
  const nostroMatrixTable = await getNostroMatrixTable(date)
  res.status(200).json({ success: true, rows: nostroMatrixTable })
})

export default getNostroMatrix

