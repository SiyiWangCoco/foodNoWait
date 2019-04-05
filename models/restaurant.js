const mongoose = require('mongoose');
const WaitListSchema = require('./waitList');
const ReservationSchema = require('./reservations');
const { ObjectID } = require('mongodb')

const CommentSchema = new mongoose.Schema({
	commentUserName: String,
	commentInfo: String,
    userImage: {
        data: Buffer, 
        contentType: String 
    },
    restId: String,
    having: {
        type: Boolean,
        default: false
    }
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
    restaurantImage: {
        data: Buffer, 
        contentType: String 
    },
    description: String,
    seatAvailable: {
        type: Boolean,
        default: true,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    phone: Number,
    reservations: [ReservationSchema],
    smallWaitList: [WaitListSchema],
    mediumWaitList: [WaitListSchema],
    largeWaitList: [WaitListSchema],
    comments: [CommentSchema]
});

const Restaurant = mongoose.model('Restaurant', RestaurantSchema);

module.exports = { Restaurant, RestaurantSchema };
