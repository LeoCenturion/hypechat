'use strict'

const express = require('express');
const api = express.Router()
const userControllers = require('../controllers/user')
const organizationControllers = require('../controllers/organization')
const channelControllers = require('../controllers/channel')
const privateControllers = require('../controllers/privateMsj')



api.get('/hello/:name',function(req, res){
	res.send({message: `Hello, ${req.params.name}!`});
});
api.get('/user', userControllers.getUsers)
api.get('/user/:userId', userControllers.getUser)
//api.post('/user', userControllers.saveUser)
api.put('/user/:userId', userControllers.updateUser2 )
//api.delete('/user/:userId', userControllers.deleteUser )


//---------REGISTER----------
api.post('/signUp', userControllers.signUp )
api.post('/login', userControllers.logIn )
//api.post('/loginFacebook', (req,res) => {res.status(500).send({message: 'not implemented yet'})})
api.post('/logFacebook',userControllers.fbLogIn)




//---------USERS----------
api.post('/profile/:email', userControllers.getUserProfile)
api.put('/profile', userControllers.updateUser )
api.put('/password', userControllers.updateUser )
api.get('/recoveredPassword', userControllers.getTokenRecoverPasswordUser)
api.put('/recoveredPassword', userControllers.updatePasswordUser)
api.get('/answerQuestions/:userEmail/:asw1/:asw2',userControllers.answersSecretQuestionsCorrect)
api.get('/secretQuestions/:userEmail',userControllers.getSecretQuestions)
api.get('/answersQuestions/:token',userControllers.getAnswersSecretQuestions)
api.put('/secretQuestios',userControllers.updateSecretQuestions)
api.get('/location/:token/:email',userControllers.getLocation)
api.put('/location',userControllers.setLocation)
api.get('/registration/months/:token',userControllers.getTotalRegistrations)
api.get('/registration/year/:token/:year',userControllers.getTotalRegistrationsPerYear)
api.get('/logout/:token',userControllers.logout)

//---------ORGANIZATIONS----------
api.get('/organizations/:userEmail',organizationControllers.getUserOrganizations)
api.get('/idOrganizationValid/:organizationID',organizationControllers.isOrganizationIDValid)
api.post('/organization',organizationControllers.createOrganization)
api.post('/organization/user',organizationControllers.addUserToOrganization)
api.get('/organization/:token/:organizationID',organizationControllers.getInfoOrganization)
api.put('/organization/name',organizationControllers.updateNameOrganization)
api.put('/organization/password',organizationControllers.updatePasswordOrganization)
api.put('/moderator',organizationControllers.asignModerator)
api.put('/revokeModerator',organizationControllers.revokeModerator)
api.delete('/member/:token/:id/:email',organizationControllers.removeUser)
api.put('/welcomeOrganization',organizationControllers.updateWelcomeOrganization)
api.put('/photoOrganization',organizationControllers.updatePhotoOrganization)
api.get('/locations/:token/:id',organizationControllers.getLocationsOrganization)
api.get('/moderator/:token/:id/:email',organizationControllers.hasEditPermission)

api.get('/organization/restrictedWords/:id/:token', organizationControllers.getRestrictedWords)
api.put('/organization/restrictedWords/:id/:token', organizationControllers.addRestrictedWords)
api.delete('/organization/restrictedWords/:id/:token', organizationControllers.deleteRestrictedWords)

api.post('/message',organizationControllers.checkMessage)
api.post('/mention',organizationControllers.checkMention)
api.get('/messages/:token',organizationControllers.getTotalMessages)

api.get('/allOrg',organizationControllers.all)

//---------CHANNELS----------
api.post('/channel',channelControllers.createChannel)
api.get('/channelValid/:id/:name',channelControllers.isChannelValid)
api.post('/channel/user',channelControllers.addUserToChannel)
api.post('/channel/users',channelControllers.addUsersToChannel)
api.delete('/channel/user/:token/:id/:name/:email',channelControllers.removeUserFromChannel)
api.put('/privateChannel',channelControllers.setPrivate)
api.get('/privateChannel/:token/:id/:name',channelControllers.getPrivate)
api.put('/description',channelControllers.setDescription)
api.get('/description/:token/:id/:name',channelControllers.getDescription)
api.put('/welcomeChannel',channelControllers.setWelcome)
api.get('/welcomeChannel/:token/:id/:name',channelControllers.getWelcome)
api.delete('/channel/:token/:id/:name',channelControllers.remove)
api.get('/channel/:token/:id/:name',channelControllers.channelInfo)
api.post('/channels/user',channelControllers.userChannels)
api.post('/channelsAvailable/user',channelControllers.userAllChannels)

api.post('/channel/mention',channelControllers.checkMentionChannel)

api.get('/allChannel',channelControllers.all)





//------- PRIVATE CHATS ----------
api.get('/privateChats/:token/:id',privateControllers.getPrivateMsjInOrganization)
api.get('/privateChats/:token',privateControllers.getPrivateMsj)
api.get('/privateChat/:token/:email/:id',privateControllers.privateMsjInfoOrganization)
api.get('/privateChat/:token/:email',privateControllers.privateMsjInfo)
api.post('/privateChat',privateControllers.createPrivateMsj)
api.post('/privateChat/mention',privateControllers.checkMentionPrivado)

api.get('/allPrivates',privateControllers.all)

module.exports = api