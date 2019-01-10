require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const knex = require('knex')
const { NODE_ENV, DB_URL } = require('./config')
const articlesRouter = require('./articles/router')
const commentsRouter = require('./comments/router')

const app = express()
const db = knex({
  client: 'pg',
  connection: DB_URL,
})

app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common'))
app.use(cors())
app.use(helmet())

app.use((req, res, next) => {
  req.db = db
  next()
})

app.use('/article', articlesRouter)
app.use('/comment', commentsRouter)

app.get('/', (req, res) => {
  res.send('Hello, world!')
})

app.use(function errorHandler(error, req, res, next) {
  let response
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } }
  } else {
    response = { error }
  }
  res.status(500).json(response)
})

module.exports = app
