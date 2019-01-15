
const TagService = {
  getAll(db) {
    return db
      .from('blogful_tag')
      .select('*')
  },

  getById(db, id) {
    return db
      .from('blogful_tag')
      .where({ id })
      .first()
  },

  hasTag(db, id) {
    return db('blogful_tag')
      .select('id')
      .where({ id })
      .first()
      .then(tag => !!tag)
  },

  insertTag(db, newTag) {
    return db
      .insert(newTag)
      .into('blogful_tag')
      .returning('*')
      .then(([tag]) => tag)
  },

  updateTag(db, id, newTagFields) {
    return db('blogful_tag')
      .where({ id })
      .update(newTagFields)
  },

  deleteTag(db, id) {
    return db('blogful_tag')
      .where({ id })
      .delete()
  },

  getArticleIdsWithTag(db, tag_id) {
    return db('blogful_article_tag')
      .select('*')
      .where({ tag_id })
  }
}

module.exports = TagService
