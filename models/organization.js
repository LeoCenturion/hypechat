'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const OrganizationSchema = new Schema({
	id:{type:String, unique:true,lowercase:true, required: true},
	psw: {type:String, default:''},//false para que cada vez que nos pidan al usuario no se mande la contraseña
	name: {type:String, default:''},
	channels: {type: Array, default: ['general','varios']},
	owner: {type:Array, required: true},
	moderators: {type: Array, default: [] },
	members: {type: Array, default: []},
	welcome: {type: String, default: 'Bienvenido a la organizacion'},
	photo: String, //guardamos la url de la imagen 
	location: {type: String, default: "Facultad de ingenieria"}
	//signupDate: {type: Date, default: Date.now()},
	//lastLogin: Date
});


module.exports = mongoose.model('Organizations', OrganizationSchema)