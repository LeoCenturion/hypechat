process.env.NODE_ENV = 'test';

const sinon = require('sinon');
const mongoose = require('mongoose');
const assert = require('assert');
let chai = require('chai');
let should = chai.should();

const channelControllers = require('../controllers/channel');
const Channel = require('../models/channel');
const Organization = require('../models/organization');

let userMock = {
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

let organizationMock = {
	id:'idOrganization',
	psw: 'pswOrganization',
	name: 'nameOrganization',
	channels: ['channel'],
	owner: userMock.email,
	moderators: ['moderator@gmail.com'],
	members: [userMock.email],
	welcome: 'Bienvenido a la organizacion',
	photo: 'url',
	location: "Facultad de ingenieria",
	restrictedWords : ['cat', 'dog']
}

describe('CHANNEL', () => {
    let mongoStub = null;
    let findOneOrganizationStub = null;

    beforeEach(() => {
        mongoStub = sinon.stub(mongoose, 'connect').callsFake(() => {});
        findOneOrganizationStub = sinon.stub(Organization, 'findOne').callsFake((_, cb)=> cb(null, organizationMock));
    });

    afterEach(() => {
        mongoStub.restore();
        findOneOrganizationStub.restore();
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
        		name: 'channel'}}
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
        		name: 'channel'}}
		res = {status: function(nro){assert.equal(nro,400)
			return {send:function(obj){obj.should.have.property('message')
									return obj}}}}
		
		channelControllers.isChannelValid(req,res)
		done();
   	});
   	
});