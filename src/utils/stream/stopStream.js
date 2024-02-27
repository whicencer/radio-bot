async function stopStream(proccess) {
	proccess.kill();
};

module.exports = { stopStream };