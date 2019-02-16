const express = require('express')
const path = require('path')
const xss = require('xss')
const { requireAuth } = require('../middleware/jwt-auth')
const ArticlesService = require('./articles-service')

const articlesRouter = express.Router()
const jsonBodyParser = express.json()

const serializeArticle = article => ({
  id: article.id,
  style: article.style,
  title: xss(article.title),
  content: xss(article.content),
  date_published: article.date_published,
  author: article.author || {},
  tags: article.tags || [],
  number_of_comments: Number(article.number_of_comments) || 0,
})

articlesRouter.route('/')
  .get((req, res, next) => {
    ArticlesService.getAllAdv(req.app.get('db'))
      .then(articles => {
        res.json(articles.map(serializeArticle))
      })
      .catch(next)
  })
  .post(requireAuth, jsonBodyParser, (req, res, next) => {
    const { title, content, style } = req.body
    const newArticle = { title, content, style }

    for (const [key, value] of Object.entries(newArticle))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })

    newArticle.author_id = req.user.id

    ArticlesService.insertArticle(
      req.app.get('db'),
      newArticle
    )
      .then(article => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, article.id))
          .json(serializeArticle({
            ...article,
            author: {
              id: req.user.id,
              user_name: req.user.user_name,
              full_name: req.user.full_name,
              nick_name: req.user.nick_name,
              date_created: req.user.date_created,
              date_modified: req.user.date_modified
            }
          }))
      })
      .catch(next)
  })

articlesRouter.route('/:article_id/')
  .all(requireAuth)
  .all(checkArticleExists)
  .get((req, res) => {
    res.json(serializeArticle(res.article))
  })
  // TODO: permissions by role
  .patch(jsonBodyParser, (req, res, next) => {
    const { title, content, style } = req.body
    const articleToUpdate = { title, content, style }

    const presentValuesArr = Object.values(articleToUpdate).filter(Boolean)

    if (presentValuesArr.length === 0)
      return res.status(400).json({
        error: `Request body must content either 'title', 'style' or 'content'`
      })

    if (res.article.author.id !== req.user.id)
      return res.status(400).json({
        error: `Article can only be updated by author`
      })

    ArticlesService.updateArticle(
      req.app.get('db'),
      req.params.article_id,
      articleToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  // TODO: permissions by role
  .delete((req, res, next) => {
    if (res.article.author.id !== req.user.id)
      return res.status(400).json({
        error: `Article can only be deleted by author`
      })

    ArticlesService.deleteArticle(
      req.app.get('db'),
      req.params.article_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

articlesRouter.route('/:article_id/comments/')
  .all(requireAuth)
  .all(checkArticleExists)
  .get((req, res, next) => {
    ArticlesService.getCommentsForArticle(
      req.app.get('db'),
      req.params.article_id
    ).then(comments => {
      res.json(comments)
    })
    .catch(next)
  })

articlesRouter.route('/:article_id/tags/')
  .all(requireAuth)
  .all(checkArticleExists)
  .get((req, res) => {
    res.json(res.article.tags)
  })
  // TODO: permissions by role
  .post(jsonBodyParser, (req, res, next) => {
    const { tag_id } = req.body

    if (tag_id == null)
      return res.status(400).json({
        error: `Missing 'tag_id' in request body`
      })

    if (res.article.author.id !== req.user.id)
      return res.status(400).json({
        error: `Article tags can only be updated by author`
      })

    ArticlesService.hasArticleTag(
      req.app.get('db'),
      req.params.article_id,
      tag_id,
    )
      .then(hasArticleTag => {
        if (hasArticleTag)
          return res.status(400).json({
            error: `Article already has tag`
          })

        return ArticlesService.addArticleTag(
          req.app.get('db'),
          req.params.article_id,
          tag_id,
        )
          .then(tagsForArticle => {
            res.status(201).json(tagsForArticle)
          })
      })
      .catch(next)
  })

articlesRouter.route('/:article_id/tags/:tag_id')
  .all(requireAuth)
  .all(checkArticleExists)
  .all((req, res, next) => {
    ArticlesService.hasArticleTag(
      req.app.get('db'),
      req.params.article_id,
      req.params.tag_id,
    )
      .then(hasArticleTag => {
        if (!hasArticleTag)
          return res.status(404).json({
            error: `Article doesn't have tag!`
          })
        next()
      })
      .catch(next)
  })
  // TODO: permissions by role
  .delete((req, res, next) => {
    if (res.article.author.id !== req.user.id)
      return res.status(400).json({
        error: `Article tags can only be removed by author`
      })

    ArticlesService.deleteArticleTag(
      req.app.get('db'),
      req.params.article_id,
      req.params.tag_id,
    )
      .then(() => {
        res.status(204).end()
      })
      .catch(next)
  })

async function checkArticleExists(req, res, next) {
  try {
    const article = await ArticlesService.getByIdAdv(
      req.app.get('db'),
      req.params.article_id
    )

    if (!article)
      return res.status(404).json({
        error: `Article doesn't exist`
      })

    res.article = article
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = articlesRouter
