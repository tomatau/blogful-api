require('dotenv').config()
const express = require('express')
// const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
// const knex = require('knex')
const { NODE_ENV/* , DB_URL */ } = require('./config')
const { logger } = require('./middleware');
const articlesRouter = require('./articles/router')
const commentsRouter = require('./comments/router')
const usersRouter = require('./users/router')
const tagsRouter = require('./tags/router')

const app = express()
// const db = knex({
//   client: 'pg',
//   connection: DB_URL,
// })

// app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common'))
app.use(logger);
app.use(cors())
app.use(helmet())

// app.use((req, res, next) => {
//   req.db = db
//   next()
// })

app.use('/articles', articlesRouter)
app.use('/comments', commentsRouter)
app.use('/users', usersRouter)
app.use('/tags', tagsRouter)

app.get('/', (req, res) => {
  res.send('Hello, world!')
})

app.use(function errorHandler(error, req, res, next) {
  let response
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } }
  } else {
    response = Object.assign({}, error, { message: error.message })
  }
  res.status(500).json(response)
})

module.exports = app
