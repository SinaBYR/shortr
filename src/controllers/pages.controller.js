exports.renderIndexPage = function(req, res) {
  if(req.session.user) {
    return res.redirect('/dashboard');
  }

  res.render('pages/index.ejs');
}

exports.renderLoginPage = function(req, res) {
  if(req.session.user) {
    return res.redirect('/dashboard');
  }

  res.render('pages/login');
}

exports.renderRegisterPage = function(req, res) {
  if(req.session.user) {
    return res.redirect('/dashboard');
  }

  res.render('pages/register');
}

// protected route controller
exports.renderDashboardPage = function(req, res) {
  if(!req.session.user) {
    // 1. Display some feedback on session being expired somehow
    return res.redirect('/login');
  }

  res.render('pages/dashboard', {
    user: req.session.user
  })
}

exports.renderCreateNewUrlPage = function(req, res) {
  if(!req.session.user) {
    return res.redirect('/login');
  }

  res.render('pages/new', {
    user: req.session.user
  });
}