var Sequelize = require("sequelize");
var sequelize = new Sequelize('flashcar_zab', 'flashcar_zab', '~Password1', {host: 'flashcarddeck.com'});

var Comment = sequelize.define('Comment', { user: Sequelize.INTEGER, content: Sequelize.STRING, website: Sequelize.INTEGER, parent: Sequelize.INTEGER, selected: Sequelize.STRING, start: Sequelize.INTEGER, end: Sequelize.INTEGER, createdAt: Sequelize.STRING, updatedAt: Sequelize.STRING });

exports.add = function(req, res){
  var url = require('url');
  var queryString = require( "querystring" );
  var sentUrl = queryString.parse(req.url, true);
  var query = sentUrl.url;

  Comment.create({
    user: req.user.id, 
    content: req.body.content,
    website: req.body.website,
    parent: null,
    selected: req.body.selected,
    parent: 0,
    start: req.body.start,
    end: req.body.end
  })
  .success(function(comment, created) {
    res.send({'comment': comment.values.content, 'id': comment.values.id, 'selected': comment.values.selected, 'start': comment.values.start, 'end': comment.values.end});
  })
  .error(function(err) {
    res.send({'content': 'Error retrieving site contents'});
  });
};

exports.index = function(req, res){
  var url = require('url');
  var queryString = require( "querystring" );
  var sentUrl = url.parse(req.url, true);

  Comment.findAll({
    where: { website: sentUrl.query.website} 
  })
  .success(function(projects) {
     res.send({'comments': projects});
  });
};