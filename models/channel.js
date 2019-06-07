'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ChannelSchema = new Schema({
	private: {type: Boolean, required: true, default: false},//siempre es publico si no se indica lo contrario
	id: {type:String, required: true},
	name: {type:String, required: true, unique:true},
	owner: {type:String, required: true},
	members: {type: Array, default: []},
	description: {type: String, default: ''},
	welcome: {type: String, default: 'Bienvenido al canal'}
	//signupDate: {type: Date, default: Date.now()},
	//lastLogin: Date
});


module.exports = mongoose.model('Channels', ChannelSchema)