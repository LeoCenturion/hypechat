'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const privateMsjSchema = new Schema({
    email_user1: {type:String,lowercase:true, required: true},
    email_user2: {type:String,lowercase:true, required: true},
	organizationID: {type:String,lowercase:true, required: true},
	//signupDate: {type: Date, default: Date.now()},
	//lastLogin: Date
});



/*
UserSchema.methods.gravatar = function (size) {
	if (!size) {
		size = 200; 
	}
	if (!this.email) return `https:/gravatar.com/avatar/?s${size}&d=retro`

	const md5 = crypto.createHash('md5').update(this.email).digest('hex')
	return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`
}
*/
module.exports = mongoose.model('privateMsj', privateMsjSchema)
