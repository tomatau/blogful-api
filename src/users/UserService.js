
const UserService = {
  getAll(db) {
    return db
      .from('blogful_user')
      .select('*')
  },

  getById(db, user_id) {
    return db
      .from('blogful_user')
      .where({
        id: user_id
      })
      .first()
  },

  hasUser(db, id) {
    return db('blogful_user')
      .select('id')
      .where({ id })
      .first()
      .then(user => !!user)
  },

  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into('blogful_user')
      .returning('*')
      .then(([user]) => user)
  },

  updateUser(db, id, newUserFields) {
    return db('blogful_user')
      .where({ id })
      .update(newUserFields)
  },

  deleteUser(db, id) {
    return db('blogful_user')
      .where({ id })
      .delete()
  },

  hasUserWithEmail(db, email) {
    return db('blogful_user')
      .where({ email })
      .first()
      .then(user => !!user)
  },
}

module.exports = UserService
