//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const sinon = require('sinon');
const mongoose = require('mongoose');
const assert = require('assert');
let chai = require('chai');
let should = chai.should();

const userControllers = require('../controllers/user');
const User = require('../models/user');
const organizationControllers = require('../controllers/organization');
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

decribe('TODO',()=>{
describe('USER', () => {
    let mongoStub = null;
    let findOneStub = null;
    let findByIdAndUpdateStub = null;
    let updateStub = null;
    let findOneAndUpdateStub = null;

    beforeEach(() => {
        mongoStub = sinon.stub(mongoose, 'connect').callsFake(() => {});
        findOneStub = sinon.stub(User, 'findOne').callsFake((_, cb)=> cb(null, userMock));
        findByIdAndUpdateStub = sinon.stub(User, 'findByIdAndUpdate').callsFake((a,b, cb)=> cb(null, userMock));
    	updateStub = sinon.stub(User, 'update').callsFake((a,b, cb)=> cb(null, userMock));
    	findOneAndUpdateStub = sinon.stub(User, 'findOneAndUpdate').callsFake((a, b, cb)=> cb(null, userMock));
    });

    afterEach(() => {
        mongoStub.restore();
        findOneStub.restore();
        findByIdAndUpdateStub.restore();
        updateStub.restore();
        findOneAndUpdateStub.restore();
    });

    it('Login user succesfull', (done) => {

        req = {body:{email:"email@gmail.com", psw: "password"}}
		res = {status: function(nro){assert.equal(nro,200)
			return {send:function(obj){obj.should.have.property('token')
									return obj}}}}
		
		userControllers.logIn(req,res)
		done();
   	});

    it('Get user profile succesfull', (done) => {

        req = {body:{token:"1234qwer"}, params:{email:"email@gmail.com"}}
		res = {status: function(nro){assert.equal(nro,200)
			return {send:function(obj){
				obj.should.have.property('name');
				obj.should.have.property('nickname');
				obj.should.have.property('email');
				obj.should.have.property('photo');
				return obj}}}}
		
		userControllers.getUserProfile(req,res)
		done();
   	});

    it('Update user succesfull', (done) => {

        req = {body:{token:"1234qwer"}}
		res = {status: function(nro){assert.equal(nro,200)
			return {send:function(obj){
				obj.should.have.property('message');
				return obj}}}}
		
		userControllers.updateUser(req,res)
		done();
   	});

    it('getTokenRecoverPasswordUser succesfull', (done) => {

        req = {body:{email:"email@gmail.com"}}
		res = {status: function(nro){assert.equal(nro,200)
			return {send:function(obj){
				obj.should.have.property('recoverPasswordToken');
				return obj}}}}
		
		userControllers.getTokenRecoverPasswordUser(req,res)
		done();
   	});

   	it('updatePasswordUser succesfull', (done) => {

        req = {body:{email:"email@gmail.com", psw:"newPsw", token:"token"}}
		res = {status: function(nro){assert.equal(nro,200)
			return {send:function(obj){
				obj.should.have.property('message');
				return obj}}}}
		
		userControllers.updatePasswordUser(req,res)
		done();
   	});

	it('answersSecretQuestionsCorrect succesfull', (done) => {

        req = {params:{userEmail: userMock.email,
        				asw1: userMock.answer1,
        				asw2: userMock.answer2}}
		res = {status: function(nro){assert.equal(nro,200)
			return {send:function(obj){
				obj.should.have.property('recoverPasswordToken');
				assert(obj.recoverPasswordToken != userMock.recoverPasswordToken);
				return obj}}}}
		
		userControllers.answersSecretQuestionsCorrect(req,res)
		done();
   	});

   	it('answersSecretQuestionsCorrect not succesfull', (done) => {

        req = {params:{userEmail: userMock.email,
        				asw1: 'otherAsw1',
        				asw2: 'otherAsw2'}}
		res = {status: function(nro){assert.equal(nro,401)
			return {send:function(obj){
				obj.should.have.property('message');
				return obj}}}}
		
		userControllers.answersSecretQuestionsCorrect(req,res)
		done();
   	});
   
   	it('getSecretQuestions succesfull', (done) => {

        req = {params:{userEmail: userMock.email}}
		res = {status: function(nro){assert.equal(nro,200)
			return {send:function(obj){
				obj.should.have.property('question1');
				obj.question1.should.be.equal(userMock.question1);
				obj.should.have.property('question2');
				obj.question2.should.be.equal(userMock.question2);
				return obj}}}}
		
		userControllers.getSecretQuestions(req,res)
		done();
   	});

   	it('getAnswersSecretQuestions succesfull', (done) => {

        req = {params:{token: 'userMockToken'}}
		res = {status: function(nro){assert.equal(nro,200)
			return {send:function(obj){
				obj.should.have.property('answers');
				assert.equal(obj.answers[0].answer1, userMock.answer1);
				assert.equal(obj.answers[0].answer2, userMock.answer2);
				return obj}}}}

		userControllers.getAnswersSecretQuestions(req,res)
		done();
   	});

   	it('updateSecretQuestions succesfull', (done) => {

        req = {body:{token: 'userMockToken',
    				question1: userMock.question1,
    				question2: userMock.question2,
    				answer1: userMock.answer1,
    				answer2: userMock.answer2}}
		res = {status: function(nro){assert.equal(nro,200)
			return {send:function(obj){
				obj.should.have.property('message');
				return obj}}}}

		userControllers.updateSecretQuestions(req,res)
		done();
   	});

   	it('getLocation succesfull', (done) => {

        req = {params:{token: 'userMockToken'}}
		res = {status: function(nro){assert.equal(nro,200)
			return {send:function(obj){
				obj.should.have.property('longitud');
				obj.longitud.should.be.equal(userMock.longitud);
				obj.should.have.property('latitud');
				obj.latitud.should.be.equal(userMock.latitud);
				return obj}}}}

		userControllers.getLocation(req,res)
		done();
   	});

   	it('setLocation succesfull', (done) => {

        req = {body:{token: 'userMockToken',
    				longitud: userMock.longitud,
    				latitud: userMock.latitud}}
		res = {status: function(nro){assert.equal(nro,200)
			return {send:function(obj){
				obj.should.have.property('message');
				return obj}}}}

		userControllers.setLocation(req,res)
		done();
   	});

});


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
});