const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

require('dotenv').config()
const { env } = require('process')

const petRoutes = require('./routes/pet-routes')
const userRoutes = require('./routes/user-routes')

const PORT = env.PORT

const app = express()
app.use(cors())
app.use(bodyParser.json({ limit: '10mb' }))
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/user', userRoutes)
app.use('/pet', petRoutes)

app.listen(PORT, () => {
  console.log('O servidor está rodando na porta:', PORT)
})
