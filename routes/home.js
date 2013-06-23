exports.index = function(req, res){
  if(req.user) {
    res.render('home', { title: 'Home', user: req.user});
  }
  else {
    res.redirect('login');
  }
};
