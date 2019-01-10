const express = require('express')
const ArticleService = require('./ArticleService')

const articlesRouter = express.Router()

/* verbs for generic articles */
articlesRouter
  .get('/', (req, res, next) => {
    ArticleService.getAll(req.db)
      .then(articles => {
        res.json(articles)
      })
      .catch(next)
  })
  // .post() // add a new article without comments

/* verbs for specific articles */
articlesRouter
  .route('/:article_id/')
    .get((req, res, next) => {
      ArticleService.getById(req.db, req.params.article_id)
        .then(articles => {
          res.json(articles)
        })
        .catch(next)
    })
  // .patch() // update article information, without comments
  // .delete() // remove an article, comments should cascade

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
    // .post() // add a post to an article ? // use POST /comment instead

module.exports = articlesRouter
