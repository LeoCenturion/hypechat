'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const OrganizationSchema = new Schema({
	id:{type:String, unique:true,lowercase:true, required: true},
	owner: {type:String,lowercase:true, required: true},
	psw: {type:String, default:''},//false para que cada vez que nos pidan al usuario no se mande la contraseña
	name: {type:String, default:''},
	channels: {type: Array, default: ['general','varios']}
	//signupDate: {type: Date, default: Date.now()},
	//lastLogin: Date
});


module.exports = mongoose.model('Organizations', OrganizationSchema)