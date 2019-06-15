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

   	it('getPrivateMsj succesfull', (done) => {
        req = {body:{token:'userMockToken',
    				id: 'idOrganization',
    				email: userMock.email}}
		res = {status: function(nro){assert.equal(nro,200)
			return {send:function(obj){
							obj.should.have.property('msjs');
							//obj.msjs.should.be.equal( [ 'msj_usr2', 'msj_usr1' ]);
							return obj}}}}
		
		organizationControllers.getPrivateMsj(req,res)
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
   	})


   	describe("When do 'find organization', organization exist",()=>{
   		let organizationMock = {
   			id:'idOrganization',
			psw: 'pswOrganization',
			name: 'nameOrganization',
			channels: [],
			owner: userMock.email,
			moderators: ['moderator@gmail.com'],
			members: [userMock.email, userMock2.email],
			welcome: 'Bienvenido a la organizacion',
			photo: 'url',
			location: "Facultad de ingenieria",
			restrictedWords : []
   		}

   		let updateOneOrganization = null;
   		let addUserToChannelStub = null;
   		let findOneAndUpdateOrganizationStub = null;
   		let findOneAndUpdateUserStub = null;
   		let mongoStub = null;
	    let findOneUserStub = null; 

	    let findOrganizationStub = null;
	    let findPrivateMsjStub = null;
	    let findOneOrganizationStub = null;
	    let updateOneUserStub = null;
	    let createChannelStub = null;


   		beforeEach(() => {
	        mongoStub = sinon.stub(mongoose, 'connect').callsFake(() => {});
	    	findOneOrganizationStub = sinon.stub(Organization, 'findOne').callsFake((_, cb)=> cb(null, organizationMock));
	    	updateOneOrganization = sinon.stub(Organization, 'updateOne').callsFake((a,b, cb)=> cb(null, organizationMock));
	    	addUserToChannelStub = sinon.stub(channelController, 'addUserToChannel').callsFake((req, res)=> {res.status(200).send({message:'OK'})});
	    	findOneAndUpdateOrganizationStub = sinon.stub(Organization, 'findOneAndUpdate').callsFake((a,b, cb)=> cb(null, organizationMock));
	        findOneUserStub = sinon.stub(User, 'findOne').callsFake((user, cb)=> {if(user.email == userMock2.email){
	        																		return cb(null,userMock2)}
																		        cb(null, userMock)});
	        findOneAndUpdateUserStub = sinon.stub(User, 'findOneAndUpdate').callsFake((a, b, cb)=> cb(null, userMock));
	        

	        findOrganizationStub = sinon.stub(Organization, 'find').callsFake((_, cb)=> cb(null, userMock.organizations));
	    	findPrivateMsjStub = sinon.stub(PrivateMsj, 'find').callsFake((_, cb)=> cb(null, [{email_user2:'msj_usr2', email_user1:'msj_usr1'}]));
	    	updateOneUserStub = sinon.stub(User, 'updateOne').callsFake((a, b, cb)=> cb(null, userMock));
	    	createChannelStub = sinon.stub(channelController, 'createChannel').callsFake((req, res)=> {res.status(200).send({message:'OK'})});
	    });

	    afterEach(() => {
	        mongoStub.restore();
	        findOneOrganizationStub.restore();
	        updateOneOrganization.restore();
	        addUserToChannelStub.restore();
	        findOneAndUpdateOrganizationStub.restore();
	        findOneUserStub.restore();
	        findOneAndUpdateUserStub.restore();

	        findOrganizationStub.restore();
	        findPrivateMsjStub.restore();	        
	        updateOneUserStub.restore();
	        createChannelStub.restore();
	    });

   		it('addUserToOrganization succesfull', (done) => {
	        req = {body:{email: userMock.email,
	        			token: 'userMockToken',
	        			idOrganization: 'idOrganization',
	        			psw:'pswOrganization'}}
			res = {status: function(nro){assert.equal(nro,200)
				return {send:function(obj){
								obj.should.have.property('message');
								return obj}}}}
			
			organizationControllers.addUserToOrganization(req,res)
			done();
   		});

   		it('getInfoOrganization succesfull', (done) => {
	        req = {params:{token: 'userMockToken',
	        			organizationID: 'idOrganization'}}
			res = {status: function(nro){assert.equal(nro,200)
				return {send:function(obj){
								obj.should.have.property('organization');
								return obj}}}}
			
			organizationControllers.getInfoOrganization(req,res)
			done();
   		});

   		it('updateNameOrganization succesfull', (done) => {
	        req = {body:{token: 'userMockToken',
	        			organizationID: 'idOrganization',
	        			name: 'nameOrganization'}}
			res = {status: function(nro){assert.equal(nro,200)
				return {send:function(obj){
								obj.should.have.property('usuario');
								return obj}}}}
			
			organizationControllers.updateNameOrganization(req,res)
			done();
   		});

   		it('updatePasswordOrganization succesfull', (done) => {
	        req = {body:{token: 'userMockToken',
	        			organizationID: 'idOrganization',
	        			psw: 'pswOrganization'}}
			res = {status: function(nro){assert.equal(nro,200)
				return {send:function(obj){
								obj.should.have.property('usuario');
								return obj}}}}
			
			organizationControllers.updatePasswordOrganization(req,res)
			done();
   		});

   		it('asignModerator not succesfull - should not asign moderator because user is not member', (done) => {
	        req = {body:{token: 'userMockToken',
	        			organizationID: 'idOrganization',
	        			userEmail: 'anexistMail@gmail.com'}}
			res = {status: function(nro){assert.equal(nro,406)
				return {send:function(obj){
								obj.should.have.property('message');
								return obj}}}}
			
			organizationControllers.asignModerator(req,res)
			done();
   		});

   		it('asignModerator succesfull', (done) => {
	        req = {body:{token: 'userMockToken',
	        			organizationID: 'idOrganization',
	        			userEmail: userMock.email}}
			res = {status: function(nro){assert.equal(nro,200)
				return {send:function(obj){
								obj.should.have.property('message');
								return obj}}}}
			
			organizationControllers.asignModerator(req,res)
			done();
   		});

   		it('revokeModerator succesfull', (done) => {
	        req = {body:{token: 'userMockToken',
	        			organizationID: 'idOrganization',
	        			userEmail: 'moderator@gmail.com'}}
			res = {status: function(nro){assert.equal(nro,200)
				return {send:function(obj){
								obj.should.have.property('message');
								return obj}}}}
			
			organizationControllers.revokeModerator(req,res)
			done();
   		});

   		it('revokeModerator not succesfull - user is not moderator', (done) => {
	        req = {body:{token: 'userMockToken',
	        			organizationID: 'idOrganization',
	        			userEmail: userMock.email}}
			res = {status: function(nro){assert.equal(nro,405)
				return {send:function(obj){
								obj.should.have.property('message');
								return obj}}}}
			
			organizationControllers.revokeModerator(req,res)
			done();
   		});

   		it('hasEditPermission succesfull', (done) => {
	        req = {params:{token: 'userMockToken',
	        			id: 'idOrganization',
	        			email: userMock.email}}
			res = {status: function(nro){assert.equal(nro,200)
				return {send:function(obj){
								obj.should.have.property('message');
								return obj}}}}
			
			organizationControllers.hasEditPermission(req,res)
			done();
   		});

   		it('hasEditPermission not succesfull - user is not owner or moderator', (done) => {
	        req = {params:{token: 'userMockToken',
	        			id: 'idOrganization',
	        			email: 'noPermissionUser@gmail.com'}}
			res = {status: function(nro){assert.equal(nro,400)
				return {send:function(obj){
								obj.should.have.property('message');
								return obj}}}}
			
			organizationControllers.hasEditPermission(req,res)
			done();
   		});
   		
   		it('removeUser succesfull', (done) => {
	        req = {params:{token: 'userMockToken',
	        			id: 'idOrganization',
	        			email: userMock2.email}}
			res = {status: function(nro){assert.equal(nro,200)
				return {send:function(obj){
								obj.should.have.property('message');
								return obj}}}}
			
			organizationControllers.removeUser(req,res)
			done();
   		});

   		it('removeUser not succesfull - can not remove owner', (done) => {
	        req = {params:{token: 'userMockToken',
	        			id: 'idOrganization',
	        			email: userMock.email}}
			res = {status: function(nro){assert.equal(nro,405)
				return {send:function(obj){
								obj.should.have.property('message');
								return obj}}}}
			
			organizationControllers.removeUser(req,res)
			done();
   		});

   		it("removeUser not succesfull - user is not organization's member", (done) => {
	        req = {params:{token: 'userMockToken',
	        			id: 'idOrganization',
	        			email: 'noMember@gmail.com'}}
			res = {status: function(nro){assert.equal(nro,406)
				return {send:function(obj){
								obj.should.have.property('message');
								return obj}}}}
			
			organizationControllers.removeUser(req,res)
			done();
   		});
   		
   		it("updateWelcomeOrganization succesfull", (done) => {
	        req = {body:{token: 'userMockToken',
	        			organizationID: 'idOrganization',
	        			welcome: 'Hi! How are you?'}}
			res = {status: function(nro){assert.equal(nro,200)
				return {send:function(obj){
								obj.should.have.property('message');
								return obj}}}}
			
			organizationControllers.updateWelcomeOrganization(req,res)
			done();
   		});

   		it("updateWelcomeOrganization not succesfull - welcome message is null", (done) => {
	        req = {body:{token: 'userMockToken',
	        			organizationID: 'idOrganization',
	        			welcome: null}}
			res = {status: function(nro){assert.equal(nro,400)
				return {send:function(obj){
								obj.should.have.property('message');
								return obj}}}}
			
			organizationControllers.updateWelcomeOrganization(req,res)
			done();
   		});
   		
   		it("updatePhotoOrganization succesfull", (done) => {
	        req = {body:{token: 'userMockToken',
	        			organizationID: 'idOrganization',
	        			photo: 'newPhoto'}}
			res = {status: function(nro){assert.equal(nro,200)
				return {send:function(obj){
								obj.should.have.property('message');
								return obj}}}}
			
			organizationControllers.updatePhotoOrganization(req,res)
			done();
   		});

   		it("updatePhotoOrganization not succesfull - url photo is null", (done) => {
	        req = {body:{token: 'userMockToken',
	        			organizationID: 'idOrganization',
	        			photo: null}}
			res = {status: function(nro){assert.equal(nro,400)
				return {send:function(obj){
								obj.should.have.property('message');
								return obj}}}}
			
			organizationControllers.updatePhotoOrganization(req,res)
			done();
   		});

   	});
   	   	
});