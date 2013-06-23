
var Sequelize = require("sequelize");
var sequelize = new Sequelize('bizbase', 'root', '~Password');

var djb2Code = function(str){
  var hash = 5381;
  for (i = 0; i < str.length; i++) {
      char = str.charCodeAt(i);
      hash = ((hash << 5) + hash) + char; /* hash * 33 + c */
  }
  return hash;
};

exports.find = function (req, res) {
  res.json("hello world");
  var fixUrl = req.url.split("?");
  var sendUrl, findUrl, data;
  if((fixUrl) && (fixUrl.length > 1) && (fixUrl[1].substr(0,4) === "url=")) {
    sendUrl = fixUrl[1].substr(4).split("&")[0];
    data = { url: sendUrl, urlHash: djb2Code(sendUrl) };
    // User.findOrCreate({ openid: identifier, firstname: profile.name.givenName, lastname: profile.name.familyName }).done(done);


    // connection.connect( function (err, results){
    //   if(err) throw err;
    //   var result = connection.query("SELECT * FROM website WHERE hash = '"+data.urlHash+"' LIMIT 1", function (error, results, fields) {
    //     if (error) {
    //       console.log("ERROR!!!");
    //     }
    //     if (results.length > 0) {
    //       console.log("ALREADY THERE");
    //     }
    //     else {
    //       console.log("INSERT");
    //       connection.query("INSERT INTO website SET ?", {hash: data.urlHash}, 
    //       function (err, results) {
    //         if (err) throw err;
    //       });
    //     }
    //   });
    // });
    //findUrl = "https://www.readability.com/api/content/v1/parser?url=" + sendUrl + "&token=be4591d022b60dc6ad175516afb712a7797f3836";
  }
  res.send(data);
};
