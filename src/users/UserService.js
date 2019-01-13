
const knex = require('../knex');

const UserService = {
  getAll() {
    return knex
      .from('blogful_user')
      .select('*')
  },

  getById(user_id) {
    return knex
      .from('blogful_user')
      .where({
        id: user_id
      })
      .first()
  },

  hasUser(id) {
    return knex('blogful_user')
      .select('id')
      .where({ id })
      .first()
      .then(user => !!user)
  },

  insertUser(newUser) {
    return knex
      .insert(newUser)
      .into('blogful_user')
      .returning('*')
      .then(([user]) => user)
  },

  updateUser(id, newUserFields) {
    return knex('blogful_user')
      .where({ id })
      .update(newUserFields)
  },

  deleteUser(id) {
    return knex('blogful_user')
      .where({ id })
      .delete()
  },

  hasUserWithEmail(email) {
    return knex('blogful_user')
      .where({ email })
      .first()
      .then(user => !!user)
  },
}

module.exports = UserService
