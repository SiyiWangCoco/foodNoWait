'use strict'
const express = require('express')
const router = express.Router();
const { ObjectID } = require('mongodb')
const { mongoose } = require('./../db/mongoose');
const { Restaurant } = require('./../models/restaurant')
const { User } = require('./../models/user');




router.get('/homepage', (req, res) => {
	const id = req.session.user;

	if (!req.session.user) {
		return res.redirect('/users/signin')
	}
	// Good practise is to validate the id
	if (!ObjectID.isValid(id)) {
		return res.status(404).send()
	}

	// Otheriwse, findById
	User.findById(id).then((user) => {
		if (!user) {
			return res.redirect('/users/signin')
		} else {
			const restaurant = user.restaurantUser
			let smallCustomerName = " ";
			let smallPhone = "";
			let midCustomerName = " ";
			let midPhone="";
			let largeCustomerName = " ";
			let largePhone="";
			let isChinese = true;
			let isdessert = true;
			if (restaurant.smallWaitList.length != 0){
				smallCustomerName = restaurant.smallWaitList[0].waitUserName
				smallPhone = restaurant.smallWaitList[0].phone
			}
			if (restaurant.mediumWaitList.length != 0){
				midCustomerName = restaurant.mediumWaitList[0].waitUserName
				midPhone = restaurant.mediumWaitList[0].phone
			}
			if (restaurant.largeWaitList.length != 0){
				largeCustomerName = restaurant.largeWaitList[0].waitUserName
				largePhone = restaurant.largeWaitList[0].phone
			}

			if (restaurant.restaurantType == 'dessert') {
				isChinese = false;
			}
			if (restaurant.restaurantType == 'chineseFood') {
				isdessert = false;
			}
			if (restaurant.restaurantType == 'seaFoodSteak') {
				isdessert = false;
				isChinese = false;
			}
			res.render('restaurantUserHomePage', {
				title: restaurant.restaurantName,
				user: user.userName,
				restaurantName: restaurant.restaurantName, 
				restaurantAddress:restaurant.address, 
				restaurantPhone: restaurant.phone,
				restaurantImageLink: restaurant._id + '/picture',
				reservation:  restaurant.reservations,
				smallTotal: restaurant.smallWaitList.length,
				smallCustomer: smallCustomerName,
				smallContactInfo: smallPhone,
				midTotal: restaurant.mediumWaitList.length,
				midCustomer: midCustomerName,
				midContactInfo: midPhone,
				largeTotal: restaurant.largeWaitList.length,
				largeCustomer:largeCustomerName,
				largeContactInfo:largePhone,
				isdessert: isdessert,
				ischineseFood: isChinese
			});
				
		}
	}).catch((error) => {
		res.status(500).send(error)
	})
});

router.get('/:id', (req, res) => {
	const id = req.params.id // the id is in the req.params object
	let userName = '';
	if (!req.session.user) {
        return res.redirect("/users/signin")
    } else {
		const sessionId = req.session.user
		if (!ObjectID.isValid(sessionId)) {
			return res.status(404).send()
		}
		User.findById(sessionId).then((user) => {
			if (!user) {
				res.status(404).send()
			} else {
				userName = user.userName
			}
		});
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
            res.render('restaurantInfo', {
				title: restaurant.restaurantName, 
				user: userName,
				resName: restaurant.restaurantName, 
				resAdd:restaurant.address, 
				resPhone: restaurant.phone, 
				resStar:restaurant.star, 
                resImg: restaurant._id + '/picture',
				comments: restaurant.comments,
				smallWaitList: restaurant.smallWaitList.length,
				mediumWaitList: restaurant.mediumWaitList.length,
				largeWaitList: restaurant.largeWaitList.length
			} );
		}
		
	}).catch((error) => {
		res.status(500).send(error)
	})
});

router.post('/:id/waittable', (req, res) => {
	const id = req.params.id;

	if (!req.session.user) {
		return res.redirect("/users/signin")
	}

	if (!ObjectID.isValid(id)) {
		return res.redirect("/")
	}

	const table = {
		waitUserName: req.session.userName,
		resvRestaurantName: req.body.resvRestaurantName,
		waitAhead: req.body.waitAhead,
		waitTable: req.body.waitTable
	};
	let tableSize;

	if (table.waitTable === 'A') {
		tableSize = {"smallWaitList" :table};
	} else if (table.waitTable === 'B') {
		tableSize = {"mediumWaitList" :table}
	} else if (table.waitTable === 'C') {
		tableSize = {"largeWaitList" :table}
	} else {
		return res.status(500).send()
	}

	Restaurant.findByIdAndUpdate(id, {$push: tableSize}, {new:true}).then((restaurant) => {
		if (!restaurant) { 
			res.status(404).send()
		} else {
			User.findOneAndUpdate({ userName: restaurant.userName }, { $set: { "restaurantUser": restaurant }}, {new:true}).then((user) => {
				if (!user) {
					return res.status(404).send()
				}
			}).catch((error) => {
				res.status(500).send(error)
			})
			User.findByIdAndUpdate(req.session.user, {$push: {"waitList":table}}, {new:true}).then((user) => {
				if (!user) { 
					return res.status(404).send()
				}
			}).catch((error) => {
				res.status(500).send(error)
			})
			res.send(restaurant)
		}
	}).catch((error) => {
		res.status(500).send(error)
	})

})

router.post('/:id/comment', (req, res) => {
	const id = req.params.id;

	if (!req.session.user) {
		return res.redirect("/users/signin")
	}

	if (!ObjectID.isValid(id)) {
		return res.redirect("/")
	}

	const comment = {
		commentUserName: req.session.userName,
		commentInfo: req.body.commentInfo
	}

	// $new: true gives back the new document
	Restaurant.findByIdAndUpdate(id, {$push: {comments:comment}}, {new:true}).then((restaurant) => {
		if (!restaurant) { 
			return res.status(404).send()
		} else {
			User.findOneAndUpdate({ userName: restaurant.userName }, { $set: { "restaurantUser": restaurant }}, {new:true}).then((user) => {
				if (!user) {
					return res.status(404).send()
				}
			}).catch((error) => {
				res.status(500).send(error)
			})
			res.send(restaurant);
		}
	}).catch((error) => {
		res.status(500).send(error)
	})

})

router.post('/:id/reservation', (req, res) => {

	const id = req.params.id;

	if (!req.session.user) {
		return res.redirect("/users/signin")
	}

	if (!ObjectID.isValid(id)) {
		return res.redirect("/")
	}
	
	const reservation = {
		resvUserName: req.session.userName,
		resvRestaurantName: req.body.resvRestaurantName,
        resvTime: req.body.resvTime,
        resvPeople: req.body.resvPeople,
        resvDate: req.body.resvDate,
        resvEmail: req.session.email
	}

	// $new: true gives back the new document
	Restaurant.findByIdAndUpdate(id, {$push: {reservations:reservation}}, {new:true}).then((restaurant) => {
		if (!restaurant) { 
			return res.status(404).send()
		} else {   
			User.findOneAndUpdate({ userName: restaurant.userName }, { $set: { "restaurantUser": restaurant }}, {new:true}).then((user) => {
				if (!user) {
					return res.status(404).send()
				}
			}).catch((error) => {
				res.status(500).send(error)
			})
			User.findByIdAndUpdate(req.session.user, {$push: {"reservations":reservation}}, {new:true}).then((user) => {
				if (!user) { 
					return res.status(404).send()
				}
			}).catch((error) => {
				res.status(500).send(error)
			})
			res.send(restaurant);
		}
	}).catch((error) => {
		return res.status(500).send(error)
	})

})

router.get('/:id/picture', (req, res) => {
	const id = req.params.id // the id is in the req.params object

	// Good practise is to validate the id
	if (!ObjectID.isValid(id)) {
		return res.status(404).send()
	}

	// Otheriwse, findById
	Restaurant.findById(id).then((restaurant) => {
		if (!restaurant) {
			res.status(404).send()
		} else {
			res.contentType(restaurant.restaurantImage.contentType);
			res.send(restaurant.restaurantImage.data);
		}
		
	}).catch((error) => {
		res.status(500).send(error)
	})
});


module.exports = router;