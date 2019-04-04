const mongoose = require('mongoose');
const { ObjectID } = require('mongodb')

const WaitListSchema = new mongoose.Schema({
	waitUserName: String,
	waitUserPhone: Number,
	waitRestaurantName: String,
	waitTable: String,
	waitAhead: Number
});


module.exports = WaitListSchema;