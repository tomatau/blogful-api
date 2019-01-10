
const ArticleService = {
  getAll(db) {
    return Promise.all([
      db.from('blogful_article').select('*'),
      db.from('blogful_comment').select('*'),
    ]).then(([ articles, comments ]) => {
      return articles.map(article => {
        article.comments = comments.filter(
          comment => comment.article_id === article.id
        )
        return article
      })
    })
  },

  // advanced version of above, uses single query to optimize
  getAllAdv(db) {
    return db
      .from('blogful_article AS art')
      .select(
        'art.id',
        'art.title',
        'art.date_published',
        'art.content',
        // array of comment objects per article
        db.raw(
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
        ),
      )
      .leftJoin(
        'blogful_comment AS comm',
        'art.id',
        'comm.article_id',
      )
      .groupBy('art.id')
  },

  hasArticle(db, id) {
    return db('blogful_article')
      .select('id')
      .where({ id })
      .first()
      .then(article => !!article)
  },

  getById(db, id) {
    return Promise.all([
      db.from('blogful_article').select('*').where('id', id).first(),
      this.getCommentsForArticle(db, id),
    ]).then(([article, comments]) => {
      article.comments = comments
      return article
    })
  },

  // uses advanced version of getAll
  getByIdAdv(db, id) {
    return this.getAllAdv(db)
      .where('art.id', id)
      .first()
  },

  getCommentsForArticle(db, article_id) {
    return db.from('blogful_comment') .where({ article_id })
  },

  insertArticle(db, newArticle) {
    return db
      .insert(newArticle)
      .into('blogful_article')
      .returning('*')
      .then(([article]) => {
        article.comments = []
        return article
      })
  },

  updateArticle(db, id, newArticleFields) {
    return db('blogful_article')
      .where({ id })
      .update(newArticleFields)
  },

  deleteArticle(db, id) {
    return db('blogful_article')
      .where({ id })
      .delete()
  },
}

module.exports = ArticleService
