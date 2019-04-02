const mongoose = require('mongoose');
const WaitListSchema = require('./waitList');
const ReservationSchema = require('./reservations');
const bcrypt = require('bcryptjs')
const validator = require('validator');


const UserSchema = new mongoose.Schema({
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
  		type: Number,
  		trim: true,
  		minlength: 10,
  		maxlength: 10,
  		unique: true
  	},
  	email: {
  		type: String,
  		required: true,
  		minlength: 1,
  		trim: true, // trim whitespace
  		unique: true,
  		validate: {
  			validator: validator.isEmail,
  			message: 'Not valid email'
  		}
	  },
    restaurantUser: String, //own restaurant id 
  	description: String,
    reservations: [ReservationSchema],
    waitList: [WaitListSchema],
});

const User = mongoose.model('User', UserSchema);

// Our own user finding function 
UserSchema.statics.findByEmailPassword = function(email, password) {
  const User = this

  return User.findOne({email: email}).then((user) => {
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

module.exports = { User };
