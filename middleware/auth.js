const jwt = require('jsonwebtoken')
const mssql = require('mssql')

const sqlConfig = require('../config/sqlConfig')
const asyncHandler = require('./async')
const ErrorResponse = require('../utils/errorResponse')

//protect routes
exports.protect = asyncHandler(async (req, res, next) => {
    let token
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }
    if(!token){
        return next(new ErrorResponse('not authorize to access this route', 401))
    }
    try {
        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const pool = await mssql.connect(sqlConfig)
        const response = await pool.request().input('id', mssql.Int, decoded.id).query(`select id, username from accounts where id = @id`)
        req.user = response.recordset[0]
        next()
    } catch (err) {
        return next(new ErrorResponse(err, 401))
    }
})