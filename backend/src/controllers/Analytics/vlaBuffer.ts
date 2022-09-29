import { Response } from 'express'
import asyncMiddleware from '../../utils/async'
import getVlaBufferTable from '../../utils/vlaBuffer'
import { RequestWithDateQuery } from '../controllers.interface'

// @desc Get VLA Buffer
// @route /api/vlaBuffer
// access Private
const getVlaBuffer = asyncMiddleware(async (req: RequestWithDateQuery, res: Response) => {
	const { date } = req.query
	const vlaBufferTable = await getVlaBufferTable(date)
	res.status(200).json({ success: true, rows: vlaBufferTable })
})

export default getVlaBuffer
