const NONE = 'none';
const BASIC = {
	id: 'basic',
	price: 10,
	max_chats: 2,
	add_source_btns: [
		[{ text: '🎶 Radio', callback_data: 'choose_radio' }],
		[{ text: '🚫 Отменить', callback_data: 'cancel' }]
	]
};
const ADVANCED = {
	id: 'advanced',
	price: 40,
	max_chats: 5,
	add_source_btns: [
		[{ text: '🎦🎶 Youtube', callback_data: 'add_youtube' }],
		[{ text: '🎶 Radio', callback_data: 'choose_radio' }],
		[{ text: '🚫 Отменить', callback_data: 'cancel' }]
	]
};
const PREMIUM = {
	id: 'premium',
	price: 70,
	max_chats: 15,
	add_source_btns: [
		[{ text: '🎦🎶 Youtube', callback_data: 'add_youtube' }],
		[{ text: '🎶 Radio', callback_data: 'choose_radio' }],
		[{ text: '🚫 Отменить', callback_data: 'cancel' }]
	]
};

module.exports = {
	NONE, BASIC, ADVANCED, PREMIUM,
};