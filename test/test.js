//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let User = require('../models/user');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
let expect = require('chai').expect;

const url= 'http://localhost:5000';
var token = "thisIsTheToken";


chai.use(chaiHttp);

const userControllers = require('../controllers/user')
var sinon = require('sinon');
/*
describe('USER CONTROLLER', ()=>{
	beforeEach((done)=>{
		User.remove({}, (err) => {
			done();
		});
	})

	describe('function signUp',()=>{
		beforeEach((done) => {
	        let user = new User({
				email: 'existentUser@gmail.com',
				nickname: 'existentUserNickname',
				psw: 'existentUserPsw'
				})
		    user.save()
		    done()
	    });
		it('signUp OK',(done)=>{
			let user = {
				body: {
					email: "email@gmail.com",
					name: "name",
					nickname: "nickname",
					psw: "password",
					photo : "photoUrl"
				}
			}

			let objectWithSend = { send: function(objJson){
				objJson.should.have.property('name')
				objJson.should.have.property('psw')
				objJson.should.have.property('photo')
				objJson.should.have.property('nickname')
				objJson.should.have.property('email')

				objJson.name.should.be.eql('name')
				objJson.psw.should.be.eql('password')
				objJson.photo.should.be.eql('photoUrl')
				objJson.nickname.should.be.eql('nickname')
				objJson.email.should.be.eql('email@gmail.com')
			}}

			let result = {status: function status(nro){
				nro.should.be.eql(200)
				return objectWithSend}};

			userControllers.signUp(user, result)
			done();
		})


		it('signUp existent user',(done)=>{
			let user = {
				body: { 
					email: "existentUser@gmail.com",
					psw: "OtherPsw"
				}
			}

			let result = {status: function status(nro){
				
				return { status: nro,
					send: function(objJson){
						this.status.should.be.eql(500)
						objJson.should.have.property('message')
						}
				}
			}};

			userControllers.signUp(user, result)
			done();
		})
	})
});
*/

describe('SERVER', () => {
    beforeEach((done) => { //Before each test we empty the database
        User.remove({}, (err) => { 
           done();           
        });        
    });
  	describe('GET /user', () => {
		it('it should GET all users', (done) => {
			chai.request(url)
			    .get('/user')
			    .end((err, res) => {
			          res.should.have.status(200);
			          res.body.should.be.eql({user: []})
			      done();
			    });
		});
	})

    describe('POST /signUp', () =>{
    	beforeEach((done) => {
	        let user = new User({
			        "email": 'uniqueUser@gmail.com',
			        "nickname": 'userNickname',
			        "psw": 'userPsw'
			      })
	        user.save()
	        done()
	    });
    	it('sign up user OK', (done)=>{
    		let user = {
			        "email": 'user@gmail.com',
			        "nickname": 'userNickname',
			        "psw": 'userPsw'
			      }
    		chai.request(url)
    			.post('/signUp')
    			.send(user)
    			.end((err, res) => {
    				res.should.have.status(200);
    				res.body.should.be.a('object');
    				res.body.should.have.property('email')
			      	res.body.email.should.be.eql('user@gmail.com')
			      	res.body.should.have.property('psw')
			      	res.body.psw.should.be.eql('userPsw')
			      	res.body.should.have.property('nickname')
			      	res.body.nickname.should.be.eql('userNickname')
    				done();
    			})
    	})

    	it('sign up user OK, without nickname', (done)=>{
    		let user = {
			        "email": 'user2@gmail.com',
			        "psw": 'userPsw'
			      }
    		chai.request(url)
    			.post('/signUp')
    			.send(user)
    			.end((err, res) => {
    				res.should.have.status(200);
    				res.body.should.be.a('object');
			      	res.body.should.have.property('email')
			      	res.body.email.should.be.eql('user2@gmail.com')
			      	
			      	res.body.should.have.property('psw')
			      	res.body.psw.should.be.eql('userPsw')
			      	
			      	res.body.should.have.property('nickname')
			      	res.body.nickname.should.be.eql("")
    				done();
    			})
    	})

    	it('sign up user with an existent email', (done)=>{
    		let user = {
			        "email": 'uniqueUser@gmail.com',
			        "psw": 'otherUserPsw'
			      }
    		chai.request(url)
    			.post('/signUp')
    			.send(user)
    			.end((err, res) => {
    				res.should.have.status(500);
    				res.body.should.have.property('message')
    				done();
    			})
    	})
    })

    describe('POST /login', () =>{
    	beforeEach((done) => {
	        let user = new User({
			        "email": 'uniqueUser@gmail.com',
			        "nickname": 'userNickname',
			        "psw": 'userPsw'
			      })
	        user.save()
	        done()
	    });

    	it('user login Ok',(done)=>{
    		let user = {
			        "email": 'uniqueUser@gmail.com',
			        "psw": 'userPsw'
			    }
    		chai.request(url)
    			.post('/login')
    			.send(user)
    			.end((err, res) => {
    				res.should.have.status(200);
    				/*res.body.should.have.property('message')
    				res.body.should.have.property('token')
    				res.body.should.have.property('email')*/
    				done();
    			})
    	})

    	it('inexistent user login', (done)=>{
    		let user = {
			        "email": 'inexistentUser@gmail.com',
			        "psw": 'userPsw'
			    }
    		chai.request(url)
    			.post('/login')
    			.send(user)
    			.end((err, res) => {
    				res.should.have.status(404);
    				done();
    			})
    	})
    })
    
    describe('GET /profile/:email', () =>{
    	beforeEach((done) => {
	        let user = new User({
			        "email": 'uniqueUser@gmail.com',
			        "nickname": 'userNickname',
			        "psw": 'userPsw'
			      })
	        user.save()
	        done()
	    });

    	it('it should GET profile of the email user', (done) => {
			chai.request(url)
			    .get('/profile/uniqueUser@gmail.com')
			    .end((err, res) => {
			        res.should.have.status(200);

			        res.body.should.have.property('name')
			      	res.body.name.should.be.eql('')
			      	
			      	res.body.should.have.property('nickname')
			      	res.body.nickname.should.be.eql('userNickname')
			      	
			      	res.body.should.have.property('email')
			      	res.body.email.should.be.eql('uniqueuser@gmail.com')

			      	res.body.should.have.property('photo')
			      	res.body.photo.should.be.eql('')

			      done();
			    });
		});

		it('it should GET profile of inexistent email user', (done) => {
			chai.request(url)
			    .get('/profile/inexistentUser@gmail.com')
			    .end((err, res) => {
			        res.should.have.status(400);
			        res.body.should.have.property('message')
			      	done();
			    });
		});
    })
    
    describe('PUT /profile', () =>{
    	beforeEach((done) => {
	        let user = new User({
			        "email": 'uniqueUser@gmail.com',
			        "nickname": 'userNickname',
			        "psw": 'userPsw',
			        "token": token
			      })
	        user.save()
	        done()

	    });

	    it('it should update user profile', (done)=>{
	    	let newUserProfile = {
	    		"token": token,
	    		"email": 'newEmmailUser@gmail.com',
	    		"nickname":'newUserNickname',
	    		"photo": 'newUrlPhoto',
	    		"name": 'newUserName'
	    	}
	    	chai.request(url)
			    .put('/profile')
			    .send(newUserProfile)
			    .end((err, res) => {
			        res.should.have.status(200);
			        res.body.should.have.property('message')
			      	done();
			    });
	    })
    })
    
    describe('PUT /password', () =>{
    	beforeEach((done) => {
	        let user = new User({
			        "email": 'uniqueUser@gmail.com',
			        "nickname": 'userNickname',
			        "psw": 'userPsw',
			        "token": token
			      })
	        user.save()
	        done()
	    });
	    
    	it('it should update user profile', (done)=>{
	    	
	    	let newUserProfile = {
	    		"token": token,
	    		"psw":'newPsw'
	    	}
	    	chai.request(url)
			    .put('/password')
			    .send(newUserProfile)
			    .end((err, res) => {
			        res.should.have.status(200);
			        res.body.should.have.property('message')
			      	done();
			    });
	    })
    })

    describe('GET /recoveredPassword', () =>{
    	beforeEach((done) => {
	        let user = new User({
			        "email": 'uniqueUser@gmail.com',
			        "nickname": 'userNickname',
			        "psw": 'userPsw'
			      })
	        user.save()
	        done()
	    });
	    
    	it('it should get a token', (done)=>{
	    	
	    	chai.request(url)
			    .get('/recoveredPassword')
			    .send({"email": 'uniqueUser@gmail.com'})
			    .end((err, res) => {
			        res.should.have.status(200);
			        res.body.should.have.property('recoverPasswordToken')
			      	done();
			    });
	    })
    })

    describe('PUT /recoveredPassword', () =>{
    	let recoverToken = "this is token to recover the password";
    	beforeEach((done) => {
	        let user = new User({
			        "email": 'uniqueUser@gmail.com',
			        "nickname": 'userNickname',
			        "psw": 'userPsw',
			        "recoverPasswordToken": recoverToken
			      })
	        user.save()
			done()
	    });
	    
    	it('it should update password because recoverToken is ok', (done)=>{
	    	/*recoverToken = userControllers.getTokenRecoverPasswordUser({body:{"email": 'uniqueUser@gmail.com'}}, {status: function(nro){return{send:function(obj){console.log(obj)
				return obj.recoverPasswordToken}}}})*/
	    	let newUserProfile = {
	    		"email": 'uniqueUser@gmail.com',
	    		"recoverPasswordToken":recoverToken,
	    		"newPassword":'newPsw'
	    	}
	    	chai.request(url)
			    .put('/recoveredPassword')
			    .send(newUserProfile)
			    .end((err, res) => {
			        res.should.have.status(200);
			      	done();
			    });
	    })

	    it('it should not update password because recoverToken is false', (done)=>{
	    	
	    	let newUserProfile = {
	    		"email": 'uniqueUser@gmail.com',
	    		"recoverPasswordToken":'falseToken',
	    		"newPassword":'newPsw'
	    	}
	    	chai.request(url)
			    .put('/recoveredPassword')
			    .send(newUserProfile)
			    .end((err, res) => {
			        res.should.have.status(400);
			      	done();
			    });
	    })
    })

});