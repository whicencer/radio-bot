const createActionButton = (status) => status === 'off'
  ? { text: '🔥 Start', callback_data: 'start_stream' }
  : { text: '🚫 Stop', callback_data: 'stop_stream' };

module.exports = { createActionButton };