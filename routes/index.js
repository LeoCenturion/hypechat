'use strict'

const express = require('express');
const api = express.Router()
const userControllers = require('../controllers/user')
const organizationControllers = require('../controllers/organization')
const channelControllers = require('../controllers/channel')

api.get('/hello/:name',function(req, res){
	res.send({message: `Hello, ${req.params.name}!`});
});
api.get('/user', userControllers.getUsers)
api.get('/user/:userId', userControllers.getUser)
api.post('/user', userControllers.saveUser)
api.put('/user/:userId', userControllers.updateUser2 )
api.delete('/user/:userId', userControllers.deleteUser )

//---------REGISTER----------
api.post('/signUp', userControllers.signUp )
api.post('/login', userControllers.logIn )
api.post('/loginFacebook', (req,res) => {res.status(500).send({message: 'not implemented yet'})})

//---------USERS----------
api.get('/profile/:email', userControllers.getUserProfile)
api.put('/profile', userControllers.updateUser )
api.put('/password', userControllers.updateUser )
api.get('/recoveredPassword', userControllers.getTokenRecoverPasswordUser)
api.put('/recoveredPassword', userControllers.updatePasswordUser)

//---------ORGANITIONS----------
api.get('/organizations/:userEmail',organizationControllers.getUserOrganizations)
api.post('/privateMsj',organizationControllers.getPrivateMsj)
api.get('/idOrganizationValid/:organizationID',organizationControllers.isOrganizationIDValid)
api.post('/organization',organizationControllers.createOrganization)
api.post('/organization/user',organizationControllers.addUserToOrganization)
api.get('/organization/:token/:organizationID',organizationControllers.getInfoOrganization)
api.put('/organization/name',organizationControllers.updateNameOrganization)
api.put('/organization/password',organizationControllers.updatePasswordOrganization)
api.put('/moderator',organizationControllers.asignModerator)
api.put('/revokeModerator',organizationControllers.revokeModerator)
api.delete('/member',organizationControllers.removeUser)
api.put('/welcomeOrganization',organizationControllers.updateWelcomeOrganization)
api.put('/photoOrganization',organizationControllers.updatePhotoOrganization)

api.post('/organization/senderMenssage', organizationControllers.getMessageWithoutRestrictedWords)

//---------CHANNELS----------
api.post('/channel',channelControllers.createChannel)
api.get('/channelValid/:id/:name',channelControllers.isChannelValid)
api.post('/channel/user',channelControllers.addUserToChannel)
api.delete('/channel/user',channelControllers.removeUserFromChannel)
api.put('/privateChannel',channelControllers.setPrivate)
api.get('/privateChannel',channelControllers.getPrivate)
api.put('/description',channelControllers.setDescription)
api.get('/description',channelControllers.getDescription)
api.put('/welcomeChannel',channelControllers.setWelcome)
api.get('/welcomeChannel',channelControllers.getWelcome)
api.delete('/channel',channelControllers.remove)
api.get('/channel',channelControllers.channelInfo)
api.post('/channels/user',channelControllers.userChannels)

module.exports = api