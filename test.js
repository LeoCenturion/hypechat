//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let User = require('./models/user');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('./server');
let should = chai.should();

const url= 'http://localhost:5000';
var token;


chai.use(chaiHttp);

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
    				res.body.should.have.property('message')
    				res.body.should.have.property('token')
    				res.body.should.have.property('email')
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
			        "psw": 'userPsw'
			      })
	        user.save()

	    	chai.request(url)
			    .get('/token')
			    .send({"email": 'uniqueUser@gmail.com'})
			    .end((err, res) => {
			        token = res.body.token
			      	done();
			    });

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
    
    describe('PUT /psw', () =>{
    	beforeEach((done) => {
	        let user = new User({
			        "email": 'uniqueUser@gmail.com',
			        "nickname": 'userNickname',
			        "psw": 'userPsw'
			      })
	        user.save()

	    	chai.request(url)
			    .get('/token')
			    .send({"email": 'uniqueUser@gmail.com'})
			    .end((err, res) => {
			        token = res.body.token
			      	done();
			    });
	    });
	    
    	it('it should update user profile', (done)=>{
	    	
	    	let newUserProfile = {
	    		"token": token,
	    		"psw":'newPsw'
	    	}
	    	chai.request(url)
			    .put('/psw')
			    .send(newUserProfile)
			    .end((err, res) => {
			        res.should.have.status(200);
			        res.body.should.have.property('message')
			      	done();
			    });
	    })
    })


});


