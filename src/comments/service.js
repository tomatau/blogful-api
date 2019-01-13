const knex = require('../knex');

const CommentService = {
  getById(comment_id) {
    return knex
      .from('blogful_comment')
      .where({
        id: comment_id
      })
      .first()
  },

  hasComment(id) {
    return knex('blogful_comment')
      .select('id')
      .where({ id })
      .first()
      .then(comment => !!comment)
  },

  insertComment(newComment) {
    return knex
      .insert(newComment)
      .into('blogful_comment')
      .returning('*')
      .then(([comment]) => comment)
  },

  updateComment(id, newCommentFields) {
    return knex('blogful_comment')
      .where({ id })
      .update(newCommentFields)
  },

  deleteComment(id) {
    return knex('blogful_comment')
      .where({ id })
      .delete()
  },
}

module.exports = CommentService
