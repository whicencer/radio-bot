const createActionButton = (status) => status === 'off'
  ? { text: '🔥 Запустить', callback_data: 'start_stream' }
  : { text: '🚫 Остановить', callback_data: 'stop_stream' };

module.exports = { createActionButton };