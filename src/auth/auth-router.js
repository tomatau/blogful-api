const express = require('express')
const AuthService = require('./auth-service')
const { requireAuth } = require('../middleware/jwt-auth')

const authRouter = express.Router()
const jsonBodyParser = express.json()

authRouter.post('/login', jsonBodyParser, (req, res, next) => {
    // TODO: restrict login attempts
  AuthService.getUserWithUserName(
    req.app.get('db'),
    req.body.user_name
  )
    .then(user => {
      if (!user)
        return res.status(400).json({
          error: 'Incorrect user_name or password',
        })

      return AuthService.comparePasswords(req.body.password, user.password)
        .then(hasMatch => {
          if (!hasMatch) {
            return res.status(400).json({
              error: 'Incorrect user_name or password',
            })
          }
          // TODO: reset login attempts

          const sub = user.user_name
          const payload = { user_id: user.id }
          res.send({
            authToken: AuthService.createJwt(sub, payload),
          })
        })
    })
    .catch(next)
})

authRouter.post('/refresh', requireAuth, (req, res) => {
  const sub = req.user.user_name
  const payload = { user_id: req.user.id }
  res.send({
    authToken: AuthService.createJwt(sub, payload),
  })
})

module.exports = authRouter
