'use strict'
const express = require('express')
const router = express.Router();
const { ObjectID } = require('mongodb')
const { mongoose } = require('./../db/mongoose');
const { Restaurant } = require('./../models/restaurant')
const { User } = require('./../models/user');




router.get('/homepage', (req, res) => {
	const id = req.session.user;
	let userName = '';

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
			const originResName =  user.restaurantUser.restaurantName
			userName =  user.userName
			return Restaurant.findOne({restaurantName:originResName})
		}
	}).then((restaurant)=>{
		
		if (!restaurant) {
		return res.redirect('/users/signin')
		} else {
			let smallCustomerName = " ";
			let smallEmail = "";
			let midCustomerName = " ";
			let midEmail = "";
			let largeCustomerName = " ";
			let largeEmail = "";
			let isChinese = true;
			let isdessert = true;
			if (restaurant.smallWaitList.length != 0){
				smallCustomerName = restaurant.smallWaitList[0].waitUserName
				smallEmail = restaurant.smallWaitList[0].waitUserEmail
			}
			if (restaurant.mediumWaitList.length != 0){
				midCustomerName = restaurant.mediumWaitList[0].waitUserName
				midEmail = restaurant.mediumWaitList[0].waitUserEmail
			}
			if (restaurant.largeWaitList.length != 0){
				largeCustomerName = restaurant.largeWaitList[0].waitUserName
				largeEmail = restaurant.largeWaitList[0].waitUserEmail
			}
			

			if (restaurant.restaurantType == 'Dessert') {
				isChinese = false;
			}
			if (restaurant.restaurantType == 'Chinese Food') {
				isdessert = false;
			}
			if (restaurant.restaurantType == 'Seafood & Steak') {
				isdessert = false;
				isChinese = false;
			}
			
			res.render('restaurantUserHomePage', {
				title: restaurant.restaurantName,
				user: userName,
				restaurantName: restaurant.restaurantName, 
				restaurantAddress:restaurant.address, 
				restaurantPhone: restaurant.phone,
				restaurantImageLink: restaurant._id + '/picture',
				reservation:  restaurant.reservations,
				smallTotal: restaurant.smallWaitList.length,
				smallCustomer: smallCustomerName,
				smallContactInfo: smallEmail,
				midTotal: restaurant.mediumWaitList.length,
				midCustomer: midCustomerName,
				midContactInfo: midEmail,
				largeTotal: restaurant.largeWaitList.length,
				largeCustomer:largeCustomerName,
				largeContactInfo:largeEmail,
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
			let check1 = ''
			let check2 = ''
			let check3 = ''
			let check4 = ''
			let check5 = ''

			let waitParty = restaurant.smallWaitList.length + restaurant.mediumWaitList.length + restaurant.largeWaitList.length
			if (waitParty >= 1){
				check1 = 'checked'
			}
			if (waitParty >= 2){
				check2 = 'checked'
			}
			if (waitParty >= 3){
				check3 = 'checked'
			}
			if (waitParty >= 4){
				check4 = 'checked'
			}
			if (waitParty >= 5){
				check5 = 'checked'
			}

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
				largeWaitList: restaurant.largeWaitList.length,
				check1:check1,
				check2:check2,
				check3:check3,
				check4:check4,
				check5:check5,
				resId:restaurant._id
			} );
		}
		
	}).catch((error) => {
		res.status(500).send(error)
	})
});

router.post('/next/small', (req, res) => {
	const userId = req.session.user
	let restName;

	if (!req.session.user) {
		return res.redirect("/users/signin")
	}

	User.findById(userId).then((user) => {
		if (!user) {
			return res.redirect("/users/signin")
		} else {
			restName = user.restaurantUser.restaurantName;
			return Restaurant.findOneAndUpdate({restaurantName: user.restaurantUser.restaurantName}, {$pop: {smallWaitList: -1}})
		}
	}).then((restaurant) => {
		if (restaurant) {
			const small = restaurant.smallWaitList;
			small.forEach((waitItem) => {
				User.findOneAndUpdate(
					{"userName": waitItem.waitUserName},
					{$inc: {"waitList.$[elem].waitAhead" : -1}},
					{
						multi: true,
						arrayFilters: [ { "elem._id": {$eq: waitItem._id}}]
					}
				).then((result) => {
				}).catch((error) => {
					return console.status(500).send(error)
				})
			})
			res.redirect("/restaurant/homepage")
		}
	}).catch((error) => {
		res.status(500).send(error)
	});
})


router.post('/next/medium', (req, res) => {
	const userId = req.session.user
	let restName;

	if (!req.session.user) {
		return res.redirect("/users/signin")
	}

	User.findById(userId).then((user) => {
		if (!user) {
			return res.redirect("/users/signin")
		} else {
			restName = user.restaurantUser.restaurantName;
			return Restaurant.findOneAndUpdate({restaurantName: user.restaurantUser.restaurantName}, {$pop: {mediumWaitList: -1}})
		}
	}).then((restaurant) => {
		if (restaurant) {
			const medium = restaurant.mediumWaitList;
			medium.forEach((waitItem) => {
				User.findOneAndUpdate(
					{"userName": waitItem.waitUserName},
					{$inc: {"waitList.$[elem].waitAhead" : -1}},
					{
						multi: true,
						arrayFilters: [ { "elem._id": {$eq: waitItem._id}}]
					}
				).then((result) => {
				}).catch((error) => {
					return console.status(500).send(error)
				})
			})
			res.redirect("/restaurant/homepage")
		}
	}).catch((error) => {
		res.status(500).send(error)
	});
})


router.post('/next/large', (req, res) => {
	const userId = req.session.user
	let restName;

	if (!req.session.user) {
		return res.redirect("/users/signin")
	}

	User.findById(userId).then((user) => {
		if (!user) {
			return res.redirect("/users/signin")
		} else {
			restName = user.restaurantUser.restaurantName;
			return Restaurant.findOneAndUpdate({restaurantName: user.restaurantUser.restaurantName}, {$pop: {largeWaitList: -1}})
		}
	}).then((restaurant) => {
		if (restaurant) {
			const large = restaurant.largeWaitList;
			large.forEach((waitItem) => {
				User.findOneAndUpdate(
					{"userName": waitItem.waitUserName},
					{$inc: {"waitList.$[elem].waitAhead" : -1}},
					{
						multi: true,
						arrayFilters: [ { "elem._id": {$eq: waitItem._id}}]
					}
				).then((result) => {
				}).catch((error) => {
					return console.status(500).send(error)
				})
			})
			res.redirect("/restaurant/homepage")
		}
	}).catch((error) => {
		res.status(500).send(error)
	});
})



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
		waitRestaurantName: req.body.waitRestaurantName,
		waitAhead: req.body.waitAhead,
		waitTable: req.body.waitTable,
		waitUserEmail: req.session.email,
		waitId: id
	};
	let tableSize;
	let tableType;

	if (table.waitTable === 'A') {
		tableType = "smallWaitList"
		tableSize = {"smallWaitList" :table};
	} else if (table.waitTable === 'B') {
		tableType = "mediumWaitList"
		tableSize = {"mediumWaitList" :table}
	} else if (table.waitTable === 'C') {
		tableType = "largeWaitList"
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
			if (tableType === "smallWaitList") {
				table._id = restaurant.smallWaitList[restaurant.smallWaitList.length - 1]
			} else if (tableType === "mediumWaitList") {
				table._id = restaurant.mediumWaitList[restaurant.mediumWaitList.length - 1]
			} else if (tableType === "largeWaitList") {
				table._id = restaurant.largeWaitList[restaurant.largeWaitList.length - 1]
			}
			
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
		commentInfo: req.body.commentInfo,
		restId: id
	}

	User.findById(req.session.user).then((result) => {
		if (result.having) {
			comment.having = true;
			comment.userImage = result.profilePic
		} else {
			comment.having = false;
		}
		return Restaurant.findByIdAndUpdate(id, {$push: {comments:comment}}, {new:true})
	}).then((restaurant) => {
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
		return res.status(500).send(error)
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
        resvEmail: req.session.email,
        resvId: id
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
			reservation._id = restaurant.reservations[restaurant.reservations.length - 1]._id
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

router.get('/:id/:comid/picture', (req, res) => {
	const id = req.params.id // the id is in the req.params object
	const comid = req.params.comid 

	// Good practise is to validate the id
	if (!ObjectID.isValid(id)) {
		return res.send("/picture/upload.png")
		
	}
	if (!ObjectID.isValid(comid)) {
		return res.send("/picture/upload.png")
	}

	Restaurant.findById(id).then((restaurant) => {
		if (!restaurant) {
			return res.send("/picture/upload.png")
		} else {
			restaurant.comments.forEach((comment) => {
				if (comment._id == comid) {
					if (comment.userImage) {
						res.contentType(comment.userImage.contentType);
						res.send(comment.userImage.data);
						return;
					}
				}
			})
		}
	}).catch((error) => {
		res.send("/picture/upload.png")

	})
});


module.exports = router;