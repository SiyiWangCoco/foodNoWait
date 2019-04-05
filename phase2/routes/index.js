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
    		res.redirect("/restaurant/homepage")
    	} else {
			if (req.session.userType === "admin") {
				res.redirect("/admin")
				return;
			}
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
	const content = req.session.content;

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
			if (content) {
				res.render('searchPage', {title:'FoodNoWait', conditon: true, user:user.userName, searchContent: content});
				req.session.content = null;
			} else {
				const defaultContent = "Find the restaurant..."
				res.render('searchPage', {title:'FoodNoWait', conditon: true, user:user.userName, searchContent: defaultContent});
			}
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