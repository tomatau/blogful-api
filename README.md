# Blogful API

Migrations: https://www.npmjs.com/package/postgrator-cli

Settings in [`./postgrator.js`](./postgrator.js)

```js
require('dotenv').config();

module.exports = {
  "migrationDirectory": "migrations",
  "driver": "pg",
  "host": process.env.DB_HOST,
  "port": process.env.DB_PORT,
  "database": process.env.DB_NAME,
  "username": process.env.DB_USER,
  "password": process.env.DB_PASS
}
```

## Scripts

**migrate**

Using postgrator behind scenes to read `.sql` files in `./migrations` dir.

- `npm run migrate` to migrate to latest schema
- `npm run migrate -- 2` to migrate to step 2 of schema
- `npm run migrate -- 0` to completely rollback schema

**seed**

Use the files inside `./seeds` dir

e.g. to seed the database named `blogful`:

```bash
psql -U $DB_USER -d blogful -f ./seeds/seed.blogful_articles.sql
psql -U dunder-mifflin -d $DB_NAME -f ./seeds/seed.blogful_comments.sql
psql -U $DB_USER -d $DB_NAME -f ./seeds/seed.blogful_users.sql
psql -U dunder-mifflin-test -d blogful-test -f ./seeds/seed.blogful_tags.sql
```

**other scripts**

Same as other API projects in curric

## Endpoints

### Articles

- `GET /api/articles`
  - get all articles
- `POST /api/articles`
  - create an article

- `GET /api/articles/:article_id`
  - get a specific article
- `PATCH /api/articles/:article_id`
  - update a specific article
- `DELETE /api/articles/:article_id`
  - delete a specific article

- `GET /api/articles/:article_id/comment`
  - get all comments for a specific article

- `GET /api/articles/:article_id/tag`
  - get all tags for a specific article
- `POST /api/articles/:article_id/tag`
  - add a tag to a specific article

- `DELETE /api/articles/:article_id/tag/:tag_id`
  - remove a specific tag from a specific article

### Users

- `GET /api/users`
  - get all users
- `POST /api/users`
  - create an user

- `GET /api/users/:user_id`
  - get a specific user
- `PATCH /api/users/:user_id`
  - update a specific user
- `DELETE /api/users/:user_id`
  - delete a specific user

### Comments

- ~~`GET /api/comments`~~
  - ~~get all comments~~
- `POST /api/comments`
  - create an comment

- `GET /api/comments/:comment_id`
  - get a specific comment
- `PATCH /api/comments/:comment_id`
  - update a specific comment
- `DELETE /api/comments/:comment_id`
  - delete a specific comment

### Tags

- `GET /api/tags`
  - get all tags
- `POST /api/tags`
  - create an tag

- `GET /api/tags/:tag_id`
  - get a specific tag
- `PATCH /api/tags/:tag_id`
  - update a specific tag
- `DELETE /api/tags/:tag_id`
  - delete a specific comment

## Hello

- `GET /`
  - responds with "Hello, world!"

## Environmental Variables

**for running the app:**

`DB_URL` is being used by `./src/app.js` to initialize knex.
The expected format is:

```bash
"postgresql://$DB_USER:$DB_PASS@$DB_HOST:$DB_PORT/$DB_NAME"
```

Inside `.env`:

```bash
DB_URL="postgresql://dunder-mifflin@localhost/blogful"
```

You should only need `DB_URL` to start the application.

There is a default value set in `./src/config.js` but it probably won't work for you. You should set your own value for it in your `.env`.

**Other variables:**

`DB_NAME`, `DB_HOST`, `DB_PORT`, `DB_USER` and `DB_PASS` are being used by postgrator migration scripts. E.g. inside `.env`:

```bash
DB_NAME=blogful
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=dunder-mifflin
DB_PASS=
```

These aren't required to start the app, they're only needed for running migration scripts.

## TODO

- Add API_TOKEN support
- XSS when serving articles and comments content
- GET /api/articles should support: pagination, title search, sorting
