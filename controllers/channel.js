'use strict'

const mongoose = require('mongoose');
const service = require('../services')
const User = require('../models/user');
const Organization = require('../models/organization');
const Channel = require('../models/channel');
const logger = require('../utils/logger');


function all(req,res){
	Channel.find({},(err, canales)=>{
		if (err) {
			return res.status(500).send({message: `Error al realizar la peticion del Canal: ${err}`})
		}
		
		return res.status(200).send({canales: canales})
	
	})
}


//Crea un canal
//devuelve 200 si se creo correctamente
// 404 - La organizacion no existe
// 405 - Ya existe un canal con ese nombre
// 500 - Error de server
function createChannel(req,res){
	let name = req.body.name
    let id = req.body.id
    let desc = req.body.description
	let owner = req.body.owner
	let welcome = req.body.welcome
    var priv = false
    if(req.body.private == 1) {priv = true}
	const channel = new Channel({
        name: req.body.name,
        id: req.body.id,
		private: priv,
        description: desc,
		members: [owner],
		welcome: welcome,
        owner: owner
    })

	//me fijo si la organizacion existe
	Organization.findOne({id: id}, (err, dbOrganization)=>{
		if (err) return res.status(500).send({message: `Error al realizar la peticion: ${err}`})
		if (!dbOrganization) return res.status(404).send({message: 'La organizacion no existe'})
        
        //me fijo si el canal existe
        if(dbOrganization.channels.includes(name)) return res.status(405).send({message: 'Ya existe un canal con ese nombre'})

        //si NO existe, guardo el nuevo canal en la base y en la organizacion
        

		channel.save((err)=>{
			if(err) {
				logger.error(`Error al crear el canal ${name}: ${err}`)
				return res.status(500).send({message: `canal - Error al crear el canal: ${err}`})
			}
			logger.info(`create channel - Se creo el canal ${name} en la organizacion ${id}`)
		
			//Agrego el canal a la organizacion 
			Organization.updateOne({id: id},{ $push: { channels: name } },(err, usuario)=>{
					if (err) {
						return res.status(500).send({message: `canal - Error al agregar el canal en la organizacion: ${err}`})
					}
					return res.status(200).send({message: `Se creo el canal ${name} en la organizacion ${id}`})
			})
	    })
		
	})

}


//devuelve 200 si el nombre del canal es valido para crearse 
// 403 en caso que la organizacion no exista
// 404 en caso ya haya un canal creado con ese nombre
function isChannelValid (req, res){
    let id_organization = req.params.id
    let name = req.params.name
	
	Organization.findOne({id: id_organization}, (err, organization)=>{
		if (err) return res.status(500).send({message: `Error al realizar la peticion: ${err}`})
		if (!organization) return res.status(403).send({message: 'La organizacion no existe'})
		
		if (organization.channels.includes(name)) return res.status(400).send({message: 'El canal ya existe'})
        return res.status(200).send({message: 'No existe un canal con ese nombre, valido para crear'})
		
		
	})
}


//Agrega el usuario al canal
//Devuelve 200 si lo agrego correctamente, 400 si no existe un usuario con ese email, 
//401 si no esta el usuario en la organizacion , 402 si no existe el canal en la organizacion
//403 si el usuario ya esta agregado en el canal ,404 si no existe una organizacion con ese id
//405 no tiene permiso para agregar a el canal
function addUserToChannel(req, res){
	let token = req.body.token
    let idOrganization = req.body.id
	let nameChannel = req.body.name
	let moderator = req.body.mo_email
	let userEmail = req.body.email


	//me fijo si la organizacion existe
	Organization.findOne({id: idOrganization}, (err, organization)=>{
		if (err) return res.status(500).send({message: `Error al realizar la peticion de Organizacion: ${err}`})
		if (!organization) return res.status(404).send({message: 'La organizacion no existe'})
		//si existe me fijo en las organizaciones del usuario a ver si ya esta agregado
		User.findOne({email: userEmail}, (err, usuario)=>{
			if (err) return res.status(500).send({message: `Error al realizar la peticion de Usuario: ${err}`})
			if (!usuario) return res.status(400).send({message: 'No existe un usuario con ese email'})
			let organizations = usuario.organizations
			//recorro todas para a ver si ya esta agregado
			if(!usuario.organizations.includes(organization.id)){
					return res.status(401).send({message: 'El usuario no existe en la organizacion'})
			}
			
            //si esta agregado, me fijo que exista el canal
            if(!organization.channels.includes(nameChannel)) return res.status(402).send({message: 'No existe el canal en la organizacion'})
            //si existe el canal me fijo si el usuario ya esta agregado
            Channel.findOne({name: nameChannel, id: idOrganization},(err, canal)=>{
				if (err) {
					return res.status(500).send({message: `Error al realizar la peticion del Canal: ${err}`})
                }
				if(canal.members.includes(userEmail)) return res.status(403).send({message: 'Ya existe el usuario en el canal'})
				
				if(canal.private){
					//si es privado el que agrega debe ser moderador o owner
					if(organization.owner.includes(moderator) || organization.moderators.includes(moderator)){
						Channel.updateOne({name: nameChannel, id: idOrganization},{ $push: { members: userEmail } },(err, udChannel)=>{
							if (err) {
								return res.status(500).send({message: `Error al realizar la peticion de Organizacion: ${err}`})
							}
							return res.status(200).send({message: 'El usuario se ha agregado correctamente en el canal'})
						})
						
					}else{
						return res.status(405).send({message: 'No tiene permisos para agregar usuarios a este canal'})
					}
				}else{

					Channel.updateOne({name: nameChannel, id: idOrganization},{ $push: { members: userEmail } },(err, udChannel)=>{
						if (err) {
							return res.status(500).send({message: `Error al realizar la peticion de Organizacion: ${err}`})
						}
						return res.status(200).send({message: 'El usuario se ha agregado correctamente en el canal'})
					})
				}
			})
			
		
		})
		
	})
}


//Elimina un usuario del canal
//Devuelve 200 si lo elimino correctamente, 400 si no existe un usuario con ese email, 
//401 si no esta el usuario en el organizacion , 402 si no existe el canal en la organizacion
//403 si no esta usuario en el canal ,404 si no existe una organizacion con ese id
function removeUserFromChannel(req, res){
	let token = req.params.token
    let idOrganization = req.params.id
    let nameChannel = req.params.name
	let userEmail = req.params.email


	//me fijo si la organizacion existe
	Organization.findOne({id: idOrganization}, (err, organization)=>{
		if (err) return res.status(500).send({message: `Error al realizar la peticion de Organizacion: ${err}`})
		if (!organization) return res.status(404).send({message: 'La organizacion no existe'})
		//si existe me fijo en las organizaciones del usuario a ver si ya esta agregado
		User.findOne({email: userEmail}, (err, usuario)=>{
			if (err) return res.status(500).send({message: `Error al realizar la peticion de Usuario: ${err}`})
			if (!usuario) return res.status(400).send({message: 'No existe un usuario con ese email'})
			let organizations = usuario.organizations
			//recorro todas para a ver si ya esta agregado
			if(!usuario.organizations.includes(organization.id)){
					return res.status(401).send({message: 'El usuario no existe en la organizacion'})
			}
            //si esta agregado, me fijo que exista el canal
            if(!organization.channels.includes(nameChannel)) return res.status(402).send({message: 'No existe el canal en la organizacion'})
            //si existe el canal me fijo si el usuario esta agregado
            Channel.findOne({name: nameChannel, id: idOrganization},(err, canal)=>{
				if (err) {
					return res.status(500).send({message: `Error al realizar la peticion del Canal: ${err}`})
                }
                if(!canal.members.includes(userEmail)) return res.status(403).send({message: 'No existe el usuario en el canal'})
                var newMembers = canal.members
                var index = newMembers.indexOf(userEmail);
		        if (index > -1) {
			        newMembers.splice(index, 1);
		        }
                
                Channel.updateOne({name: nameChannel, id: idOrganization},{ members: newMembers },(err, udChannel)=>{
					if (err) {
						return res.status(500).send({message: `Error al realizar la peticion de Organizacion: ${err}`})
					}
					return res.status(200).send({message: 'El usuario se ha eliminado correctamente en el canal'})
				})
			})
			
		
		})
		
	})
}


//Setea la privacidad del canal (200)
// 404 - si no existe un canal con ese nombre en la organizacion
// 500 - Error de server
function setPrivate (req, res){
	let token = req.body.token
	let idOrganization = req.body.organizationID
	let nameChannel = req.body.name
    var priv = false
    if(req.body.private == 1) {priv = true}

	Channel.findOneAndUpdate({name: nameChannel, id: idOrganization},{ private: priv },(err, udChannel)=>{
		if(err) res.status(500).send({message:`Error al actualizar la organizacion: ${err}`})
        if (!udChannel) return res.status(404).send({message: 'El canal no existe para esa organizacion'})
		res.status(200).send({message:`Se seteo al canal la privacidad del canal`})
	})
}


//Setea la descripcion del canal (200)
// 404 - si no existe un canal con ese nombre en la organizacion
// 500 - Error de server
function setDescription (req, res){
	let token = req.body.token
	let idOrganization = req.body.organizationID
	let nameChannel = req.body.name
    let desc = req.body.description

	Channel.findOneAndUpdate({name: nameChannel, id: idOrganization},{ description: desc },(err, udChannel)=>{
		if(err) res.status(500).send({message:`Error al actualizar la organizacion: ${err}`})
        if (!udChannel) return res.status(404).send({message: 'El canal no existe para esa organizacion'})
		res.status(200).send({message:`Se actualizo la descripcion del canal`})
	})
}

//Setea el mensaje de bienvenida del canal (200)
// 404 - si no existe un canal con ese nombre en la organizacion
// 500 - Error de server
function setWelcome (req, res){
	let token = req.body.token
	let idOrganization = req.body.organizationID
	let nameChannel = req.body.name
    let wel = req.body.welcome

	Channel.findOneAndUpdate({name: nameChannel, id: idOrganization},{ welcome: wel },(err, udChannel)=>{
		if(err) res.status(500).send({message:`Error al actualizar la organizacion: ${err}`})
        if (!udChannel) return res.status(404).send({message: 'El canal no existe para esa organizacion'})
		res.status(200).send({message:`Se actualizo el mensaje de bienvenida del canal`})
	})
}

//Devuelve la descripcion del canal (200)
// 404 - si no existe un canal con ese nombre en la organizacion
// 500 - Error de server
function getDescription (req, res){
	let token = req.params.token
	let idOrganization = req.params.id
	let nameChannel = req.params.name


	Channel.findOne({name: nameChannel, id: idOrganization},(err, udChannel)=>{
		if(err) res.status(500).send({message:`Error al actualizar la organizacion: ${err}`})
        if (!udChannel) return res.status(404).send({message: 'El canal no existe para esa organizacion'})
		res.status(200).send({description: udChannel.description})
	})
}

//Devuelve el mensaje de bienvenida del canal (200)
// 404 - si no existe un canal con ese nombre en la organizacion
// 500 - Error de server
function getWelcome (req, res){
	let token = req.params.token
	let id_organization = req.params.id
	let name = req.params.name


	Channel.findOne({name: name, id: id_organization},(err, udChannel)=>{
		if(err) res.status(500).send({message:`Error al actualizar la organizacion: ${err}`})
        if (!udChannel) return res.status(404).send({message: 'El canal no existe para esa organizacion'})
		res.status(200).send({welcome: udChannel.welcome})
	})
}

//Devuelve la privacidad del canal (200)
// 404 - si no existe un canal con ese nombre en la organizacion
// 500 - Error de server
function getPrivate (req, res){
	let token = req.params.token
	let id_organization = req.params.id
	let name = req.params.name

    if(req.body.private == 1) {priv = true}

	Channel.findOne({name: name, id: id_organization},(err, udChannel)=>{
		if(err) res.status(500).send({message:`Error al actualizar la organizacion: ${err}`})
        if (!udChannel) return res.status(404).send({message: 'El canal no existe para esa organizacion'})
		res.status(200).send({private: udChannel.private})
	})
}

//Elimina el canal (200)
//404 - No existe la organizacion
// 405 - si no existe un canal con ese nombre en la organizacion
// 500 - Error de server
function remove(req, res){
	let token = req.params.token
	let idOrganization = req.params.id
	let nameChannel = req.params.name

	//buscamos la organizacion 
	Organization.findOne({id: idOrganization},(err, organization)=>{
		if (err) {
			return res.status(500).send({message: `Error al realizar la peticion de la Organizacion: ${err}`})
		}
		if(!organization) return res.status(404).send({message: 'No existe la organizacion'})
		
		if(!organization.channels.includes(nameChannel)) return res.status(405).send({message: 'No existe el canal en la organizacion'})
		//si existe la organizacion y el canal en la organizacion
		var newChannels = organization.channels
		var index = newChannels.indexOf(nameChannel);
		if (index > -1) {
			newChannels.splice(index, 1);
		}
		
		Organization.updateOne({id: idOrganization},{ channels: newChannels },(err, udOrg)=>{
			if (err) {
				return res.status(500).send({message: `Error al realizar la peticion de Organizacion: ${err}`})
			}
			//borro el canal en la bd de canales
			Channel.findOneAndDelete({name: nameChannel, id: idOrganization},(err, udChannel)=>{
				if(err) res.status(500).send({message:`Error al actualizar la organizacion: ${err}`})
				if (!udChannel) return res.status(405).send({message: 'El canal no existe en esa organizacion'})
				res.status(200).send({message: 'El canal se ha eliminado correctamente'})
			})
		})
	})

	
	
}

//Devuelve la informacion del canal (200)
// 404 - si no existe la organizacion o canal
// 500 - Error de server
function channelInfo(req, res){
	let token = req.params.token
	let idOrganization = req.params.id
	let nameChannel = req.params.name

	Channel.findOne({name: nameChannel, id: idOrganization},(err, udChannel)=>{
		if(err) res.status(500).send({message:`Error al actualizar la organizacion: ${err}`})
        if (!udChannel) return res.status(404).send({message: 'La organizacion no existe o el canal no existe en esa organizacion'})
		res.status(200).send({channel: udChannel})
	})
}

//Devuelve los canales del usuario que tiene agregados en la app(200)
// 400 - si no existe un usuario con ese email
// 404 - si no existe la organizacion
// 405 - si no existe un usuario con ese email en la organizacion
// 500 - Error de server
function userChannels(req, res){
	let token = req.body.token
	let idOrganization = req.body.id
	let userEmail = req.body.email


	//me fijo si la organizacion existe
	Organization.findOne({id: idOrganization}, (err, organization)=>{
		if (err) return res.status(500).send({message: `Error al realizar la peticion de Organizacion: ${err}`})
		if (!organization) return res.status(404).send({message: 'La organizacion no existe'})
		//si existe me fijo en las organizaciones del usuario a ver si ya esta agregado
		User.findOne({email: userEmail}, (err, usuario)=>{
			if (err) return res.status(500).send({message: `Error al realizar la peticion de Usuario: ${err}`})
			if (!usuario) return res.status(400).send({message: 'No existe un usuario con ese email'})
			let organizations = usuario.organizations
			//recorro todas para a ver si ya esta agregado
			if(!usuario.organizations.includes(organization.id)){
					return res.status(405).send({message: 'El usuario no existe en la organizacion'})
			}
			var userChannels = []
			var prueba = []
			let channels = organization.channels
			
			Channel.find({name: {$in: channels}, id: idOrganization},(err, udChannel)=>{
					if (err) return res.status(500).send({message: `Error al realizar la peticion de Organizacion: ${err}`})
					
					udChannel.forEach(function(element) {
						if(element.members.includes(userEmail)) userChannels.push(element.name)
					})
					return res.status(200).send({channel: userChannels})
			})
			
			
		})
	})	
	
}



//Devuelve los canales del usuario que tiene agregados en la app(200)
// 400 - si no existe un usuario con ese email
// 404 - si no existe la organizacion
// 405 - si no existe un usuario con ese email en la organizacion
// 500 - Error de server
function userAllChannels(req, res){
	let token = req.body.token
	let idOrganization = req.body.id
	let userEmail = req.body.email


	//me fijo si la organizacion existe
	Organization.findOne({id: idOrganization}, (err, organization)=>{
		if (err) return res.status(500).send({message: `Error al realizar la peticion de Organizacion: ${err}`})
		if (!organization) return res.status(404).send({message: 'La organizacion no existe'})
		//si existe me fijo en las organizaciones del usuario a ver si ya esta agregado
		User.findOne({email: userEmail}, (err, usuario)=>{
			if (err) return res.status(500).send({message: `Error al realizar la peticion de Usuario: ${err}`})
			if (!usuario) return res.status(400).send({message: 'No existe un usuario con ese email'})
			let organizations = usuario.organizations
			//recorro todas para a ver si ya esta agregado
			if(!usuario.organizations.includes(organization.id)){
					return res.status(405).send({message: 'El usuario no existe en la organizacion'})
			}
			var userChannels = []
			var prueba = []
			let channels = organization.channels
			
			Channel.find({name: {$in: channels}, id: idOrganization},(err, udChannel)=>{
					if (err) return res.status(500).send({message: `Error al realizar la peticion de Organizacion: ${err}`})
					
					udChannel.forEach(function(element) {
						if(!element.private) userChannels.push(element.name)
						else{
							if(element.members.includes(userEmail)) userChannels.push(element.name)
						}
					})
					return res.status(200).send({channel: userChannels})
			})
			
			
		})
	})	
	
}




module.exports={
    createChannel,
    isChannelValid,
    addUserToChannel,
    removeUserFromChannel,
    setPrivate,
    setDescription,
    setWelcome,
    getPrivate,
    getDescription,
    getWelcome,
	remove,
	channelInfo,
	userChannels,
	userAllChannels,
	all
}