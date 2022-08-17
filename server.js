const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const colors = require('colors')
const morgan = require('morgan')

const errorHandler = require('./middleware/error')

const authRoutes = require('./routes/authRoutes')
const profileRoutes = require('./routes/profileRoutes')

const app = express()

dotenv.config({ path : './config/config.env' })

app.use(express.json())
app.use(cors({ origin : true }))

app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)
app.use(errorHandler)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`.yellow.bold)
})
