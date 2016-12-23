var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var config = require('./config/config');
var checkToken = expressJwt({ secret: config.secrets.jwt });

var validatePassword = require('./utils').validatePassword;
var User = require('./models/user');

module.exports = {
  decodeToken,
  getSignedInUserData,
  getFreshUser,
  verifyUser,
  signToken,
  checkIfNotLoggedIn,
  signup,
  signin
}

// Decode user's token
function decodeToken() {
  return function(req, res, next) {
    // [OPTIONAL]
    // make it optional to place token on query string
    // if it is, place it on the headers where it should be
    // so checkToken can see it. See follow the 'Bearer 034930493' format
    // so checkToken can see it and decode it
    if (req.query && req.query.hasOwnProperty('access_token')) {
      req.headers.authorization = 'Bearer ' + req.query.access_token;
    }
    // this will call next if token is valid
    // and send error if it is not. It will attached
    // the decoded token to req.user
    checkToken(req, res, next);
  }
};

function getSignedInUserData() {
  return function(req, res, next) {
    User.findById(req.user._id)
      .then(function(user) {
        if (!user) {
          // if no user is found it was not
          // it was a valid JWT but didn't decode
          // to a real user in our DB. Either the user was deleted
          // since the client got the JWT, or
          // it was a JWT from some other source
          return res.redirect('/signin');
          // res.status(401).send('Unauthorized');
        } else {
          // update req.user with fresh user from
          // stale token data
          res.json({
            username: user.username,
            email: user.email
          });
        }
      }, function(err) {
        next(err);
      });
  };
};

function getFreshUser() {
  return function(req, res, next) {
    User.findById(req.user._id)
      .then(function(user) {
        if (!user) {
          // if no user is found it was not
          // it was a valid JWT but didn't decode
          // to a real user in our DB. Either the user was deleted
          // since the client got the JWT, or
          // it was a JWT from some other source

          return res.redirect('/signin');
          // res.status(401).send('Unauthorized');
        } else {
          // update req.user with fresh user from
          // stale token data
          req.user = user;
          // console.log('FOUND IT!', user);
          next();
        }
      }, function(err) {
        next(err);
      });
  };
};

// Authenticate the user
function verifyUser() {
  return function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    // if no username or password then send
    if (!username || !password) {
      res.status(400).send('You need a username and password');
      return;
    }

    // look user up in the DB so we can check
    // if the passwords match for the username
    User.findOne({username: username})
      .then(function(user) {
        if (!user) {
          res.status(401).send('No user with the given email');
        } else {
          // checking the passowords here
          if (!user.comparePassword(password)) {
            res.status(401).send('Incorrect password');
          } else {
            // if everything is good,
            // then attach to req.user
            // and call next so the controller
            // can sign a token from the req.user._id
            req.user = user;
            next();
          }
        }
      }, function(err) {
        next(err);
      });
  };
};

// Sign token on signup
function signToken(id) {
  return jwt.sign(
    { _id: id },
    config.secrets.jwt,
    { expiresIn: config.expireTime }
  )
};

// Check If Not LoggedIn
function checkIfNotLoggedIn(req, res) {
  return function(req, res, next) {
    User.findById(req.user._id)
      .then(function(user) {
        if (!user) {
          next();
        } else {
          return res.redirect('/lounge');
        }
      }, function(err) {
        next(err);
      });
  };
}

// Signup handler
function signup(req, res) {
  const username = req.body.username ? req.body.username.trim() : '';
  const password = req.body.password ? req.body.password.trim() : '';

  if (!username || !password) {
    return res
      .status(422)
      .send({ error: 'Username and password are required.' });
  }

  if (username.length > 30) {
    return res
      .status(400)
      .send({ error: 'Username must be less than 30 characters.' });
  }

  const passwordValidationError = validatePassword(password);
  if (passwordValidationError.length > 0) {
    return res
      .status(400)
      .send({ error: passwordValidationError });
  }

  // Check if username already exists
  User.findOne({ username }, function(err, existingUser) {
    if (err) return next(err);

    // if the username exists return error
    if (existingUser && existingUser.username.length > 0) {
      return res
        .status(422)
        .send({ error: 'The username is already registered.' });
    }

    // Create a new user object
    const newUser = new User({ username, password });

    // Save the new user into the database
    newUser.save(function(err, userData) {
      if (err) return next(err);

      // Respond to request indicating that the user was created
      return res.json({
        token: signToken(userData.id),
        user: {
          id: userData.id,
          username: userData.username,
        },
      });
    });

  });
}

// Signin handler
function signin(req, res) {
  // req.user will be there from the middleware
  // verify user. Then we can just create a token
  // and send it back for the client to consume

  var token = signToken(req.user._id);
  res.json({
    token: token,
    user: {
      username: req.user.username,
    }
  });
};
