
const ArticleService = {
  getAll(db) {
    return Promise.all([
      db.from('blogful_article').select('*'),
      db.from('blogful_comment').select('*'),
      db.from('blogful_tag').select('*'),
      db.from('blogful_article_tag').select('*'),
    ]).then(([ articles, comments, tags, articleTags ]) => {
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
  getAllAdv(db) {
    return db
      .from('blogful_article AS art')
      .select(
        'art.id',
        'art.title',
        'art.date_published',
        'art.content',
        db.raw(
          `COALESCE(
            json_agg(DISTINCT tag) filter(WHERE tag.id IS NOT NULL),
            '[]'
          ) AS tags`
        ),
        db.raw(
          `COALESCE(
            json_agg(DISTINCT comm) filter(WHERE comm.id IS NOT NULL),
            '[]'
          ) AS comments`
        ),
      )
      .leftJoin('blogful_article_tag AS ba',
        'art.id',
        'ba.article_id',
      )
      .leftJoin('blogful_tag AS tag',
        'ba.tag_id',
        'tag.id',
      )
      .leftJoin('blogful_comment AS comm',
        'art.id',
        'comm.article_id',
      )
      .groupBy('art.id')
    /*
    SELECT
      art.id,
      art.title,
      art.date_published,
      art.content,
      COALESCE(
        json_agg(DISTINCT tag) filter(WHERE tag.id IS NOT NULL),
        '[]'
      ) AS tags,
      COALESCE(
        json_agg(DISTINCT comm) filter(WHERE comm.id IS NOT NULL),
        '[]'
      ) AS comments
    FROM blogful_article AS art
    LEFT JOIN blogful_article_tag AS ba ON art.id = ba.article_id
    LEFT JOIN blogful_tag AS tag ON ba.tag_id = tag.id
    LEFT JOIN blogful_comment AS comm ON art.id = comm.article_id
    GROUP BY art.id;
    */
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
      ArticleService.getCommentsForArticle(db, id),
      ArticleService.getTagsForArticle(db, id),
    ]).then(([article, comments, tags]) => {
      article.comments = comments
      article.tags = tags
      return article
    })
  },

  // uses advanced version of getAll
  getByIdAdv(db, id) {
    return ArticleService.getAllAdv(db)
      .where('art.id', id)
      .first()
  },

  getCommentsForArticle(db, article_id) {
    return db.from('blogful_comment').where({ article_id })
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

  getTagsForArticle(db, article_id) {
    return db('blogful_tag AS tag')
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

  addArticleTag(db, article_id, tag_id) {
    return db
      .insert({ article_id, tag_id })
      .into('blogful_article_tag')
      .then(() =>
        ArticleService.getTagsForArticle(db, article_id)
      )
  },

  deleteArticleTag(db, article_id, tag_id) {
    return db('blogful_article_tag')
      .where({ article_id, tag_id })
      .delete()
  },

  hasArticleTag(db, article_id, tag_id) {
    return db('blogful_article_tag')
      .select('article_id', 'tag_id')
      .where({ article_id, tag_id })
      .first()
      .then(articleTag => !!articleTag)
  },
}

module.exports = ArticleService
