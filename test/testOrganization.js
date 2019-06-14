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

describe('ORGANIZATION', () => {
    let mongoStub = null;
    let findOneUserStub = null; 
    let findOrganizationStub = null;
    let findPrivateMsjStub = null;
    let findOneOrganizationStub = null;

    beforeEach(() => {
        mongoStub = sinon.stub(mongoose, 'connect').callsFake(() => {});
        findOneUserStub = sinon.stub(User, 'findOne').callsFake((_, cb)=> cb(null, userMock));
        findOrganizationStub = sinon.stub(Organization, 'find').callsFake((_, cb)=> cb(null, userMock.organizations));
    	findPrivateMsjStub = sinon.stub(PrivateMsj, 'find').callsFake((_, cb)=> cb(null, [{email_user2:'msj_usr2', email_user1:'msj_usr1'}]));
    	findOneOrganizationStub = sinon.stub(Organization, 'findOne').callsFake((_, cb)=> cb(null, null));
    });

    afterEach(() => {
        mongoStub.restore();
        findOneUserStub.restore();
        findOrganizationStub.restore();
        findPrivateMsjStub.restore();
        findOneOrganizationStub.restore();
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
   	

   	
});