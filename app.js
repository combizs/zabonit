
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , url = require('./routes/url')
  , home = require('./routes/home')
  , website = require('./routes/website')
  , comment = require('./routes/comment')
  , login = require('./routes/login')
  , http = require('http')
  , path = require('path')
  , fs = require('fs');

var Sequelize = require("sequelize");

var passport = require('passport')
  , GoogleStrategy = require('passport-google').Strategy;

var sequelize = new Sequelize('bizbase', 'root', '~Silent83');

var User = sequelize.define('User', { openid: Sequelize.STRING, firstname: Sequelize.STRING, lastname: Sequelize.STRING }, {
  instanceMethods: {
    getFullname: function() {
      return [this.firstname, this.lastname].join(' ')
    }
  }
});

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new GoogleStrategy({
    returnURL: 'http://127.0.0.1:3000/auth/google/return',
    realm: 'http://127.0.0.1:3000/'
  },
  function(identifier, profile, done) {
    User.findOrCreate({ openid: identifier, firstname: profile.name.givenName, lastname: profile.name.familyName }).done(done);
  }
));

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.bodyParser());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({secret: '654yt325'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/url', url.find);
app.get('/home', home.index);
app.get('/login', login.index);
app.get('/test', user.test);
app.get('/website', website.index);
app.post('/comment', comment.add);
app.get('/comment', comment.index);
app.get('/test', ensureAuthenticated, function(req, res){
  res.render('test', { user: req.user });
});
app.get('/auth/google', passport.authenticate('google'));
app.get('/auth/google/return',  passport.authenticate('google', { successRedirect: '/home', failureRedirect: '/login' }));
app.get('/logout', function(req, res){
  req.session.destroy();
  res.redirect('/');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/home')
}

// send url to function
// sterilize string
// check db for hash value
//   hash value with function if doesnt exist.
//     send data to api to retrieve content.
//   return content if exists
