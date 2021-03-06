process.env.NODE_ENV = 'test';

const sinon = require('sinon');
const mongoose = require('mongoose');
const assert = require('assert');
let chai = require('chai');
let should = chai.should();
let arrayCompare = require("array-compare")

const channelControllers = require('../controllers/channel');
const Channel = require('../models/channel');
const Organization = require('../models/organization');
const User = require('../models/user');

const https = require('https');

describe('CHANNEL', () => {
    let mongoStub = null;
    let findOneOrganizationStub = null;
    let findOneUserStub = null;
    let updateOneChannelStub = null;
    let findOneAndUpdateChannelStub = null;
    let updateOneOrganizationStub = null;
    let findOneAndDeleteChannelStub = null;
    let findChannelStub = null;
    let findOneChannelStub = null;
    let findUserStub = null;
    let requestHttpsStub = null;
    
    beforeEach(() => {
    	let idOrganization = 'idOrganization'
    	userMock = {
			_id: '1234qwer',
			email:"email@gmail.com",
			name: "name",
			psw: "password",
			photo: "photoUrl",
			nickname: "nickname",
			organizations: [idOrganization],
			question1: 'question1',
			question2: 'question2',
			answer1: 'answer1',
			answer2: 'answer2',
			latitud: 0,
			longitud: 0,
			recoverPasswordToken: 'itsToken',
			token_notifications:'tokenNotification'
		};

		channelMock = {
			private: true,
			id: idOrganization,
			name: 'channel',
			owner: userMock.email,
			members: [userMock.email],
			description: 'this is a channel',
			welcome: 'welcome'
		}

		channelMock2 = {
			private: false,
			id: idOrganization,
			name: 'channel2',
			owner: userMock.email,
			members: [userMock.email],
			description: 'this is a channel 2',
			welcome: 'welcome'
		}

		userMock2 = {
			_id: '12345qwert',
			email:"member@gmail.com",
			name: "name",
			psw: "password",
			photo: "photoUrl",
			nickname: "nickname",
			organizations: [idOrganization],
			question1: 'question1',
			question2: 'question2',
			answer1: 'answer1',
			answer2: 'answer2',
			latitud: 0,
			longitud: 0,
			recoverPasswordToken: 'itsToken',
			token_notifications:'tokenNotification2'
		}

		organizationMock = {
			id:idOrganization,
			psw: 'pswOrganization',
			name: 'nameOrganization',
			channels: [channelMock.name, channelMock2.name],
			owner: [userMock.email],
			moderators: ['moderator@gmail.com'],
			members: [userMock.email, userMock2.email],
			welcome: 'Bienvenido a la organizacion',
			photo: 'url',
			location: "Facultad de ingenieria",
			restrictedWords : ['cat', 'dog']
		}

    	userMock.organizations=[organizationMock.id]

    	//mongo mocks
        mongoStub = sinon.stub(mongoose, 'connect').callsFake(() => {});

        //Organization mocks
        findOneOrganizationStub = sinon.stub(Organization, 'findOne').callsFake((_, cb)=> cb(null, organizationMock));
        updateOneOrganizationStub = sinon.stub(Organization, 'updateOne').callsFake((a, b, cb)=> cb(null, organizationMock));

        //User mock
        findOneUserStub = sinon.stub(User, 'findOne').callsFake((user, cb)=> {if(user.email == userMock2.email){
	        																		return cb(null,userMock2)}
																		        cb(null, userMock)});
        findUserStub = sinon.stub(User, 'find').callsFake((user, cb)=> {if(user.email == userMock2.email){
	        																		return cb(null,[userMock2])}
																		        cb(null, [userMock])});

        //Channel mock
        updateOneChannelStub = sinon.stub(Channel, 'updateOne').callsFake((a, b, cb)=> cb(null, channelMock));
        findOneAndUpdateChannelStub = sinon.stub(Channel, 'findOneAndUpdate').callsFake((a,b, cb)=> {if(!cb){return channelMock}
        	cb(null, channelMock)});
        findOneAndDeleteChannelStub = sinon.stub(Channel, 'findOneAndDelete').callsFake((_, cb)=> cb(null, channelMock));
        findOneChannelStub = sinon.stub(Channel, 'findOne').callsFake((dataChannel, cb)=> {
        	if(dataChannel.name==channelMock.name && dataChannel.id==channelMock.id) return cb(null, channelMock);
        																					cb(null, channelMock2)});
        findChannelStub = sinon.stub(Channel, 'find').callsFake((_, cb)=> cb(null, [channelMock]));
        
        //Https mocks
        requestHttpsStub = sinon.stub(https,'request').callsFake((_,cb)=>cb({statusCode: 200,
        																	on: (algo,cb1)=>{
        																		if(algo=='data'){return cb1('data')}
        																	},
        																	write: (algo)=>{return null;},
        																	end: ()=>{return;}}))

    });

    afterEach(() => {
        mongoStub.restore();
        findOneOrganizationStub.restore();
        findOneUserStub.restore();
        updateOneChannelStub.restore();
        findOneAndUpdateChannelStub.restore();
        updateOneOrganizationStub.restore();
        findOneAndDeleteChannelStub.restore();
        findChannelStub.restore();
        findOneChannelStub.restore();
        findUserStub.restore();
        requestHttpsStub.restore();        
    });

    it('all succesfull', (done) => {
	        let req = {}
			let res = {status: function(nro){assert.equal(nro,200)
				return {send:function(obj){
								obj.should.have.property('canales');
								return obj}}}}
			
			channelControllers.all(req,res)
			done();
   		});

    it('createChannel succesfull', (done) => {
        req = {body:{id:organizationMock.id,
        		owner:userMock.email,
        		description:'this is a channel',
        		welcome: 'WELCOME!!',
        		name: 'nameNewChannel'}}
		res = {status: function(nro){assert.equal(nro,200)
			return {send:function(obj){obj.should.have.property('message')
									return obj}}}}
		channelControllers.createChannel(req,res)
		done();
   	});

   	it("createChannel not succesfull - new channel's name yet exist", (done) => {
        req = {body:{id:organizationMock.id,
        		owner:userMock.email,
        		description:'this is a channel',
        		welcome: 'WELCOME!!',
        		name: channelMock.name}}
		res = {status: function(nro){assert.equal(nro,405)
			return {send:function(obj){obj.should.have.property('message')
									return obj}}}}
		
		channelControllers.createChannel(req,res)
		done();
   	});

   	it("isChannelValid succesfull", (done) => {
        req = {params:{id:organizationMock.id,
        		name: 'newNamechannel'}}
		res = {status: function(nro){assert.equal(nro,200)
			return {send:function(obj){obj.should.have.property('message')
									return obj}}}}
		
		channelControllers.isChannelValid(req,res)
		done();
   	});

   	it("isChannelValid not succesfull - channel's name alredy exist", (done) => {
        req = {params:{id:organizationMock.id,
        		name: channelMock.name}}
		res = {status: function(nro){assert.equal(nro,400)
			return {send:function(obj){obj.should.have.property('message')
									return obj}}}}
		
		channelControllers.isChannelValid(req,res)
		done();
   	});

   	it("addUserToChannel succesfull with private channel", (done) => {
        req = {body:{token:'tokenUserMock',
        			id:organizationMock.id,
        			name: channelMock.name,
        			mo_email: userMock.email,
        			email: userMock2.email}}
		res = {status: function(nro){assert.equal(nro,200)
			return {send:function(obj){obj.should.have.property('message')
									return obj}}}}
		
		channelControllers.addUserToChannel(req,res)
		done();
   	});

   	it("addUserToChannel succesfull with public channel", (done) => {
        req = {body:{token:'tokenUserMock',
        			id:organizationMock.id,
        			name: channelMock2.name,
        			mo_email: userMock.email,
        			email: userMock2.email}}
		res = {status: function(nro){assert.equal(nro,200)
			return {send:function(obj){obj.should.have.property('message')
									return obj}}}}
		
		channelControllers.addUserToChannel(req,res)
		done();
   	});

   	it("addUserToChannel not succesfull - channel does not exist", (done) => {
        req = {body:{token:'tokenUserMock',
        			id:organizationMock.id,
        			name: 'channelAnexistent',
        			mo_email: userMock.email,
        			email: userMock2.email}}
		res = {status: function(nro){assert.equal(nro,402)
			return {send:function(obj){obj.should.have.property('message')
									return obj}}}}
		channelControllers.addUserToChannel(req,res)
		done();
   	});

   	it("addUserToChannel not succesfull - user is channel's member", (done) => {
        req = {body:{token:'tokenUserMock',
        			id:organizationMock.id,
        			name: channelMock.name,
        			mo_email: userMock.email,
        			email: userMock.email}}
		res = {status: function(nro){assert.equal(nro,403)
			return {send:function(obj){obj.should.have.property('message')
									return obj}}}}
		
		channelControllers.addUserToChannel(req,res)
		done();
   	});




   	it("addUsersToChannel succesfull", (done) => {
        req = {body:{token:'tokenUserMock',
        			id:organizationMock.id,
        			name: channelMock.name,
        			mo_email: userMock.email,
        			emails: [userMock.email]}}
		res = {status: function(nro){assert.equal(nro,200)
			return {send:function(obj){obj.should.have.property('message')
									return obj}}}}
		
		channelControllers.addUsersToChannel(req,res)
		done();
   	});


   	
   	it("removeUserFromChannel succesfull", (done) => {
        req = {params:{token:'tokenUserMock',
        			id:channelMock.id,
        			name: channelMock.name,
        			email: userMock.email}}
		res = {status: function(nro){assert.equal(nro,200)
			return {send:function(obj){obj.should.have.property('message')
									return obj}}}}
		
		channelControllers.removeUserFromChannel(req,res)
		done();
   	});

	it("removeUserFromChannel not succesfull - user not in channel", (done) => {
        req = {params:{token:'tokenUserMock',
        			id:channelMock.id,
        			name: channelMock.name,
        			email: userMock2.email}}
		res = {status: function(nro){assert.equal(nro,403)
			return {send:function(obj){obj.should.have.property('message')
									return obj}}}}
		
		channelControllers.removeUserFromChannel(req,res)
		done();
   	});

   	it("removeUserFromChannel not succesfull - channel does not exist", (done) => {
        req = {params:{token:'tokenUserMock',
        			id:channelMock.id,
        			name: 'channelAnexistent',
        			email: userMock.email}}
		res = {status: function(nro){assert.equal(nro,402)
			return {send:function(obj){obj.should.have.property('message')
									return obj}}}}
		
		channelControllers.removeUserFromChannel(req,res)
		done();
   	});

   	it("setPrivate succesfull", (done) => {
        req = {body:{token:'tokenUserMock',
        			organizationID:organizationMock.id,
        			name: channelMock.name}}
		res = {status: function(nro){assert.equal(nro,200)
			return {send:function(obj){obj.should.have.property('message')
									return obj}}}}
		
		channelControllers.setPrivate(req,res)
		done();
   	});

   	it("setDescription succesfull", (done) => {
        req = {body:{token:'tokenUserMock',
        			organizationID:organizationMock.id,
        			name: channelMock.name,
        			description: 'description'}}
		res = {status: function(nro){assert.equal(nro,200)
			return {send:function(obj){obj.should.have.property('message')
									return obj}}}}
		
		channelControllers.setDescription(req,res)
		done();
   	});
   	
   	it("setWelcome succesfull", (done) => {
        req = {body:{token:'tokenUserMock',
        			organizationID:organizationMock.id,
        			name: channelMock.name,
        			welcome: 'welcome'}}
		res = {status: function(nro){assert.equal(nro,200)
			return {send:function(obj){obj.should.have.property('message')
									return obj}}}}
		
		channelControllers.setWelcome(req,res)
		done();
   	});

   	it("getDescription succesfull", (done) => {
        req = {params:{token:'tokenUserMock',
        			id:channelMock.id,
        			name: channelMock.name}}
		res = {status: function(nro){assert.equal(nro,200)
			return {send:function(obj){obj.should.have.property('description')
									obj.description.should.be.equal(channelMock.description)
									return obj}}}}
		
		channelControllers.getDescription(req,res)
		done();
   	});
   	
   	it("getWelcome succesfull", (done) => {
        req = {params:{token:'tokenUserMock',
        			id:channelMock.id,
        			name: channelMock.name}}
		res = {status: function(nro){assert.equal(nro,200)
			return {send:function(obj){obj.should.have.property('welcome')
									obj.welcome.should.be.equal(channelMock.welcome)
									return obj}}}}
		
		channelControllers.getWelcome(req,res)
		done();
   	});

   	it("getPrivate succesfull", (done) => {
        req = {params:{token:'tokenUserMock',
        			id:channelMock.id,
        			name: channelMock.name}}
		res = {status: function(nro){assert.equal(nro,200)
			return {send:function(obj){obj.should.have.property('private')
									obj.private.should.be.equal(channelMock.private)
									return obj}}}}
		
		channelControllers.getPrivate(req,res)
		done();
   	});
   	

   	it("remove succesfull", (done) => {
        req = {params:{token:'tokenUserMock',
        			id:organizationMock.id,
        			name: channelMock.name}}
		res = {status: function(nro){assert.equal(nro,200)
			return {send:function(obj){
				obj.should.have.property('channels')
				let compare = arrayCompare(obj.channels,[channelMock2.name])
				assert(compare.missing.length == 0 && compare.added.length == 0)
				return obj}}}}
		
		channelControllers.remove(req,res)
		done();
   	});

   	it("remove not succesfull - channel does not exist", (done) => {
        req = {params:{token:'tokenUserMock',
        			id:organizationMock.id,
        			name: 'channelAnexistent'}}
		res = {status: function(nro){assert.equal(nro,405)
			return {send:function(obj){obj.should.have.property('message')
									return obj}}}}
		channelControllers.remove(req,res)
		done();
   	});
   	
   	it("channelInfo succesfull", (done) => {
        req = {params:{token:'tokenUserMock',
        			id:channelMock.id,
        			name: channelMock.name}}
		res = {status: function(nro){assert.equal(nro,200)
			return {send:function(obj){obj.should.have.property('channel')
									obj.channel.should.be.equal(channelMock)
									return obj}}}}
		channelControllers.channelInfo(req,res)
		done();
   	});
   	
   	it("userChannels succesfull", (done) => {
        req = {body:{token:'tokenUserMock',
        			id:channelMock.id,
        			email: userMock.email}}
		res = {status: function(nro){assert.equal(nro,200)
			return {send:function(obj){obj.should.have.property('channel')
									//obj.channel.should.be.equal([channelMock.name])
									let compare = arrayCompare(obj.channel,[channelMock.name])
									//son dos arrays iguales:
									assert(compare.missing.length == 0 && compare.added.length == 0)
									return obj}}}}
		channelControllers.userChannels(req,res)
		done();
   	});
   	
   	it("userAllChannels succesfull", (done) => {
        req = {body:{token:'tokenUserMock',
        			id:channelMock.id,
        			email: userMock.email}}
		res = {status: function(nro){assert.equal(nro,200)
			return {send:function(obj){obj.should.have.property('channel')
									//obj.channel.should.be.equal([channelMock.name])
									let compare = arrayCompare(obj.channel,[channelMock.name])
									//son dos arrays iguales:
									assert(compare.missing.length == 0 && compare.added.length == 0)
									return obj}}}}
		channelControllers.userAllChannels(req,res)
		done();
   	});

   	it("checkMentionChannel succesfull", (done) => {
        req = {body:{token:'tokenUserMock',
        			id:channelMock.id,
        			message:`hello @${userMock2.email}`,
        			channel:channelMock.name}}
		res = {status: function(nro){assert.equal(nro,200)
			return {send:function(obj){
				obj.should.have.property('message')
									return obj}}}}
		channelControllers.checkMentionChannel(req,res)
		done();
   	});

   	it("titoCheck succesfull without mentions to tito", (done) => {
        req = {body:{token:'tokenUserMock',
        			id:channelMock.id,
        			message:`hello @${userMock2.email}`,
        			channel:channelMock.name}}
		res = {status: function(nro){assert.equal(nro,200)
			return {send:function(obj){
				obj.should.have.property('message')
				return obj}}}}
		channelControllers.titoCheck(req,res)
		done();
   	});

   	it("titoCheck succesfull with mentions to tito", (done) => {
        req = {body:{token:'tokenUserMock',
        			id:channelMock.id,
        			message:`hello @tito`,
        			channel:channelMock.name}}
		res = {status: function(nro){assert.equal(nro,200)
			return {send:function(obj){
				obj.should.have.property('message')
				return obj}}}}
		channelControllers.titoCheck(req,res)
		done();
   	});
});