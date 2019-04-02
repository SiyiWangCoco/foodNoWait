'use strict';
const express = require('express')
const router = express.Router();
const { User } = require('../models/user')

router.get('/signup', function(req, res, next){
    res.render('signup', {title:'FoodNoWait', conditon: false});
});

router.get('/signin', function(req, res, next){
    res.render('signin', {title:'FoodNoWait', conditon: false});
}); 

router.post('/signin', (req, res) => {
	const email = req.body.email
	const password = req.body.password

	User.findByEmailPassword(email, password).then((user) => {
		if(!user) {
			res.redirect('/signin')
		} else {
			// Add the user to the session cookie that we will
			// send to the client
			req.session.user = user._id;
			req.session.userType = user.userType;
			req.session.userName = user.userName;
			req.session.email = user.email;
			res.redirect('/index')
		}
	}).catch((error) => {
		res.status(400).redirect('/signin')
	})
})

module.exports = router;