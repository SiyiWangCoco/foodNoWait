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

router.get("/restaurant/:id", (req, res) => {
	const id = req.params.id // the id is in the req.params object

	if (!req.session.id) {
		res.redirect('/users/signin')
		return;
	}
	// Good practise is to validate the id
	if (!ObjectID.isValid(id)) {
		return res.status(404).send()
	}

	// Otheriwse, findById
	Restaurant.findById(id).then((restaurant) => {
		if (!restaurant) {
			res.status(404).send()
		} else {
			res.render('restaurantUserHomePage', {title:'FoodNoWait', conditon: true, user:user.userName})
		}
		
	}).catch((error) => {
		res.status(500).send(error)
	})
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
        phoneNumber: req.body.phoneNumber,
        age: req.body.age,
        gender: req.body.gender
	})

	if (!validator.isEmail(user.email)) {
		res.status(400).send("incorrect email format")
		return;
	}
	User.findOne({userName: user.userName}).then((result) => {
		if (result) {
			res.status(400).send("user already existed")
			return;
		} else {
			return user.save()
		}
	}).then((result) => {
		res.send(result)
	}, (error) => {
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
			console.log("no user")
			res.status(400).redirect('/users/signin')
		} else {
			req.session.user = user._id;
			req.session.userType = user.userType;
			req.session.userName = user.userName;
			req.session.email = user.email;
			if (req.session.userType === "restaurant") {
				req.session.restaurantUser = user.restaurantUser;
			}
			console.log(req.session);
			res.redirect("/");
		}
	}).catch((error) => {
		res.status(400).redirect('/users/signin')
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
			res.render('CustomerProfile', {title:'FoodNoWait', conditon: true, user:user.userName});
		}
	}).catch((error) => {
		res.status(500).send(error)
	})
});

router.get('/profile/get', function (req, res) {
	// find unique user id
	const id = req.session.user;
	console.log("cookie:", id)

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

router.post('/profile/edit', (req, res) => {
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
	// const profilePic = req.body.profilePic

	if (!validator.isEmail(email)) {
		res.status(400).send("incorrect email format")
		return;
	}
  
	// Otheriwse, findByIdAndUpdate
	User.findByIdAndUpdate(id, {$set: { firstName: firstName, lastName: lastName, email: email, gender: gender, 
		age: age, phone: phone, description: description}}, {new: true}).then((user) => {
			if (!user) {
				res.status(404).redirect('/users/signin')
			} else {
				console.log("server", user)
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
	console.log("pwd:", oldPassword, newPassword, confirmPassword)

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

module.exports = router;