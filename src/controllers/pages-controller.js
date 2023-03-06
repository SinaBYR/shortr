exports.renderIndexPage = function(_req, res) {
  res.render('pages/index.ejs');
}

exports.renderLoginPage = function(req, res) {
  if(req.session.user) {
    return res.render('pages/admin');
  }

  res.render('pages/login');
}