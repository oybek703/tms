import { Request } from 'express'
export type RequestWithDateQuery = Request<{}, {}, {}, { date: string }>
