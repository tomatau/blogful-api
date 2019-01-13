const knex = require('../knex');

const ArticleService = {
  getAll() {
    return Promise.all([
      knex.from('blogful_article').select('*'),
      knex.from('blogful_comment').select('*'),
      knex.from('blogful_tag').select('*'),
      knex.from('blogful_article_tag').select('*'),
    ]).then(([articles, comments, tags, articleTags]) => {
      return articles.map(article => {
        article.comments = comments.filter(
          comment => comment.article_id === article.id
        )
        article.tags = articleTags
          .filter(artTag => artTag.article_id === article.id)
          .map(artTag => tags.find(tag => tag.id === artTag.tag_id))
        return article
      })
    })
  },

  // advanced version of above, uses single query to optimize
  getAllAdv() {
    return knex
      .from('blogful_article AS art')
      .select(
        'art.id',
        'art.title',
        'art.date_published',
        'art.content',
        // array of comment objects per article
        knex.raw(
          // remove nulls from array and convert nulls to empty array
          `COALESCE(
            JSON_AGG(
              TO_JSON(comm.*)
            )
            FILTER(
              WHERE comm.id IS NOT NULL
            ),
            '[]'
          ) AS comments`
        )
      )
      .leftJoin(
        'blogful_comment AS comm',
        'art.id',
        'comm.article_id'
      )
      .groupBy('art.id')
    /* adding tags as part of this gets very complicated... `
        SELECT
          art.id,
          art.title,
          art.date_published,
          art.content,
          COALESCE(
              JSON_AGG(
                TO_JSON(comm.*)
              )
              FILTER( WHERE comm.id IS NOT NULL )
            ,
              '[]'
          ) AS comments

        FROM
          blogful_article AS art

        LEFT JOIN
          blogful_comment AS comm
        ON
          art.id = comm.article_id

        GROUP BY art.id;
      ` */
  },

  hasArticle(id) {
    return knex
      .select('id')
      .from('blogful_article')
      .where({ id })
      .first()
      .then(article => !!article)

    // alternative solution:
    //
    // return knex.raw(
    //   'SELECT exists(SELECT 1 FROM blogful_article WHERE id=?)',
    //   [id]
    // ).then(({ rows }) => rows[0].exists)
  },

  getById(id) {
    return Promise.all([
      knex.from('blogful_article').select('*').where('id', id).first(),
      this.getCommentsForArticle(id),
      this.getTagsForArticle(id),
    ]).then(([article, comments, tags]) => {
      article.comments = comments
      article.tags = tags
      return article
    })
  },

  // uses advanced version of getAll
  getByIdAdv(id) {
    return this.getAllAdv(knex)
      .where('art.id', id)
      .first()
  },

  getCommentsForArticle(article_id) {
    return knex.select('*').from('blogful_comment').where({ article_id })
  },

  insertArticle(newArticle) {
    return knex
      .insert(newArticle)
      .into('blogful_article')
      .returning('*')
      .then(([article]) => {
        article.comments = []
        return article
      })
  },

  updateArticle(id, newArticleFields) {
    return knex('blogful_article')
      .where({ id })
      .update(newArticleFields)
  },

  deleteArticle(id) {
    return knex('blogful_article')
      .where({ id })
      .delete()
  },

  getTagsForArticle(article_id) {
    return knex('blogful_tag AS tag')
      .select('tag.id', 'tag.text')
      .join(
        'blogful_article_tag AS artag',
        'tag.id',
        'artag.tag_id'
      )
      .where(
        'artag.article_id',
        article_id
      )
  },

  addArticleTag(article_id, tag_id) {
    return knex
      .insert({ article_id, tag_id })
      .into('blogful_article_tag')
      .then(() =>
        this.getTagsForArticle(knex, article_id)
      )
  },

  deleteArticleTag(article_id, tag_id) {
    return knex('blogful_article_tag')
      .where({ article_id, tag_id })
      .delete()
  },

  hasArticleTag(article_id, tag_id) {
    return knex('blogful_article_tag')
      .select('article_id', 'tag_id')
      .where({ article_id, tag_id })
      .first()
      .then(articleTag => !!articleTag)
  },
}

module.exports = ArticleService
