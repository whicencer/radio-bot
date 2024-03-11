const crypto = require('crypto');
const axios = require('axios');

async function checkPayment(orderReference) {
	const merchantAccount = process.env.WAYFORPAY_MERCHANT_ACCOUNT;

	const temp = [
		merchantAccount,
		orderReference
	];
	
	const message = temp.join(";");
	const hmac = crypto.createHmac('md5', process.env.WAYFORPAY_MERCHANT_SECRET);
	hmac.update(message);

	const merchantSignature = hmac.digest('hex');

	const invoice = JSON.stringify({
		transactionType: "CHECK_STATUS",
		merchantAccount: merchantAccount,
		orderReference,
		merchantSignature,
		apiVersion: 1
	});

	const res = await axios.post(process.env.WAYFORPAY_API_URL, invoice);
	return res.data;
};

module.exports = { checkPayment };