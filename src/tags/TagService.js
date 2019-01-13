const knex = require('../knex');

const TagService = {
  getAll() {
    return knex
      .from('blogful_tag')
      .select('*')
  },

  getById(id) {
    return knex
      .from('blogful_tag')
      .where({ id })
      .first()
  },

  hasTag(id) {
    return knex('blogful_tag')
      .select('id')
      .where({ id })
      .first()
      .then(tag => !!tag)
  },

  insertTag(newTag) {
    return knex
      .insert(newTag)
      .into('blogful_tag')
      .returning('*')
      .then(([tag]) => tag)
  },

  updateTag(id, newTagFields) {
    return knex('blogful_tag')
      .where({ id })
      .update(newTagFields)
  },

  deleteTag(id) {
    return knex('blogful_tag')
      .where({ id })
      .delete()
  },

  getArticleIdsWithTag(tag_id) {
    return knex('blogful_article_tag')
      .select('*')
      .where({ tag_id })
  }
}

module.exports = TagService
