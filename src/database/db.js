const { Sequelize } = require('sequelize');

module.exports = new Sequelize(
	'postgres',
	'postgres',
	'admin',
	{
		host: 'localhost',
		port: '5432',
		dialect: 'postgres'
	}
);