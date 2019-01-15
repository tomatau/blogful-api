require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const articlesRouter = require('./articles/articles-router')
const commentsRouter = require('./comments/comments-router')
const usersRouter = require('./users/users-router')
const tagsRouter = require('./tags/tags-router')

const app = express()

app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common'))
app.use(cors())
app.use(helmet())

app.use('/article', articlesRouter)
app.use('/comment', commentsRouter)
app.use('/user', usersRouter)
app.use('/tag', tagsRouter)

app.get('/', (req, res) => {
  res.send('Hello, world!')
})

app.use(function errorHandler(error, req, res, next) {
  let response
  if (NODE_ENV === 'production') {
    response = { error: 'server error' }
  } else {
    console.error(error)
    response = { message: error.message, error }
  }
  res.status(500).json(response)
})

module.exports = app
