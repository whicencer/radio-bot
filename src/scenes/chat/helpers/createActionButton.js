const createActionButton = (status) => status === 'off'
  ? { text: '🔥 Запустити', callback_data: 'start_stream' }
  : { text: '🚫 Зупинити', callback_data: 'stop_stream' };

module.exports = { createActionButton };