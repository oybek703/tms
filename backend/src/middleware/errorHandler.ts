import ErrorResponse from '../utils/errorResponse'
import { Response, Request, NextFunction } from 'express'

function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  console.error(err)
  const message = err.message; const statusCode = err.status === 200 ? 500 : err.status
  const error: any = new ErrorResponse(
      statusCode || 500,
      message || 'Something went wrong on the server side.'
  )
  res.status(error.status).json({ success: false, message: error.message })
}

export default errorHandler
