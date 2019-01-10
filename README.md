# Blogful

Migrations: https://www.npmjs.com/package/postgrator-cli

Settings in [`./postgrator.js`](./postgrator.js)

```js
require('dotenv').config();

module.exports = {
  "migrationDirectory": "migrations",
  "driver": "pg",
  "host": "127.0.0.1",
  "port": 5432,
  "database": "tomatao",
  "username": process.env.DB_USER,
  "password": process.env.DB_USER
}
```
