'use strict'

const express = require('express');
const api = express.Router()
const userControllers = require('../controllers/user')
const organizationControllers = require('../controllers/organization')

api.get('/hello/:name',function(req, res){
	res.send({message: `Hello, ${req.params.name}!`});
});
api.get('/user', userControllers.getUsers)
api.get('/user/:userId', userControllers.getUser)
api.post('/user', userControllers.saveUser)
api.put('/user/:userId', userControllers.updateUser2 )
api.delete('/user/:userId', userControllers.deleteUser )

api.post('/signUp', userControllers.signUp )
api.post('/login', userControllers.logIn )
api.get('/profile/:email', userControllers.getUserProfile)
api.put('/profile', userControllers.updateUser )
api.put('/psw', userControllers.updateUser )
api.post('/loginFacebook', (req,res) => {res.status(500).send({message: 'not implemented yet'})})

//---------ORGANIZACIONES----------
api.get('/organizations/:userEmail',organizationControllers.getUserOrganizations)
api.get('/privateMsj',organizationControllers.getPrivateMsj)
api.get('/idOrganizationValid/:organizationID',organizationControllers.isOrganizationIDValid)
api.post('/organization',organizationControllers.createOrganization)
api.post('/userOrganization',organizationControllers.addUserToOrganization)
api.get('/organization/:token/:organizationID',organizationControllers.getInfoOrganization)
api.put('/nameOrganization',organizationControllers.updateNameOrganization)
api.put('/pswOrganization',organizationControllers.updatePasswordOrganization)



module.exports = api