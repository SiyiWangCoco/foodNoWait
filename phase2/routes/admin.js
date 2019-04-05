'use strict';
const log = console.log
const express = require('express')
const router = express.Router();
const { ObjectID } = require('mongodb')
const { mongoose } = require('./../db/mongoose');
const { Restaurant } = require('./../models/restaurant')
const { User } = require('./../models/user');


router.get('/', (req, res)  => {
    if (!req.session.user) {
		return res.redirect('/users/signin')
    } else if (!req.session.userType === 'admin') {
		return res.redirect(`/users/${req.session.user}`)
    }

    let restaurantsList = []
    let ownersList = []
    let customersList = []
    
    User.find().then((users) => {
        for (let i in users) {
            const user = users[i]
            // customer
            if (user.userType === 'customer') {
                const c = {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    userName: user.userName,
                    email: user.email,
                    reservationNum: user.reservations.length,
                    waitListNum: user.waitList.length
                }
                customersList.push(c)
            }

            //owner
            if (user.userType === 'restaurant') {
                // owner
                const o = {
                    userName: user.userName,
                    email: user.email,
                    restaurant : user.restaurantUser.restaurantName
                }
                ownersList.push(o)
            }
        }
    }).catch(error => console.log(error))

    // restaurant
    Restaurant.find().then((restaurants) => {
        for (let j in restaurants) {
            const rest = restaurants[j]
            const r = {
                restaurantName: rest.restaurantName,
                owner: rest.userName,
                restaurantType: rest.restaurantType,
                reservationNum: rest.reservations.length,
                waitListNum: rest.smallWaitList.length
                    + rest.mediumWaitList.length
                    + rest.largeWaitList.length
            }
            restaurantsList.push(r)
        }
    }).catch(error => console.log(error))

    res.render('admin', {
        customers: customersList,
        owners: ownersList,
        restaurants: restaurantsList,
       
        user: 'admin'
    })
})


router.delete('/restaurant', (req, res) => {
    const name = req.body.name

    User.find().then((users) =>{
        for (let i in users) {
            const u = users[i]

            //remove the reservations from user
            for (let j = u.reservations.length - 1; j >= 0; j--) {
                const reser = u.reservations[j]
                if (reser.resvRestaurantName === name) {
                    u.reservations.remove(reser)
                }
            }

            //remove the waitlist from user
            for (let j = u.waitList.length - 1; j >= 0; j--) {
                const wait = u.waitList[j]
                if (wait.waitRestaurantName === name) {
                    u.waitList.remove(wait)
                }
            }


            u.save().then((u) => {}, (error) => {
                res.status(400).send(error)
            })

        }
    }).catch((error) => {
        log(error)
        res.status(500).send(error)
    })


    Restaurant.findOneAndDelete({restaurantName: name}).then((rest) =>{
        if (!rest) {
			res.status(404).send()
		} else {
			res.status(200).send()
		}
	}).catch((error) => {
        log(error)
		res.status(500).send(error)
	})

})


router.delete('/user', (req, res) => {
    const userName = req.body.userName

    Restaurant.find().then((restaurants) => {
        for (let i in restaurants) {
            const rest = restaurants[i]

            // remove reservations from restaurant
            for (let j = rest.reservations.length - 1; j >= 0; j--) {
                const reser = rest.reservations[j]
                if (reser.resvUserName === userName) {
                    rest.reservations.remove(reser)
                }
            }

            // remove waitlist from restaurant
            for (let j = rest.smallWaitList.length - 1; j >= 0; j--) {
                const wait = rest.smallWaitList[j]
                if (wait.waitUserName === userName) {
                    rest.smallWaitList.remove(wait)
                }
            }

            for (let j = rest.mediumWaitList.length - 1; j >= 0; j--) {
                const wait = rest.mediumWaitList[j]
                if (wait.waitUserName === userName) {
                    rest.mediumWaitList.remove(wait)
                }
            }

            for (let j = rest.largeWaitList.length - 1; j >= 0; j--) {
                const wait = rest.largeWaitList[j]
                if (wait.waitUserName === userName) {
                    rest.largeWaitList.remove(wait)
                }
            }

            // save
            rest.save().then((r) => {}, (error) => {
                log(error)
                res.status(400).send(error)
            })
        }
    }).catch((error) => {
        log(error)
        res.status(500).send(error)
    })

    User.findOneAndDelete({userName: userName}).then((user) =>{
        if (!user) {
			res.status(404).send()
		} else {
			res.status(200).send()
		}
	}).catch((error) => {
        log(error)
		res.status(500).send(error)
	})    
})


module.exports = router;

