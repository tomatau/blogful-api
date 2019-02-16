
const ArticlesService = {
  getAllAdv(db) {
    return db
      .from('blogful_articles AS art')
      .select(
        'art.id',
        'art.title',
        'art.date_published',
        'art.style',
        'art.content',
        db.raw(
          `COALESCE(
            json_agg(DISTINCT tag) filter(WHERE tag.id IS NOT NULL),
            '[]'
          ) AS tags`
        ),
        db.raw(
          `count(DISTINCT comm) AS number_of_comments`
        ),
        db.raw(
          `json_strip_nulls(
            json_build_object(
              'id', usr.id,
              'user_name', usr.user_name,
              'full_name', usr.full_name,
              'nick_name', usr.nick_name,
              'date_created', usr.date_created,
              'date_modified', usr.date_modified
            )
          ) AS "author"`
        ),
      )
      .leftJoin(
        'blogful_articles_tags AS ba',
        'art.id',
        'ba.article_id',
      )
      .leftJoin(
        'blogful_tags AS tag',
        'ba.tag_id',
        'tag.id',
      )
      .leftJoin(
        'blogful_comments AS comm',
        'art.id',
        'comm.article_id',
      )
      .leftJoin(
        'blogful_users AS usr',
        'art.author_id',
        'usr.id',
      )
      .groupBy('art.id', 'usr.id')
      .orderBy('art.date_published')
  },

  getByIdAdv(db, id) {
    return ArticlesService.getAllAdv(db)
      .where('art.id', id)
      .first()
  },

  insertArticle(db, newArticle) {
    return db
      .insert(newArticle)
      .into('blogful_articles')
      .returning('*')
      .then(([article]) => {
        article.comments = []
        return article
      })
  },

  updateArticle(db, id, newArticleFields) {
    return db('blogful_articles')
      .where({ id })
      .update(newArticleFields)
  },

  deleteArticle(db, id) {
    return db('blogful_articles')
      .where({ id })
      .delete()
  },

  getTagsForArticle(db, article_id) {
    return db('blogful_tags AS tag')
      .select('tag.id', 'tag.text')
      .join(
        'blogful_articles_tags AS artag',
        'tag.id',
        'artag.tag_id'
      )
      .where(
        'artag.article_id',
        article_id
      )
  },

  hasArticleTag(db, article_id, tag_id) {
    return db('blogful_articles_tags')
      .select('article_id', 'tag_id')
      .where({ article_id, tag_id })
      .first()
      .then(articleTag => !!articleTag)
  },

  addArticleTag(db, article_id, tag_id) {
    return db
      .insert({ article_id, tag_id })
      .into('blogful_articles_tags')
      .then(() =>
        ArticlesService.getTagsForArticle(db, article_id)
      )
  },

  deleteArticleTag(db, article_id, tag_id) {
    return db('blogful_articles_tags')
      .where({ article_id, tag_id })
      .delete()
  },

  getCommentsForArticle(db, article_id) {
    return db
      .from('blogful_comments AS comm')
      .select(
        'comm.id',
        'comm.text',
        'comm.date_created',
        db.raw(
          `row_to_json(
            (SELECT tmp FROM (
              SELECT usr.id, usr.user_name, usr.full_name, usr.nick_name, usr.date_created, usr.date_modified
            ) tmp)
          ) AS "user"`
        )
      )
      .where('comm.article_id', article_id)
      .leftJoin(
        'blogful_users AS usr',
        'comm.user_id',
        'usr.id',
      )
      .groupBy('comm.id', 'usr.id')
      .orderBy('comm.date_created')
  },
}

module.exports = ArticlesService


/* getAll(db) {
  return Promise.all([
    db.from('blogful_articles').select('*'),
    db.from('blogful_comments').select('*'),
    db.from('blogful_tags').select('*'),
    db.from('blogful_articles_tags').select('*'),
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
}, */

/* getById(db, id) {
  return Promise.all([
    db.from('blogful_articles').select('*').where('id', id).first(),
    ArticlesService.getCommentsForArticle(db, id),
    ArticlesService.getTagsForArticle(db, id),
  ]).then(([article, comments, tags]) => {
    article.comments = comments
    article.tags = tags
    return article
  })
}, */

/* hasArticle(db, id) {
  return db('blogful_articles')
    .select('id')
    .where({ id })
    .first()
    .then(article => !!article)
}, */

/* getCommentsForArticle(db, article_id) {
  return db.from('blogful_comments').where({ article_id })
}, */
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
FROM blogful_articles AS art
LEFT JOIN blogful_articles_tag AS ba ON art.id = ba.article_id
LEFT JOIN blogful_tag AS tag ON ba.tag_id = tag.id
LEFT JOIN blogful_comment AS comm ON art.id = comm.article_id
GROUP BY art.id;
*/
