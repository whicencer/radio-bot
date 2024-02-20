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

const Chat = sequelize.define('chat', {
	id: {type: DataTypes.BIGINT, primaryKey: true, unique: true, autoIncrement: true},
	name: {type: DataTypes.STRING, unique: true, allowNull: false},
	chatLink: {type: DataTypes.STRING, unique: true, allowNull: false},
	streamKey: {type: DataTypes.STRING, unique: true, allowNull: false},
	status: {type: DataTypes.STRING, defaultValue: 'off'}
});

User.hasMany(Resource, {as: 'resources', foreignKey: 'userId'});
User.hasMany(Chat, {as: 'chats', foreignKey: 'userId'});
Chat.hasMany(Resource, {as: 'resources', foreignKey: 'chatId'});

Chat.belongsTo(User, {foreignKey: 'userId'});
Resource.belongsTo(User, {foreignKey: 'userId'});
Resource.belongsTo(Chat, {foreignKey: 'chatId'});

module.exports = {
	Chat,
	User,
	Resource
};