const app = require('./app')
const { PORT } = require('./config')

app.listen(PORT, function () {
  console.info(`Listening at ${this.address().port}`)
})
