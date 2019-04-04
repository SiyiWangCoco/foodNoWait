'use strict';
const express = require('express')
const router = express.Router();
const { User } = require('./../models/user')
const { ObjectID } = require('mongodb')
const validator = require('validator');
const bodyParser = require('body-parser')
const { Restaurant } = require('./../models/restaurant')
router.use(bodyParser.json());
// parse incoming parameters to req.body
router.use(bodyParser.urlencoded({ extended:true }))
const multer = require('multer');

const upload = multer({ dest:  __dirname + '/public/upload'});


router.post('/', (req, res) => {

	const user = new User({
	    userName: req.body.userName,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        email: req.body.email,
        userType: req.body.userType,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        age: req.body.age,
        gender: req.body.gender
	})

	if (!validator.isEmail(user.email)) {
		res.status(400).send("incorrect email format")
		return;
	}
	User.findOne({userName: user.userName}).then((result) => {
		if (!result) {
			return user.save()
		} else {
			res.status(400).send();
		}
	}).then((result) => {
		if (!result) {
			res.status(400).send();
		} else{
			res.redirect('/users/signin')
		}
		
	}).catch((error) => {
		res.status(400).send(error) 
	})
})

router.get('/signin', function(req, res, next){
    res.render('signin', {title:'FoodNoWait', conditon: false});
}); 

router.post('/signin', (req, res) => {
	const userName = req.body.userNameInput
	const password = req.body.userPasswordInput

	User.findByEmailPassword(userName, password).then((user) => {
		if (!user) {
			res.redirect("/users/signin")
		} else {
			req.session.user = user._id;
			req.session.userType = user.userType;
			req.session.userName = user.userName;
			req.session.email = user.email;
			if (req.session.userType === "restaurant") {
				req.session.restaurantUser = user.restaurantUser;
				res.redirect('/restaurant/homepage');
				return;
			}
			res.redirect("/");
		}
	}).catch((error) => {
		res.status(400).redirect("/users/signin")
	})
})

router.get('/profile', function (req, res) {
	// find unique user id
	const id = req.session.user;

	// Good practise is to validate the id
	if (!ObjectID.isValid(id)) {
		return res.status(404).send()
	}

	// Otheriwse, findById
	User.findById(id).then((user) => {
		if (!user) {
			res.status(404).redirect('/users/signin')
		} else {
			let imageAdd = "/picture/upload.png";
			if(user.profilePic.data !=null) {
				imageAdd = '/users/' + user._id + '/picture'
			}
			if(user.userType == "customer"){
				res.render('CustomerProfile', {title:'FoodNoWait',imageAdd:imageAdd, iscustomer: true, user:user.userName});
			} else if (user.userType == "restaurant"){
				res.render('CustomerProfile', {title:'FoodNoWait',imageAdd:imageAdd, iscustomer: false, isres: true, user:user.userName});
			} else {
				es.render('CustomerProfile', {title:'FoodNoWait',imageAdd:imageAdd, iscustomer: false, isres: false, user:user.userName});
			}
			
		}
	}).catch((error) => {
		res.status(500).send(error)
	})
});

router.get('/profile/get', function (req, res) {
	// find unique user id
	const id = req.session.user;

	// Good practise is to validate the id
	if (!ObjectID.isValid(id)) {
		return res.status(404).send()
	}

	// Otheriwse, findById
	User.findById(id).then((user) => {
		if (!user) {
			res.status(404).redirect('/users/signin')
		} else {
			res.send({
				userName: user.userName, 
				accountType: user.userType, 
				firstName: user.firstName,
				lastName: user.lastName, 
				email: user.email, 
				gender: user.gender,
				age: user.age,
				phone: user.phone,
				description: user.description,
				password: user.password,
				profilePic: user.profilePic
			});
		}
	}).catch((error) => {
		res.status(500).send(error)
	})
});

router.post('/profile/edit', upload.single('profilePic'), (req, res) => {
	// find unique user id
	const id = req.session.user;

	// Good practise is to validate the id
	if (!ObjectID.isValid(id)) {
		return res.status(404).send()
	}

	const firstName = req.body.firstName;
	const lastName = req.body.lastName;
	const email = req.body.email;
	const gender = req.body.gender;
	const age = req.body.age;
	const phone = req.body.phone;
	const description = req.body.description;
	const profilePic = req.body.profilePic

	if (!validator.isEmail(email)) {
		res.status(400).send("incorrect email format")
		return;
	}
  
	// Otheriwse, findByIdAndUpdate
	User.findByIdAndUpdate(id, {$set: { firstName: firstName, lastName: lastName, email: email, gender: gender, 
		age: age, phone: phone, description: description, profilePic: {data: fs.readFileSync(profilePic.path), contentType: profilePic.mimetype} }}, {new: true}).then((user) => {
			if (!user) {
				res.status(404).redirect('/users/signin')
			} else {
				res.send()
			}
		}).catch((error) => {
			res.status(500).send(error)
	})
});

router.post('/profile/pwd', (req, res) => {
	// find unique user id and username
	const userName = req.session.userName;

	const oldPassword = req.body.oldPassword;
	const newPassword = req.body.newPassword;
	const confirmPassword = req.body.confirmPassword;

	User.findByEmailPassword(userName, oldPassword).then(() => {
		if (newPassword !== confirmPassword) {
			res.status(400).send()
		} else {
			if (newPassword.length < 4) {
				res.status(300).send()
			} else {
				User.findOne({userName: userName}).then((user) => {
					if (!user) {
						res.status(404).redirect('/users/signin')
					} else {
						user.password = newPassword;
						return user.save()
					}
				})
			}
		}
	}).then(() => {
		res.send()
	}).catch((error) => {
		res.status(400).send()
	})
})

router.get('/logout', (req, res) => {
	req.session.destroy((error) => {
		if (error) {
			res.status(500).send(error)
		} else {
			res.redirect('/')
		}
	})
})


router.get('/status', function(req, res) {
    res.render('UserInfoPage', {title:'FoodNoWait', conditon: false});
});

router.get('/status/get', function(req,res) {
	// find unique user id
	const id = req.session.user;

	// Good practise is to validate the id
	if (!ObjectID.isValid(id)) {
		return res.status(404).send()
	}

	// Otheriwse, findById
	User.findById(id).then((user) => {
		if (!user) {
			res.status(404).redirect('/users/signin')
		} else {
			res.send({
				waitList: user.waitList,
				reservations: user.reservations
			});
		}
	}).catch((error) => {
		res.status(500).send(error)
	})
})

router.delete('/status/cancelLineUp', function(req, res) {
	// find unique user id
	const id = req.session.user

	// Good practise is to validate the id
	if (!ObjectID.isValid(id)) {
		return res.status(404).send()
	}

	const waitRestaurant = req.body.waitRestaurant
	const restName = waitRestaurant.waitRestaurantName

	// remove line up from restaurant
	Restaurant.findOne({ restaurantName: restName }).then((rest) => {
		if (!rest) {
			res.status(404).send()
		} else {
			const tableSize = waitRestaurant.waitTable

			var waitList;
			if (tableSize === "A") {
				waitList = rest.smallWaitList
				const index = waitList.indexOf(waitRestaurant)
				if (index > -1) {
					waitList.splice(index, 1);
				}

				waitList = { "smallWaitList": waitList }
			} else if (tableSize === "B") {
				waitList = rest.mediumWaitList
				const index = waitList.indexOf(waitRestaurant)
				if (index > -1) {
					waitList.splice(index, 1);
				}

				waitList = { "mediumWaitList": waitList }
			} else if (tableSize === "C") {
				waitList = rest.largeWaitList
				const index = waitList.indexOf(waitRestaurant)
				if (index > -1) {
					waitList.splice(index, 1);
				}

				waitList = { "largeWaitList": waitList }
			} else {
				console.log("UNKNOWN value of waitTable")
			}

			Restaurant.findOneAndUpdate({ restaurantName: restName }, {$set: waitList}, {new: true}).then((rest) => {
				if (!rest) {
					res.status(404).send()
				}
			})
		}
	}).catch((error) => {
		res.status(500).send(error)
	})

	// remove line up from user
	User.findById(id).then((user) => {
		if (!user) {
			res.status(404).redirect('/users/signin')
		} else {
			const waitList = user.waitList;
			const index = waitList.indexOf(waitRestaurant);
			if (index > -1) {
				waitList.splice(index, 1);
			}

			User.findByIdAndUpdate(id, {$set: { waitList: waitList }}, {new: true}).then((user) => {
				if (!user) {
					res.status(404).redirect('/users/signin')
				} else {
					res.send()
				}
			})
		}
	}).catch((error) => {
		res.status(500).send(error)
	})
});


router.delete('/status/cancelReservation', function(req, res) {
	// find unique user id
	const id = req.session.user;

	// Good practise is to validate the id
	if (!ObjectID.isValid(id)) {
		return res.status(404).send()
	}

	const resvRestaurant = req.body.resvRestaurant
	const restName = resvRestaurant.resvRestaurantName

	// remove reservation from restaurant
	Restaurant.findOne({ restaurantName: restName }).then((rest) => {
		if (!rest) {
			res.status(404).send()
		} else {
			const reservations = rest.reservations
			const index = reservations.indexOf(resvRestaurant)
			if (index > -1) {
				reservations.splice(index, 1);
			}

			Restaurant.findOneAndUpdate({ restaurantName: restName }, {$set: { reservations: reservations }}, {new: true}).then((rest) => {
				if (!rest) {
					res.status(404).send()
				}
			})
		}
	}).catch((error) => {
		res.status(500).send(error)
	})

	// remove reservation from user
	User.findById(id).then((user) => {
		if (!user) {
			res.status(404).redirect('/users/signin')
		} else {
			const reservations = user.reservations;
			const index = reservations.indexOf(resvRestaurant);
			if (index > -1) {
				reservations.splice(index, 1);
			}

			User.findByIdAndUpdate(id, {$set: { reservations: reservations }}, {new: true}).then((user) => {
				if (!user) {
					res.status(404).redirect('/users/signin')
				} else {
					res.send()
				}
			})
		}
	}).catch((error) => {
		res.status(500).send(error)
	})
});


router.get('/:id/picture', (req, res) => {
	const id = req.params.id // the id is in the req.params object

	// Good practise is to validate the id
	if (!ObjectID.isValid(id)) {
		return res.status(404).send()
	}

	// Otheriwse, findById
	User.findById(id).then((user) => {
		if (!user) {
			res.status(404).send()
		} else {
			res.contentType(user.profilePic.contentType);
			res.send(user.profilePic.data);
		}
		
	}).catch((error) => {
		res.status(500).send(error)
	})
});


module.exports = router;