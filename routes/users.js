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

router.post('/default/small', (req, res) => {
	const user = new User({
		userName: req.body.userName,
		password: "default",
		email: req.body.email,
		userType: "customer"
	});

	let userId;
	let restaurantelem;

	const waitList = {
		waitUserName: req.body.userName,
		waitUserEmail: req.body.email
	}

	if (!req.session.user) {
		return res.send("users/signin")
	}
	if (!validator.isEmail(user.email)) {
		return res.status(400).send("incorrect email format")
	}

	User.findOne({userName: user.userName}).then((result) => {
		if (!result) {
			return user.save()
		} else {
			res.status(400).send("user already existed")
		}
	}).then((result) => {
		if (!result) {
			res.status(400).send();
		} else {
			userId = result._id
			return User.findById(req.session.user)
		}
	}).then((user) => {
		if (!user) {
			return res.redirect("/users/signin")
		} else {
			return Restaurant.findOne({restaurantName: user.restaurantUser.restaurantName})
		}
	}).then((restaurant) => {
		if (restaurant) {
			waitList.waitAhead = restaurant.smallWaitList.length + 1
			waitList.waitRestaurantName = restaurant.restaurantName
			waitList.waitTable = "A"
			return Restaurant.findOneAndUpdate({restaurantName: restaurant.restaurantName}, {$push: {smallWaitList: waitList}}, {new: true})
		}
	}).then((restaurant) => {
		if (restaurant) {
			restaurantelem = restaurant;
			waitList._id = restaurant.smallWaitList[restaurant.smallWaitList.length - 1]._id
			return User.findByIdAndUpdate(userId, {$push: {"waitList":waitList}})
		}
	}).then((user) => {
		if (!user) { 
			return res.status(404).send()
		} else {
			return User.findByIdAndUpdate(req.session.user, {$set: {restaurantUser: restaurantelem}})
		}
	}).then((user) => {
		if (!user) {
			return res.status(404).send()
		} else {
			res.redirect('/restaurant/homepage')
		}
	}).catch((error) => {
		res.status(500).send(error)
	});
})

router.post('/default/medium', (req, res) => {
	const user = new User({
		userName: req.body.userName,
		password: "default",
		email: req.body.email,
		userType: "customer"
	});

	let userId;
	let restaurantelem;

	const waitList = {
		waitUserName: req.body.userName,
		waitUserEmail: req.body.email
	}

	if (!req.session.user) {
		return res.send("users/signin")
	}
	if (!validator.isEmail(user.email)) {
		return res.status(400).send("incorrect email format")
	}

	User.findOne({userName: user.userName}).then((result) => {
		if (!result) {
			return user.save()
		} else {
			res.status(400).send("user already existed")
		}
	}).then((result) => {
		if (!result) {
			res.status(400).send();
		} else {
			userId = result._id
			return User.findById(req.session.user)
		}
	}).then((user) => {
		if (!user) {
			return res.redirect("/users/signin")
		} else {
			return Restaurant.findOne({restaurantName: user.restaurantUser.restaurantName})
		}
	}).then((restaurant) => {
		if (restaurant) {
			waitList.waitAhead = restaurant.mediumWaitList.length + 1
			waitList.waitRestaurantName = restaurant.restaurantName
			waitList.waitTable = "B"
			return Restaurant.findOneAndUpdate({restaurantName: restaurant.restaurantName}, {$push: {mediumWaitList: waitList}}, {new: true})
		}
	}).then((restaurant) => {
		if (restaurant) {
			restaurantelem = restaurant;
			waitList._id = restaurant.smallWaitList[restaurant.mediumWaitList.length - 1]._id
			return User.findByIdAndUpdate(userId, {$push: {"waitList":waitList}})
		}
	}).then((user) => {
		if (!user) { 
			return res.status(404).send()
		} else {
			return User.findByIdAndUpdate(req.session.user, {$set: {restaurantUser: restaurantelem}})
		}
	}).then((user) => {
		if (!user) {
			return res.status(404).send()
		} else {
			res.redirect('/restaurant/homepage')
		}
	}).catch((error) => {
		res.status(500).send(error)
	});
})

router.post('/default/large', (req, res) => {
	const user = new User({
		userName: req.body.userName,
		password: "default",
		email: req.body.email,
		userType: "customer"
	});

	let userId;
	let restaurantelem;

	const waitList = {
		waitUserName: req.body.userName,
		waitUserEmail: req.body.email
	}

	if (!req.session.user) {
		return res.send("users/signin")
	}
	if (!validator.isEmail(user.email)) {
		return res.status(400).send("incorrect email format")
	}

	User.findOne({userName: user.userName}).then((result) => {
		if (!result) {
			return user.save()
		} else {
			res.status(400).send("user already existed")
		}
	}).then((result) => {
		if (!result) {
			res.status(400).send();
		} else {
			userId = result._id
			return User.findById(req.session.user)
		}
	}).then((user) => {
		if (!user) {
			return res.redirect("/users/signin")
		} else {
			return Restaurant.findOne({restaurantName: user.restaurantUser.restaurantName})
		}
	}).then((restaurant) => {
		if (restaurant) {
			waitList.waitAhead = restaurant.largeWaitList.length + 1
			waitList.waitRestaurantName = restaurant.restaurantName
			waitList.waitTable = "C"
			return Restaurant.findOneAndUpdate({restaurantName: restaurant.restaurantName}, {$push: {largeWaitList: waitList}}, {new: true})
		}
	}).then((restaurant) => {
		if (restaurant) {
			restaurantelem = restaurant;
			waitList._id = restaurant.smallWaitList[restaurant.largeWaitList.length - 1]._id
			return User.findByIdAndUpdate(userId, {$push: {"waitList":waitList}})
		}
	}).then((user) => {
		if (!user) { 
			return res.status(404).send()
		} else {
			return User.findByIdAndUpdate(req.session.user, {$set: {restaurantUser: restaurantelem}})
		}
	}).then((user) => {
		if (!user) {
			return res.status(404).send()
		} else {
			res.redirect('/restaurant/homepage')
		}
	}).catch((error) => {
		res.status(500).send(error)
	});
})

router.post('/', (req, res) => {

	const user = new User({
	    userName: req.body.userName,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        email: req.body.email,
        userType: req.body.userType,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phoneNumber,
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
    res.render('signin', {title:'FoodNoWait', conditon: false });
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
			if (req.session.userType === "admin") {
				res.redirect('/admin')
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
				res.render('CustomerProfile', {title:'FoodNoWait',imageAdd:imageAdd, iscustomer: false, isres: false, user:user.userName});
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

	if (!validator.isEmail(email)) {
		res.status(400).send("incorrect email format")
		return;
	}
  
	// Otheriwse, findByIdAndUpdate
	User.findByIdAndUpdate(id, {$set: { firstName: firstName, lastName: lastName, email: email, gender: gender, 
		age: age, phone: phone, description: description }}, {new: true}).then((user) => {
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
			res.render('UserInfoPage', {title:'FoodNoWait', conditon: false, user:user.userName});	
		}
	}).catch((error) => {
			res.status(400).send()
		})
    
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

router.delete('/status/deleteLineUp', function(req, res) {
	// find unique user id
	const id = req.session.user

	// Good practise is to validate the id
	if (!ObjectID.isValid(id)) {
		return res.status(404).send()
	}

	const waitRestaurantId = req.body.waitRestaurantId

	// remove line up from user
	User.findById(id).then((user) => {
		if (!user) {
			res.status(404).redirect('/users/signin')
		} else {
			return User.findOneAndUpdate({'waitList._id': {$eq: waitRestaurantId}}, {$pull: { waitList: { "_id": waitRestaurantId }}}, {new: true})
		}
	}).then((user) => {
		if (!user) {
			res.status(404).redirect('/users/signin')
		} else {
			res.send()
		}
	}).catch((error) => {
		res.status(500).send(error)
	})
});

router.delete('/status/cancelLineUp', function(req, res) {
	// find unique user id
	const id = req.session.user

	// Good practise is to validate the id
	if (!ObjectID.isValid(id)) {
		return res.status(404).send()
	}

	const waitRestaurant = req.body.waitRestaurant

	// remove line up from restaurant
	const restName = waitRestaurant.waitRestaurantName
	Restaurant.findOne({ restaurantName: restName }).then((rest) => {
		if (!rest) {
			res.status(404).send()
		} else {
			const tableSize = waitRestaurant.waitTable

			var waitList;
			if (tableSize === "A") {
				waitList = rest.smallWaitList
				let index = -1;
				for (let i = 0; i < waitList.length; i++) {
					if (waitList[i]._id == waitRestaurant._id) {
						index = i;
					}
				}
				if (index > -1) {
					waitList.splice(index, 1);

					for (let i = index; i < waitList.length; i++) {
						waitList[i].waitAhead -= 1

						User.findOneAndUpdate(
							{ "userName": waitList[i].waitUserName },
							{ $inc: { "waitList.$[elem].waitAhead": -1 } },
							{
								multi: true,
								arrayFilters: [{ "elem._id": {$eq: waitList[i]._id}}]
							}
						).then((result) => {
						}).catch((error) => {
							return console.status(500).send(error)
						})
					}
				}

				waitList = { "smallWaitList": waitList }
			} else if (tableSize === "B") {
				waitList = rest.mediumWaitList
				let index = -1;
				for (let i = 0; i < waitList.length; i++) {
					if (waitList[i]._id == waitRestaurant._id) {
						index = i;
					}
				}
				if (index > -1) {
					waitList.splice(index, 1);

					for (let i = index; i < waitList.length; i++) {
						waitList[i].waitAhead -= 1

						User.findOneAndUpdate(
							{ "userName": waitList[i].waitUserName },
							{ $inc: { "waitList.$[elem].waitAhead": -1 } },
							{
								multi: true,
								arrayFilters: [{ "elem._id": {$eq: waitList[i]._id}}]
							}
						).then((result) => {
						}).catch((error) => {
							return console.status(500).send(error)
						})
					}
				}

				waitList = { "mediumWaitList": waitList }
			} else if (tableSize === "C") {
				waitList = rest.largeWaitList
				let index = -1;
				for (let i = 0; i < waitList.length; i++) {
					if (waitList[i]._id == waitRestaurant._id) {
						index = i;
					}
				}
				if (index > -1) {
					waitList.splice(index, 1);
					
					for (let i = index; i < waitList.length; i++) {
						waitList[i].waitAhead -= 1

						User.findOneAndUpdate(
							{ "userName": waitList[i].waitUserName },
							{ $inc: { "waitList.$[elem].waitAhead": -1 } },
							{
								multi: true,
								arrayFilters: [{ "elem._id": {$eq: waitList[i]._id}}]
							}
						).then((result) => {
						}).catch((error) => {
							return console.status(500).send(error)
						})
					}
				}

				waitList = { "largeWaitList": waitList }
			} else {
				console.log("UNKNOWN value of waitTable")
			}

			return Restaurant.findOneAndUpdate({ restaurantName: restName }, {$set: waitList}, {new: true})
		}
	}).then((rest) => {
		if (!rest) {
			return res.status(404).send()
		} else {
			// remove line up from user
			return User.findById(id)
		}
	}).then((user) => {
		if (!user) {
			res.status(404).redirect('/users/signin')
		} else {
			return User.findOneAndUpdate({'waitList._id': {$eq: waitRestaurant._id}}, {$pull: { waitList: { "_id": waitRestaurant._id }}}, {new: true})
		}
	}).then((user) => {
		if (!user) {
			res.status(404).redirect('/users/signin')
		} else {
			res.send()
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

	// remove reservation from restaurant
	const restName = resvRestaurant.resvRestaurantName

	Restaurant.findOne({ restaurantName: restName }).then((rest) => {
		if (!rest) {
			res.status(404).send()
		} else {
			const reservations = rest.reservations

			let index = -1;
			for (let i = 0; i < reservations.length; i++) {
				if (reservations[i]._id == resvRestaurant._id) {
					index = i;
				}
			}
			if (index > -1) {
				reservations.splice(index, 1);
			}

			return Restaurant.findOneAndUpdate({ restaurantName: restName }, {$set: { reservations: reservations }}, {new: true})
		}
	}).then((rest) => {
		if (!rest) {
			res.status(404).send()
		} else {
			return User.findById(id)
		}
	}).then((user) => {
		if (!user) {
			res.status(404).redirect('/users/signin')
		} else {
			return User.findOneAndUpdate({'reservations._id': {$eq: resvRestaurant._id}}, {$pull: { reservations: { "_id": resvRestaurant._id }}}, {new: true})
		}
	}).then((user) => {
		if (!user) {
			res.status(404).redirect('/users/signin')
		} else {
			res.send()
		}
	}).catch((error) => {
		res.status(500).send(error)
	})
});

router.post('/status/changeTableSize', (req, res) => {
	// find unique user id
	const id = req.session.user

	// Good practise is to validate the id
	if (!ObjectID.isValid(id)) {
		res.status(404).send()
	}

	const waitRestaurant = req.body.waitRestaurant
	const newTableSize = req.body.tableSize

	// remove line up from restaurant
	const restName = waitRestaurant.waitRestaurantName
	Restaurant.findOne({ restaurantName: restName }).then((rest) => {
		if (!rest) {
			res.status(404).send()
		} else {
			const tableSize = waitRestaurant.waitTable

			var waitList;
			if (tableSize === "A") {
				waitList = rest.smallWaitList
				let index = -1;
				for (let i = 0; i < waitList.length; i++) {
					if (waitList[i]._id == waitRestaurant._id) {
						index = i;
					}
				}
				if (index > -1) {
					waitList.splice(index, 1);

					waitList.forEach(waitItem => {
						waitItem.waitAhead -= 1
					});
				}

				waitList = { "smallWaitList": waitList }
			} else if (tableSize === "B") {
				waitList = rest.mediumWaitList
				let index = -1;
				for (let i = 0; i < waitList.length; i++) {
					if (waitList[i]._id == waitRestaurant._id) {
						index = i;
					}
				}
				if (index > -1) {
					waitList.splice(index, 1);

					waitList.forEach(waitItem => {
						waitItem.waitAhead -= 1
					});
				}

				waitList = { "mediumWaitList": waitList }
			} else if (tableSize === "C") {
				waitList = rest.largeWaitList
				let index = -1;
				for (let i = 0; i < waitList.length; i++) {
					if (waitList[i]._id == waitRestaurant._id) {
						index = i;
					}
				}
				if (index > -1) {
					waitList.splice(index, 1);

					waitList.forEach(waitItem => {
						waitItem.waitAhead -= 1
					});
				}

				waitList = { "largeWaitList": waitList }
			} else {
				console.log("UNKNOWN value of waitTable")
			}

			return Restaurant.findOneAndUpdate({ restaurantName: restName }, {$set: waitList}, {new: true})
		}
	}).then((rest) => {
		if (!rest) {
			res.status(404).send()
		} else {
			// add line up to restaurant
			const newWaitRestaurant = waitRestaurant
			newWaitRestaurant._id = waitRestaurant._id
			newWaitRestaurant.waitTable = newTableSize
		
			var waitList;
			if (newTableSize === "A") {
				waitList = { "smallWaitList": newWaitRestaurant }
			} else if (newTableSize === "B") {
				waitList = { "mediumWaitList": newWaitRestaurant }
			} else if (newTableSize === "C") {
				waitList = { "largeWaitList": newWaitRestaurant }
			}
		
			return Restaurant.findOneAndUpdate({ restaurantName: newWaitRestaurant.waitRestaurantName }, {$push: waitList}, {new: true})
		}
	}).then((rest) => {
		if (!rest) {
			res.status(404).send()
		} else {
			return User.findById(id)
		}
	}).then((user) => {
		// update user database
		if (!user) {
			res.status(404).redirect('/users/signin')
		} else {
			const waitList = user.waitList;

			for (let i = 0; i < waitList.length; i++) {
				if (waitList[i]._id == waitRestaurant._id) {
					waitList[i].waitTable = newTableSize;
				}
			}

			return User.findByIdAndUpdate(id, {$set: { waitList: waitList }}, {new: true})
		}
	}).then((user) => {
		if (!user) {
			res.status(404).redirect('/users/signin')
		} else {
			res.send()
		}
	}).catch((error) => {
		res.status(500).send(error)
	})
});

router.post('/status/changeResvPeople', (req, res) => {
	// find unique user id
	const id = req.session.user;

	// Good practise is to validate the id
	if (!ObjectID.isValid(id)) {
		return res.status(404).send()
	}

	const resvRestaurant = req.body.resvRestaurant
	const newResvPeople = req.body.resvPeople

	// update the number of reservation people for restaurant
	const restName = resvRestaurant.resvRestaurantName
	Restaurant.findOne({ restaurantName: restName }).then((rest) => {
		if (!rest) {
			res.status(404).send()
		} else {
			const reservations = rest.reservations

			for (let i = 0; i < reservations.length; i++) {
				if (reservations[i]._id == resvRestaurant._id) {
					reservations[i].resvPeople = newResvPeople;
				}
			}

			return Restaurant.findOneAndUpdate({ restaurantName: restName }, {$set: { reservations: reservations }}, {new: true})
		}
	}).then((rest) => {
		if (!rest) {
			res.status(404).send()
		} else {
			// update the number of reservation people for user
			return User.findById(id)
		}
	}).then((user) => {
		if (!user) {
			res.status(404).redirect('/users/signin')
		} else {
			const reservations = user.reservations;

			for (let i = 0; i < reservations.length; i++) {
				if (reservations[i]._id == resvRestaurant._id) {
					reservations[i].resvPeople = newResvPeople;
				}
			}

			return User.findByIdAndUpdate(id, {$set: { reservations: reservations }}, {new: true})
		}
	}).then((user) => {
		if (!user) {
			res.status(404).redirect('/users/signin')
		} else {
			res.send()
		}
	}).catch((error) => {
		res.status(500).send(error)
	})
})


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