module.exports = {
  home,
  signup,
  lounge,
  getSignup,
  getSignin
};

function home(req, res) {
  return res.render('home');
}

function getSignup(req, res) {
  return res.render('signup');
}

function signup(req, res) {
  return res.redirect('/lounge');
}

function getSignin(req, res) {
  return res.render('signin');
}

function lounge(req, res) {
  return res.render('chat');
}