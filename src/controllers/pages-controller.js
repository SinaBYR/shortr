exports.renderIndexPage = function(req, res) {
  if(req.session.user) {
    return res.render('pages/dashboard', {
      user: req.session.user
    })
  }

  res.render('pages/index.ejs');
}

exports.renderLoginPage = function(req, res) {
  if(req.session.user) {
    return res.render('pages/dashboard', {
      user: req.session.user
    });
  }

  res.render('pages/login');
}

exports.renderRegisterPage = function(req, res) {
  if(req.session.user) {
    return res.render('pages/dashboard', {
      user: req.session.user
    });
  }

  res.render('pages/register');
}

exports.renderDashboardPage = function(req, res) {
  if(!req.session.user) {
    // 1. Display some feedback on session being expired
    return res.render('pages/login');
  }

  res.render('pages/dashboard', {
    user: req.session.user
  })
}