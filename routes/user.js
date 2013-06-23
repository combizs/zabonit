
var Sequelize = require("sequelize");
var sequelize = new Sequelize('flashcar_zab', 'flashcar_zab', '~Password1', {host: "my.server.tld"});

var User = sequelize.define('User', { openid: Sequelize.STRING, firstname: Sequelize.STRING, lastname: Sequelize.STRING }, {
  instanceMethods: {
    getFullname: function() {
      return [this.firstname, this.lastname].join(' ')
    }
  }
});

exports.list = function(req, res){

  User.findAll().success(function(users) {
    res.render('test', users);
  });
};

exports.test = function(req, res){
  var http = require('http');
  var querystring = require("querystring");

  var options = {
    // host: 'https://www.readability.com',
    // path: '/api/content/v1/parser?url=http://redotheweb.com/2013/02/20/sequelize-the-javascript-orm-in-practice.html&token=be4591d022b60dc6ad175516afb712a7797f3836'
    host: 'redotheweb.com',
    path: '/2013/02/20/sequelize-the-javascript-orm-in-practice.html'
  };

  var messageData = '';
  http.get(options, function(resp){
    resp.on('data', function(data){
      messageData += data;
    });
    resp.on('end', function() {
      // data = messageData.replace(/(<([^>]+)>)/ig,"");
      data = messageData;
      console.log(data);
      res.render('test', data);
    })
  }).on("error", function(e){
    console.log("Got error: " + e.message);
  });
  'https://www.readability.com/api/content/v1/parser?url=http://redotheweb.com/2013/02/20/sequelize-the-javascript-orm-in-practice.html&token=be4591d022b60dc6ad175516afb712a7797f3836'
  res.render('test');

};
