process.env.NODE_ENV = 'test';

const sinon = require('sinon');
const mongoose = require('mongoose');
const assert = require('assert');
let chai = require('chai');
let should = chai.should();

const organizationControllers = require('../controllers/organization');
const User = require('../models/user');
const Organization = require('../models/organization');
const PrivateMsj = require('../models/privateMsj');
const channelController = require('../controllers/channel');
const Channel = require('../models/channel');

userMock = {
			_id: '1234qwer',
			email:"email@gmail.com",
			name: "name",
			psw: "password",
			photo: "photoUrl",
			nickname: "nickname",
			organizations: [],
			question1: 'question1',
			question2: 'question2',
			answer1: 'answer1',
			answer2: 'answer2',
			latitud: 0,
			longitud: 0,
			recoverPasswordToken: 'itsToken'
		};

userMock2 = {
	_id: '12345qwert',
	email:"member@gmail.com",
	name: "name",
	psw: "password",
	photo: "photoUrl",
	nickname: "nickname",
	organizations: ['idOrganization'],
	question1: 'question1',
	question2: 'question2',
	answer1: 'answer1',
	answer2: 'answer2',
	latitud: 0,
	longitud: 0,
	recoverPasswordToken: 'itsToken'
}
describe('ORGANIZATION', () => {
	describe("When do 'find organization', organization does not exist",()=>{

    let mongoStub = null;
    let findOneUserStub = null; 
    let findOrganizationStub = null;
    let findPrivateMsjStub = null;
    let findOneOrganizationStub = null;
    let updateOneUserStub = null;
    let createChannelStub = null;

    beforeEach(() => {
    	userMock = {
				_id: '1234qwer',
				email:"email@gmail.com",
				name: "name",
				psw: "password",
				photo: "photoUrl",
				nickname: "nickname",
				organizations: [],
				question1: 'question1',
				question2: 'question2',
				answer1: 'answer1',
				answer2: 'answer2',
				latitud: 0,
				longitud: 0,
				recoverPasswordToken: 'itsToken'
			};

			userMock2 = {
				_id: '12345qwert',
				email:"member@gmail.com",
				name: "name",
				psw: "password",
				photo: "photoUrl",
				nickname: "nickname",
				organizations: ['idOrganization'],
				question1: 'question1',
				question2: 'question2',
				answer1: 'answer1',
				answer2: 'answer2',
				latitud: 0,
				longitud: 0,
				recoverPasswordToken: 'itsToken'
			}

        mongoStub = sinon.stub(mongoose, 'connect').callsFake(() => {});
        findOneUserStub = sinon.stub(User, 'findOne').callsFake((_, cb)=> cb(null, userMock));
        findOrganizationStub = sinon.stub(Organization, 'find').callsFake((_, cb)=> cb(null, userMock.organizations));
    	findPrivateMsjStub = sinon.stub(PrivateMsj, 'find').callsFake((_, cb)=> cb(null, [{email_user2:'msj_usr2', email_user1:'msj_usr1'}]));
    	findOneOrganizationStub = sinon.stub(Organization, 'findOne').callsFake((_, cb)=> cb(null, null));
    	updateOneUserStub = sinon.stub(User, 'updateOne').callsFake((a, b, cb)=> cb(null, userMock));
    	createChannelStub = sinon.stub(channelController, 'createChannel').callsFake((req, res)=> {res.status(200).send({message:'OK'})});

    });

    afterEach(() => {
        mongoStub.restore();
        findOneUserStub.restore();
        findOrganizationStub.restore();
        findPrivateMsjStub.restore();
        findOneOrganizationStub.restore();
        updateOneUserStub.restore();
        createChannelStub.restore();
    });

    it('getUserOrganizations succesfull', (done) => {

        req = {params:{email:userMock.email}}
		res = {status: function(nro){assert.equal(nro,200)
			return {send:function(obj){
							obj.should.have.property('organizations');
							//obj.organizations.should.be.equal(userMock.organizations);
							return obj}}}}
		
		organizationControllers.getUserOrganizations(req,res)
		done();
   	});

   	it('isOrganizationIDValid succesfull', (done) => {
        req = {params:{organizationID: 'idOrganization'}}
		res = {status: function(nro){assert.equal(nro,200)
			return {send:function(obj){
							obj.should.have.property('message');
							return obj}}}}
		
		organizationControllers.isOrganizationIDValid(req,res)
		done();
   	});

   	it('createOrganization succesfull', (done) => {
        req = {body:{email: userMock.email,
        			id: 'idOrganization',
        			psw:'pswOrganization',
        			name: 'nameOrganization'}}
		res = {status: function(nro){assert.equal(nro,200)
			return {send:function(obj){
							obj.should.have.property('message');
							return obj}}}}
		
		organizationControllers.createOrganization(req,res)
		done();
   	});

   	it("checkMention no succesfull", (done)=>{
   			let req = {body:{token:userMock.token, message:"it is a message"}}
   			let res = {status: function(nro){assert.equal(nro,500)
				return {send:function(obj){
								obj.should.have.property('message')
								return obj}}}}
			organizationControllers.checkMention(req,res);
   			done();
   		})

   	it("getTotalMessages succesfull", (done)=>{
   			let req = {params:{token:userMock.token}}
   			let res = {status: function(nro){
   				assert.equal(nro,200)
				return {send:function(obj){
								obj.should.have.property('organizations')
								return obj}}}}
			organizationControllers.getTotalMessages(req,res);
   			done();
   		})

   	})

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

   	describe("When do 'find organization', organization exist",()=>{
   		let updateOneOrganization = null;
   		let addUserToChannelStub = null;
   		let findOneAndUpdateOrganizationStub = null;
   		let findOneAndUpdateUserStub = null;
   		let mongoStub = null;
	    let findOneUserStub = null; 
	    let findUserStub = null;
	    let findChannelStub = null;
	    let findOneAndUpdateChannelStub = null;

	    let findOrganizationStub = null;
	    let findPrivateMsjStub = null;
	    let findOneOrganizationStub = null;
	    let updateOneUserStub = null;
	    let createChannelStub = null;

	    let findOneChannelStub = null;
	    //let updateOneChannelStub = null;

	    let moderatorEmail = 'moderator@gmail.com';

   		beforeEach(() => {
   			userMock = {
				_id: '1234qwer',
				email:"email@gmail.com",
				name: "name",
				psw: "password",
				photo: "photoUrl",
				nickname: "nickname",
				organizations: ["idOrganization"],
				question1: 'question1',
				question2: 'question2',
				answer1: 'answer1',
				answer2: 'answer2',
				latitud: 0,
				longitud: 0,
				recoverPasswordToken: 'itsToken',
				token: 'userMockToken'
			};

			userMock2 = {
				_id: '12345qwert',
				email:"member@gmail.com",
				name: "name",
				psw: "password",
				photo: "photoUrl",
				nickname: "nickname",
				organizations: ['idOrganization'],
				question1: 'question1',
				question2: 'question2',
				answer1: 'answer1',
				answer2: 'answer2',
				latitud: 0,
				longitud: 0,
				recoverPasswordToken: 'itsToken',
				token: 'userMock2Token'
			}

			userMock3 = {
				_id: '12345qwert',
				email:"noMember@gmail.com",
				name: "name",
				psw: "password",
				photo: "photoUrl",
				nickname: "nickname",
				organizations: [],
				question1: 'question1',
				question2: 'question2',
				answer1: 'answer1',
				answer2: 'answer2',
				latitud: 0,
				longitud: 0,
				recoverPasswordToken: 'itsToken',
				token: 'userMock3Token'
			};

			channelMock = {
				private: false,
				id: 'channel',
				name: 'channelName',
				owner: userMock.email,
				members: [userMock.email],
				description: "it's a channel",
				welcome: 'Welcome to the channel'
			}

			organizationMock = {
	   			id:'idOrganization',
				psw: 'pswOrganization',
				name: 'nameOrganization',
				channels: [channelMock.id],
				owner: userMock.email,
				moderators: [moderatorEmail],
				members: [userMock.email, userMock2.email],
				welcome: 'Bienvenido a la organizacion',
				photo: 'url',
				location: "Facultad de ingenieria",
				restrictedWords : ['cat', 'dog']
   			}

	        mongoStub = sinon.stub(mongoose, 'connect').callsFake(() => {});
	    	findOneOrganizationStub = sinon.stub(Organization, 'findOne').callsFake((_, cb)=> cb(null, organizationMock));
	    	updateOneOrganization = sinon.stub(Organization, 'updateOne').callsFake((a,b, cb)=> cb(null, organizationMock));
	    	addUserToChannelStub = sinon.stub(channelController, 'addUserToChannel').callsFake((req, res)=> {res.status(200).send({message:'OK'})});
	    	findOneAndUpdateOrganizationStub = sinon.stub(Organization, 'findOneAndUpdate').callsFake((a,b, cb)=> cb(null, organizationMock));
	        findOneUserStub = sinon.stub(User, 'findOne').callsFake((user, cb)=> {
	        																	if(user.email == userMock2.email ||user.token ==userMock2.token){
	        																		return cb(null,userMock2)}
	        																	else if(user.email == userMock.email ||user.token ==userMock.token){
	        																		return cb(null, userMock)
	        																	}
	        																		cb(null, userMock3)
																		        });
	        findOneAndUpdateUserStub = sinon.stub(User, 'findOneAndUpdate').callsFake((a, b, cb)=> cb(null, userMock));
	        findUserStub = sinon.stub(User, 'find').callsFake((user, cb)=> { cb(null, [userMock,userMock2])});

	        findOrganizationStub = sinon.stub(Organization, 'find').callsFake((_, cb)=> cb(null, userMock.organizations));
	    	findPrivateMsjStub = sinon.stub(PrivateMsj, 'find').callsFake((_, cb)=> cb(null, [{email_user2:'msj_usr2', email_user1:'msj_usr1'}]));
	    	updateOneUserStub = sinon.stub(User, 'updateOne').callsFake((a, b, cb)=> cb(null, userMock));
	    	createChannelStub = sinon.stub(channelController, 'createChannel').callsFake((req, res)=> {res.status(200).send({message:'OK'})});
	    	findChannelStub = sinon.stub(Channel, 'find').callsFake((_, cb)=>{cb(null, [channelMock])})
	    	findOneAndUpdateChannelStub = sinon.stub(Channel, 'findOneAndUpdate').callsFake((a, b)=>{return channelMock})
	    	findOneChannelStub = sinon.stub(Channel, 'findOne').callsFake((a, cb)=>cb(null,channelMock))
	    	//updateOneChannelStub = sinon.stub(Channel, 'updateOne').callsFake((a, b, cb)=>cb(null,channelMock))
	    });

	    afterEach(() => {
	        mongoStub.restore();
	        findOneOrganizationStub.restore();
	        updateOneOrganization.restore();
	        addUserToChannelStub.restore();
	        findOneAndUpdateOrganizationStub.restore();
	        findOneUserStub.restore();
	        findOneAndUpdateUserStub.restore();
	        findUserStub.restore();
	        findChannelStub.restore();
	        findOneAndUpdateChannelStub.restore();

	        findOrganizationStub.restore();
	        findPrivateMsjStub.restore();	        
	        updateOneUserStub.restore();
	        createChannelStub.restore();

	        findOneChannelStub.restore();
	        //updateOneChannelStub.restore();
	    });

	    it('all succesfull', (done) => {
	        let req = {}
			let res = {status: function(nro){assert.equal(nro,200)
				return {send:function(obj){
								obj.should.have.property('organizations');
								return obj}}}}
			
			organizationControllers.all(req,res);
			done();
   		});

   		it('addUserToOrganization succesfull', (done) => {
	        let req = {body:{email: userMock3.email,
	        			token: userMock3.token,
	        			idOrganization: organizationMock.id,
	        			psw: organizationMock.psw}}
			let res = {status: function(nro){assert.equal(nro,200)
				return {send:function(obj){
								obj.should.have.property('message');
								return obj}}}}
			
			organizationControllers.addUserToOrganization(req,res)
			done();
   		});

   		it('addUserToOrganization no succesfull because user is member', (done) => {
	        let req = {body:{email: userMock.email,
	        			token: userMock.token,
	        			idOrganization: organizationMock.id,
	        			psw: organizationMock.psw}}
			let res = {status: function(nro){assert.equal(nro,400)
				return {send:function(obj){
								obj.should.have.property('message');
								return obj}}}}
			
			organizationControllers.addUserToOrganization(req,res)
			done();
   		});

   		it('getInfoOrganization succesfull', (done) => {
	        let req = {params:{token: userMock.token,
	        			organizationID: organizationMock.id}}
			let res = {status: function(nro){assert.equal(nro,200)
				return {send:function(obj){
								obj.should.have.property('organization');
								return obj}}}}
			
			organizationControllers.getInfoOrganization(req,res)
			done();
   		});

   		it('updateNameOrganization succesfull', (done) => {
	        let req = {body:{token: userMock.token,
	        			organizationID: organizationMock.id,
	        			name: 'newNameOrganization'}}
			let res = {status: function(nro){assert.equal(nro,200)
				return {send:function(obj){
								obj.should.have.property('organization');
								return obj}}}}
			
			organizationControllers.updateNameOrganization(req,res)
			done();
   		});

   		it('updatePasswordOrganization succesfull', (done) => {
	        let req = {body:{token: userMock.token,
	        			organizationID: organizationMock.id,
	        			psw: 'newPswOrganization'}}
			let res = {status: function(nro){assert.equal(nro,200)
				return {send:function(obj){
								obj.should.have.property('usuario');
								return obj}}}}
			
			organizationControllers.updatePasswordOrganization(req,res)
			done();
   		});

   		it('asignModerator not succesfull - should not asign moderator because user is not member', (done) => {
	        let req = {body:{token: userMock.token,
	        			organizationID: organizationMock.id,
	        			userEmail: 'anexistMail@gmail.com'}}
			let res = {status: function(nro){assert.equal(nro,406)
				return {send:function(obj){
								obj.should.have.property('message');
								return obj}}}}
			
			organizationControllers.asignModerator(req,res)
			done();
   		});

   		it('asignModerator succesfull', (done) => {
	        let req = {body:{token: userMock.token,
	        			organizationID: organizationMock.id,
	        			userEmail: userMock.email}}
			let res = {status: function(nro){assert.equal(nro,200)
				return {send:function(obj){
								obj.should.have.property('message');
								return obj}}}}
			
			organizationControllers.asignModerator(req,res)
			done();
   		});

   		it('revokeModerator succesfull', (done) => {
	        let req = {body:{token: userMock.token,
	        			organizationID: organizationMock.id,
	        			userEmail: moderatorEmail}}
			let res = {status: function(nro){assert.equal(nro,200)
				return {send:function(obj){
								obj.should.have.property('message');
								return obj}}}}
			
			organizationControllers.revokeModerator(req,res)
			done();
   		});

   		it('revokeModerator not succesfull - user is not moderator', (done) => {
	        let req = {body:{token: userMock.token,
	        			organizationID: organizationMock.id,
	        			userEmail: userMock.email}}
			let res = {status: function(nro){assert.equal(nro,405)
				return {send:function(obj){
								obj.should.have.property('message');
								return obj}}}}
			
			organizationControllers.revokeModerator(req,res)
			done();
   		});

   		it('hasEditPermission succesfull', (done) => {
	        let req = {params:{token: userMock.token,
	        			id: organizationMock.id,
	        			email: userMock.email}}
			let res = {status: function(nro){assert.equal(nro,200)
				return {send:function(obj){
								obj.should.have.property('message');
								return obj}}}}
			
			organizationControllers.hasEditPermission(req,res)
			done();
   		});

   		it('hasEditPermission not succesfull - user is not owner or moderator', (done) => {
	        let req = {params:{token: userMock.token,
	        			id: organizationMock.id,
	        			email: 'noPermissionUser@gmail.com'}}
			let res = {status: function(nro){assert.equal(nro,400)
				return {send:function(obj){
								obj.should.have.property('message');
								return obj}}}}
			
			organizationControllers.hasEditPermission(req,res)
			done();
   		});
   		
   		it('removeUser succesfull', (done) => {
	        let req = {params:{token: userMock.token,
	        			id: organizationMock.id,
	        			email: userMock2.email}}
			let res = {status: function(nro){assert.equal(nro,200)
				return {send:function(obj){
								obj.should.have.property('message');
								return obj}}}}
			
			organizationControllers.removeUser(req,res)
			done();
   		});

   		it('removeUser not succesfull - can not remove owner', (done) => {
	        let req = {params:{token: userMock.token,
	        			id: organizationMock.id,
	        			email: userMock.email}}
			let res = {status: function(nro){assert.equal(nro,405)
				return {send:function(obj){
								obj.should.have.property('message');
								return obj}}}}
			
			organizationControllers.removeUser(req,res)
			done();
   		});

   		it("removeUser not succesfull - user is not organization's member", (done) => {
	        let req = {params:{token: userMock.token,
	        			id: organizationMock.id,
	        			email: 'noMember@gmail.com'}}
			let res = {status: function(nro){assert.equal(nro,406)
				return {send:function(obj){
								obj.should.have.property('message');
								return obj}}}}
			
			organizationControllers.removeUser(req,res)
			done();
   		});
   		
   		it("updateWelcomeOrganization succesfull", (done) => {
	        let req = {body:{token: userMock.token,
	        			organizationID: organizationMock.id,
	        			welcome: 'Hi! How are you?'}}
			let res = {status: function(nro){assert.equal(nro,200)
				return {send:function(obj){
								obj.should.have.property('message');
								return obj}}}}
			
			organizationControllers.updateWelcomeOrganization(req,res)
			done();
   		});

   		it("updateWelcomeOrganization not succesfull - welcome message is null", (done) => {
	        let req = {body:{token: userMock.token,
	        			organizationID: organizationMock.id,
	        			welcome: null}}
			let res = {status: function(nro){assert.equal(nro,400)
				return {send:function(obj){
								obj.should.have.property('message');
								return obj}}}}
			
			organizationControllers.updateWelcomeOrganization(req,res)
			done();
   		});
   		
   		it("updatePhotoOrganization succesfull", (done) => {
	        let req = {body:{token: userMock.token,
	        			organizationID: organizationMock.id,
	        			photo: 'newPhoto'}}
			let res = {status: function(nro){assert.equal(nro,200)
				return {send:function(obj){
								obj.should.have.property('message');
								return obj}}}}
			
			organizationControllers.updatePhotoOrganization(req,res)
			done();
   		});

   		it("updatePhotoOrganization not succesfull - url photo is null", (done) => {
	        let req = {body:{token: userMock.token,
	        			organizationID: organizationMock.id,
	        			photo: null}}
			let res = {status: function(nro){assert.equal(nro,400)
				return {send:function(obj){
								obj.should.have.property('message');
								return obj}}}}
			
			organizationControllers.updatePhotoOrganization(req,res)
			done();
   		});

   		it("checkMessage succesfull", (done) => {
	        let req = {body:{userToken: userMock.token,
	        			organizationID: organizationMock.id,
	        			message: 'dog Hello cat cat',
	        			channelName: null}}
			let res = {status: function(nro){assert.equal(nro,200)
				return {send:function(obj){
								obj.should.have.property('message');
								obj.message.should.be.equal('*** Hello *** ***');
								return obj}}}}
			
			organizationControllers.checkMessage(req,res);
			done();
   		});

   		it("getLocationsOrganization succesfull", (done) => {
	        let req = {params:{token: userMock.token}}
			let res = {status: function(nro){assert.equal(nro,200)
				return {send:function(obj){
								obj.should.have.property('users')
								/*obj.users.should.be.equal( [ { nickname: 'nickname',
								email: 'email@gmail.com',
								longitud: 0,
								latitud: 0 },
								{ nickname: 'nickname',
								email: 'member@gmail.com',
								longitud: 0,
								latitud: 0 } ])*/
								return obj}}}}
			
			organizationMock.members = [userMock.email, userMock2.email]
			organizationControllers.getLocationsOrganization(req,res);
			done();
   		});

   		it("getRestrectedWords succesfull", (done)=>{
   			let req = {params:{id:organizationMock.id, token:userMock.token}}
   			let res = {status: function(nro){assert.equal(nro,200)
				return {send:function(obj){
								obj.should.have.property('restrictedWords')
								obj.restrictedWords.should.be.equal(organizationMock.restrictedWords)
								return obj}}}}
			organizationControllers.getRestrictedWords(req,res);
   			done();
   		})

   		it("addRestrictedWords succesfull", (done)=>{
   			let req = {params:{id:organizationMock.id, token:userMock.token}, body:{restrictedWords:'newRestrictedWord'}}
   			let res = {status: function(nro){assert.equal(nro,200)
				return {send:function(obj){
								obj.should.have.property('restrictedWords')
								//obj.restrictedWords.should.be.equal(organizationMock.restrictedWords.concat('newRestrictedWord'))
								return obj}}}}
			organizationControllers.addRestrictedWords(req,res);
   			done();
   		})

   		it("addRestrictedWords no succesfull bucause user is not authorizate", (done)=>{
   			let req = {params:{id:organizationMock.id, token:userMock2.token}, body:{restrictedWords:'newRestrictedWord'}}
   			let res = {status: function(nro){assert.equal(nro,401)
				return {send:function(obj){
								obj.should.have.property('message')
								//obj.restrictedWords.should.be.equal(organizationMock.restrictedWords.concat('newRestrictedWord'))
								return obj}}}}
			organizationControllers.addRestrictedWords(req,res);
   			done();
   		})

   		it("addRestrictedWords no succesfull because user is not member", (done)=>{
   			let req = {params:{id:organizationMock.id, token:userMock3.token}, body:{restrictedWords:'newRestrictedWord'}}
   			let res = {status: function(nro){assert.equal(nro,406)
				return {send:function(obj){
								obj.should.have.property('message')
								//obj.restrictedWords.should.be.equal(organizationMock.restrictedWords.concat('newRestrictedWord'))
								return obj}}}}
			organizationControllers.addRestrictedWords(req,res);
   			done();
   		})

   		it("deleteRestrictedWords succesfull", (done)=>{
   			let req = {params:{id:organizationMock.id, token:userMock.token}, body:{restrictedWords:'cat'}}
   			let res = {status: function(nro){assert.equal(nro,200)
				return {send:function(obj){
								obj.should.have.property('restrictedWords')
								//obj.restrictedWords.should.be.equal(organizationMock.restrictedWords)
								return obj}}}}
			organizationControllers.deleteRestrictedWords(req,res);
   			done();
   		})

   		it("deleteRestrictedWords no succesfull bucause user is not authorizate", (done)=>{
   			let req = {params:{id:organizationMock.id, token:userMock2.token}, body:{restrictedWords:'cat'}}
   			let res = {status: function(nro){assert.equal(nro,401)
				return {send:function(obj){
								obj.should.have.property('message')
								//obj.restrictedWords.should.be.equal(organizationMock.restrictedWords)
								return obj}}}}
			organizationControllers.deleteRestrictedWords(req,res);
   			done();
   		})

   		it("deleteRestrictedWords no succesfull because user is not member", (done)=>{
   			let req = {params:{id:organizationMock.id, token:userMock3.token}, body:{restrictedWords:'cat'}}
   			let res = {status: function(nro){assert.equal(nro,406)
				return {send:function(obj){
								obj.should.have.property('message')
								//obj.restrictedWords.should.be.equal(organizationMock.restrictedWords)
								return obj}}}}
			organizationControllers.deleteRestrictedWords(req,res);
   			done();
   		})

   		it("checkMention succesfull", (done)=>{
   			let req = {body:{token:userMock.token, message:`it is a message @${userMock2.email}`}}
   			let res = {status: function(nro){assert.equal(nro,200)
				return {send:function(obj){
								obj.should.have.property('mentions')
								return obj}}}}
			organizationControllers.checkMention(req,res);
   			done();
   		})

   		it("checkMention succesfull", (done)=>{
   			let req = {body:{token:userMock.token, message:`it is a message `}}
   			let res = {status: function(nro){assert.equal(nro,200)
				return {send:function(obj){
								obj.should.have.property('mentions')
								return obj}}}}
			organizationControllers.checkMention(req,res);
   			done();
   		})

   		it("getTotalMessages no succesfull", (done)=>{
   			let req = {params:{token:userMock.token}}
   			let res = {status: function(nro){
   				//no hace la promesa
   				assert.equal(nro,500)
				return {send:function(obj){
								obj.should.have.property('message')
								return obj}}}}
			organizationControllers.getTotalMessages(req,res);
   			done();
   		})

   	});
   	   	
});