const express = require('express')
const ArticleService = require('./ArticleService')

const articlesRouter = express.Router()
const jsonBodyParser = express.json()

/* verbs for generic articles */
articlesRouter
  .route('/')
    .get((req, res, next) => {
      ArticleService.getAll(req.db)
        .then(articles => {
          res.json(articles)
        })
        .catch(next)
    })
    // add a new article without comments
    .post(jsonBodyParser, (req, res, next) => {
      const { title, content, author_id } = req.body
      const newArticle = { title, content, author_id }

      for (const [key, value] of Object.entries(newArticle))
        if (value == null)
          return res.status(400).json({
            error: { message: `Missing '${key}' in request body` }
          })

      ArticleService.insertArticle(req.db, newArticle)
        .then(article => {
          res.status(201).json(article)
        })
    })

/* verbs for specific articles */
articlesRouter
  .route('/:article_id/')
    .all((req, res, next) => {
      ArticleService.hasArticle(req.db, req.params.article_id)
        .then(hasArticle => {
          if (!hasArticle)
            return res.status(404).json({ error: { message: `Article doesn't exist` } })
          next()
        })
        .catch(next)
    })
    .get((req, res, next) => {
      ArticleService.getById(req.db, req.params.article_id)
        .then(articles => {
          res.json(articles)
        })
        .catch(next)
    })
    // update article information, without comments
    .patch(jsonBodyParser, (req, res, next) => {
      const { title, content } = req.body
      if (title == null && content == null)
        return res.status(400).json({
          error: { message: `Request body must content either 'title' or 'content'` }
        })

      const newFields = {}
      if (title) newFields.title = title
      if (content) newFields.content = content

      ArticleService.updateArticle(req.db, req.params.article_id, newFields)
        .then(() => {
          res.status(204).end()
        })
        .catch(next)
    })
    // remove an article, comments should cascade
    .delete((req, res, next) => {
      ArticleService.deleteArticle(req.db, req.params.article_id)
        .then(() => {
          res.status(204).end()
        })
        .catch(next)
    })

/* verbs for specific article's comments (probably don't need this) */
articlesRouter
  .route('/:article_id/comment/')
    .get((req, res, next) => {
      ArticleService.getCommentsForArticle(req.db, req.params.article_id)
        .then(comments => {
          res.json(comments)
        })
        .catch(next)
    })

module.exports = articlesRouter
