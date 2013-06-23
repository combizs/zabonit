var mongoose = require('mongoose');

var Schema = new mongoose.Schema({ name: 'string', size: 'string' });
var Cat = mongoose.model('Cat', Schema);

module.exports = {Cat: Cat};