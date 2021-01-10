'use strict';

const AWS = require('aws-sdk');
let dynamo = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME;
const BOOKING_TABLE_NAME = process.env.BOOKING_TABLE_NAME;

module.exports.initializateDynamoClient = newDynamo => {
	dynamo = newDynamo;
};

module.exports.savePayment = payment => {
	const params = {
		TableName: TABLE_NAME,
		Item: payment
	};

	return dynamo
		.put(params)
		.promise()
		.then(() => {
			return payment.paymentId;
		});
};

module.exports.getPayment = paymentId => {
	const params = {
		Key: {
			paymentId: paymentId
		},
		TableName: TABLE_NAME
	};

	return dynamo
		.get(params)
		.promise()
		.then(result => {
			return result.payment;
		});
};

module.exports.deletePayment = paymentId => {
	const params = {
		Key: {
			paymentId: paymentId
		},
		TableName: TABLE_NAME
	};

	return dynamo.delete(params).promise();
};

module.exports.updateBooking = (bookingId, paramsName, paramsValue) => {
	const params = {
		TableName: BOOKING_TABLE_NAME,
		Key: {
			bookingId
		},
		ConditionExpression: 'attribute_exists(bookingId)',
		UpdateExpression: 'set ' + paramsName + ' = :v',
		ExpressionAttributeValues: {
			':v': paramsValue
		},
		ReturnValues: 'ALL_NEW'
	};

	return dynamo
		.update(params)
		.promise()
		.then(response => {
			return response.Attributes;
		});
};

module.exports.updatePayment = (paymentId, paramsName, paramsValue) => {
	const params = {
		TableName: TABLE_NAME,
		Key: {
			paymentId
		},
		ConditionExpression: 'attribute_exists(paymentId)',
		UpdateExpression: 'set ' + paramsName + ' = :v',
		ExpressionAttributeValues: {
			':v': paramsValue
		},
		ReturnValues: 'ALL_NEW'
	};

	return dynamo
		.update(params)
		.promise()
		.then(response => {
			return response.Attributes;
		});
};
