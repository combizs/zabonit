
var Sequelize = require("sequelize");
var sequelize = new Sequelize('flashcar_zab', 'flashcar_zab', '~Password1', {host: 'flashcarddeck.com'});

var Website = sequelize.define('Website', { id: Sequelize.INTEGER, url: Sequelize.STRING, user: Sequelize.INTEGER, content: Sequelize.STRING, createdAt: Sequelize.STRING, updatedAt: Sequelize.STRING });

exports.index = function(req, res){
  var url = require('url');
  var readability = require('node-readability');
  var queryString = require( "querystring" );
  var sentUrl = queryString.parse(req.url, true);
  var query = sentUrl.url;
  var content = '';

  readability.read('https://www.readability.com/api/content/v1/parser?token=be4591d022b60dc6ad175516afb712a7797f3836&url='+req.query.url, function(err, article) {
    content = article.getContent();
    if(content) {
      Website.findOrCreate({ url: req.query.url}, {
        user: req.user.id, 
        content: content.replace(/\\n/g, ' ').replace('/\\t/g','').trim()
      })
      .success(function(website, created) {
        res.send({'content': website.values.content, 'id': website.values.id});
      })
      .error(function(err) {
        res.send({'content': 'failed to return article found'});
      });
    }
    else {
      res.send({'content': 'no article found'});
    }
  });
};
