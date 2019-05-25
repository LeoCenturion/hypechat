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

api.post('/signUp', userControllers.signUp )
api.post('/login', userControllers.logIn )
api.get('/profile/:email', userControllers.getUserProfile)
api.put('/profile', userControllers.updateUser )
api.put('/psw', userControllers.updateUser )
api.post('/loginFacebook', (req,res) => {res.status(500).send({message: 'not implemented yet'})})

api.get('/organizaciones/:userEmail',userControllers.getUserOrganizations)
api.get('/canalesYmsjPrivados',userControllers.getPrivateMsj)
api.get('/organizationID_valid/:organizacionID',userControllers.is_organizationId_valid)
api.post('/organizacion',userControllers.createOrganization)
api.post('/usuarioOrganizacion',userControllers.addUserToOrganization)
api.get('/organizacion/:token/:organizacion_id',userControllers.getInfoOrganization)
api.put('/nombreOrganizacion',userControllers.updateNameOrganization)
api.put('/passwordOrganizacion',userControllers.updatePasswordOrganization)



module.exports = api