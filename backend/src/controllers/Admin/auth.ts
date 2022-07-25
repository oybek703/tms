import { Request, Response } from 'express'
import asyncMiddleware from '../../utils/async'
import ErrorResponse from '../../utils/errorResponse'
import { getData } from '../../models/db_apis'
import { compare, genSalt, hash } from 'bcryptjs'
import { sign } from 'jsonwebtoken'


interface User {
    ID: number
    USERNAME: string
    PASSWORD: string
    ROLE: string
    ALLOWED_PAGES: string
}

// @desc Sign in user
// @route /auth/login
// access Public
export const signInUser = asyncMiddleware(async (req: Request, res: Response) => {
  const { username, password } = req.body
  const query = `SELECT * FROM TRS_USERS WHERE USERNAME='${username}'`
  const { rows = [] } = await getData(query)
  const user: User | undefined = rows[0] as User
  if (user) {
    const matchPassword = await compare(password, user.PASSWORD)
    if (matchPassword) {
      const token = sign(
          { id: user.ID },
                process.env.JWT_SECRET as string,
                { expiresIn: '4h' },
      )
      res.status(200).json({
        success: true,
        token,
        username: user.USERNAME,
        ROLE: user.ROLE,
        pages: user.ALLOWED_PAGES,
      })
    } else {
      throw new ErrorResponse(400, 'Invalid password.')
    }
  } else {
    throw new ErrorResponse(400, 'Invalid username.')
  }
})

// @desc Add user
// @route /auth/adduser
// access Admin
export const addUser = asyncMiddleware(async (req: Request, res: Response) => {
  const { username, password, confirmpassword, allowedPages } = req.body
  const { rows = [] } = await getData(`SELECT * FROM TRS_USERS WHERE USERNAME='${username}'`)
  const existingUser: User = rows[0] as User
  if (existingUser) throw new ErrorResponse(400, 'user_exists')
  if (password !== confirmpassword) throw new ErrorResponse(400, 'match_password')
  const salt = await genSalt(10)
  const hashedPassword = await hash(password, salt)
  const ALLOWED_PAGES = allowedPages.join(',')
  await getData(`INSERT INTO TRS_USERS (USERNAME, PASSWORD, ALLOWED_PAGES) 
                       VALUES ('${username}', '${hashedPassword}', '${ALLOWED_PAGES}')`)
  res.json({ success: true, message: 'User added successfully.' })
})

// @desc Delete user
// @route /auth/:username
// access Admin
export const deleteUserByName = asyncMiddleware(async (req: Request, res: Response) => {
  const { username } = req.params
  const { rows = [] } = await getData(`SELECT * FROM TRS_USERS WHERE USERNAME='${username}'`)
  const user: User = rows[0] as User
  if (!user) throw new ErrorResponse(404, 'User does not exists.')
  await getData(`DELETE FROM TRS_USERS WHERE USERNAME='${username}'`)
  res.json({ success: true, message: `${username} deleted successfully.` })
})

// @desc Get all users
// @route /auth/users
// access Admin
export const getAllUsers = asyncMiddleware(async (req: Request, res: Response) => {
  const { rows } = await getData(`SELECT ID, USERNAME, ROLE, ALLOWED_PAGES FROM TRS_USERS`)
  res.status(200).json({ success: true, users: rows })
})

// @desc Get user by id
// @route /users/:username
// access Admin
export const getUserByName = asyncMiddleware(async function(req: Request, res: Response) {
  const { id } = req.params
  const date = '02.06.2021'
  const query = `SELECT (SELECT SUM(SALDO_EQUIVAL_OUT)
                    FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                   SALDO_EQUIVAL_OUT
                                    FROM   IBS.SALDO@IABS SL
                                    WHERE  SL.ACCOUNT_CODE = AC.CODE
                                           AND SL.OPER_DAY <= TO_DATE('${date}',
                                                              'DD-MM-YYYY')
                                           AND ROWNUM = 1) AS saldo_equival_out
                            FROM   IBS.ACCOUNTS@IABS AC
                            WHERE  CODE_COA LIKE '101%'))      AS total,
                   (SELECT SUM(SALDO_EQUIVAL_OUT)
                    FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                   SALDO_EQUIVAL_OUT
                                    FROM   IBS.SALDO@IABS SL
                                    WHERE  SL.ACCOUNT_CODE = AC.CODE
                                           AND SL.OPER_DAY <= TO_DATE('${date}',
                                                              'DD-MM-YYYY')
                                           AND ROWNUM = 1) AS saldo_equival_out
                            FROM   IBS.ACCOUNTS@IABS AC
                            WHERE  CODE_COA LIKE '101%'
                                   AND CODE_CURRENCY = '000')) AS nat_curr,
                   TRUNC(( (SELECT ( (SELECT SUM(SALDO_EQUIVAL_OUT)
                                      FROM   (SELECT (SELECT
                                                     --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                     SALDO_EQUIVAL_OUT
                                                      FROM   IBS.SALDO@IABS SL
                                                      WHERE  SL.ACCOUNT_CODE = AC.CODE
                                                             AND
                                                     SL.OPER_DAY <= TO_DATE('${date}',
                                                                    'DD-MM-YYYY')
                                                             AND ROWNUM = 1) AS
                                                     saldo_equival_out
                                              FROM   IBS.ACCOUNTS@IABS AC
                                              WHERE  CODE_COA LIKE '101%')) - (SELECT
                                             SUM(SALDO_EQUIVAL_OUT)
                                                                               FROM   (
                                     SELECT
                                             (SELECT
                                             --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                             SALDO_EQUIVAL_OUT
                                              FROM
                   IBS.SALDO@IABS SL
                            WHERE
                   SL.ACCOUNT_CODE = AC.CODE
                   AND
                   SL.OPER_DAY <= TO_DATE('${date}',
                   'DD-MM-YYYY')
                   AND ROWNUM = 1) AS
                   saldo_equival_out
                   FROM   IBS.ACCOUNTS@IABS AC
                   WHERE  CODE_COA LIKE '101%'
                   AND CODE_CURRENCY =
                   '000')) )
                   FROM   DUAL) / (SELECT EQUIVAL
                   FROM   IBS.S_RATE_CUR@IABS
                   WHERE  DATE_CROSS = TO_DATE('${date}', 'DD-MM-YYYY')
                   AND CODE = '840') ), 2)                     AS for_curr_dollar,
                   (SELECT SUM(SALDO_OUT)
                    FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                   SALDO_OUT
                                    FROM   IBS.SALDO@IABS SL
                                    WHERE  SL.ACCOUNT_CODE = AC.CODE
                                           AND SL.OPER_DAY <= TO_DATE('${date}',
                                                              'DD-MM-YYYY')
                                           AND ROWNUM = 1) AS saldo_out
                            FROM   IBS.ACCOUNTS@IABS AC
                            WHERE  CODE_COA LIKE '101%'
                                   AND CODE_CURRENCY = '840')) AS usa_dollar,
                   (SELECT SUM(SALDO_OUT)
                    FROM   (SELECT (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                   SALDO_OUT
                                    FROM   IBS.SALDO@IABS SL
                                    WHERE  SL.ACCOUNT_CODE = AC.CODE
                                           AND SL.OPER_DAY <= TO_DATE('${date}',
                                                              'DD-MM-YYYY')
                                           AND ROWNUM = 1) AS saldo_out
                            FROM   IBS.ACCOUNTS@IABS AC
                            WHERE  CODE_COA LIKE '101%'
                                   AND CODE_CURRENCY = '978')) AS evro
                FROM   IBS.SALDO@IABS S,
                   IBS.ACCOUNTS@IABS A
                WHERE  A.CODE = S.ACCOUNT_CODE
                   AND ROWNUM = 1`
  const { rows = [] } = await getData(query)
  const user: User = rows[0] as User
  if (!user) throw new ErrorResponse(404, `User with id of ${id} not found.`)
  res.status(200).json({ success: true, user })
})
