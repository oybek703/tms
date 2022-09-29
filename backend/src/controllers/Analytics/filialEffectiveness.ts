import { Response } from 'express'
import asyncMiddleware from '../../utils/async'
import getFilialEffectivenessTable from '../../utils/filialEffectiveness.ts'
import { RequestWithDateQuery } from '../controllers.interface'

// @desc Get Filial Effectiveness
// @route /api/filialEffectiveness
// access Private
const getFilialEffectiveness = asyncMiddleware(async (req: RequestWithDateQuery, res: Response) => {
	const { date } = req.query
	const vlaBufferTable = await getFilialEffectivenessTable(date)
	res.status(200).json({ success: true, rows: vlaBufferTable })
})

export default getFilialEffectiveness
