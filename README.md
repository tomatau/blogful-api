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
psql -U thinkful -d $DB_NAME -f ./seeds/seed.blogful_comments.sql
psql -U $DB_USER -d $DB_NAME -f ./seeds/seed.blogful_users.sql
psql -U thinkful-test -d blogful-test -f ./seeds/seed.blogful_tags.sql
```

**other scripts**

Same as other API projects in curric

## Endpoints

### Articles

- `GET /article`
  - get all articles
- `POST /article`
  - create an article

- `GET /article/:article_id`
  - get a specific article
- `PATCH /article/:article_id`
  - update a specific article
- `DELETE /article/:article_id`
  - delete a specific article

- `GET /article/:article_id/comment`
  - get all comments for a specific article

- `GET /article/:article_id/tag`
  - get all tags for a specific article
- `POST /article/:article_id/tag`
  - add a tag to a specific article

- `DELETE /article/:article_id/tag/:tag_id`
  - remove a specific tag from a specific article

### Users

- `GET /user`
  - get all users
- `POST /user`
  - create an user

- `GET /user/:user_id`
  - get a specific user
- `PATCH /user/:user_id`
  - update a specific user
- `DELETE /user/:user_id`
  - delete a specific user

### Comments

- ~~`GET /comment`~~
  - ~~get all comments~~
- `POST /comment`
  - create an comment

- `GET /comment/:comment_id`
  - get a specific comment
- `PATCH /comment/:comment_id`
  - update a specific comment
- `DELETE /comment/:comment_id`
  - delete a specific comment

### Tags

- `GET /tag`
  - get all tags
- `POST /tag`
  - create an tag

- `GET /tag/:tag_id`
  - get a specific tag
- `PATCH /tag/:tag_id`
  - update a specific tag
- `DELETE /tag/:tag_id`
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
DB_URL="postgresql://thinkful@localhost/blogful"
```

You should only need `DB_URL` to start the application.

There is a default value set in `./src/config.js` but it probably won't work for you. You should set your own value for it in your `.env`.

**Other variables:**

`DB_NAME`, `DB_HOST`, `DB_PORT`, `DB_USER` and `DB_PASS` are being used by postgrator migration scripts. E.g. inside `.env`:

```bash
DB_NAME=blogful
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=thinkful
DB_PASS=
```

These aren't required to start the app, they're only needed for running migration scripts.

## TODO

- Add API_TOKEN support
- XSS when serving articles and comments content
- GET /articles should support: pagination, title search, sorting
