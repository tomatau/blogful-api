
const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d.*)(?=.*\W.*)[a-zA-Z0-9\S]+/

const UsersService = {
  getAll(db) {
    return db
      .from('blogful_users')
      .select('*')
  },

  hasUserWithUserName(db, user_name) {
    return db('blogful_users')
      .where({ user_name })
      .first()
      .then(user => !!user)
  },

  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into('blogful_users')
      .returning('*')
      .then(([user]) => user)
  },

  getById(db, id) {
    return db
      .from('blogful_users')
      .where({ id })
      .first()
  },

  updateUser(db, id, newUserFields) {
    return db('blogful_users')
      .where({ id })
      .update(newUserFields)
  },

  deleteUser(db, id) {
    return db('blogful_users')
      .where({ id })
      .delete()
  },

  validatePassword(password) {
    if (!password) {
      return 'Must supply password'
    }
    if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must not start or end with empty spaces'
    }
    if (password.length < 8) {
      return 'Password be longer than 8 characters'
    }
    if (password.length > 72) {
      return 'Password be less than 72 characters'
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return 'Password must contain one upper case, lower case, number and special character'
    }
    return null
  },
  /* hasUser(db, id) {
    return db('blogful_users')
      .select('id')
      .where({ id })
      .first()
      .then(user => !!user)
  }, */
}

module.exports = UsersService
