const express = require('express')
const CommentService = require('./CommentService')

const commentsRouter = express.Router()

/* verbs for general comments */
commentsRouter
  .route('/')
  // .post() // add a comment, requires { article_id }

/* verbs for soecufuc comment */
commentsRouter
  .route('/:comment_id')
    .get((req, res, next) => {
      CommentService.getById(req.db, req.params.comment_id)
        .then(comment => {
          res.json(comment)
        })
        .catch(next)
    })
    // .patch()
    // .delete()

module.exports = commentsRouter
