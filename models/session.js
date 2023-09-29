const mongo = require('mongoose')

const Schema = new mongo.Schema({
    id: String,
    nom: String,
    userlist: [String],
    date: Date,
    recurrent: Boolean
});

module.exports = mongo.model('session', Schema);