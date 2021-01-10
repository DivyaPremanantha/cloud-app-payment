'use strict';

const AWS = require('aws-sdk');
let dynamo = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME;
const PAYMENT_TABLE_NAME = process.env.PAYMENT_TABLE_NAME;

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
			this.update(PAYMENT_TABLE_NAME, payment.bookingId, paymentStatus, "Successfull");
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

module.exports.update = (tableName, paymentId, paramsName, paramsValue) => {
	const params = {
		TableName: tableName,
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