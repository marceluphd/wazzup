const morgan = require('morgan');
const compression = require('compression');
const helmet = require('helmet');

module.exports = (app) => {
  app.use(morgan('dev'));
  app.use(compression());
  app.use(helmet());
};
