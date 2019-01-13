const express = require('express')
const UserService = require('./service')

const usersRouter = express.Router()
const jsonBodyParser = express.json()

/* verbs for general users */
usersRouter
  .route('/')
  .get((req, res, next) => {
    UserService.getAll()
      .then(users => {
        res.json(users)
      })
      .catch(next)
  })
  // add a user, requires { article_id }
  .post(jsonBodyParser, (req, res, next) => {
    const { first_name, last_name, email, screen_name } = req.body
    const newUser = { first_name, last_name, email, screen_name }

    const requiredFields = ['email', 'screen_name']
    for (const field of requiredFields)
      if (newUser[field] == null)
        return res.status(400).json({
          error: { message: `Missing '${field}' in request body` }
        })

    UserService.hasUserWithEmail(newUser.email)
      .then(hasUserWithEmail => {
        if (hasUserWithEmail)
          return res.status(400).json({
            error: { message: 'Email already taken' }
          })

        return UserService.insertUser(newUser)
          .then(user => {
            res.status(201).json(user)
          })
      })
      .catch(next)
  })

/* verbs for soecufuc user */
usersRouter
  .route('/:user_id')
  .all((req, res, next) => {
    UserService.hasUser(req.params.user_id)
      .then(hasUser => {
        if (!hasUser)
          return res.status(404).json({
            error: { message: 'User doesn\'t exist' }
          })
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    UserService.getById(req.params.user_id)
      .then(user => {
        res.json(user)
      })
      .catch(next)
  })
  // update user information, without users
  .patch(jsonBodyParser, (req, res, next) => {
    const { first_name, last_name, email, screen_name } = req.body
    if (
      first_name == null
      && last_name == null
      && email == null
      && screen_name == null
    )
      return res.status(400).json({
        error: {
          message: 'Request body must contain either \'first_name\', \'last_name\', \'email\' or \'screen_name\''
        }
      })

    const newFields = {
      date_modified: 'now()'
    }
    if (first_name) newFields.first_name = first_name
    if (last_name) newFields.last_name = last_name
    if (email) newFields.email = email
    if (screen_name) newFields.screen_name = screen_name

    UserService.hasUserWithEmail(newFields.email)
      .then(hasUserWithEmail => {
        if (hasUserWithEmail)
          return res.status(400).json({
            error: { message: 'Email already taken' }
          })

        return UserService.updateUser(
          req.params.user_id, newFields
        )
          .then(() => {
            res.status(204).end()
          })
      })
      .catch(next)
  })
  // remove an user, users should cascade
  .delete((req, res, next) => {
    UserService.deleteUser(req.params.user_id)
      .then(() => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = usersRouter
