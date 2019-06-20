'use strict'

const mongoose = require('mongoose');
const User = require('../models/user');
const Organization = require('../models/organization');
const Channel = require('../models/channel');
const PrivateMsj = require('../models/privateMsj');
const logger = require('../utils/logger');


function all(req,res){
	PrivateMsj.find({},(err, privados)=>{
		if (err) {
			return res.status(500).send({message: `Error al realizar la peticion de los chats privados`})
		}
		
		return res.status(200).send({privateMsj: privados})
	
	})
}



//devuelve los mensajes privados que tiene un usuario.
//El token debe ser pasado en el body
function getPrivateMsj(req, res){
    let token = req.params.token
    
    //chequeo si existe el token
    User.findOne({token: token}, (err, user)=>{
        if (err) return res.status(500).send({message: `Error al realizar la peticion: ${err}`})
        if (!user) return res.status(400).send({message: 'Token invalido'})
        PrivateMsj.find({id: null, email_user1: user.email}, (err, msjs)=>{
            if (err) return res.status(500).send({message: `Error al realizar la peticion: ${err}`})
            PrivateMsj.find({id: null, email_user2: user.email}, (err, msjs2)=>{
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
    })
	
}

//devuelve los mensajes privados que tiene un usuario.
//El token debe ser pasado en el body
function getPrivateMsjInOrganization(req, res){
    let token = req.params.token
    let org_id = req.params.id
    
    //chequeo si existe el token
    User.findOne({token: token}, (err, user)=>{
        if (err) return res.status(500).send({message: `Error al realizar la peticion: ${err}`})
        if (!user) return res.status(400).send({message: 'Token invalido'})
        
        PrivateMsj.find({id: org_id, email_user1: user.email}, (err, msjs)=>{
            if (err) return res.status(500).send({message: `Error al realizar la peticion: ${err}`})
            PrivateMsj.find({id: org_id, email_user2: user.email}, (err, msjs2)=>{
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
    })
	
}

//Devuelve la informacion del chat privado (200)
// 400 - token invalido
// 404 - si no existe el email
// 405 - no existe un chat privado entre ambos usuarios 
// 500 - Error de server
function privateMsjInfo(req, res){
	let token = req.params.token
    let userEmail = req.params.email

    //chequeo si existe el token
    User.findOne({token: token}, (err, user)=>{
        if (err) return res.status(500).send({message: `Error al realizar la peticion: ${err}`})
        if (!user) return res.status(400).send({message: 'Token invalido'})

        //chequeo que exista el email
        User.findOne({email: userEmail}, (err, user2)=>{
            if (err) return res.status(500).send({message: `Error al realizar la peticion: ${err}`})
            if (!user2) return res.status(404).send({message: 'No existe el email en el sistema o organizacion'})
            
            //chequear que exista el email y id
	        PrivateMsj.findOne({id: null, email_user1: userEmail, email_user2: user.email}, (err, msjs)=>{
		        if (err) return res.status(500).send({message: `Error al realizar la peticion: ${err}`})
                if(!msjs){
                    PrivateMsj.findOne({id: null, email_user1: user.email, email_user2: userEmail}, (err, msjs2)=>{
                        if (err) return res.status(500).send({message: `Error al realizar la peticion: ${err}`})
                        if(!msjs2) return res.status(405).send({message: `No existe un chat privado entre ambos usuarios dentro de la organizacion`})
                        return res.status(200).send({private_msj: {_id: msjs2._id, name: userEmail}})
                    })
                }else{
                    return res.status(200).send({private_msj: {_id: msjs._id, name: userEmail}})
                }
		    })

        })
    })
	
}

//Devuelve la informacion del chat privado de una organizacion (200)
// 400 - token invalido
// 404 - si no existe el email
// 405 - no existe un chat privado entre ambos usuarios dentro de la organizacion
// 500 - Error de server
function privateMsjInfoOrganization(req, res){
	let token = req.params.token
	let id_organization = req.params.id
    let userEmail = req.params.email

    //chequeo si existe el token
    User.findOne({token: token}, (err, user)=>{
        if (err) return res.status(500).send({message: `Error al realizar la peticion: ${err}`})
        if (!user) return res.status(400).send({message: 'Token invalido'})

        //chequeo que exista el email
        User.findOne({email: userEmail}, (err, user2)=>{
            if (err) return res.status(500).send({message: `Error al realizar la peticion: ${err}`})
            if (!user2) return res.status(404).send({message: 'No existe el email en el sistema o organizacion'})
            
            //chequear que exista el email y id
	        PrivateMsj.findOne({id: id_organization, email_user1: userEmail, email_user2: user.email}, (err, msjs)=>{
		        if (err) return res.status(500).send({message: `Error al realizar la peticion: ${err}`})
                if(!msjs){
                    PrivateMsj.findOne({id: id_organization, email_user1: user.email, email_user2: userEmail}, (err, msjs2)=>{
                        if (err) return res.status(500).send({message: `Error al realizar la peticion: ${err}`})
                        if(!msjs2) return res.status(405).send({message: `No existe un chat privado entre ambos usuarios dentro de la organizacion`})
                        return res.status(200).send({private_msj: {_id: msjs2._id, name: userEmail}})
                    })
                }else{
                    return res.status(200).send({private_msj: {_id: msjs._id, name: userEmail}})
                }
		    })

        })
    })
	
}

//Crea un nuevo chat privado (200)
// 400 - token invalido
// 403 - no existe el email
// 404 - no existe algun email en la organizacion
// 405 - ya existe un chat privado entre ambos usuarios dentro de la organizacion
// 406 - no existe la organizacion
// 500 - Error de server
function createPrivateMsj(req, res){
	let token = req.body.token
	let id_organization = req.body.id
    let userEmail = req.body.email
    let free_chat = false
    if(req.body.id == null) free_chat = true
                          
    //chequeo si existe el token
    User.findOne({token: token}, (err, user)=>{
        if (err) return res.status(500).send({message: `Error al realizar la peticion: ${err}`})
        if (!user) return res.status(400).send({message: 'Token invalido'})

        //chequeo que exista el email
        User.findOne({email: userEmail}, (err, user2)=>{
            if (err) return res.status(500).send({message: `Error al realizar la peticion: ${err}`})
            if (!user2) return res.status(404).send({message: 'No existe el email en el sistema'})
                            
            //me fijo q no este creado
            PrivateMsj.findOne({id: id_organization, email_user1: userEmail, email_user2: user.email}, (err, msjs)=>{
                if (err) return res.status(500).send({message: `Error al realizar la peticion: ${err}`})
                if(!msjs){
                    PrivateMsj.findOne({id: id_organization, email_user1: user.email, email_user2: userEmail}, (err, msjs2)=>{
                        if (err) return res.status(500).send({message: `Error al realizar la peticion: ${err}`})
                        if(msjs2) return res.status(405).send({message: `Ya existe un chat privado entre ambos usuarios dentro de la organizacion ${id_organization}`})
                        
                        //no existe me fijo si el chat a crear esta dentro o fuera de una organizacion
                        if(free_chat){
                            //si es un chat fuera de una organizacion entonces creo directamente
                            const private_msj = new PrivateMsj({
                                email_user1: user.email,
                                email_user2: userEmail
                            })
                            
                            private_msj.save((err)=>{
                                if(err) {
                                    logger.error(`Error al crear el chat privado ${name}: ${err}`)
                                    return res.status(500).send({message: `privateMsj - Error al crear el chat privado: ${err}`})
                                }
                                logger.info(`create private chat - Se creo el chat privado entre ${userEmail} y ${user.email} en la organizacion ${id_organization}`)
                                return res.status(200).send({message: `Se creo el chat privado en la organizacion`})
                            })

                        }else{
                            //si es un chat dentro de una organizacion entones me fijo que:
                            //la organizacion existe y que
                            //los usuarios pertenecen a la organizacion
                            Organization.findOne({id: id_organization},(err, org)=>{
                                if (err) return res.status(500).send({message: `Error al realizar la peticion: ${err}`})
                                if (!org) return res.status(406).send({message: `No existe la organizacion: ${id_organization}`})
                                if(org.members.includes(userEmail) && org.members.includes(user.email)){
                                    const private_msj_org = new PrivateMsj({
                                        email_user1: user.email,
                                        email_user2: userEmail,
                                        id: id_organization
                                    })
                                    //si los usuarios pertenecen a la organizacion entonces creo el chat
                                    private_msj_org.save((err)=>{
                                        if(err) {
                                            logger.error(`Error al crear el chat privado ${name}: ${err}`)
                                            return res.status(500).send({message: `privateMsj - Error al crear el chat privado: ${err}`})
                                        }else{
                                        logger.info(`create private chat - Se creo el chat privado entre ${userEmail} y ${user.email} en la organizacion: ${id_organization}`)
                                        return res.status(200).send({message: `Se creo el chat privado en la organizacion`})
                                        }
                                    })
                                }else{
                                    return res.status(404).send({message: `No existe alguno de los usuarios como miembro de la organizacion: ${id_organization}`})
                                }
                            })
                        }
                    })
                }else{
                    return res.status(405).send({message: `Ya existe un chat privado entre ambos usuarios dentro de la organizacion ${id_organization}`})
                }
            })
        })
    })
	
}



module.exports={
    all,
    getPrivateMsj,
    getPrivateMsjInOrganization,
    privateMsjInfo,
    privateMsjInfoOrganization,
    createPrivateMsj
}