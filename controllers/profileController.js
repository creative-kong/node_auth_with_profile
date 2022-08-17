const mssql = require('mssql')

const sqlConfig = require('../config/sqlConfig')
const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/errorResponse')

exports.getProfile = asyncHandler( async (req, res, next) => {
    const pool = await mssql.connect(sqlConfig)
    const response = await pool.request().input('account_id', mssql.Int, req.user.id).query(`select * from profile where account_id = @account_id`)
    if(!response.recordset[0]) {
        return next(new ErrorResponse('profile is empty.', 200))
    }
    res.status(200).json({
        data : response.recordset[0],
        success : true,
        message : 'successfully.'
    })
})

exports.createProfile = asyncHandler (async (req, res, next) => {
    const { firstName, lastName, displayName, sex, phone } = req.body
    const pool = await mssql.connect(sqlConfig)
    await pool.request()
                .input('id', mssql.Int, 0)
                .input('firstName', mssql.NVarChar(50), firstName)
                .input('lastName', mssql.NVarChar(50), lastName)
                .input('displayName', mssql.NVarChar(50), displayName)
                .input('sex', mssql.Int, sex)
                .input('phone', mssql.NVarChar(50), phone)
                .input('account_id', mssql.Int, req.user.id)
                .execute('manage_profile', (err, result) => {
                    if(err) {
                        return next(new ErrorResponse(err, 400))
                    }
                    if(result.recordset[0][""] === 0) {
                        return next(new ErrorResponse('code has been used.', 200))
                    }
                    if(result.recordset[0][""] === -2) {
                        return next(new ErrorResponse('error to create user profile.', 200))
                    }
                    res.status(200).json({
                        data : result.recordset[0],
                        success : true,
                        message : 'create profile successfully.'
                    })
                })
})

exports.updateProfile = asyncHandler( async (req, res, next) => {
    const { firstName, lastName, displayName, sex, phone } = req.body
    const pool = await mssql.connect(sqlConfig)
    await pool.request()
                .input('id', mssql.Int, req.params.id)
                .input('firstName', mssql.NVarChar(50), firstName)
                .input('lastName', mssql.NVarChar(50), lastName)
                .input('displayName', mssql.NVarChar(50), displayName)
                .input('sex', mssql.Int, sex)
                .input('phone', mssql.NVarChar(50), phone)
                .input('account_id', mssql.Int, req.user.id)
                .execute('manage_profile', (err, result) => {
                    if(err) {
                        return next(new ErrorResponse(err, 400))
                    }
                    if(result.recordset[0][""] === 0) {
                        return next(new ErrorResponse('code has been used.', 200))
                    }
                    if(result.recordset[0][""] === -2) {
                        return next(new ErrorResponse('error to create user profile.', 200))
                    }
                    res.status(200).json({
                        data : result.recordset[0],
                        success : true,
                        message : 'update profile successfully.'
                    })
                })
})