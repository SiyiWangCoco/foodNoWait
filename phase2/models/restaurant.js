const mongoose = require('mongoose');
const WaitListSchema = require('./waitList');
const ReservationSchema = require('./reservations');

const CommentSchema = new mongoose.Schema({
	commentUserid: String,
	commentInfo: String
});

const RestaurantSchema = new mongoose.Schema({
    restaurantName: {
        type: String,
        trim: true,
        required: true
    },
    address: {
        type: String,
        trim: true,
        required: true
    },
    restaurantType: {
        type: String,
        trim: true,
        required: true
    },
    description: String,
  	star: {
        type: Number,
        default: 0
    },
    phone: Number,
    reservations: [ReservationSchema],
    waitList: [WaitListSchema],
    comments: [CommentSchema]
});

const Restaurant = mongoose.model('Restaurant', RestaurantSchema);

module.exports = { Restaurant };
