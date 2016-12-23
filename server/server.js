var express = require('express')
var app = express();
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');

var config = require('./config/config');
var routes = require('./routes');

// Connect to MongoDB
mongoose.connect(config.db.url, function() {
  console.log('Connected to mongo, URL: ', config.db.url);
});

// View templates and static assets path setup
app.set('views', path.join(__dirname, '/../views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, '/../public')));

// Set up middlewares
require('./config/middlewares')(app);

// Routes
app.use(routes);

// Global Error Handling
app.use(function(err, req, res, next) {
  // // if error thrown from jwt validation check
  // console.log('REQ', req)
  // console.log('ERR', err)
  if (err.name === 'UnauthorizedError') {
    if (req.originalUrl === '/signup') {
      return res.render('signup');
    }   
    if (req.originalUrl === '/signin') {
      return res.render('signin');
    }
    return res.redirect('/signin');
    // return res.status(401).json({ error: 'Invalid token' });
  }
  return res.status(500).json({ error: 'Something went wrong.' });
});

// Esports 'app' to be used in 'index.js'
module.exports = app;