const express = require('express')
const path = require('path')
const CommentService = require('./comment-service')

const commentsRouter = express.Router()
const jsonBodyParser = express.json()

/* verbs for general comments */
commentsRouter
  .route('/')
    // add a comment, requires { article_id }
    .post(jsonBodyParser, (req, res, next) => {
      const { article_id, text, user_id } = req.body
      const newComment = { article_id, text, user_id }

      for (const [key, value] of Object.entries(newComment))
        if (value == null)
          return res.status(400).json({
            error: { message: `Missing '${key}' in request body` }
          })

      CommentService.insertComment(
        req.app.get('db'),
        newComment
      )
        .then(comment => {
          res
            .status(201)
            .location(path.join(req.originalUrl, comment.id))
            .json(comment)
        })
        .catch(next)
    })

/* verbs for soecufuc comment */
commentsRouter
  .route('/:comment_id')
    .all((req, res, next) => {
      CommentService.hasComment(
        req.app.get('db'),
        req.params.comment_id
      )
        .then(hasComment => {
          if (!hasComment)
            return res.status(404).json({ error: { message: `Comment doesn't exist` } })
          next()
        })
        .catch(next)
    })

    .get((req, res, next) => {
      CommentService.getById(
        req.app.get('db'),
        req.params.comment_id
      )
        .then(comment => {
          res.json(comment)
        })
        .catch(next)
    })

    // update comment information, without comments
    .patch(jsonBodyParser, (req, res, next) => {
      const { text } = req.body
      if (text == null)
        return res.status(400).json({
          error: { message: `Request body must contain'text'` }
        })

      const newFields = {}
      if (text) newFields.text = text

      CommentService.updateComment(
        req.app.get('db'),
        req.params.comment_id,
        newFields
      )
        .then(() => {
          res.status(204).end()
        })
        .catch(next)
    })

    // remove an comment, comments should cascade
    .delete((req, res, next) => {
      CommentService.deleteComment(
        req.app.get('db'),
        req.params.comment_id
      )
        .then(() => {
          res.status(204).end()
        })
        .catch(next)
    })

module.exports = commentsRouter
