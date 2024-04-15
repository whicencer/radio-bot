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

// module.exports = new Sequelize(process.env.DATABASE_URL);