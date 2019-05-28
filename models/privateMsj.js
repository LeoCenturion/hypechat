'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const privateMsjSchema = new Schema({
    email_user1: {type:String,lowercase:true, required: true},
    email_user2: {type:String,lowercase:true, required: true},
	organizationID: {type:String,lowercase:true, required: true},

});




module.exports = mongoose.model('privateMsj', privateMsjSchema)
