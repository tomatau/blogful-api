const cors = require('cors');

const { CLIENT_ORIGIN } = require('../config');

module.exports = cors({ origin: CLIENT_ORIGIN });
