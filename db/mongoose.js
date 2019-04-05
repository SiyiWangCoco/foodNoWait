'use strict';

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://xinrun:wxr10843123456@foodnowait-6ntfy.mongodb.net/test?retryWrites=true', { useNewUrlParser: true, useCreateIndex: true});

module.exports = {
	mongoose
}