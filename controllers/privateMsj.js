'use strict'

const mongoose = require('mongoose');
const User = require('../models/user');
const Organization = require('../models/organization');
const Channel = require('../models/channel');
const PrivateMsj = require('../models/privateMsj');
const logger = require('../utils/logger');
const admin = require('../sendNotification');


function all(req,res){
	PrivateMsj.find({},(err, privados)=>{
		if (err) {
			return res.status(500).send({message: `Error al realizar la peticion de los chats privados`})
		}
		
		return res.status(200).send({privateMsj: privados})
	
	})
}

//devuelve los mensajes privados que tiene un usuario fuera de las organizaciones
//El token debe ser pasado en la url (params)
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

//devuelve los mensajes privados que tiene un usuario en una organizacion
//El token debe ser pasado en el url
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
            if (!user2) return res.status(404).send({message: 'No existe el email en el sistema u organizacion'})
            
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

function existe_chat_privado(email1, email2, id){
    return new Promise(function(resolve, reject){
        PrivateMsj.findOne({id: id, email_user1: email1, email_user2: email2}, (err, msjs)=>{
            if (err) return reject(new Error(`Error al realizar la peticion: ${err}`))
            if(!msjs){
                PrivateMsj.findOne({id: id, email_user1: email2, email_user2: email1}, (err, msjs2)=>{
                    if (err) return reject(new Error(`Error al realizar la peticion: ${err}`))
                    if(!msjs2) return reject(new Error(`No existe el chat entre ambos usuarios`))
                    return resolve("existe")
                })
            }else{
                return resolve("existe")
            }
        })
    })
}


//Devuelve la informacion del canal (200)
// 404 - si no existe la organizacion o canal
// 500 - Error de server
function checkMentionPrivado(req, res){
	let token = req.body.token
	let msj = req.body.message
    let userEmail = req.body.email
    let id_organization = req.body.id
    

	User.findOne({token: token}, (err, user)=>{
		if (err) return res.status(500).send({message: `Error al realizar la peticion de Usuario: ${err}`})
		if (!user) return res.status(400).send({message: 'Token invalido'})

        let texto_org = (user.email+" en la organizacion: "+id_organization)
        if(id_organization == null) texto_org = userEmail
        var payload ={
            notification: {
              "body" : ("Te han @ en el chat con "+texto_org),
              "title" : "Rapido! Revisa tus mensajes"
            },
            data : {
              "Titulo" : "Te han @",
              "Subtitulo" : "Chat privado"
            }
        };
        var options = {
            priority: "high",
            timeToLive: 60 * 60 * 24
        };
        var pattern = /\B@[a-z0-9A-Z_.@-]+/gi;
			let result = msj.match(pattern);
			let ss= []
			let ss2= []
			if(result != null){
				result.forEach(function (element){
					ss.push(element.substr(1));	
				})
            }
        
             //me fijo q no este creado
          
         
        var promesa = existe_chat_privado(userEmail,user.email,id_organization)   

        promesa.then(function(resultado) {
                if(ss.includes(userEmail)){
                    User.findOne({email: userEmail}, (err, user2)=>{
                        if (err) return res.status(500).send({message: `Error al realizar la peticion de Usuario: ${err}`})
                        if (!user2) return res.status(400).send({message: 'Usuario invalido'})
                        var registrationToken = user2.token_notifications
                        console.log("RegistrationToken: ",registrationToken);
                        admin.messaging().sendToDevice(registrationToken, payload, options)
                            .then(function(response){
                                console.log("Se envio correctamente la push notification: ",response);
                                return res.status(200).send({message: "se han enviado las notificaciones"})
                            })
                            .catch(function(error){
                                console.log("Problema al eviar la push notification: ",error);
                                return res.status(404).send({message: 'Error al enviar las notificaciones'})
                            })
                    })
                }else{
                    return res.status(200).send({message: "se han enviado las notificaciones"})
                }  
				
			}).catch(function(err){ 
				return res.status(500).send({message: `Error al enviar las notificaciones: ${err}`});
			})
	
	})
}

module.exports={
    all,
    getPrivateMsj,
    getPrivateMsjInOrganization,
    privateMsjInfo,
    privateMsjInfoOrganization,
    createPrivateMsj,
    checkMentionPrivado
}