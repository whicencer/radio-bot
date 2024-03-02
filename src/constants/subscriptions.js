const NONE = 'none';
const BASIC = {
	id: 'basic',
	max_chats: 2,
	add_source_btns: [
		[{ text: '🎶 Radio', callback_data: 'choose_radio' }],
		[{ text: '🚫 Отменить', callback_data: 'cancel' }]
	]
};
const ADVANCED = {
	id: 'advanced',
	max_chats: 5,
	add_source_btns: [
		[{ text: '🎦🎶 Youtube', callback_data: 'add_youtube' }],
		[{ text: '🎶 Radio', callback_data: 'choose_radio' }],
		[{ text: '🚫 Отменить', callback_data: 'cancel' }]
	]
};
const PREMIUM = {
	id: 'premium',
	max_chats: 15,
	add_source_btns: [
		[{ text: '🎦🎶 Youtube', callback_data: 'add_youtube' }],
		[{ text: '🎶 Radio', callback_data: 'choose_radio' }],
		[{ text: '🎦🎶 Twitch', callback_data: 'test' }],
		[{ text: '🚫 Отменить', callback_data: 'cancel' }]
	]
};

module.exports = {
	NONE, BASIC, ADVANCED, PREMIUM,
};