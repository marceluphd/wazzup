var Router = require('express').Router();
var handlers = require('./handlers.js');
var auth = require('./authentication');

var checkUser = [auth.decodeToken(), auth.getFreshUser()];
var checkNotLoggedin = [auth.decodeToken(), auth.checkIfNotLoggedIn()];

Router.route('/')
  .get(handlers.home);
Router.route('/signup')
  .get(checkNotLoggedin, handlers.getSignup)
  .post(auth.signup);
Router.route('/signin')
  .get(checkNotLoggedin, handlers.getSignin)
  .post(auth.verifyUser(), auth.signin);
Router.route('/lounge')
  .get(checkUser, handlers.lounge);

Router.route('*').get(function(req, res) {
  return res.redirect('/');
});

module.exports = Router;
