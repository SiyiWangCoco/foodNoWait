'use strict'
const express = require('express')
const router = express.Router();
const { ObjectID } = require('mongodb')
const { mongoose } = require('./../db/mongoose');
const { Restaurant } = require('./../models/restaurant')
const { User } = require('./../models/user');



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
				smallWaitList: restaurant.smallWaitList,
				mediumWaitList: restaurant.mediumWaitList,
				largeWaitList: restaurant.largeWaitList
			} );
		}
		
	}).catch((error) => {
		res.status(500).send(error)
	})
});

router.post('/:id/waittable', (req, res) => {
	
	const table = {
		waitUserid: req.body.waitUserid,
		waitTable: req.body.waitTable,
		waitNum: req.body.waitNum,
		waitAhead: req.body.waitAhead,
		waitTime: req.body.waitTime,
		waitPhone: req.body.waitPhone
	};

	const id = req.params.id;
	let tableSize;

	// check validate the id
	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}

	if (table.waitTable === 'A') {
		tableSize = {smallWaitList:table};
	} else if (table.waitTable === 'B') {
		tableSize = {mediumWaitList:table}
	} else if (table.waitTable === 'C') {
		tableSize = {largeWaitList:table}
	} else {
		return res.status(500).send()
	}

	Restaurant.findByIdAndUpdate(id, {$push: tableSize}, {new:true}).then((restaurant) => {
		if (!restaurant) { 
			res.status(404).send()
		} else {   
			res.send({
				"waitTable": table, 
				"restaurant": restaurant
			})
		}
	}).catch((error) => {
		res.status(500).send(error)
	})

})

router.post('/:id/comment', (req, res) => {
	
	const comment = {
		commentUserid: req.body.commentUserid,
		commentInfo: req.body.commentInfo
	}

	const id = req.params.id

	// check validate the id
	if (!ObjectID.isValid(id)) {
		return res.status(404).send()
	}

	// $new: true gives back the new document
	Restaurant.findByIdAndUpdate(id, {$push: {comments:comment}}, {new:true}).then((restaurant) => {
		if (!restaurant) { 
			res.status(404).send()
		} else {   
			res.send({
				"comments": restaurant.comments[restaurant.comments.length - 1], 
				"restaurant": restaurant
			})
		}
	}).catch((error) => {
		res.status(500).send(error)
	})

})

router.post('/:id/reservation', (req, res) => {
	
	const reservation = {
		resvUserid: req.body.resvUserid,
        resvName: req.body.resvName,
        resvTime: req.body.resvTime,
        resvPhone: req.body.resvPhone
	}

	const id = req.params.id

	// check validate the id
	if (!ObjectID.isValid(id)) {
		return res.status(404).send()
	}

	// $new: true gives back the new document
	Restaurant.findByIdAndUpdate(id, {$push: {reservations:reservation}}, {new:true}).then((restaurant) => {
		if (!restaurant) { 
			res.status(404).send()
		} else {   
			res.send({
				"reservation": restaurant.reservations[restaurant.reservations.length - 1], 
				"restaurant": restaurant
			})
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