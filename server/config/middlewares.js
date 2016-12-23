// Setup middlewares

// var express = require('express');
// var path = require('path');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var compression = require('compression');
var helmet = require('helmet');

module.exports = function(app) {
  // app.set('views', path.join(__dirname, '/../views'));
  // app.set('view engine', 'pug');
  // app.use(express.static(path.join(__dirname, '/../public')));

  app.use(morgan('dev'));
  app.use(compression());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(helmet());
};