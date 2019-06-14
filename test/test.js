//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const sinon = require('sinon');
const mongoose = require('mongoose');
const assert = require('assert');
let chai = require('chai');
let should = chai.should();

const userControllers = require('../controllers/user');
const User = require('../models/user');

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
			longitud: 0
		};

describe('USER', () => {
    let mongoStub = null;
    let findOneStub = null;
    let findByIdAndUpdateStub = null;
    let updateStub = null;

    beforeEach(() => {
        mongoStub = sinon.stub(mongoose, 'connect').callsFake(() => {});
        findOneStub = sinon.stub(User, 'findOne').callsFake((_, cb)=> cb(null, userMock));
        findByIdAndUpdateStub = sinon.stub(User, 'findByIdAndUpdate').callsFake((a,b, cb)=> cb(null, userMock));
    	updateStub = sinon.stub(User, 'update').callsFake((a,b, cb)=> cb(null, userMock));
    });

    afterEach(() => {
        mongoStub.restore();
        findOneStub.restore();
        findByIdAndUpdateStub.restore();
        updateStub.restore();
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
    
});