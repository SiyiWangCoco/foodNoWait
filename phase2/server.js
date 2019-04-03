'use strict';
const log = console.log;

const express = require('express')
const bodyParser = require('body-parser')
const { ObjectID } = require('mongodb')
const { mongoose } = require('./db/mongoose');
const session = require('express-session')
const { Restaurant } = require('./models/restaurant')
const { User } = require('./models/user')
const hbs = require('express-handlebars')
const fs = require('fs');
const multer = require('multer');
const validator = require('validator');

const port = process.env.PORT || 3000
const app = express();

const indexRouter = require('./routes/index')
const restaurantsRouter = require('./routes/restaurants')
const usersRouter = require('./routes/users')
// const adminRouter = require('./routes/admin')



const upload = multer({ dest:  __dirname + '/public/upload'});

// Add express sesssion middleware
app.use(session({
	secret: 'oursecret',
	resave: false,
	saveUninitialized: false,
	cookie: {
		expires: 600000,
		httpOnly: true
	}
}))

app.engine('hbs', hbs({
  extname: 'hbs', 
  defaultLayout: 'layout', 
  layoutsDir: __dirname + '/views/',
  partialsDir: __dirname + '/views/partials/'
}));

app.set( 'view engine', 'hbs' );

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended:true }))

app.use('/', indexRouter)
app.use('/restaurant', restaurantsRouter)
app.use('/users', usersRouter)
// app.use('/admin', adminRouter)

app.use("/js", express.static(__dirname + '/public/js'));
app.use("/css", express.static(__dirname + '/public/css'))
app.use("/picture", express.static(__dirname + '/public/picture'));

app.get('/restaurants', (req, res) => {
	Restaurant.find().then((restaurants) => {
		res.send(restaurants) // put in object in case we want to add other properties
	}, (error) => {
		res.status(500).send(error)
	})
})

//restaurants
app.post('/restaurants',  upload.single('image'), (req, res) => {

	const restaurant = new Restaurant({
		restaurantName: req.body.restaurantName,
    	address: req.body.address,
    	restaurantType: req.body.restaurantType,
    	phone: req.body.phone,
		description: req.body.description
	})

	const user = new User({
	    userName: req.body.userName,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        email: req.body.email,
		userType: "restaurant",
		restaurantUser: restaurant
	})

	if (!validator.isEmail(user.email)) {
		res.status(400).send("incorrect email format")
		return;
	}

	restaurant.restaurantImage.data = fs.readFileSync(req.file.path);
	restaurant.restaurantImage.contentType = req.file.mimetype;
	
	restaurant.save().then((result) => {
		res.send(result)
		return User.findOne({userName: user.userName})
	}).then((result) => {
		if (result) {
			res.status(400).send("user already existed")
			return;
		} else {
			return user.save()
		}
	}).then((result) => {
		res.send(result)
	}).catch((error) => {
		res.status(400).send(error) 
	})
})

//////////

app.listen(port, () => {
	log(`Listening on port ${port}...`)
});
