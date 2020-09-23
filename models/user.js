const mongoose = require('mongoose');
var passportlocalmongoose = require("passport-local-mongoose");
var UserSchema = new  mongoose.Schema({
	username: String,
	password: String,
	avatar: String,
	email: String,
	isAdmin: {
		type: Boolean ,
		default: false
	}
	
});

UserSchema.plugin(passportlocalmongoose);

module.exports = mongoose.model("User" , UserSchema);