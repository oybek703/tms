import { Request, Response } from 'express'
import asyncMiddleware from '../../utils/async'
import getVlaBufferTable from '../../utils/vlaBuffer'

// @desc Get VLA Buffer
// @route /api/vlaBuffer
// access Private
const getVlaBuffer = asyncMiddleware(async (req: Request, res: Response) => {
  const { date } = req.query
  // @ts-ignore
  const vlaBufferTable = await getVlaBufferTable(date)
  res.status(200).json({ success: true, rows: vlaBufferTable })
})

export default getVlaBuffer

