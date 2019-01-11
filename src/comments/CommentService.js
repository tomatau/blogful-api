
const CommentService = {
  getById(db, comment_id) {
    return db
      .from('blogful_comment')
      .where({
        id: comment_id
      })
      .first()
  },

  hasComment(db, id) {
    return db('blogful_comment')
      .select('id')
      .where({ id })
      .first()
      .then(comment => !!comment)
  },

  insertComment(db, newComment) {
    return db
      .insert(newComment)
      .into('blogful_comment')
      .returning('*')
      .then(([comment]) => comment)
  },

  updateComment(db, id, newCommentFields) {
    return db('blogful_comment')
      .where({ id })
      .update(newCommentFields)
  },

  deleteComment(db, id) {
    return db('blogful_comment')
      .where({ id })
      .delete()
  },
}

module.exports = CommentService
