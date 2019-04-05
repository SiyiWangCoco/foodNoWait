const mongoose = require('mongoose');
const { ObjectID } = require('mongodb')

const WaitListSchema = new mongoose.Schema({
	waitUserName: String,
	waitUserEmail: String,
	waitRestaurantName: {
		type: String,
		trim: true
	},
	waitId: ObjectID,
	waitTable: String,
	waitAhead: Number
});


module.exports = WaitListSchema;