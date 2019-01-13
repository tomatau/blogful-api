const express = require('express')
const ArticleService = require('./service')
const TagService = require('../tags/service')

const articlesRouter = express.Router()
const jsonBodyParser = express.json()

const checkArticleExists = (req, res, next) => {
  ArticleService.hasArticle(req.params.article_id)
    .then(hasArticle => {
      if (!hasArticle)
        return res.status(404).json({
          error: { message: "Article doesn't exist" }
        })
      next()
    })
    .catch(next)
}

/* verbs for generic articles */
articlesRouter
  .route('/')
  .get((req, res, next) => {
    ArticleService.getAll()
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

    ArticleService.insertArticle(newArticle)
      .then(article => {
        res.status(201).json(article)
      })
  })

/* verbs for specific articles */
articlesRouter
  .route('/:article_id/')
  .all(checkArticleExists)

  .get((req, res, next) => {
    ArticleService.getById(req.params.article_id)
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
        error: { message: "Request body must content either 'title' or 'content'" }
      })
    const newFields = {}
    if (title) newFields.title = title
    if (content) newFields.content = content
    ArticleService.updateArticle(req.params.article_id, newFields)
      .then(() => {
        res.status(204).end()
      })
      .catch(next)
  })

  // remove an article, comments should cascade
  .delete((req, res, next) => {
    ArticleService.deleteArticle(req.params.article_id)
      .then(() => {
        res.status(204).end()
      })
      .catch(next)
  })

/* verbs for specific article's comments (probably don't need this) */
articlesRouter
  .route('/:article_id/comment/')
  .all(checkArticleExists)

  .get((req, res, next) => {
    ArticleService.getCommentsForArticle(
      req.params.article_id
    )
      .then(comments => {
        res.json(comments)
      })
      .catch(next)
  })

articlesRouter
  .route('/:article_id/tag/')
  .all(checkArticleExists)

  .get((req, res, next) => {
    ArticleService.getTagsForArticle(req.params.article_id)
      .then(tags => {
        res.json(tags)
      })
      .catch(next)
  })

  // add a tag to an article
  .post(jsonBodyParser, (req, res, next) => {
    const { tag_id } = req.body

    if (tag_id == null)
      return res.status(400).json({
        error: { message: "Missing 'tag_id' in request body" }
      })

    ArticleService.hasArticleTag(
      req.params.article_id,
      tag_id
    ).then(hasArticleTag => {
      if (hasArticleTag)
        return res.status(400).json({
          error: { message: 'Article already has tag' }
        })

      return ArticleService.addArticleTag(
        req.params.article_id,
        tag_id
      )
        .then(tagsForArticle => {
          res.status(201).json(tagsForArticle)
        })
    })
      .catch(next)
  })


articlesRouter
  .route('/:article_id/tag/:tag_id')
  .all(checkArticleExists)
  .all((req, res, next) => {
    ArticleService.hasArticleTag(
      req.params.article_id,
      req.params.tag_id
    )
      .then(hasArticleTag => {
        if (!hasArticleTag)
          return res.status(404).json({
            error: { message: "Article doesn't have tag!" }
          })
        next()
      })
      .catch(next)
  })

  // remove tag from article
  .delete((req, res, next) => {
    ArticleService.deleteArticleTag(
      req.params.article_id,
      req.params.tag_id
    )
      .then(() => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = articlesRouter
