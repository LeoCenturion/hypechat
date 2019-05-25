'use strict'

const mongoose = require('mongoose');
const service = require('../services')
const User = require('../models/user');
const Organization = require('../models/organization');
const PrivateMsj = require('../models/privateMsj');
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



function getUserOrganizations(req, res){
	let userId = req.params.userEmail

	User.findById(userId, (err, usuario)=>{
		if (err) return res.status(500).send({message: `Error al realizar la peticion: ${err}`})
		if (!usuario) return res.status(404).send({message: 'El usuario no existe'})
		res.status(200).send({organizations: usuario.organizations})
	})
	
}


function getPrivateMsj(req, res){
	let token = req.body.token
	let id_organization = req.body.organizacion_id
	let userId = req.body.email


	PrivateMsj.find({organizationID: id_organization, email_user1: userId}, (err, msjs)=>{
		if (err) return res.status(500).send({message: `Error al realizar la peticion: ${err}`})
		PrivateMsj.find({organizationID: id_organization, email_user2: userId}, (err, msjs2)=>{
			if (err) return res.status(500).send({message: `Error al realizar la peticion: ${err}`})
			let allMsj = []
			msj.forEach(element => {
				allMsj.push(element.email_user2)
			});
			msj2.forEach(element => {
				allMsj.push(element.email_user1)
			});
			return res.status(200).send({msjs: allMsj})
		})

	})
	
}

function is_organizationId_valid (req, res){
	let organizationID = req.params.organizacion_id
	
	Organization.findById(organizationID, (err, organization)=>{
		if (err) return res.status(500).send({message: `Error al realizar la peticion: ${err}`})
		if (!organization) return res.status(200).send({message: 'No existe una organizacion con ese ID, valido para crear'})
		res.status(404).send({message: 'La organizacion no existe'})
		
	})
}

function createOrganization(req,res){
	const organization = new Organization({
	id: req.body.id,
	owner: req.body.email_usuario,
	psw: req.body.contraseña,
	name: req.body.nombre
})

organization.save((err)=>{
	if(err) {
		logger.error(`Error al crear la organizacion ${organization.id}: ${err}`)
		return res.status(500).send({message: `organization - Error al crear la organizacion: ${err}`})
	}
	logger.info(`create orgazation - Se creo la organizacion con id ${organization.id}`)
	res.status(200).send(organization)
})
}



function addUserToOrganization (req, res){
	let token = req.body.token
	let organizationID = req.body.id_organizacion
	let userId = req.body.email_usuario

	Organization.findById(organizationID, (err, organization)=>{
		if (err) return res.status(500).send({message: `Error al realizar la peticion: ${err}`})
		if (!organization) return res.status(404).send({message: 'La organizacion no existe'})
		User.findById(userId, (err, usuario)=>{
			if (err) return res.status(500).send({message: `Error al realizar la peticion: ${err}`})
			if (!usuario) return res.status(401).send({message: 'No existe un usuario con ese email'})
			let organizations = usuario.organizations
			organizations.forEach(element => {
				if(element == organizationID){
					return res.status(400).send({message: 'El usuario ya existe en la organizacion'})
				}
			});
			organizations.push(organizationID)
			res.status(200).send({organization: organization})
		})
		
	})
}

function getInfoOrganization (req, res){
	let token = req.params.token
	let organizationID = req.params.organizacion_id
	Organization.findById(organizationID, (err, organization)=>{
		if (err) return res.status(500).send({message: `Error al realizar la peticion: ${err}`})
		if (!organization) return res.status(404).send({message: 'La organizacion no existe'})
		res.status(200).send({organization: organization})
	})
}



function updateNameOrganization (req, res){
	let token = req.body.token
	let id_organization = req.body.id_organizacion
	let update = {name: req.body.nombre_organizacion}

	Organization.findByIdAndUpdate(id_organization, update, (err,orgUpdated)=>{
		if(err) res.status(500).send({message:`Error al actualizar la organizacion: ${err}`})

		res.status(200).send({usuario: orgUpdated})
	})
}

function updatePasswordOrganization (req, res){
	let token = req.body.token
	let psw_organization = req.body.psw_organizacion
	let update = {psw: req.body.psw_organization}

	Organization.findByIdAndUpdate(id_organization, update, (err,orgUpdated)=>{
		if(err) res.status(500).send({message:`Error al actualizar la organizacion: ${err}`})

		res.status(200).send({usuario: orgUpdated})
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
	getUserOrganizations,
	getPrivateMsj,
	is_organizationId_valid,
	createOrganization,
	addUserToOrganization,
	getInfoOrganization,
	updateNameOrganization,
	updatePasswordOrganization
}
