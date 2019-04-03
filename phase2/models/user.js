const mongoose = require('mongoose');
const WaitListSchema = require('./waitList');
const ReservationSchema = require('./reservations');
const { RestaurantSchema } = require('./restaurant');
const bcrypt = require('bcryptjs')
const validator = require('validator');


const UserSchema = new mongoose.Schema({
    firstName: {
      type: String, 
      trim: true
    },
    lastName: {
      type: String,
      trim: true
    },
    userName: {
    	type: String,
    	required: true,
    	minlength: 1,
    	trim: true,
    	unique: true
    },
    password: {
    	type: String,
    	required: true,
    	minlength: 4,
    	trim: true
    },    
    profilePic: {
      data: Buffer, 
      contentType: String 
    },
    gender: {
    	type: String,
    	trim: true
    },
    age: {
    	type: Number,
    	trim: true
    },
    userType: {
    	type: String,
    	required: true,
    	trim: true
    },
  	phone: {
      default: 0,
  		type: Number,
  		trim: true,
  	},
  	email: {
  		type: String,
  		required: true,
  		minlength: 1,
  		trim: true, // trim whitespace
  		validate: {
  			validator: validator.isEmail,
  			message: 'Not valid email'
  		}
	  },
    restaurantUser: RestaurantSchema, //own restaurant id 
  	description: String,
    reservations: [ReservationSchema],
    waitList: [WaitListSchema],
});

// Our own user finding function 
UserSchema.statics.findByEmailPassword = function(userName, password) {
  const User = this

  return User.findOne({userName: userName}).then((user) => {
    if (!user) {
      return Promise.reject()
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (error, result) => {
        if (result) {
          resolve(user);
        } else {
          reject();
        }
      })
    })
  })
}

// This function runs before saving user to database
UserSchema.pre('save', function(next) {
  const user = this

  if (user.isModified('password')) {
    bcrypt.genSalt(10, (error, salt) => {
      bcrypt.hash(user.password, salt, (error, hash) => {
        user.password = hash
        next()
      })
    })
  } else {
    next();
  }

})

const User = mongoose.model('User', UserSchema);

module.exports = { User };
