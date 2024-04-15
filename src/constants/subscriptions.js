const NONE = 'none';
const BASIC = {
	id: 'basic',
	price: 10,
	max_chats: 1,
	add_source_btns: [
		[{ text: '🎶 Radio', callback_data: 'choose_radio' }],
		[{ text: `🚫 Cancel`, callback_data: 'cancel' }]
	]
};
const ADVANCED = {
	id: 'advanced',
	price: 40,
	max_chats: 2,
	add_source_btns: [
		[{ text: '🎦🎶 Youtube', callback_data: 'add_youtube' }],
		[{ text: '🎦🎶 Youtube LIVE', callback_data: 'add_youtube' }],
		[{ text: '🎶 Radio', callback_data: 'choose_radio' }],
		[{ text: '🚫 Cancel', callback_data: 'cancel' }]
	]
};
const PREMIUM = {
	id: 'premium',
	price: 70,
	max_chats: 4,
	add_source_btns: [
		[{ text: '🎦🎶 Youtube', callback_data: 'add_youtube' }],
		[{ text: '🎦🎶 Youtube LIVE', callback_data: 'add_youtube' }],
		[{ text: '🎦🎶 Twitch', callback_data: 'add_twitch' }],
		[{ text: '🎬 Filmix', callback_data: 'add_movie' }],
		[{ text: '🎶 Radio', callback_data: 'choose_radio' }],
		[{ text: '🚫 Cancel', callback_data: 'cancel' }]
	]
};

module.exports = {
	NONE, BASIC, ADVANCED, PREMIUM,
};