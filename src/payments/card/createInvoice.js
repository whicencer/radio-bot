const crypto = require('crypto');
const axios = require('axios');

async function createInvoice(amount, userId) {
	const orderReference = `${userId}_${Date.now()}`;
	const orderDate = Date.now();
	const currency = "USD";
	const productName = "Пополнение баланса в Radio Bot";

	const temp = [
		process.env.WAYFORPAY_MERCHANT_ACCOUNT,
		process.env.WAYFORPAY_MERCHANT_DOMAIN,
		orderReference,
		orderDate,
		amount,
		currency,
		productName,
		1,
		amount
	];

	const message = temp.join(";");
	const hmac = crypto.createHmac('md5', process.env.WAYFORPAY_MERCHANT_SECRET);
	hmac.update(message);

	const merchantSignature = hmac.digest('hex');

	const invoice = JSON.stringify({
		transactionType: "CREATE_INVOICE",
		merchantAccount: process.env.WAYFORPAY_MERCHANT_ACCOUNT,
		merchantDomainName: "https://t.me/shop_test_hjvfs2_bot",
		merchantSignature,
		apiVersion: 1,
		language: "ua",
		serviceUrl: "https://api.wayforpay.com/api/wayforpay/payment-status",
		orderReference,
		orderDate,
		amount,
		currency,
		orderTimeout: 600,
		productName: [productName],
		productPrice: [amount],
		productCount: [1],
		paymentSystems: "card;privat24;googlePay",
	});

	const res = await axios.post(process.env.WAYFORPAY_API_URL, invoice);

	return {
		invoiceUrl: res.data.invoiceUrl,
		orderReference
	};
};

module.exports = { createInvoice };