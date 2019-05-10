'use strict'

const mongoose = require('mongoose');
const app = require('./app')
const config = require('./config')
const logger = require('./utils/logger')

mongoose.connect(config.db, function(err, res) {
	if(err) {
		return logger.error(`Error al conectar a la base de datos: ${err}`)
	}
	logger.info('Se conecto a la base de datos');

	app.listen(config.port, () =>{
		//console.log(`Servidor Express escuchando en el puerto: ${config.port}`)
		logger.info(`Servidor Express escuchando en el puerto: ${config.port}`)
	})
});

