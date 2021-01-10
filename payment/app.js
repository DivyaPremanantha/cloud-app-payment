const databaseManager = require('./databaseManager');
/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */

exports.paymentHandler = async (event, context) => {
	console.log(event);
	const TABLE_NAME = process.env.TABLE_NAME;

	switch (event.httpMethod) {
		case 'DELETE':
			return deletePayment(event);
		case 'GET':
			return getPayment(event);
		case 'POST':
			return savePayment(event, context);
		case 'PUT':
			return updatePayment(event, TABLE_NAME);
		default:
			return sendResponse(404, `Unsupported method "${event.httpMethod}"`);
	}
};

function savePayment(event, context) {
	const TABLE_NAME = process.env.PAYMENT_TABLE_NAME;
	const payment = JSON.parse(event.body);
	payment.paymentId = context.awsRequestId;
	payment.customerId = event.requestContext.authorizer.claims.sub;

	return databaseManager.savePayment(payment).then(response => {
		console.log(response);
		const formData = JSON.parse(event.body);
		formData.paramName = "paymentStatus";
		formData.paramValue = "Successfull";
		return updateBooking(formData);
	});
}

function getPayment(event) {
	const paymentId = event.pathParameters.paymentId;

	return databaseManager.getPayment(paymentId).then(response => {
		console.log(response);
		return sendResponse(200, JSON.stringify(response));
	});
}

function deletePayment(event) {
	const paymentId = event.pathParameters.paymentId;

	return databaseManager.deletePayment(paymentId).then(response => {
		return sendResponse(200, 'DELETE payment');
	});
}

function updateBooking(event) {
	const bookingId = event.bookingId;
	const paramName = event.paramName;
	const paramValue = event.paramValue;

	return databaseManager.updateBooking(bookingId, paramName, paramValue).then(response => {
		console.log(response);
		return sendResponse(200, response);
	});
}

function updatePayment(event) {
	const paymentId = event.pathParameters.paymentId;

	const body = JSON.parse(event.body);
	const paramName = body.paramName;
	const paramValue = body.paramValue;

	return databaseManager.updatePayment(paymentId, paramName, paramValue).then(response => {
		console.log(response);
		return sendResponse(200, JSON.stringify(response));
	});
}

function sendResponse(statusCode, message) {
	const response = {
		statusCode: statusCode,
		body: JSON.stringify(message)
	};
	return response
}
