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

                // restaurant
                const r = {
                    restaurantName: user.restaurantUser.restaurantName,
                    owner: user.userName,
                    restaurantType: user.restaurantUser.restaurantType,
                    reservationNum: user.restaurantUser.reservations.length,
                    waitListNum: user.restaurantUser.smallWaitList.length
                     + user.restaurantUser.mediumWaitList.length
                     + user.restaurantUser.largeWaitList.length
                }
                restaurantsList.push(r)
            }
        }
    }).catch(error => console.log(error))

    res.render('admin', {
        customers: customersList,
        owners: ownersList,
        restaurants: restaurantsList
    })
})


module.exports = router;

