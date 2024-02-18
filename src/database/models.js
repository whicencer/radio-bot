const sequelize = require('./db');
const { DataTypes } = require('sequelize');

const User = sequelize.define('user', {
	id: {type: DataTypes.BIGINT, primaryKey: true, unique: true},
	balance: {type: DataTypes.BIGINT, defaultValue: 0},
});

const Resource = sequelize.define('resource', {
	id: {type: DataTypes.BIGINT, primaryKey: true, unique: true, autoIncrement: true},
	name: {type: DataTypes.STRING},
	url: {type: DataTypes.STRING, unique: true}
});

User.hasMany(Resource, {as: 'resources', foreignKey: 'userId'});
Resource.belongsTo(User, {foreignKey: 'userId'});

const Chat = sequelize.define('chat', {
	id: {type: DataTypes.BIGINT, primaryKey: true, unique: true},
	name: {type: DataTypes.STRING},
	status: {type: DataTypes.STRING, defaultValue: 'off'}
});

module.exports = {
	Chat,
	User,
	Resource
};