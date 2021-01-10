'use strict';

const AWS = require('aws-sdk');
let dynamo = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME;

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

module.exports.update = (tableName, paymentId, paramsName, paramsValue) => {
	var condition;
	if (tableName == process.env.PAYMENT_TABLE_NAME) {
		condition = bookingId;
	} else {
		condition = paymentId;
	}
	const params = {
		TableName: tableName,
		Key: {
			paymentId
		},
		ConditionExpression: 'attribute_exists(' + condition + ')',
		UpdateExpression: 'set ' + paramsName + ' = :v',
		ExpressionAttributeValues: {
			':v': paramsValue
		},
		ReturnValues: 'ALL_NEW'
	};

	console.log(params);

	return dynamo
		.update(params)
		.promise()
		.then(response => {
			console.log("Bingo")
			console.log(Attributes)
			return response.Attributes;
		});
};