'use strict';

const mongoose = require('mongoose');

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/foodnowaitAPI'

mongoose.connect(mongoURI, { useNewUrlParser: true, useCreateIndex: true});

module.exports = {
	mongoose
}