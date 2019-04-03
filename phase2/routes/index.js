'use strict';
const express = require('express')
const router = express.Router();
const { ObjectID } = require('mongodb')
const validator = require('validator');
const bodyParser = require('body-parser')
const { User } = require('./../models/user');
router.use(bodyParser.json());
// parse incoming parameters to req.body
router.use(bodyParser.urlencoded({ extended:true }))

router.get('/', function(req, res, next){
    if (req.session.user) {
    	if (req.session.userType === "restaurant") {
    		res.redirect("/users/restaurant/" + req.session.restaurantUser._id)
    	} else {
	        // find unique user id
		    const id = req.session.user;
		    // Good practise is to validate the id
		    if (!ObjectID.isValid(id)) {
	            return res.status(404).send()
	        }
	        User.findById(id).then((user) => {
			    if (!user) {
	                 return res.status(404).send()
		        } else {
			        res.render('index', {title:'FoodNoWait', condition: true, user: user.userName});
	            }
	        });
	    }
	} else {
		res.render('index', {title:'FoodNoWait', condition: false});
	}
});

router.get('/search', (req, res) => {
    // find unique user id
	const id = req.session.user;

	// Good practise is to validate the id
	if (!ObjectID.isValid(id)) {
        res.redirect('/users/signin')
        return;
	}

	// Otheriwse, findById
	User.findById(id).then((user) => {
		if (!user) {
			res.redirect('/users/signin')
		} else {
			res.render('searchPage', {title:'FoodNoWait', conditon: true, user:user.userName});
		}
	}).catch((error) => {
		res.status(500).send(error)
	})
})

router.get('/signup/restaurant', function(req, res, next){
    res.render('signup', {title:'FoodNoWait', type: false});
});

router.get('/signup/customer', function(req, res, next){
    res.render('signup', {title:'FoodNoWait', type: true});
});


module.exports = router;