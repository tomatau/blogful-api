const AuthService = require('../auth/auth-service')

function requireAuth(req, res, next) {
  const authToken = req.get('Authorization') || ''
  let bearerToken

  if (authToken.toLowerCase().startsWith('bearer ')) {
    bearerToken = authToken.slice(7, authToken.length)
  } else {
    return res.status(401).json({ error: 'Unauthorized request' })
  }

  try {
    const payload = AuthService.verifyJwt(bearerToken)

    AuthService.getUserWithUserName(
      req.app.get('db'),
      payload.sub,
    )
      .then(user => {
        if (!user) return res.status(401).json({ error: 'Unauthorized request' })

        req.user = user
        next()
      })
      .catch(err => {
        console.error(err)
        next(err)
      })
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized request' })
  }
}

// depends on requireAuth happening first
function requireAdmin(req, res, next) {
  if (req.user.user_name !== 'tomht') {
    return res.status(401).json({ error: 'Unauthorized request' })
  }

  return next()
}

module.exports = {
  requireAuth,
  requireAdmin,
}
