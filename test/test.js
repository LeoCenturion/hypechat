//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const sinon = require('sinon');
const mongoose = require('mongoose');
const assert = require('assert');
let chai = require('chai');
let should = chai.should();

const userControllers = require('../controllers/user');
const User = require('../models/user');



describe('USER', () => {

    let mongoStub = null;
    let findOneStub = null;
    let findByIdAndUpdateStub = null;
    let updateStub = null;
    let findOneAndUpdateStub = null;
    let findStub = null;

    describe('With server error',()=>{
	    beforeEach(() => {
	        mongoStub = sinon.stub(mongoose, 'connect').callsFake(() => {});
	        findOneStub = sinon.stub(User, 'findOne').callsFake((_, cb)=> cb('SERVER ERROR', 'SERVER ERROR'));
	        findByIdAndUpdateStub = sinon.stub(User, 'findByIdAndUpdate').callsFake((a,b, cb)=> cb('SERVER ERROR', 'SERVER ERROR'));
	    	updateStub = sinon.stub(User, 'update').callsFake((a,b, cb)=> cb('SERVER ERROR', 'SERVER ERROR'));
	    	findOneAndUpdateStub = sinon.stub(User, 'findOneAndUpdate').callsFake((a, b, cb)=> cb('SERVER ERROR', 'SERVER ERROR'));
	    	findStub = sinon.stub(User, 'find').callsFake((_, cb)=> cb('SERVER ERROR',['SERVER ERROR']))
	    });

	    afterEach(() => {
	        mongoStub.restore();
	        findOneStub.restore();
	        findByIdAndUpdateStub.restore();
	        updateStub.restore();
	        findOneAndUpdateStub.restore();
	        findStub.restore();
	    });

	    it('Login user no succesfull', (done) => {
	        req = {body:{email:"email@gmail.com", psw: "password"}}
			res = {status: function(nro){assert.equal(nro,500)
				return {send:function(obj){
					obj.should.have.property('message')
					return obj}}}}
			
			userControllers.logIn(req,res)
			done();
	   	});

	    it('Get user profile no succesfull', (done) => {
	        req = {body:{token:"1234qwer"}, params:{email:"email@gmail.com"}}
			res = {status: function(nro){assert.equal(nro,500)
				return {send:function(obj){
					obj.should.have.property('message');
					return obj}}}}
			
			userControllers.getUserProfile(req,res)
			done();
	   	});

	    it('Update user no succesfull', (done) => {
	        req = {body:{token:"1234qwer"}}
			res = {status: function(nro){assert.equal(nro,500)
				return {send:function(obj){
					obj.should.have.property('message');
					return obj}}}}
			
			userControllers.updateUser(req,res)
			done();
	   	});

	    it('getTokenRecoverPasswordUser no succesfull', (done) => {
	        req = {body:{email:"email@gmail.com"}}
			res = {status: function(nro){assert.equal(nro,500)
				return {send:function(obj){
					obj.should.have.property('message');
					return obj}}}}
			
			userControllers.getTokenRecoverPasswordUser(req,res)
			done();
	   	});

	   	it('updatePasswordUser no succesfull', (done) => {
	        req = {body:{email:"email@gmail.com", psw:"newPsw", token:"token"}}
			res = {status: function(nro){assert.equal(nro,500)
				return {send:function(obj){
					obj.should.have.property('message');
					return obj}}}}
			
			userControllers.updatePasswordUser(req,res)
			done();
	   	});

		it('answersSecretQuestionsCorrect no succesfull', (done) => {
	        req = {params:{userEmail: "email@gmail.com",
	        				asw1: "answer1",
	        				asw2: "answer2"}}
			res = {status: function(nro){assert.equal(nro,500)
				return {send:function(obj){
					obj.should.have.property('message');
					return obj}}}}
			
			userControllers.answersSecretQuestionsCorrect(req,res)
			done();
	   	});

	   	it('answersSecretQuestionsCorrect not succesfull', (done) => {
	        req = {params:{userEmail: "email@gmail.com",
	        				asw1: 'otherAsw1',
	        				asw2: 'otherAsw2'}}
			res = {status: function(nro){assert.equal(nro,500)
				return {send:function(obj){
					obj.should.have.property('message');
					return obj}}}}
			
			userControllers.answersSecretQuestionsCorrect(req,res)
			done();
	   	});
	   
	   	it('getSecretQuestions no succesfull', (done) => {
	        req = {params:{userEmail: "email@gmail.com"}}
			res = {status: function(nro){assert.equal(nro,500)
				return {send:function(obj){
					obj.should.have.property('message');
					return obj}}}}
			
			userControllers.getSecretQuestions(req,res)
			done();
	   	});

	   	it('getAnswersSecretQuestions no succesfull', (done) => {
	        req = {params:{token: 'userMockToken'}}
			res = {status: function(nro){assert.equal(nro,500)
				return {send:function(obj){
					obj.should.have.property('message');
					return obj}}}}

			userControllers.getAnswersSecretQuestions(req,res)
			done();
	   	});

	   	it('updateSecretQuestions no succesfull', (done) => {
	        req = {body:{token: 'userMockToken',
	    				question1: "question1",
	    				question2: "question2",
	    				answer1: "answer1",
	    				answer2: "answer2"}}
			res = {status: function(nro){assert.equal(nro,500)
				return {send:function(obj){
					obj.should.have.property('message');
					return obj}}}}

			userControllers.updateSecretQuestions(req,res)
			done();
	   	});

	   	it('getLocation no succesfull', (done) => {
	        req = {params:{token: 'userMockToken'}}
			res = {status: function(nro){assert.equal(nro,500)
				return {send:function(obj){
					obj.should.have.property('message');
					return obj}}}}

			userControllers.getLocation(req,res)
			done();
	   	});

	   	it('setLocation no succesfull', (done) => {

	        req = {body:{token: 'userMockToken',
	    				longitud: "longitud",
	    				latitud: "latitud"}}
			res = {status: function(nro){assert.equal(nro,500)
				return {send:function(obj){
					obj.should.have.property('message');
					return obj}}}}

			userControllers.setLocation(req,res)
			done();
	   	});

	   	it('getTotalRegistrations no succesfull', (done) => {

	        req = {params:{token: 'userMockToken'}}
			res = {status: function(nro){assert.equal(nro,500)
				return {send:function(obj){
					obj.should.have.property('message');
					return obj}}}}

			userControllers.getTotalRegistrations(req,res)
			done();
	   	});

	   	it('getTotalRegistrationsPerYear no succesfull', (done) => {

	        req = {params:{token: 'userMockToken', year:'2019'}}
			res = {status: function(nro){assert.equal(nro,500)
				return {send:function(obj){
					obj.should.have.property('message');
					return obj}}}}

			userControllers.getTotalRegistrationsPerYear(req,res)
			done();
	   	});

	   	it('logout no succesfull', (done) => {

	        req = {params:{token: 'userMockToken'}}
			res = {status: function(nro){assert.equal(nro,500)
				return {send:function(obj){
					obj.should.have.property('message');
					return obj}}}}

			userControllers.logout(req,res)
			done();
	   	});

	})

	describe('With userMock',()=>{
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

	        mongoStub = sinon.stub(mongoose, 'connect').callsFake(() => {});
	        findOneStub = sinon.stub(User, 'findOne').callsFake((_, cb)=> cb(null, userMock));
	        findByIdAndUpdateStub = sinon.stub(User, 'findByIdAndUpdate').callsFake((a,b, cb)=> cb(null, userMock));
	    	updateStub = sinon.stub(User, 'update').callsFake((a,b, cb)=> cb(null, userMock));
	    	findOneAndUpdateStub = sinon.stub(User, 'findOneAndUpdate').callsFake((a, b, cb)=> cb(null, userMock));
	    	findStub = sinon.stub(User, 'find').callsFake((_, cb)=> cb(null,[userMock]))
	    });

	    afterEach(() => {
	        mongoStub.restore();
	        findOneStub.restore();
	        findByIdAndUpdateStub.restore();
	        updateStub.restore();
	        findOneAndUpdateStub.restore();
	        findStub.restore();
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

	   	it('getTotalRegistrations succesfull', (done) => {

	        req = {params:{token: 'userMockToken'}}
			res = {status: function(nro){assert.equal(nro,200)
				return {send:function(obj){
					obj.should.have.property('resultados');
					obj.resultados[0].should.have.property('year')
					obj.resultados[0].should.have.property('month')
					obj.resultados[0].should.have.property('total')
					assert(obj.resultados.length == 4)
					return obj}}}}

			userControllers.getTotalRegistrations(req,res)
			done();
	   	});

	   	it('getTotalRegistrationsPerYear succesfull', (done) => {

	        req = {params:{token: 'userMockToken', year:'2019'}}
			res = {status: function(nro){assert.equal(nro,200)
				return {send:function(obj){
					obj.should.have.property('total');
					obj.total.should.be.equal(1);
					return obj}}}}

			userControllers.getTotalRegistrationsPerYear(req,res)
			done();
	   	});

	   	it('logout no succesfull', (done) => {

	        req = {params:{token: 'userMockToken'}}
			res = {status: function(nro){assert.equal(nro,200)
				return {send:function(obj){
					obj.should.have.property('message');
					return obj}}}}

			userControllers.logout(req,res)
			done();
	   	});

	})
});

describe('USER - Endpoints personales', () => {
    let mongoStub = null;
    let findByIdStub = null;
    let findStub = null;
    let findByIdAndUpdateStub = null;

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

        mongoStub = sinon.stub(mongoose, 'connect').callsFake(() => {});
        findByIdStub = sinon.stub(User, 'findById').callsFake((_, cb)=> cb(null, userMock));
        findStub = sinon.stub(User, 'find').callsFake((_, cb)=> cb(null, userMock));
        findByIdAndUpdateStub = sinon.stub(User, 'findByIdAndUpdate').callsFake((a, b, cb)=> cb(null, userMock));
    });

    afterEach(() => {
        mongoStub.restore();
        findByIdStub.restore();
        findStub.restore();
        findByIdAndUpdateStub.restore();
    });

    it('getUser succesfull', (done) => {

        req = {params:{userId: userMock._id}}
		res = {status: function(nro){assert.equal(nro,200)
			return {send:function(obj){obj.should.have.property('usuario')
									return obj}}}}
		
		userControllers.getUser(req,res)
		done();
   	});

   	it('getUsers succesfull', (done) => {

        req = {params:{userId: userMock._id}}
		res = {status: function(nro){assert.equal(nro,200)
			return {send:function(obj){obj.should.have.property('user')
									return obj}}}}
		
		userControllers.getUsers(req,res)
		done();
   	});

   	it('updateUser2 succesfull', (done) => {
        req = {params:{userId:userMock._id},
        	body: userMock}
		res = {status: function(nro){assert.equal(nro,200)
			return {send:function(obj){obj.should.have.property('usuario')
									return obj}}}}
		
		userControllers.updateUser2(req,res)
		done();
   	});
   	
   	
});