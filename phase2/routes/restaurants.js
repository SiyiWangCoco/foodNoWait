'use strict'
const express = require('express')
const router = express.Router();
const { ObjectID } = require('mongodb')
const { mongoose } = require('./../db/mongoose');
const { Restaurant } = require('./../models/restaurant')



router.get('/:id', (req, res) => {
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
            res.render('restaurantInfo', {title: restaurant.restaurantName, 
                resName: restaurant.restaurantName, resAdd:restaurant.address, 
                resPhone: restaurant.phone, resStar:restaurant.star, 
                resImg: restaurant._id + '/picture',
                comments: restaurant.comments} );
		}
		
	}).catch((error) => {
		res.status(500).send(error)
	})
});

router.post('/:id', (req, res) => {
	
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
			res.send({"comments": restaurant.comments[restaurant.comments.length - 1], "restaurant": restaurant})
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