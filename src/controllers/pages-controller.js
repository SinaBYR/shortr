exports.renderIndexPage = function(req, res) {
  if(req.session.user) {
    return res.render('pages/index', {
      user: req.session.user
    })
  }

  res.render('pages/index.ejs');
}

exports.renderLoginPage = function(req, res) {
  if(req.session.user) {
    return res.render('pages/admin');
  }

  res.render('pages/login');
}

exports.renderRegisterPage = function(req, res) {
  if(req.session.user) {
    return res.render('pages/admin');
  }

  res.render('pages/register');
}
