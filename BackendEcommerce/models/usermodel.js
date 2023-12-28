// Create a model from the schema

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
username: { type: String, required: true },
password: { type: String, required: true },
authToken: String,

});

const User = mongoose.model('User', userSchema);

module.exports = User;