'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PrivateMsjSchema = new Schema({
    email_user1: {type:String, required: true},
    email_user2: {type:String, required: true},
    id: {type:String},
    mensajes: {type: Number, default: 0 }

});




module.exports = mongoose.model('PrivateMsj', PrivateMsjSchema)
