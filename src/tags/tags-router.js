const express = require('express')
const path = require('path')
const TagService = require('./tag-service')

const tagsRouter = express.Router()
const jsonBodyParser = express.json()

/* verbs for general tags */
tagsRouter
  .route('/')
  .get((req, res, next) => {
    TagService.getAll(req.app.get('db'))
      .then(tags => {
        res.json(tags)
      })
      .catch(next)
  })
  .post(jsonBodyParser, (req, res, next) => {
    const { text } = req.body
    const newTag = { text }

    for (const [key, value] of Object.entries(newTag))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })

    TagService.insertTag(
      req.app.get('db'),
      newTag
    )
      .then(tag => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, tag.id))
          .json(tag)
      })
      .catch(next)
  })


tagsRouter
  .route('/:tag_id')
  .all((req, res, next) => {
    TagService.hasTag(
      req.app.get('db'),
      req.params.tag_id
    )
      .then(hasTag => {
        if (!hasTag)
          return res.status(404).json({
            error: `Tag doesn't exist`
          })
        next()
        return null
      })
      .catch(next)
  })
  .get((req, res, next) => {
    TagService.getById(
      req.app.get('db'),
      req.params.tag_id
    )
      .then(tag => {
        res.json(tag)
      })
      .catch(next)
  })
  .patch(jsonBodyParser, (req, res, next) => {
    const { text } = req.body
    if (text == null)
      return res.status(400).json({
        error: `Request body must contain'text'`
      })

    const newFields = {}
    if (text) newFields.text = text

    TagService.updateTag(
      req.app.get('db'),
      req.params.tag_id,
      newFields
    )
      .then(() => {
        res.status(204).end()
      })
      .catch(next)
  })
  .delete((req, res, next) => {
    TagService.getArticleIdsWithTag(
      req.app.get('db'),
      req.params.tag_id
    )
      .then(articleIdsWithTag => {
        if (articleIdsWithTag.length)
          return res.status(400).json({
            error: `Tag is being used in articles and can't be removed`
          })

        return TagService.deleteTag(
          req.app.get('db'),
          req.params.tag_id
        )
          .then(() => {
            res.status(204).end()
          })
      })
      .catch(next)
  })

module.exports = tagsRouter
