const mongoose = require('mongoose');


const ReservationSchema = new mongoose.Schema({
	resvUserid: {
		type: String,
		required: true,
		trim: true,
	},
	resvName: {
		type: String,
		required: true,
		trim: true
	},
    resvTime: {
    	type: String,
    	required: true,
    	trim: true
    },
    resvTable: {
    	type: String,
    	required: true,
    	trim: true
    },
    resvPhone: {
    	type: Number,
    	required: true,
    	trim: true
    }
});


module.exports = ReservationSchema;