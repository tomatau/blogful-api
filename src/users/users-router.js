const express = require('express')
const path = require('path')
const xss = require('xss')
const AuthService = require('../auth/auth-service')
const { requireAuth, requireAdmin } = require('../middleware/jwt-auth')
const UsersService = require('./users-service')

const usersRouter = express.Router()
const jsonBodyParser = express.json()

const serializeUser = user => ({
  id: user.id,
  full_name: xss(user.full_name),
  user_name: xss(user.user_name),
  nick_name: xss(user.nick_name),
  date_created: user.date_created,
})

usersRouter
  .route('/')
  .get(requireAuth, requireAdmin, (req, res, next) => {
    UsersService.getAll(req.app.get('db'))
      .then(users => {
        res.json(users.map(serializeUser))
      })
      .catch(next)
  })
  .post(jsonBodyParser, (req, res, next) => {
    const { full_name, user_name, nick_name, password } = req.body

    for (const field of ['full_name', 'user_name', 'password'])
      if (!req.body[field] || req.body[field] == null) {
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        })
      }

    const passwordError = UsersService.validatePassword(password)

    if (passwordError) {
      return res.status(400).json({
        error: passwordError
      })
    }

    UsersService.hasUserWithUserName(
      req.app.get('db'),
      user_name
    )
      .then(hasUserWithUserName => {
        if (hasUserWithUserName)
          return res.status(400).json({
            error: `User name already taken`
          })

        return AuthService.hashPassword(password)
      })
      .then(hashedPassword => {
        const newUser = {
          full_name,
          user_name,
          nick_name,
          date_created: 'now()',
          password: hashedPassword
        }

        return UsersService.insertUser(
          req.app.get('db'),
          newUser
        )
          .then(user => {
            res
              .status(201)
              .location(path.posix.join(req.originalUrl, `/${user.id}`))
              .json(serializeUser(user))
          })
      })
      .catch(next)
  })

usersRouter
  .route('/:user_id')
  .all(requireAuth)
  .all((req, res, next) => {
    UsersService.getById(
      req.app.get('db'),
      req.params.user_id
    )
      .then(user => {
        if (!user)
          return res.status(404).json({
            error: `User doesn't exist`
          })
        res.user = user
        next()
        return null
      })
      .catch(next)
  })
  // TODO: permissions by role
  .get((req, res) => {
    if (res.user.id !== req.user.id)
      return res.status(400).json({
        error: `Comment can only be read by user`
      })

    res.json(serializeUser(res.user))
  })
  // TODO: permissions by role
  .patch(jsonBodyParser, (req, res, next) => {
    // don't let users change username
    const { full_name, nick_name, password } = req.body
    const userToUpdate = { full_name, nick_name, password }

    const numberOfValues = Object.values(userToUpdate).filter(Boolean).length

    if (numberOfValues === 0)
      return res.status(400).json({
        error: `Request body must contain either 'full_name', 'nickname', 'password'`
      })

    if (res.user.id !== req.user.id)
      return res.status(400).json({
        error: `User can only be updated by self`
      })

    const passwordError = UsersService.validatePassword(userToUpdate.password)

    if (passwordError) {
      return res.status(400).json({
        error: passwordError
      })
    }

    userToUpdate.date_modified = 'now()'

    return UsersService.updateUser(
      req.app.get('db'),
      req.params.user_id,
      userToUpdate
    )
      .then(() => {
        res.status(204).end()
      })
      .catch(next)
  })
  // TODO: permissions by role
  .delete((req, res, next) => {
    if (res.user.id !== req.user.id)
      return res.status(400).json({
        error: `User can only be deleted by owner`
      })

    UsersService.deleteUser(
      req.app.get('db'),
      req.params.user_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = usersRouter
