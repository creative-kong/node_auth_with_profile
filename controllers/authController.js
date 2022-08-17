const mssql = require('mssql')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const sqlConfig = require('../config/sqlConfig')
const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/errorResponse')

exports.register = asyncHandler( async (req, res, next) => {
    const { username, password } = req.body
    if(!username || !password) {
        return next(new ErrorResponse('username or password not be empty.', 400))
    }

    // hash password 
    const salt = await bcrypt.genSalt(10)
    let hashPassword = await bcrypt.hash(password, salt)

    // insert 
    const pool = await mssql.connect(sqlConfig)
    const response = await pool.request()
                            .input('username', mssql.NVarChar(30), username)
                            .input('password', mssql.NVarChar(255), hashPassword)
                            .execute('authentications', (err, result) => {
                                if(err) {
                                    return next(new ErrorResponse(err, 400))
                                }
                                if(result.recordset[0][""] === 0) {
                                    return next(new ErrorResponse('code has been used.', 200))
                                }
                                if(result.recordset[0][""] === -2) {
                                    return next(new ErrorResponse('error to create user account.', 200))
                                }
                                tokenResponse(result.recordset[0]["IDENTITY_ID"], 200, res)
                            })
})

exports.login = asyncHandler( async (req, res, next) => {
    const { username, password } = req.body
    if(!username || !password) {
        return next(new ErrorResponse('username or password not be empty.', 400))
    }
    const pool = await mssql.connect(sqlConfig)
    const response = await pool.request().input('username', mssql.NVarChar(30), username).query('select * from accounts where username = @username')
    if(! await bcrypt.compare(password, response.recordset[0]["password"])) {
        return next(new ErrorResponse( 'invalid credentials', 401))
    }
    tokenResponse(response.recordset[0]["id"], 200, res)
})

exports.updatePassword = asyncHandler( async (req, res, next) => {
    const { oldPassword, newPassword } = req.body
    const pool = await mssql.connect(sqlConfig)
    const user = await pool.request().input('id', mssql.Int, req.user.id).query(`select * from accounts where id = @id`)
    if(! await bcrypt.compare(oldPassword, user.recordset[0]["password"])) {
        return next(new ErrorResponse('password is incorrect', 401))
    }

    // hash password 
    const salt = await bcrypt.genSalt(10)
    let hashPassword = await bcrypt.hash(newPassword, salt)
    
    const response = await pool.request().input('password', mssql.NVarChar(255), hashPassword).input('id', mssql.Int, user.recordset[0]["id"]).query(`update accounts set password = @password where id = @id`)
    res.status(200).json({
        data : [],
        message : 'update password successfully.',
        success : true
    })
})

const tokenResponse = (id, statusCode, res) => {
    const token = jwt.sign({ id : id }, process.env.JWT_SECRET, { expiresIn : process.env.JWT_EXPIRE, algorithm : 'HS256' })
    res.status(statusCode).json({
        data : [],
        token,
        success : true,
        message : 'successfully.'
    })
}