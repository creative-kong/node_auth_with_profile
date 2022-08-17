const errorHandler = (err, req, res, next) => {
    let error = { ...err }
    error.message = err.message

    res.status(err.statusCode || 500).json({
        data : [],
        success : false,
        message : error.message || 'server error'
    })
}

module.exports = errorHandler