process.env.NODE_ENV = 'test';

const sinon = require('sinon');
const mongoose = require('mongoose');
const assert = require('assert');
let chai = require('chai');
let should = chai.should();

const privateMsjControllers = require('../controllers/privateMsj');
const PrivateMsj = require('../models/privateMsj');
const User = require('../models/user');
const Organization = require('../models/organization');

let arrayCompare = require("array-compare")

describe('PRIVATE MESSAGE', () => {
	let mongoStub = null;
    let findPrivateMsjStub = null;
    let findOneUserStrub = null;
    let findOneOrganizationStub = null;
    let saveStub = null;

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
			recoverPasswordToken: 'itsToken'
		};

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
			recoverPasswordToken: 'itsToken'
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

		privateMsjMock = {
		    email_user1: userMock.email,
		    email_user2: userMock2.email,
			id: null,
			_id: 'id'
		}

		private_msj_org = new PrivateMsj({
                            email_user1: userMock2.email,
                            email_user2: userMock.email,
                            id: organizationMock.id
                        })

        mongoStub = sinon.stub(mongoose, 'connect').callsFake(() => {});
        findPrivateMsjStub = sinon.stub(PrivateMsj, 'find').callsFake((_,cb)=> cb(null, [privateMsjMock]))
    	findOneUserStrub = sinon.stub(User, 'findOne').callsFake((_,cb)=>cb(null,userMock))
    	findOneOrganizationStub = sinon.stub(Organization, 'findOne').callsFake((_,cb)=>cb(null, organizationMock))
    	saveStub = sinon.stub(private_msj_org,'save').callsFake((cb)=>cb(null))
    });

    afterEach(() => {
        mongoStub.restore();  
        findPrivateMsjStub.restore();
        findOneUserStrub.restore();
        findOneOrganizationStub.restore();
        saveStub.restore();
    });

	describe('findOnePrivateMsjStub no returns null',()=>{
    
	    let findOnePrivateMsjStub = null;
	    beforeEach(() => {
	    	
	    	findOnePrivateMsjStub = sinon.stub(PrivateMsj, 'findOne').callsFake((data,cb)=>{
	    		if(data.email_user1== userMock2.email) {return cb(null,null)}
	    		return cb(null, privateMsjMock)
	    	    });
	    });

	    afterEach(() => {
	        findOnePrivateMsjStub.restore();
	    });

	    it('all succesfull', (done) => {
	        let req = {}
			let res = {status: function(nro){assert.equal(nro,200)
				return {send:function(obj){
								obj.should.have.property('privateMsj');
								return obj}}}}
			
			privateMsjControllers.all(req,res)
			done();
		});

		it('getPrivateMsj succesfull', (done) => {
	        let req = {params:{token:userMock.token}}
			let res = {status: function(nro){assert.equal(nro,200)
				return {send:function(obj){
								obj.should.have.property('msjs');
								assert(obj.msjs.length ==2);
								let compare = arrayCompare(obj.msjs,[userMock2.email, userMock.email])
								//son dos arrays iguales:
								assert(compare.missing.length == 0 && compare.added.length == 0)
								return obj}}}}
			
			privateMsjControllers.getPrivateMsj(req,res)
			done();
		});

		it('getPrivateMsjInOrganization succesfull', (done) => {
	        let req = {params:{token:userMock.token, id:organizationMock.id}}
			let res = {status: function(nro){assert.equal(nro,200)
				return {send:function(obj){
								obj.should.have.property('msjs');
								assert(obj.msjs.length ==2);
								let compare = arrayCompare(obj.msjs,[userMock2.email, userMock.email])
								//son dos arrays iguales:
								assert(compare.missing.length == 0 && compare.added.length == 0)
								return obj}}}}
			
			privateMsjControllers.getPrivateMsjInOrganization(req,res)
			done();
		});
		
		it('privateMsjInfo succesfull', (done) => {
	        let req = {params:{token:userMock.token, email:userMock.email }}
			let res = {status: function(nro){assert.equal(nro,200)
				return {send:function(obj){
								obj.should.have.property('private_msj');
								let compare = arrayCompare([obj.private_msj._id, obj.private_msj.name],[privateMsjMock._id, userMock.email])
								//son dos arrays iguales:
								assert(compare.missing.length == 0 && compare.added.length == 0)
								return obj}}}}
			
			privateMsjControllers.privateMsjInfo(req,res)
			done();
		});

		it('privateMsjInfo succesfull with other user', (done) => {
	        let req = {params:{token:userMock.token, email:userMock2.email, id:organizationMock.id }}
			let res = {status: function(nro){assert.equal(nro,200)
				return {send:function(obj){
								obj.should.have.property('private_msj');
								let compare = arrayCompare([obj.private_msj._id, obj.private_msj.name],[privateMsjMock._id, userMock2.email])
								//son dos arrays iguales:
								assert(compare.missing.length == 0 && compare.added.length == 0)
								return obj}}}}
			
			privateMsjControllers.privateMsjInfo(req,res)
			done();
		});

		
		it('privateMsjInfoOrganization succesfull', (done) => {
	        let req = {params:{token:userMock.token, email:userMock.email, id:organizationMock.id }}
			let res = {status: function(nro){assert.equal(nro,200)
				return {send:function(obj){
								obj.should.have.property('private_msj');
								let compare = arrayCompare([obj.private_msj._id, obj.private_msj.name],[privateMsjMock._id, userMock.email])
								//son dos arrays iguales:
								assert(compare.missing.length == 0 && compare.added.length == 0)
								return obj}}}}
			
			privateMsjControllers.privateMsjInfoOrganization(req,res)
			done();
		});

		it('privateMsjInfoOrganization succesfull', (done) => {
	        let req = {params:{token:userMock.token, email:userMock2.email, id:organizationMock.id }}
			let res = {status: function(nro){assert.equal(nro,200)
				return {send:function(obj){
								obj.should.have.property('private_msj');
								let compare = arrayCompare([obj.private_msj._id, obj.private_msj.name],[privateMsjMock._id, userMock2.email])
								//son dos arrays iguales:
								assert(compare.missing.length == 0 && compare.added.length == 0)
								return obj}}}}
			
			privateMsjControllers.privateMsjInfoOrganization(req,res)
			done();
		});

		it('createPrivateMsj no succesfull', (done) => {
	        let req = {body: {token:userMock.token, email:userMock.email, id:organizationMock.id }}
			let res = {status: function(nro){assert.equal(nro,405)
				return {send:function(obj){
								obj.should.have.property('message');
								return obj}}}}
			
			privateMsjControllers.createPrivateMsj(req,res)
			done();
		});
	});
	describe('findOnePrivateMsjStub returns null allways',()=>{
	
	    let findOnePrivateMsjStub = null;
	    
	    beforeEach(() => {
	    	
	    	findOnePrivateMsjStub = sinon.stub(PrivateMsj, 'findOne').callsFake((data,cb)=>{
	    		return cb(null,null)
	    	    });
	    });

	    afterEach(() => {
	        findOnePrivateMsjStub.restore();
	    });

			it('createPrivateMsj succesfull', (done) => {
		        let req = {body: {token:userMock.token, email:userMock2.email, id:organizationMock.id }}
				let res = {status: function(nro){assert.equal(nro,200)
					return {send:function(obj){
									obj.should.have.property('message');
									return obj}}}}
				
				privateMsjControllers.createPrivateMsj(req,res)
				done();
			});

		})
});	

