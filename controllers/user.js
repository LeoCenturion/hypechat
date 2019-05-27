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
		photo : req.body.photo
	})

	user.save((err)=>{
		if(err) {
			logger.error(`Error al crear el usuario ${user.email}: ${err}`)
			return res.status(500).send({message: `singUp - Error al crear el usuario: ${err}`})
		}
		logger.info(`signUp - Se creo el usuario con mail ${user.email}`)
		res.status(200).send(user)
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

function getUserProfile(req, res) {
	User.findOne({email: req.params.email}, (err, user) =>{
		if(err) {
			logger.error(`getUserProfile - Error (500) al buscar informacion del usuario ${req.params.email}: ${err}`)
			return res.status(500).send({message: `Error al buscar informacion del usuario: ${err}`})}
		if(!user) {
			logger.error(`getUserProfile - Error (400), el usuario ${req.params.email} no existe`)
			return res.status(400).send({message: 'El usuario solicitado no existe'})}

		logger.info(`getUserProfile - Se devolvió el perfil del usuario ${user.email}`)
		return res.status(200).send({ name: user.name,
			nickname: user.nickname,
			email: user.email,
			photo: user.photo
		})
	})
}

function updateUser(req, res){
	let userToken = req.body.token
	let update = req.body
	User.update({token: userToken}, update, (err,userUpdated)=>{
		if(err) {
			logger.error(`updateUser2 - Error (500) al actualizar el usuario: ${err}`)
			res.status(500).send({message:`Error al actualizar el usuario: ${err}`})}

		logger.info(`updateUser2 - El usuario ${userUpdated.email} se modificó correctamente`)
		res.status(200).send({message: 'El usuario se modificó correctamente'})
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
	updateUser
}
