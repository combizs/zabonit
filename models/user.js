var Sequelize = require('sequelize');
var User = sequelize.define('User', { openid: Sequelize.STRING, firstname: Sequelize.STRING, lastname: Sequelize.STRING }, {
instanceMethods: {
  getFullname: function() {
    return [this.firstname, this.lastname].join(' ')
  }
}
});

module.exports = sequelize.model('User', userSchema);