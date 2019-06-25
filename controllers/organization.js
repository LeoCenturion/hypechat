'use strict'

const mongoose = require('mongoose');
const User = require('../models/user');
const Organization = require('../models/organization');
const Channel = require('../models/channel');
const channelController = require('../controllers/channel')
const PrivateMsj = require('../models/privateMsj');
const logger = require('../utils/logger');


function all(req, res){
	Organization.find({}, (err, org)=>{
		if (err) return res.status(500).send({message: `Error al realizar la peticion: ${err}`})
		return res.status(200).send({organizations: org})
	})
	
}

//devuelve las organizaciones que tiene un usuario.
//El mail del usuario debe ser pasado en la URL sin comillas
function getUserOrganizations(req, res){
	let userEmail = req.params.userEmail

	User.findOne({email: req.params.userEmail}, (err, usuario)=>{
		if (err) return res.status(500).send({message: `Error al realizar la peticion: ${err}`})
		if (!usuario) return res.status(404).send({message: `El usuario ${userEmail} no existe`})
		let userOrg =[]
		Organization.find({id: {$in: usuario.organizations}}, (err, userOrganizations)=>{
			if (err) return res.status(500).send({message: `Error al realizar la peticion: ${err}`})
			userOrganizations.forEach(function (element){
				userOrg.push({id: element.id, name: element.name})
			})
			res.status(200).send({organizations: userOrg})
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
		owner: [req.body.email],
		members: [req.body.email],
		psw: req.body.psw,
		name: req.body.name
	})

//me fijo si el usuario existe
User.findOne({email: emailUser}, (err, usuario)=>{
	if (err) return res.status(500).send({message: `Error al realizar la peticion: ${err}`})
	if (!usuario) return res.status(404).send({message: `El usuario ${emailUser} no existe`})

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

					//crear canales de varios y general
					let canalGeneral = {body: {
						name : "general",
						id: id,
						description: "Canal general",
						owner: emailUser,
						private: 0
					}}
					let result = {status: function (nro){
						return {statusNro: nro,
						send: function (objJson){ 
							if(this.statusNro == 200){
								//creo varios
								let canalVarios = {body: {
									name : "varios",
									id: id,
									description: "Canal varios",
									owner: emailUser,
									private: 0
								}}
								let resultVarios = {status: function (nro){
									return {statusNro: nro,
									send: function (objJson){ return res.status(this.statusNro).send({message: `Se creo la organizacion: ${id}`})}}
									}
								}
								channelController.createChannel(canalVarios, resultVarios)
							}else{
								return res.status(this.statusNro).send({message: `Se creo la organizacion: ${id}`})}}
							}
							
						}
					}
					channelController.createChannel(canalGeneral, result)
					//return res.status(200).send({message: `Se creo la organizacion: ${id}`})
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
	let idOrganization = req.body.idOrganization
	let userEmail = req.body.email
	let pswOrganization = req.body.psw

	//me fijo si la organizacion existe
	Organization.findOne({id: idOrganization, psw: pswOrganization}, (err, organization)=>{
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
			//si no esta agregado, agrego la organizacion al usuario y el usuario a la organizacion
			Organization.updateOne({id: idOrganization},{ $push: { members: userEmail } },(err, org)=>{
				if (err) return res.status(500).send({message: `Error al realizar la peticion de Organizacion: ${err}`})
				User.updateOne({email: userEmail},{ $push: { organizations: organization.id } },(err, usuario)=>{
					if (err) {
						return res.status(500).send({message: `Error al realizar la peticion de Organizacion: ${err}`})
					}
					//lo agrego a los canales de general y varios
					//canal general
					let canalGeneral = {body: {
						name : "general",
						token: token,
						id: idOrganization,
						email: userEmail,
						mo_email: userEmail
					}}
					let result = {status: function (nro){
						return {statusNro: nro,
						send: function (objJson){ 
							if(this.statusNro == 200){
								//canal varios
								let canalVarios = {body: {
									token: token,
									name : "varios",
									id: idOrganization,
									email: userEmail,
									mo_email: userEmail
								}}
								let resultVarios = {status: function (nro){
									return {statusNro: nro,
									send: function (objJson){ return res.status(this.statusNro).send({message: 'El usuario se ha agregado correctamente en la organizacion'})}}
									}
								}
								channelController.addUserToChannel(canalVarios, resultVarios)
							}else{
								return res.status(this.statusNro).send({message: 'El usuario se ha agregado correctamente en la organizacion'})}}
							}
							
						}
					}
					channelController.addUserToChannel(canalGeneral, result)

				})
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

		res.status(200).send({organization: orgUpdated})
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
//500 - server error
//404 - la organizacion no existe
//405 - el usuario ya es moderador
//406 - el usuario no es parte de la organizacion
//recibe como body: token , organizationID, userEmail
//Asigna a una usuario como moderador
function asignModerator (req, res){
	let token = req.body.token
	let id_organization = req.body.organizationID
	let userEmail = req.body.userEmail
//me fijo si la organizacion existe
	Organization.findOne({id: id_organization}, (err, organization)=>{
		if (err) return res.status(500).send({message: `Error al realizar la peticion: ${err}`})
		if (!organization) return res.status(404).send({message: 'La organizacion no existe'})
		let moderators = organization.moderators
		let members = organization.members
		//me fijo si el usuario ya es moderador
		if(moderators.includes(userEmail)) return res.status(405).send({message: 'El usuario ya es moderador'})
		//me fijo si es usuario esta agregado a la organizacion
		if(!members.includes(userEmail)) return res.status(406).send({message: 'El usuario no es parte de la organizacion'})
	
		//lo saco de la lista de miembros y lo agrego a la lista de moderadores
		Organization.findOneAndUpdate({id: id_organization}, {$push: { moderators: userEmail }}, (err,orgUpdated)=>{
			if(err) res.status(500).send({message:`Error al actualizar la organizacion: ${err}`})
	
			res.status(200).send({message:`Se seteo al usuario como moderador de la organizacion`})
		})
	})
}

//500 - server error
//404 - la organizacion no existe
//405 - el usuario no es moderador
//recibe como body: token , organizationID, userEmail
//Elimino la asignacion de un usuario como moderador
function revokeModerator (req, res){
	let token = req.body.token
	let id_organization = req.body.organizationID
	let userEmail = req.body.userEmail
//me fijo si la organizacion existe
	Organization.findOne({id: id_organization}, (err, organization)=>{
		if (err) return res.status(500).send({message: `Error al realizar la peticion: ${err}`})
		if (!organization) return res.status(404).send({message: 'La organizacion no existe'})
		let newModerators = organization.moderators
		//me fijo si el usuario es moderador
		if(!newModerators.includes(userEmail)) return res.status(405).send({message: 'El usuario no es moderador'})
		var index = newModerators.indexOf(userEmail);
		if (index > -1) {
			newModerators.splice(index, 1);
		}
		let update = { moderators: newModerators}
		//lo saco de la lista de moderadores y lo agrego a la lista de miembros
		Organization.findOneAndUpdate({id: id_organization}, update, (err,orgUpdated)=>{
			if(err) res.status(500).send({message:`Error al actualizar la organizacion: ${err}`})
	
			res.status(200).send({message:`Se elimino al usuario como moderador de la organizacion`})
		})
	})
}

//Devuelvo 200 si es owner o moderador de la organizacion
//404 - no existe la organizacion con ese id
//500 - server error
//400 - no es moderador
function hasEditPermission (req, res){
	let token = req.params.token
	let id_organization = req.params.id
	let userEmail = req.params.email
//me fijo si la organizacion existe
	Organization.findOne({id: id_organization}, (err, organization)=>{
		if (err) return res.status(500).send({message: `Error al realizar la peticion: ${err}`})
		if (!organization) return res.status(404).send({message: 'La organizacion no existe'})
		
		if(organization.owner.includes(userEmail) || organization.moderators.includes(userEmail)){
			return res.status(200).send({message:`El usuario ${userEmail} es owner o moderador`})
		} else{
			return res.status(400).send({message: 'El usuario no es moderador ni owner'})
		}
		
	})
}

//Elimino un usuario de la organizacion
//500 - server error
//404 - la organizacion no existe
//405 - no se puede eliminar al owner
//406 - el usuario no es parte de la organizacion 
function removeUser (req, res){
	let token = req.params.token
	let id_organization = req.params.id
	let userEmail = req.params.email
//me fijo si la organizacion existe
	Organization.findOne({id: id_organization}, (err, organization)=>{
		if (err) return res.status(500).send({message: `Error al realizar la peticion: ${err}`})
		if (!organization) return res.status(404).send({message: 'La organizacion no existe'})
		let newModerators = organization.moderators
		let newMembers = organization.members
		let owner = organization.owner
		if(owner.includes(userEmail)) return res.status(405).send({message: 'No se puede eliminar al creador de la organizacion'})
		//me fijo si el usuario es moderador
		if(!newMembers.includes(userEmail)) return res.status(406).send({message: 'El usuario no es parte de la organizacion'})
		var index = newModerators.indexOf(userEmail);
		if (index > -1) {
			newModerators.splice(index, 1);
		}
		var index2 = newMembers.indexOf(userEmail);
		if (index2 > -1) {
			newMembers.splice(index2, 1);
		}
		let update = { moderators: newModerators ,members: newMembers}
		//lo saco de la lista de moderadores y lo agrego a la lista de miembros
		Organization.findOneAndUpdate({id: id_organization}, update, (err,orgUpdated)=>{
			if(err) res.status(500).send({message:`Error al actualizar la organizacion: ${err}`})
			User.findOne({email: userEmail}, (err, usuario)=>{
				if (err) return res.status(500).send({message: `Error al realizar la peticion: ${err}`})
				let userOrg = usuario.organizations
				var index3 = userOrg.indexOf(id_organization);
				if (index3 > -1) {
					userOrg.splice(index3, 1);
				}
				User.findOneAndUpdate({email: userEmail}, {organizations: userOrg}, (err,userUpdate)=>{
					if (err) return res.status(500).send({message: `Error al realizar la peticion: ${err}`})
					let channels = orgUpdated.channels
					Channel.find({name: {$in: channels}, id: id_organization},(err, udChannel)=>{
						if (err) return res.status(500).send({message: `Error al realizar la peticion de Canales: ${err}`})
						
						const deleteMembersFromChannels = udChannel.map(function(element) {
							let newMembers = element.members;
							var index = element.members.indexOf(userEmail);
							if (index > -1) {
								newMembers.splice(index, 1);
							}
							let update = { members: newMembers}
							return Channel.findOneAndUpdate({id: id_organization, name: element.name}, update);
						});
						
						Promise.all(deleteMembersFromChannels).then((deletedChannels) => {
							return res.status(200).send({message:`Se elimino al usuario de la organizacion`})
						}).catch((err) =>{ 
							return res.status(500).send({message: `Error al editar los miembros de Canal: ${err}`});
						})
						
					})
					
				})
			})
		})
	})
}

//Actualiza el mensaje de bienvendia de la organizacion
//Recibe por body el token, el id de la organizacion y el nuevo mensaje
// 200 - Ok /  400 - No entro un mensaje de bienvenida / 404 - Organizacion no existe
function updateWelcomeOrganization (req, res){
	let token = req.body.token
	let id_organization = req.body.organizationID
	let welcome = req.body.welcome
	let update = {welcome: req.body.welcome}

	if(welcome == null) return res.status(400).send({message:'No hay mensaje en welcome'})


	Organization.findOneAndUpdate({id: id_organization}, update, (err,orgUpdated)=>{
		if(err) res.status(500).send({message:`Error al actualizar la organizacion: ${err}`})
		if (!orgUpdated) return res.status(404).send({message: 'La organizacion no existe'})
		
		res.status(200).send({message:`Se actualizo el mensaje de bienvenida de la organizacion`})
	})
}

//Actualiza el mensaje de bienvendia de la organizacion
//Recibe por body el token, el id de la organizacion y el nuevo mensaje
// 200 - Ok /  400 - No entro una photo / 404 - Organizacion no existe
function updatePhotoOrganization (req, res){
	let token = req.body.token
	let id_organization = req.body.organizationID
	let photo = req.body.photo
	let update = {photo: req.body.photo}

	if(photo == null) return res.status(400).send({message:'No se envio una foto para actualizar'})

	Organization.findOneAndUpdate({id: id_organization}, update, (err,orgUpdated)=>{
		if(err) res.status(500).send({message:`Error al actualizar la organizacion: ${err}`})
		if (!orgUpdated) return res.status(404).send({message: 'La organizacion no existe'})
		
		res.status(200).send({message:`Se actualizo la foto de la organizacion`})
	})
}

//Elimina la organizacion (200)
// 401 - El usuario no es owner
// 404 - si no existe la organizacion
// 500 - Error de server
/*
function remove(req, res){
	let token = req.body.token
	let id_organization = req.body.organizationID
	let email = req.body.email
	Organization.findOne({id: id_organization}, (err, organization)=>{
		if (err) return res.status(500).send({message: `Error al realizar la peticion: ${err}`})
		if (!organization) return res.status(404).send({message: 'La organizacion no existe'})
		var owners = organization.owner
		var moderators = organization.moderators
		var members = organization.members
		var channels = organization.channels
		//me fijo que el usuario sea owner
		if(!owners.includes(email)) return res.status(401).send({message: 'El usuario no es owner'})
		//recorro todos los usuarios y le elimino la organizacion
		User.find({name: {$in: members}},(err, usuarios)=>{
			if (err) return res.status(500).send({message: `Error al realizar la peticion de Usuarios: ${err}`})
			
			usuarios.forEach(function(element) {
				let userOrg = usuario.organizations
				let index2 = userOrg.indexOf(id_organization);
				if (index2 > -1) {
					userOrg.splice(index2, 1);
				}
				User.findOneAndUpdate({email: element}, {organizations: userOrg}, (err,userUpdate)=>{
					if (err) return res.status(500).send({message: `Error al realizar la peticion: ${err}`})
				})
			})
			udChannel.forEach(function(element) {
				if(element.members.includes(userEmail)) userChannels.push(element.name)
			})
			return res.status(200).send({channel: userChannels})
	})
		members.forEach(function(element) {
			User.findOne({email: element}, (err, usuario)=>{
				if (err) return res.status(500).send({message: `Error al realizar la peticion: ${err}`})
				let userOrg = usuario.organizations
				let index2 = userOrg.indexOf(id_organization);
				if (index2 > -1) {
					userOrg.splice(index2, 1);
				}
				User.findOneAndUpdate({email: element}, {organizations: userOrg}, (err,userUpdate)=>{
					if (err) return res.status(500).send({message: `Error al realizar la peticion: ${err}`})
				})
			})
		});
		//borro todos los canales de la organizacion
		Channel.deleteMany({id: id_organization},(err,userUpdate)=>{
			if (err) return res.status(500).send({message: `Error al realizar la peticion: ${err}`})
		})
		//borro todos las conversaciones privadas de la organizacion
		PrivateMsj.deleteMany({organizationID: id_organization},(err,userUpdate)=>{
			if (err) return res.status(500).send({message: `Error al realizar la peticion: ${err}`})
		})
		//borro la organizacion
		Organization.findOneAndDelete({id: id_organization}, (err,userUpdate)=>{
			if (err) return res.status(500).send({message: `Error al realizar la peticion: ${err}`})
		})
		return res.status(200).send({message:`Se elimino correctamente la organizacion`})
	})
	
}
*/

function checkMessage(req, res){
	User.findOne({token: req.body.userToken}, (err, user)=>{
		if(err) return res.status(500).send({message: `Error al buscar un usuario: ${err}`})
		if(!user) return res.status(404).send({message: `No existe usuario con token ${req.body.userToken}`})
		Organization.findOne({id: req.body.organizationID}, (err, organization)=>{
			if(err) return res.status(500).send({message: `Error al buscar una organizacion: ${err}`})
			if(!organization) return res.status(200).send({message: req.body.message}); //res.status(404).send({message: `No existe organizacoin con id ${req.body.organizationID}`})
			let restrictedWords = organization.restrictedWords;
			let message = req.body.message;
			for(let i=0; i<restrictedWords.length; i++){
				message = message.split(restrictedWords[i]).join('***')
			}
			Channel.findOne({id:req.body.organizationID, name:req.body.channelName},(err,channel)=>{
				if(err) return res.status(500).send({message: `Error al buscar un canal: ${err}`})
				if(channel){
					//sumo un mensaje al channel si existe, es decir que no es null
					//si id de channel es null --> channel no existe
					Channel.findOneAndUpdate({id: req.body.organizationID, name: req.body.channelName}, {messages: (channel.messages +1)},(err,channel2)=>{
						if(err) return res.status(500).send({message: `Error al buscar un canal: ${err}`})})
				}
			})
			return res.status(200).send({message: message});
		})		
	})
}

//api.get('/locations/:token/:idOrg',organizationControllers.getLocationsOrganization)
//500 - server error
//400 - token invalido
//404 - no existe una organizacion con ese id
//200 - lista de usuarios con nickname,email,longitud y latitud
function getLocationsOrganization(req, res){
	User.findOne({token: req.params.token}, (err, user)=>{
		if(err) return res.status(500).send({message: `Error al buscar un usuario: ${err}`})
		if(!user) return res.status(404).send({message: `No existe usuario con token ${req.params.token}`})
		Organization.findOne({id: req.params.id}, (err, organization)=>{
			if(err) return res.status(500).send({message: `Error al buscar la organizacion: ${err}`})
			if(!organization) return res.status(404).send({message: `No existe organizacoin con id ${req.params.id}`})
			let usersLocation = [];
			User.find({email: {$in: organization.members}}, (err, userOrg)=>{
				userOrg.forEach(function (element){
					usersLocation.push({nickname: element.nickname, email: element.email, longitud: element.longitud, latitud: element.latitud})
		
				})
				return res.status(200).send({users: usersLocation});
			})
		})
	})
}

function getRestrictedWords(req, res){
	User.findOne({token: req.params.token}, (err, user)=>{
		if(err) return res.status(500).send({message: `Error del servidor al buscar un usuario: ${err}`})
		if(!user) return res.status(404).send({message: `No existe usuario con token ${req.body.token}`})
		Organization.findOne({id: req.params.id}, (err, organization)=>{
			if (err) return res.status(500).send({message: `Error del servidor al buscar una organizacion: ${err}`})
			if (!organization) return res.status(404).send({message: 'La organizacion no existe'})
			
			let members = organization.members
			if(!members.includes(user.email)) return res.status(406).send({message: 'El usuario no es parte de la organizacion'})
			return res.status(200).send({restrictedWords:organization.restrictedWords})
		})
	})
}

function addRestrictedWords(req, res){
	User.findOne({token: req.params.token}, (err, user)=>{
		if(err) return res.status(500).send({message: `Error del servidor al buscar un usuario: ${err}`})
		if(!user) return res.status(404).send({message: `No existe usuario con token ${req.params.token}`})
		Organization.findOne({id: req.params.id}, (err, organization)=>{
			if (err) return res.status(500).send({message: `Error del servidor al buscar una organizacion: ${err}`})
			if (!organization) return res.status(404).send({message: 'La organizacion no existe'})
			
			let members = organization.members
			if(!members.includes(user.email)) return res.status(406).send({message: 'El usuario no es parte de la organizacion'})
			
			let owner = organization.owner
			let moderators = organization.moderators
			if(!owner.includes(user.email) && !moderators.includes(user.email)) return res.status(401).send({message:'El usuario no tiene permisos para editar las palabras prohibidas de la organizacion'})
			
			let newRestrictedWords = organization.restrictedWords.concat(req.body.restrictedWords)

			Organization.updateOne({id: req.params.id},{restrictedWords: newRestrictedWords},(err, org)=>{
				if (err) return res.status(500).send({message: `Error al realizar la peticion de Organizacion: ${err}`})
				res.status(200).send({restrictedWords:newRestrictedWords})
			})
		})
	})
}

function deleteRestrictedWords(req, res){
	User.findOne({token: req.params.token}, (err, user)=>{
		if(err) return res.status(500).send({message: `Error del servidor al buscar un usuario: ${err}`})
		if(!user) return res.status(404).send({message: `No existe usuario con token ${req.params.token}`})
		Organization.findOne({id: req.params.id}, (err, organization)=>{
			if (err) return res.status(500).send({message: `Error del servidor al buscar una organizacion: ${err}`})
			if (!organization) return res.status(404).send({message: 'La organizacion no existe'})
			
			let members = organization.members
			if(!members.includes(user.email)) return res.status(406).send({message: 'El usuario no es parte de la organizacion'})
			
			let owner = organization.owner
			let moderators = organization.moderators
			if(!owner.includes(user.email) && !moderators.includes(user.email)) return res.status(401).send({message:'El usuario no tiene permisos para editar las palabras prohibidas de la organizacion'})
			
			let filtered = organization.restrictedWords.filter(function(value, index, arr){
				    return value != req.body.restrictedWords;
				});

			Organization.updateOne({id: req.params.id},{ restrictedWords: filtered},(err, org)=>{
				if (err) return res.status(500).send({message: `Error al realizar la peticion de Organizacion: ${err}`})
				res.status(200).send({restrictedWords: filtered})
			})
		})
	})
}


//Devuelve la informacion del canal (200)
// 404 - si no existe la organizacion o canal
// 500 - Error de server
function getTotalMessages(req, res){
	let token = req.params.token

	User.findOne({token: token}, (err, usuario)=>{
		if (err) return res.status(500).send({message: `Error al realizar la peticion de Usuario: ${err}`})
		if (!usuario) return res.status(400).send({message: 'Token invalido'})
		
		Organization.find({id: {$in: usuario.organizations}}, (err, organizations)=>{
			if (err) return res.status(500).send({message: `Error al realizar la peticion de Organizacion: ${err}`})
			if(organizations.length == 0 ) return res.status(200).send({organizations: organizations})
			
			const addOnlyOwnerOrModeratorCanales = organizations.map(function(element) {
				return new Promise((resolve, reject) => {
					if(element.owner.includes(usuario.email) || element.moderators.includes(usuario.email)){
						let total = 0
						let res_canales = []
						Channel.find({id: {$in: element.id}}, (err, canales)=>{
			
							if (err) return res.status(500).send({message: `Error al realizar la peticion de Organizacion: ${err}`})
							canales.forEach(function (canal){
								res_canales.push({name: canal.name, total: canal.messages})
								total = (total + canal.messages)
							})
							return resolve({name: element.name, total: total, canales: res_canales})
						})
					} else{
						return resolve({})
					}
				})
				
			});
	
			Promise.all(addOnlyOwnerOrModeratorCanales).then((info_canales) => {
				return res.status(200).send(info_canales)
			}).catch((err) =>{ 
				return res.status(500).send({message: `Error al traer info de mensajes: ${err}`});
			})
		})
})
}

//Devuelve la informacion del canal (200)
// 404 - si no existe la organizacion o canal
// 500 - Error de server
function checkMention(req, res){
	let token = req.body.token
	let msj = req.body.message

	User.findOne({token: token}, (err, usuario)=>{
		if (err) return res.status(500).send({message: `Error al realizar la peticion de Usuario: ${err}`})
		if (!usuario) return res.status(400).send({message: 'Token invalido'})
		let pattern = /\B@[a-z0-9A-Z_.@-]+/gi;
		let result = msj.match(pattern);
		let ss= []
		let ss2= []
		if(result != null){
			result.forEach(function (element){
				ss.push(element.substr(1));	
			})
		}
		logger.info(`checkMention - Las menciones son: ${ss}`)
		User.find({email: {$in: ss}}, (err, usuarios)=>{
			if (err) return res.status(500).send({message: `Error al realizar la peticion de Usuario: ${err}`})
			usuarios.forEach(function (element){
				ss2.push(element.email);	
			})
			logger.info(`checkMention - se le devolvieron las menciones del mensaje "${msj}" al usuario con token ${token}`)
			return res.status(200).send({mentions: ss2})
		})			
	})
}


module.exports={
	getUserOrganizations,
	isOrganizationIDValid,
	createOrganization,
	addUserToOrganization,
	getInfoOrganization,
	updateNameOrganization,
	updatePasswordOrganization,
	asignModerator,
	revokeModerator,
	hasEditPermission,
	removeUser,
	updateWelcomeOrganization,
	updatePhotoOrganization,
	getLocationsOrganization,
	all,
	getRestrictedWords,
	addRestrictedWords,
	deleteRestrictedWords,
	checkMessage,
	checkMention,
	getTotalMessages
}