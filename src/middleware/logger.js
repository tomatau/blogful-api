const morgan = require('morgan');

module.exports = function (req, res, next) {
  morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'common', {
    skip: () => process.env.NODE_ENV === 'test'
  });
  next();
};
