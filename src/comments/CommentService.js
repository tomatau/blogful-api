
const CommentService = {
  getById(db, comment_id) {
    return db
      .from('blogful_comment AS comm')
      .where({
        id: comment_id
      })
      .first()
  },
}

module.exports = CommentService
