process.env.NODE_ENV = 'test';

const sinon = require('sinon');
const mongoose = require('mongoose');
const assert = require('assert');
let chai = require('chai');
let should = chai.should();

const channelControllers = require('../controllers/channel');
const Channel = require('../models/channel');
const Organization = require('../models/organization');
const User = require('../models/user');



let userMock = {
			_id: '1234qwer',
			email:"email@gmail.com",
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
		};

let channelMock = {
	private: true,
	id: 'idChannel',
	name: 'channel',
	owner: userMock.email,
	members: [userMock.email],
	description: 'this is a channel',
	welcome: 'welcome'
}
let userMock2 = {
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

let organizationMock = {
	id:'idOrganization',
	psw: 'pswOrganization',
	name: 'nameOrganization',
	channels: [channelMock.name],
	owner: userMock.email,
	moderators: ['moderator@gmail.com'],
	members: [userMock.email, userMock2.email],
	welcome: 'Bienvenido a la organizacion',
	photo: 'url',
	location: "Facultad de ingenieria",
	restrictedWords : ['cat', 'dog']
}

describe('CHANNEL', () => {
    let mongoStub = null;
    let findOneOrganizationStub = null;
    let findOneUserStub = null;
    let updateOneChannelStub = null;

    beforeEach(() => {
        mongoStub = sinon.stub(mongoose, 'connect').callsFake(() => {});
        findOneOrganizationStub = sinon.stub(Organization, 'findOne').callsFake((_, cb)=> cb(null, organizationMock));
        findOneUserStub = sinon.stub(User, 'findOne').callsFake((user, cb)=> {if(user.email == userMock2.email){
	        																		return cb(null,userMock2)}
																		        cb(null, userMock)});
        updateOneChannelStub = sinon.stub(Channel, 'updateOne').callsFake((a, b, cb)=> cb(null, channelMock));
    });

    afterEach(() => {
        mongoStub.restore();
        findOneOrganizationStub.restore();
        findOneUserStub.restore();
        updateOneChannelStub.restore();
    });

    it('createChannel succesfull', (done) => {
        req = {body:{id:'idOrganization',
        		owner:"email@gmail.com",
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
        req = {body:{id:'idOrganization',
        		owner:"email@gmail.com",
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
        req = {params:{id:'idOrganization',
        		name: 'newNamechannel'}}
		res = {status: function(nro){assert.equal(nro,200)
			return {send:function(obj){obj.should.have.property('message')
									return obj}}}}
		
		channelControllers.isChannelValid(req,res)
		done();
   	});

   	it("isChannelValid not succesfull - channel's name alredy exist", (done) => {
        req = {params:{id:'idOrganization',
        		name: channelMock.name}}
		res = {status: function(nro){assert.equal(nro,400)
			return {send:function(obj){obj.should.have.property('message')
									return obj}}}}
		
		channelControllers.isChannelValid(req,res)
		done();
   	});

   	it("addUserToChannel succesfull", (done) => {
        req = {body:{token:'tokenUserMock',
        			id:'idOrganization',
        			name: 'channel',
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
        			id:'idOrganization',
        			name: 'channelAnexistent',
        			mo_email: userMock.email,
        			email: userMock2.email}}
		res = {status: function(nro){assert.equal(nro,402)
			return {send:function(obj){obj.should.have.property('message')
									return obj}}}}
		
		channelControllers.addUserToChannel(req,res)
		done();
   	});
   	
   	
});