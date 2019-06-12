'use strict'

const mongoose = require('mongoose');
const service = require('../services')
const User = require('../models/user');
const logger = require('../utils/logger');

function getUser (req, res){
	let userId = req.params.userId
	User.findById(userId, (err, usuario)=>{
		if (err) return res.status(500).send({message: `Error al realizar la peticion: ${err}`})
		if (!usuario) return res.status(404).send({message: 'El usuario no existe'})
		res.status(200).send({usuario: usuario})
	})
}

function getUsers (req,res){
	User.find({},(err, users) =>{
		if(err) return res.status(500).send({message: `Error al realizar la peticion: ${err}`})
		if(!users) return res.status(404).send({message:'No existen usuario'})
		return res.status(200).send({user: users})
	})
}

function saveUser (req, res){	
	let usuario = new User()
	usuario.name = req.body.name
	usuario.psw = req.body.psw
	usuario.email = req.body.email
	usuario.photo = req.body.photo

	usuario.save((err,usuarioStored) =>{
		if(err) return res.status(500).send({message: `Error al salvar en la base de datos: ${err}`});
		res.status(200).send({usuario: usuarioStored});
	})
}

function updateUser2 (req, res){
	let usuarioId = req.params.userId
	let update = req.body

	User.findByIdAndUpdate(usuarioId, update, (err,usuarioUpdated)=>{
		if(err) res.status(500).send({message:`Error al actualizar el usuario: ${err}`})

		res.status(200).send({usuario: usuarioUpdated})
	})
}

function deleteUser (req, res){
	let usuarioId = req.params.userId

	User.findById(usuarioId, (err, usuario)=>{
		if(err) return res.status(500).send({message:`Error al borrar el usuario: ${err}`})

		usuario.remove(err =>{
			if(err) return res.status(500).send({message:`Error al borrar el usuario: ${err}`})
			res.status(200).send({message:'El usuario ha sido eliminado'})
		})
	})
}


function signUp(req,res){
    const user = new User({
		email: req.body.email,
		name: req.body.name,
		nickname: req.body.nickname,
		psw: req.body.psw,
		photo : req.body.photo,
		question1: req.body.question1,
		question2: req.body.question2,
		answer1: req.body.asw1,
		answer2: req.body.asw2,
	})

	user.save((err)=>{
		if(err) {
			logger.error(`Error al crear el usuario ${user.email}: ${err}`)
			return res.status(500).send({message: `singUp - Error al crear el usuario: ${err}`})
		}
		else{
			logger.info(`signUp - Se creo el usuario con mail ${user.email}`)
			res.status(200).send(user)
		}
	})
}

function logIn (req, res) {

	User.findOne({ email: req.body.email, psw: req.body.psw }, (err, user) => {
		if (err) {
			logger.error(`logIn - Error (500) al loguearse: ${err}`)
			return res.status(500).send({ message: `Error al logearse: ${err}` })
		}
		if (!user) {
			logger.error(`logIn - Error (404) al loguearse, email o psw invalidos: ${err}`)
			return res.status(404).send({message: `El mail o la contraseña son invalidos`})
		}
		
		let usuarioId = user._id
		let newToken = service.createToken(user)
		let update = {token: newToken}

		User.findByIdAndUpdate(usuarioId, update, (err,usuarioUpdated)=>{
			if(err) {
				logger.error(`logIn - Error (500) al guardar el token del usuario: ${err}`)
				return res.status(500).send({message:`Error al guardar el token del usuario: ${err}`})
			}
			logger.info(`logIn - Se actualizo el token del usuario ${user.email}`)
		})

		logger.info(`logIn - Se logueo el usuario ${user.email}`)
		return res.status(200).send({ message: 'Te has logueado correctamente',
			token: newToken,
			name: user.name,
			nickname: user.nickname,
			email: user.email })
		});
	
}
/*
function getUserByEmailAndPsw(email, password){
	User.findOne({ email: req.body.email, psw: req.body.psw }, (err, user) => {
		if (err) {
			logger.error(`getUserByEmailAndPsw - Server Error (500): ${err}`)
			return {status: 500,
					message: `Error al logearse: ${err}`}
		}
		if (!user) {
			logger.error(`getUserByEmailAndPsw - Error (404) al loguearse, email o psw invalidos: ${err}`)
			return {status: 404,
					message: `El mail o la contraseña son invalidos`}
		}
		return {status: 200,
				user: user}
	});
}
*/
function getUserProfile(req, res) {
	User.findOne({token: req.body.token}, (err1,user1)=>{
		User.findOne({email: req.params.email}, (err2, user2) =>{
		if(err1 || err2) {
			logger.error(`getUserProfile - Error (500) al buscar informacion del usuario ${req.params.email}: ${err}`)
			return res.status(500).send({message: `Error al buscar informacion del usuario: ${err}`})}
		if(!user1 || !user2) {
			logger.error(`getUserProfile - Error (400), el usuario con mail ${req.params.email} no existe, o el usuario con token ${req.body.token} no existes`)
			return res.status(400).send({message: `El usuario con mail ${req.params.email} no existe, o el usuario con token ${req.body.token} no existe`})}

		logger.info(`getUserProfile - Se devolvió el perfil del usuario ${user2.email}`)
		return res.status(200).send({ 
			name: user2.name,
			nickname: user2.nickname,
			email: user2.email,
			photo: user2.photo
			})
		})
	})
	
}

function updateUser(req, res){
	let userToken = req.body.token
	let update = req.body
	User.update({token: userToken}, update, (err,userUpdated)=>{
		if(err) {
			logger.error(`updateUser - Error (500) al actualizar el usuario: ${err}`)
			res.status(500).send({message:`Error al actualizar el usuario: ${err}`})
		}
		logger.info(`updateUser - El usuario ${userToken} se modificó correctamente`)
		res.status(200).send({message: 'El usuario se modificó correctamente'})
	})
}

function getTokenRecoverPasswordUser(req, res){
	User.findOne({email: req.body.email}, (err, user)=>{
		console.log(req.body.email)
		if(err){
			logger.error(`getTokenRecoverPasswordUser - Error (500) al buscar el usuario: ${err}`)
			return res.status(500).send({message: `Error al buscar informacion del usuario: ${err}`})
		}
		if(!user){
			logger.error(`getTokenRecoverPasswordUser - Error (400), el usuario con mail ${req.params.email} no existe`)
			return res.status(400).send({message: 'El usuario solicitado no existe'})
		}
		let recoverToken = service.createToken({_id: user.psw})
		logger.info(`getTokenRecoverPasswordUser - Se creo un token para la recuperacion de contrasena del usuario con mail ${req.params.email}`)
		let userUpdated = {body: {
			token : user.token,
			recoverPasswordToken: recoverToken
		}}
		let result = {status: function (nro){
			return {statusNro: nro,
			send: function (objJson){ return res.status(this.statusNro).send({recoverPasswordToken: recoverToken})}}
			}
		}
		updateUser(userUpdated, result)
	})
}

function updatePasswordUser(req, res){
	User.findOne({email: req.body.email, recoverPasswordToken:req.body.recoverPasswordToken}, (err, user)=>{
		if(err){
			logger.error(`updatePasswordUser - Error (500) al buscar el usuario: ${err}`)
			return res.status(500).send({message: `Error al buscar informacion del usuario: ${err}`})
		}
		if(!user){
			logger.error(`updatePasswordUser - Error (400), el usuario con mail ${req.body.email} y token de recupero ${req.body.recoverPasswordToken} no existe`)
			return res.status(400).send({message: 'El usuario solicitado no existe'})
		}

		let userToUpdate = {body: {
			token : user.token,
			recoverPasswordToken: undefined,
			psw: req.body.newPassword
		}}

		let result = {status: function (nro){
			return {statusNro: nro,
			send: function (objJson){
				return res.status(this.statusNro).send({message: objJson.message})}}
			}
		}
		logger.info(`updatePasswordUser - Se mando a actualizar la contraseña del usuario con mail ${req.body.email}`)
		updateUser(userToUpdate, result)
	})
}





//api.get('/answerQuestions/:email/:asw1/:asw2',userControllers.answersSecretQuestionsCorrect)
//500 - Server error
//400 - Email invalido
//401 - Respuestas incorrectas
//200 - Respuestas correctas
function answersSecretQuestionsCorrect(req,res){
	let asw1 = req.params.asw1
	let asw2 = req.params.asw2
	let userEmail = req.params.userEmail
	logger.info(`email: ${req.params.userEmail}`)
	logger.info(`asw1: ${req.params.asw1}`)
	logger.info(`asw2: ${req.params.asw2}`)
	User.findOne({email: req.params.userEmail},(err,user)=>{
		if(err){
			logger.error(`answersSecretQuestionsCorrect - Error (500) al buscar el usuario: ${err}`)
			return res.status(500).send({message: `Error al buscar el token del usuario: ${err}`})
		}
		if(!user){
			logger.error(`answersSecretQuestionsCorrect - Error (400), email invalido: ${req.params.userEmail}`)
			return res.status(400).send({message: 'El email es invalido'})
		}
		if( (asw1 == user.answer1) && (asw2 == user.answer2)){
			//return res.status(200).send({message: 'Respuestas correctas'})
			let recoverToken = service.createToken({_id: user.psw})
			logger.info(`getTokenRecoverPasswordUser - Se creo un token para la recuperacion de contrasena del usuario con mail ${req.params.userEmail}`)
			User.findOneAndUpdate({email: req.params.userEmail},{recoverPasswordToken: recoverToken},(err,user2)=>{
				if(err){
					logger.error(`answersSecretQuestionsCorrect - Error (500) al buscar el usuario: ${err}`)
					return res.status(500).send({message: `Error al buscar el token del usuario: ${err}`})
				}
				if(!user2){
					logger.error(`answersSecretQuestionsCorrect - Error (400), email invalido: ${req.params.userEmail}`)
					return res.status(400).send({message: 'El email es invalido'})
				}
				return res.status(200).send({recoverPasswordToken: recoverToken});
			});
		
		}else{
			return res.status(401).send({message: 'Respuestas incorrectas'})
		}
	})
}

//api.get('/secretQuestions/:email',userControllers.getSecretQuestions)
//500 - Server error
//400 - Email invalido
//200 - Preguntas secretas
function getSecretQuestions(req,res){
	User.findOne({email: req.params.userEmail},(err,user)=>{
		if(err){
			logger.error(`getSecretQuestions - Error (500) al buscar el usuario: ${err}`)
			return res.status(500).send({message: `Error al buscar el token del usuario: ${err}`})
		}
		if(!user){
			logger.error(`getSecretQuestions - Error (400), email invalido: ${req.params.userEmail}`)
			return res.status(400).send({message: 'El email es invalido'})
		}
	
		return res.status(200).send( {question1: user.question1, question2: user.question2})
			
	})
}

//api.get('/answersQuestions/:token',userControllers.getAnswersSecretQuestions)
//500 - Server error
//400 - Token invalido
//200 - Respuestas secretas
function getAnswersSecretQuestions(req,res){
	User.findOne({token: req.params.token},(err,user)=>{
		if(err){
			logger.error(`answersSecretQuestionsCorrect - Error (500) al buscar el usuario: ${err}`)
			return res.status(500).send({message: `Error al buscar el token del usuario: ${err}`})
		}
		if(!user){
			logger.error(`answersSecretQuestionsCorrect - Error (400), token invalido: ${req.params.token}`)
			return res.status(400).send({message: 'El token es invalido'})
		}
		let answers = []
		answers.push({answer1: user.answer1, answer2: user.answer2})
		return res.status(200).send({answers: answers})
			
	})
}

//api.put('/secretQuestios',userControllers.updateSecretQuestions)
//500 - Server error
//400 - Token invalido
//200 - Respuestas secretas
function updateSecretQuestions(req,res){
	let token = req.body.token
	let update = {question1: req.body.question1, question2: req.body.question2, answer1: req.body.answer1, answer2: req.body.answer2 }


	User.findOneAndUpdate({token: req.body.token},update ,(err,user)=>{
		if(err){
			logger.error(`answersSecretQuestionsCorrect - Error (500) al buscar el usuario: ${err}`)
			return res.status(500).send({message: `Error al buscar el token del usuario: ${err}`})
		}
		if(!user){
			logger.error(`answersSecretQuestionsCorrect - Error (400), token invalido: ${req.body.token}`)
			return res.status(400).send({message: 'El token es invalido'})
		}

		return res.status(200).send({message: 'Las preguntas y respuestas secretas se han actualizado correctamente'})
			
	})
}


//api.get('/location/:token',userControllers.getLocation)
//500 - Server error
//400 - Token invalido
//200 - longitud y latitud
function getLocation(req,res){
	User.findOne({token: req.params.token},(err,user)=>{
		if(err){
			logger.error(`answersSecretQuestionsCorrect - Error (500) al buscar el usuario: ${err}`)
			return res.status(500).send({message: `Error al buscar el token del usuario: ${err}`})
		}
		if(!user){
			logger.error(`answersSecretQuestionsCorrect - Error (400), token invalido: ${req.params.token}`)
			return res.status(400).send({message: 'El token es invalido'})
		}
	
		return res.status(200).send({longitud: user.longitud, latitud: user.latitud})
			
	})
}
//api.put('/location',userControllers.setLocation)
//500 - Server error
//400 - Token invalido
//401 - Longitud y latitud invalidos
//200 - Seteo de locacion correcto
function setLocation(req,res){
	let token = req.body.token;

	let update = {latitud: req.body.latitud, longitud: req.body.longitud}

	User.findOneAndUpdate({token: req.body.token},update ,(err,user)=>{
		if(err){
			logger.error(`answersSecretQuestionsCorrect - Error (500) al buscar el usuario: ${err}`)
			return res.status(500).send({message: `Error al buscar el token del usuario: ${err}`})
		}
		if(!user){
			logger.error(`answersSecretQuestionsCorrect - Error (400), token invalido: ${req.body.token}`)
			return res.status(400).send({message: 'El token es invalido'})
		}

		return res.status(200).send({message: `La locacion se ha actualizado correctamente en el usuario: ${user.email}`})
			
	})
}


module.exports={
	getUser,
	getUsers,
	saveUser,
	updateUser2,
	deleteUser,
	signUp,
	logIn,
	getUserProfile,
	updateUser,
	getTokenRecoverPasswordUser,
	updatePasswordUser,
	answersSecretQuestionsCorrect,
	getSecretQuestions,
	getAnswersSecretQuestions,
	updateSecretQuestions,
	getLocation,
	setLocation
}
