'use strict'

const mongoose = require('mongoose');
const service = require('../services')
const User = require('../models/user');
const Organization = require('../models/organization');
const PrivateMsj = require('../models/privateMsj');
const logger = require('../utils/logger');

//devuelve las organizaciones que tiene un usuario.
//El mail del usuario debe ser pasado en la URL sin comillas
function getUserOrganizations(req, res){
	let userEmail = req.params.userEmail

	User.findOne({email: req.params.userEmail}, (err, usuario)=>{
		if (err) return res.status(500).send({message: `Error al realizar la peticion: ${err}`})
		if (!usuario) return res.status(404).send({message: `El usuario ${userEmail} no existe`})
		res.status(200).send({organizations: usuario.organizations})
	})
	
}

//devuelve los mensajes privados que tiene un usuario en una organizacion.
//El mail del usuario, el id de la organizacion y el token debe ser pasado en el body
function getPrivateMsj(req, res){
	let token = req.body.token
	let id_organization = req.body.organization_id
	let userEmail = req.body.email

  //chequear que exista el email y id
	PrivateMsj.find({organizationID: id_organization, email_user1: userEmail}, (err, msjs)=>{
		if (err) return res.status(500).send({message: `Error al realizar la peticion: ${err}`})
		PrivateMsj.find({organizationID: id_organization, email_user2: userEmail}, (err, msjs2)=>{
			if (err) return res.status(500).send({message: `Error al realizar la peticion: ${err}`})
			let allMsj = []
			msjs.forEach(element => {
				allMsj.push(element.email_user2)
			});
			msjs2.forEach(element => {
				allMsj.push(element.email_user1)
			});
			return res.status(200).send({msjs: allMsj})
		})

	})
	
}

//devuelve 200 si el ID de la organizacion es valido para crearse o 404 en caso ya hay una organizacion creada con ese ID
//El id de la organizacion debe ser pasado en la URL sin comillas.
function isOrganizationIDValid (req, res){
	let id_organization = req.params.organizationID
	
	Organization.findOne({id: id_organization}, (err, organization)=>{
		if (err) return res.status(500).send({message: `Error al realizar la peticion: ${err}`})
		if (!organization) return res.status(200).send({message: 'No existe una organizacion con ese ID, valido para crear'})
		res.status(400).send({message: 'La organizacion ya existe'})
		
	})
}

//Crea la organizacion 
function createOrganization(req,res){
	let emailUser = req.body.email
	let id = req.body.id
	const organization = new Organization({
	id: req.body.id,
	owner: req.body.email,
	psw: req.body.psw,
	name: req.body.name
})

//me fijo si el usuario existe
User.findOne({email: emailUser}, (err, usuario)=>{
	if (err) return res.status(500).send({message: `Error al realizar la peticion: ${err}`})
	if (!usuario) return res.status(404).send({message: `El usuario ${userEmail} no existe`})

	//me fijo si la organizacion existe
	Organization.findOne({id: id}, (err, dbOrganization)=>{
		if (err) return res.status(500).send({message: `Error al realizar la peticion: ${err}`})
		if (dbOrganization) return res.status(400).send({message: 'La organizacion ya existe'})
		
		//si NO existe, guardo la nueva organizacion en la base
		organization.save((err)=>{
			if(err) {
				logger.error(`Error al crear la organizacion ${organization.id}: ${err}`)
				return res.status(500).send({message: `organization - Error al crear la organizacion: ${err}`})
			}
			logger.info(`create orgazation - Se creo la organizacion con id ${organization.id}`)
		
			//Agrego la organizacion al listado de organizaciones del usuario.
			User.updateOne({email: emailUser},{ $push: { organizations: id } },(err, usuario)=>{
					if (err) {
						return res.status(500).send({message: `organization - Error al agregar la organizacion al usuario: ${err}`})
					}
					return res.status(200).send({message: `Se creo la organizacion: ${id}`})
			})
	})
		
	})

})

}


//Agrega el usuario a la organizacion
//Devuelve 200 si lo agrego correctamente, 400 si ya existe en la organizacion, 
//401 si no existe un usuario con ese email o 404 si no existe una organizacion con ese id
function addUserToOrganization (req, res){
	let token = req.body.token
	let id_organization = req.body.id_organization
	let userEmail = req.body.email

	//me fijo si la organizacion existe
	Organization.findOne({id: id_organization}, (err, organization)=>{
		if (err) return res.status(500).send({message: `Error al realizar la peticion de Organizacion: ${err}`})
		if (!organization) return res.status(404).send({message: 'La organizacion no existe'})
		//si existe me fijo en las organizaciones del usuario a ver si ya esta agregado
		User.findOne({email: userEmail}, (err, usuario)=>{
			if (err) return res.status(500).send({message: `Error al realizar la peticion de Usuario: ${err}`})
			if (!usuario) return res.status(401).send({message: 'No existe un usuario con ese email'})
			let organizations = usuario.organizations
			//recorro todas para a ver si ya esta agregado
			if(usuario.organizations.includes(organization.id)){
					return res.status(400).send({message: 'El usuario ya existe en la organizacion'})
			}
			//si no esta agregado, agrego la organizacion al usuario
			User.updateOne({email: userEmail},{ $push: { organizations: organization.id } },(err, usuario)=>{
				if (err) {
					return res.status(500).send({message: `Error al realizar la peticion de Organizacion: ${err}`})
				}
				return res.status(200).send({message: 'El usuario se ha agregado correctamente en la organizacion'})
			})
		
		})
		
	})
}

//Duvuelve la informacion de la organizacion
function getInfoOrganization (req, res){
	let token = req.params.token
	let organizationID = req.params.organizationID
	Organization.findOne({id: organizationID}, (err, organization)=>{
		if (err) return res.status(500).send({message: `Error al realizar la peticion: ${err}`})
		if (!organization) return res.status(404).send({message: 'La organizacion no existe'})
		res.status(200).send({organization: organization})
	})
}


//Actualiza el nombre de la organizacion
//Recibe por body el token, el id de la organizacion y el nuevo nombre
function updateNameOrganization (req, res){
	let token = req.body.token
	let id_organization = req.body.organizationID
	let update = {name: req.body.name}

	Organization.findOneAndUpdate({id: id_organization}, update, (err,orgUpdated)=>{
		if(err) res.status(500).send({message:`Error al actualizar la organizacion: ${err}`})

		res.status(200).send({usuario: orgUpdated})
	})
}

//Actualiza el password de la organizacion
//Recibe por body el token, el id de la organizacion y el nuevo password
function updatePasswordOrganization (req, res){
	let token = req.body.token
	let id_organization = req.body.organizationID
	let psw_organization = req.body.psw
	let update = {psw: req.body.psw}

	Organization.findOneAndUpdate({id: id_organization}, update, (err,orgUpdated)=>{
		if(err) res.status(500).send({message:`Error al actualizar la organizacion: ${err}`})

		res.status(200).send({usuario: orgUpdated})
	})
}


module.exports={
	getUserOrganizations,
	getPrivateMsj,
	isOrganizationIDValid,
	createOrganization,
	addUserToOrganization,
	getInfoOrganization,
	updateNameOrganization,
	updatePasswordOrganization
}