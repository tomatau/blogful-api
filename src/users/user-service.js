
const UserService = {
  getAll(db) {
    return db
      .from('blogful_users')
      .select('*')
  },

  getById(db, user_id) {
    return db
      .from('blogful_users')
      .where({
        id: user_id
      })
      .first()
  },

  hasUser(db, id) {
    return db('blogful_users')
      .select('id')
      .where({ id })
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

  hasUserWithEmail(db, email) {
    return db('blogful_users')
      .where({ email })
      .first()
      .then(user => !!user)
  },
}

module.exports = UserService
