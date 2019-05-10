module.exports = {
	port : process.env.PORT || 5000,
	db : process.env.MONGODB|| 'mongodb://mongo:27017/hypechat',
	SECRET_TOKEN : 'miclavedetockens',
	logLevel: 'debug'
}