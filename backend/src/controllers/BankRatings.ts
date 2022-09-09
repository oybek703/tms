import { getData } from '../models/db_apis'
import asyncMiddleware from './../utils/async'
import { Request, Response } from 'express'


// @desc get All Banks
// @route /banks
// access Admin
export const getAddedBanks = asyncMiddleware(async (req: Request, res: Response) => {
  const { rows } = await getData(`SELECT client_code,bank_name,
                                      case when residency = 1 then 'Локал банк'
                                      else 'Иностранные банк' end          as residency,
                                      case when rating_status = 1 then 'Инвестиционный'
                                      else 'Не инвестиционный' end as rating_status
                                    FROM bank_info_rating`)
  res.status(200).json({ success: true, addedBanks: rows })
})

export const searchBankIabs = asyncMiddleware(async (req: Request, res: Response) => {
  const { code } = req.body
  const { rows } = await getData(`select name, code  from ibs.client_current@iabs where code like'${code}%'`)
  res.status(200).json({ success: true, banks: rows })
})

export const searchAddedBanks = asyncMiddleware(async (req: Request, res: Response) => {
  const { code } = req.body
  const { rows } = await getData(`select * from bank_info_rating where client_code like'${code}%'`)
  res.status(200).json({ success: true, addedBanks: rows })
})
