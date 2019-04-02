const mongoose = require('mongoose');

const WaitListSchema = new mongoose.Schema({
	waitUserid: String,
	waitTable: String,
	waitNum: String,
	waitAhead: Number,
	waitTime: Number,
	waitPhone: Number
});


module.exports = WaitListSchema;