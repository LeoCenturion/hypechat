'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	email:{type:String, unique:true,lowercase:true, required: true},
	name: {type:String, default:''},
	psw: {type:String, default:''},//false para que cada vez que nos pidan al usuario no se mande la contraseña
	photo: {type:String, default:''}, //guardamos la url de la imagen
	nickname: {type:String, default:''},
	token: String,
	token_notifications: {type: String,default: ''},
	organizations: {type: Array, default:[]},
	question1: {type:String, required: false, default: ''},
	question2: {type:String, required: false, default: ''},
	answer1: {type:String, required: false, default: ''},
	answer2: {type:String, required: false, default: ''},
	latitud: {type: Number, default: 0},
	longitud: {type: Number, default: 0},
	registration_day: {type: Number, required: true},
	registration_month: {type: Number, required: true},
	registration_year: {type: Number, required: true},
	facebook: {type: Boolean, default: false},
	recoverPasswordToken: String
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
module.exports = mongoose.model('User', UserSchema)
