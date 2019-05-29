'use strict'

const express = require('express');
const api = express.Router()
const userControllers = require('../controllers/user')

api.get('/hello/:name',function(req, res){
	res.send({message: `Hello, ${req.params.name}!`});
});
api.get('/user', userControllers.getUsers)
api.get('/user/:userId', userControllers.getUser)
api.post('/user', userControllers.saveUser)
api.put('/user/:userId', userControllers.updateUser2 )
api.delete('/user/:userId', userControllers.deleteUser )
//api.put('/token', userControllers.setToken)

api.post('/signUp', userControllers.signUp )
api.post('/login', userControllers.logIn )
api.get('/profile/:email', userControllers.getUserProfile)
api.put('/profile', userControllers.updateUser )
api.put('/password', userControllers.updateUser )
api.get('/recoveredPassword', userControllers.getTokenRecoverPasswordUser)
api.put('/recoveredPassword', userControllers.updatePasswordUser)




module.exports = api