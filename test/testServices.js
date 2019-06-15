process.env.NODE_ENV = 'test';

const sinon = require('sinon');
const mongoose = require('mongoose');
const assert = require('assert');
let chai = require('chai');
let should = chai.should();

const userControllers = require('../controllers/user');
const User = require('../models/user');


const services = require('../services/index')

describe('USER', () => {
    let mongoStub = null;
    let findOneStub = null;
    let findByIdAndUpdateStub = null;
    let updateStub = null;
    let findOneAndUpdateStub = null;

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
    });

    afterEach(() => {
        mongoStub.restore();
        findOneStub.restore();
        findByIdAndUpdateStub.restore();
        updateStub.restore();
        findOneAndUpdateStub.restore();
    });

    it('createToken succesfull', (done) => {
		userControllers.logIn(req,res)
		done();
   	});
});