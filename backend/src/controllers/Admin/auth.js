const asyncMiddleware = require('../../utils/async')
const ErrorResponse = require("../../utils/errorResponse")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const {getData} = require("../../models/db_apis")

// @desc Sign in user
// @route /auth/login
// access Public
exports.signInUser = asyncMiddleware(async (req, res) => {
    const {username, password} = req.body
    const {rows: [user]} = await getData(`SELECT * FROM TRS_USERS WHERE USERNAME='${username}'`)
    if(user) {
        const matchPassword = await bcrypt.compare(password, user.PASSWORD)
        if(matchPassword) {
            const token = await jwt.sign(
                {id: user.ID},
                process.env.JWT_SECRET,
                {expiresIn: '4h'}
                )
            res.status(200).json({
                success: true,
                token,
                username: user.USERNAME,
                ROLE: user.ROLE,
                pages: user.ALLOWED_PAGES
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
exports.addUser = asyncMiddleware(async (req, res) => {
    const {username, password, confirmpassword, allowedPages} = req.body
    const {rows: [existingUser]} = await getData(`SELECT * FROM TRS_USERS WHERE USERNAME='${username}'`)
    if(existingUser) throw new ErrorResponse(400, 'user_exists')
    if(password !== confirmpassword) throw new ErrorResponse(400, 'match_password')
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    let ALLOWED_PAGES = allowedPages.join(',')
    await getData(`INSERT INTO TRS_USERS (USERNAME, PASSWORD, ALLOWED_PAGES) 
                       VALUES ('${username}', '${hashedPassword}', '${ALLOWED_PAGES}')`)
    res.json({success: true, message: 'User added successfully.'})
})

// @desc Delete user
// @route /auth/:username
// access Admin
exports.deleteUserByName = asyncMiddleware(async (req, res) => {
    const {username} = req.params
    const {rows: [user]} = await getData(`SELECT * FROM TRS_USERS WHERE USERNAME='${username}'`)
    if(!user) throw new ErrorResponse(404, 'User does not exists.')
    await getData(`DELETE FROM TRS_USERS WHERE USERNAME='${username}'`)
    res.json({success: true, message: `${username} deleted successfully.`})
})

// @desc Get all users
// @route /auth/users
// access Admin
exports.getAllUsers = asyncMiddleware(async (req, res) => {
    const {rows} = await getData(`SELECT ID, USERNAME, ROLE, ALLOWED_PAGES FROM TRS_USERS`)
    res.status(200).json({success:true, users: rows})
})

// @desc Get user by id
// @route /users/:username
// access Admin
exports.getUserByName = asyncMiddleware(async function (req, res) {
    const {id} = req.params
    const date = '02.06.2021'
    const {rows: [user]} = await getData(`SELECT
                                              (SELECT sum(saldo_equival_out)
                                               FROM
                                                   (SELECT
                                                        (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                                saldo_equival_out
                                                         FROM ibs.saldo@iabs sl
                                                         WHERE sl.account_code=ac.code
                                                           AND sl.oper_day<=to_date('${date}', 'DD-MM-YYYY')
                                                           AND rownum =1 ) AS saldo_equival_out
                                                    FROM ibs.accounts@iabs AC
                                                    WHERE code_coa like '101%' )) AS total,
                                              (SELECT sum(saldo_equival_out)
                                               FROM
                                                   (SELECT
                                                        (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                                saldo_equival_out
                                                         FROM ibs.saldo@iabs sl
                                                         WHERE sl.account_code=ac.code
                                                           AND sl.oper_day<=to_date('${date}', 'DD-MM-YYYY')
                                                           AND rownum =1 ) AS saldo_equival_out
                                                    FROM ibs.accounts@iabs AC
                                                    WHERE code_coa like '101%'
                                                      AND code_currency='000' )) AS nat_curr,
                                              trunc(((select (
                                                                 (SELECT sum(saldo_equival_out)
                                                                  FROM
                                                                      (SELECT
                                                                           (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                                                   saldo_equival_out
                                                                            FROM ibs.saldo@iabs sl
                                                                            WHERE sl.account_code=ac.code
                                                                              AND sl.oper_day<=to_date('${date}', 'DD-MM-YYYY')
                                                                              AND rownum =1 ) AS saldo_equival_out
                                                                       FROM ibs.accounts@iabs AC
                                                                       WHERE code_coa like '101%' ))-(SELECT sum(saldo_equival_out)
                                                                     FROM
                                                                     (SELECT
                                                                     (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                                     saldo_equival_out
                                                                     FROM ibs.saldo@iabs sl
                                                                     WHERE sl.account_code=ac.code
                                                                     AND sl.oper_day<=to_date('${date}', 'DD-MM-YYYY')
                                                                     AND rownum =1 ) AS saldo_equival_out
                                                                     FROM ibs.accounts@iabs AC
                                                                     WHERE code_coa like '101%'
                                                                     AND code_currency='000' ))
                                                             ) from dual)/(select equival from ibs.s_rate_cur@IABS where date_cross=to_date('${date}', 'DD-MM-YYYY') and code='840')),2)
                                                                                  as for_curr_dollar,
                                              (SELECT sum(saldo_out)
                                               FROM
                                                   (SELECT
                                                        (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                                saldo_out
                                                         FROM ibs.saldo@iabs sl
                                                         WHERE sl.account_code=ac.code
                                                           AND sl.oper_day<=to_date('${date}', 'DD-MM-YYYY')
                                                           AND rownum =1 ) AS saldo_out
                                                    FROM ibs.accounts@iabs AC
                                                    WHERE code_coa like '101%'
                                                      AND code_currency='840' )) AS usa_dollar,
                                              (SELECT sum(saldo_out)
                                               FROM
                                                   (SELECT
                                                        (SELECT --+index_desc (sl UK_SALDO_ACCOUNT_DAY)
                                                                saldo_out
                                                         FROM ibs.saldo@iabs sl
                                                         WHERE sl.account_code=ac.code
                                                           AND sl.oper_day<=to_date('${date}', 'DD-MM-YYYY')
                                                           AND rownum =1 ) AS saldo_out
                                                    FROM ibs.accounts@iabs AC
                                                    WHERE code_coa like '101%'
                                                      AND code_currency='978' )) AS evro
                                          FROM ibs.saldo@iabs s,
                                               ibs.accounts@iabs a
                                          WHERE a.code=s.account_code
                                            AND rownum=1`)
    if(!user) throw new ErrorResponse(404, `User with id of ${id} not found.`)
    res.status(200).json({success: true, user})
})