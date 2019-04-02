/* E4 server.js */
'use strict';
const log = console.log;

const express = require('express')
const bodyParser = require('body-parser')
const { ObjectID } = require('mongodb')


const { mongoose } = require('./db/mongoose');
const { Restaurant } = require('./models/restaurant')
const { User } = require('./models/user')
const hbs = require('express-handlebars')

const port = process.env.PORT || 3000
const app = express();

const index = require('./public/js/index')


app.engine('hbs', hbs({
  extname: 'hbs', 
  defaultLayout: 'layout', 
  layoutsDir: __dirname + '/views/',
  partialsDir: __dirname + '/views/partials/'
}));

app.set( 'view engine', 'hbs' );

app.use(bodyParser.json());

app.use('/', index)

app.use("/js", express.static(__dirname + '/public/js'));
app.use("/css", express.static(__dirname + '/public/css'))
app.use("/picture", express.static(__dirname + '/public/picture'));


//users
app.post('/users', (req, res) => {

	const user = new User({
		userName: req.body.userName,
    	password: req.body.password,
    	userType: req.body.userType,
    	email: req.body.email 
	})

	// save user to the database
	user.save().then((result) => {
		res.send(result)
	}, (error) => {
		res.status(400).send(error) 
	})
})

//restaurants
app.post('/restaurants', (req, res) => {

	const restaurant = new Restaurant({
		restaurantName: req.body.restaurantName,
    	address: req.body.address,
    	restaurantType: req.body.restaurantType,
    	phone: req.body.phone,
    	description: req.body.description,
	})

	// save restaurant to the database
	restaurant.save().then((result) => {
		res.send(result)
	}, (error) => {
		res.status(400).send(error) 
	})
})



//////////

app.listen(port, () => {
	log(`Listening on port ${port}...`)
});
