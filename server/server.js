const path = require('path');
const express = require('express');

const app = express();

app.use(express.static(path.join(__dirname, '/../public')));

// Set up middlewares
require('./middlewares')(app);

// Export 'app' to be used in 'index.js'
module.exports = app;
