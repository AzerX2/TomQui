const mongo = require('mongoose')

const Schema = new mongo.Schema({
    id: String,
    userlist: [String],
    date: String,
    recurrent: Boolean
});

module.exports = mongo.model('session', Schema);