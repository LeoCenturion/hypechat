const {createLogger, format, transports} = require('winston');
const config = require('../config');

module.exports = createLogger({
	format: format.combine(
		format.simple(), 
		format.timestamp(),
		format.printf(info => `[${info.timestamp}] ${info.level} : ${info.message}`)
	),
	transports: [
		new transports.File({
			maxsize: 5120000,
			maxFiles: 1,
			filename: './logApi.log'
		}),
		new transports.Console({
			level: config.logLevel
		})
	]
})