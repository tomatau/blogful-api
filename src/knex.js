const knex = require('knex');
// const { DB_URL } = require('./config')

module.exports = knex({
  client: 'pg',
  // connection: DB_URL,
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  }
})
