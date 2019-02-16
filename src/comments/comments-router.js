const express = require('express')
const path = require('path')
const { requireAuth } = require('../middleware/jwt-auth')
const CommentsService = require('./comments-service')

const commentsRouter = express.Router()
const jsonBodyParser = express.json()

const serializeComment = comment => ({
  id: comment.id,
  article_id: comment.article_id,
  user_id: comment.user_id,
  text: xss(comment.text),
})

commentsRouter
  .route('/')
  .all(requireAuth)
  .post(jsonBodyParser, (req, res, next) => {
    const { user } = req
    const { article_id, text } = req.body
    const newComment = { article_id, text }

    for (const [key, value] of Object.entries(newComment))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })

    newComment.user_id = user.id

    CommentsService.insertComment(
      req.app.get('db'),
      newComment
    )
      .then(comment => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, comment.id))
          .json({
            ...comment,
            user: {
              id: user.id,
              user_name: user.user_name,
              full_name: user.full_name,
              nick_name: user.nick_name,
              date_created: user.date_created,
              date_modified: user.date_modified,
            }
          })
      })
      .catch(next)
  })

commentsRouter
  .route('/:comment_id')
  .all(requireAuth)
  .all((req, res, next) => {
    CommentsService.getById(
      req.app.get('db'),
      req.params.comment_id
    )
      .then(comment => {
        if (!comment)
          return res.status(404).json({
            error: `Comment doesn't exist`
          })
        res.comment = comment
        next()
      })
      .catch(next)
  })
  .get((req, res) => {
    res.json(serializeComment(res.comment))
  })
  .patch(jsonBodyParser, (req, res, next) => {
    const { text } = req.body
    if (text == null)
      return res.status(400).json({
        error: `Request body must contain'text'`
      })

    if (res.comment.user_id !== req.user.id)
      return res.status(400).json({
        error: `Comment can only be updated by owner`
      })

    const newFields = {}
    if (text) newFields.text = text

    CommentsService.updateComment(
      req.app.get('db'),
      req.params.comment_id,
      newFields
    )
      .then(() => {
        res.status(204).end()
      })
      .catch(next)
  })
  .delete((req, res, next) => {
    if (res.comment.user_id !== req.user.id)
      return res.status(400).json({
        error: `Comment can only be updated by owner`
      })

    CommentsService.deleteComment(
      req.app.get('db'),
      req.params.comment_id
    )
      .then(() => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = commentsRouter
