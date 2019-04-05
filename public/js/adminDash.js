'use strict'
const log = console.log

const customerTable = document.querySelector('#customers');
const restaurantTable = document.querySelector('#restaurants');

customerTable.addEventListener('click', removeCustomer)
restaurantTable.addEventListener('click', removeRestaurant)



function removeCustomer(e) {
    e.preventDefault();

    if (e.target.classList.contains('delete')) {
		const toRemove = e.target.parentElement.parentElement
        const userName = toRemove.querySelectorAll('.userName')[0].innerText

        const data = {
            userName: userName
        }

        const request = new Request(`/admin/user`, {
	        method: 'DELETE', 
	        body: JSON.stringify(data),
	        headers: {
	            'Accept': 'application/json, text/plain, */*',
	            'Content-Type': 'application/json'
	        },
        });
        
        fetch(request)
        .then((res) => {
            if(res.status === 200) {
                swal("", "Delete succeed!", "success");
            } else {
                swal("", "Delete failed.", "error");
            }
        }).catch((error) => {
	        console.log(error)
	    })     
    }
    
    setTimeout(function() {location.reload()}, 1500);
}

function removeOwner(e) {
    e.preventDefault();

    if (e.target.classList.contains('delete')) {
		const toRemove = e.target.parentElement.parentElement
        const userName = toRemove.querySelectorAll('.userName')[0].innerText
        const restName = toRemove.querySelectorAll('.restName')[0].innerText

        const userData = {
            userName: userName
        }

        const restData = {
            name: restName
        }

        // delete restaurant
        const request1 = new Request(`/admin/restaurant`, {
	        method: 'DELETE', 
	        body: JSON.stringify(restData),
	        headers: {
	            'Accept': 'application/json, text/plain, */*',
	            'Content-Type': 'application/json'
	        },
        });
        
        fetch(request1)
        .then((res) => {
            if(res.status === 200) {
                // delete user
                const request2 = new Request(`/admin/user`, {
                    method: 'DELETE', 
                    body: JSON.stringify(userData),
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json'
                    },
                });
                
                fetch(request2)
                .then((res) => {
                    if(res.status === 200) {
                        swal("", "Delete succeed!", "success");
                    } else {
                        swal("", "Delete failed.", "error");
                    }
                }).catch((error) => {
                    console.log(error)
                })
            } else {
                swal("", "SDelete failed.", "error");
            }
        }).catch((error) => {
	        console.log(error)
	    })

    }
    
    setTimeout(function() {location.reload()}, 1500);
    

}

function removeRestaurant(e) {
    e.preventDefault();

    if (e.target.classList.contains('delete')) {
        const toRemove = e.target.parentElement.parentElement
        const userName = toRemove.querySelectorAll('.userName')[0].innerText
        const restName = toRemove.querySelectorAll('.restName')[0].innerText

        const userData = {
            userName: userName
        }

        const restData = {
            name: restName
        }
        
        // delete restaurant
        let request1 = new Request(`/admin/restaurant`, {
	        method: 'DELETE', 
	        body: JSON.stringify(restData),
	        headers: {
	            'Accept': 'application/json, text/plain, */*',
	            'Content-Type': 'application/json'
	        },
        });
        
        fetch(request1)
        .then((res) => {
            if(res.status === 200) {
                // delete user
                const request2 = new Request(`/admin/user`, {
                    method: 'DELETE', 
                    body: JSON.stringify(userData),
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json'
                    },
                });
                
                fetch(request2)
                .then((res) => {
                    if(res.status === 200) {
                        swal("", "Delete succeed!", "success");
                    } else {
                        swal("", "Delete failed.", "error");
                    }
                }).catch((error) => {
                    console.log(error)
                })
            } else {
                swal("", "Delete failed.", "error");
            }
        }).catch((error) => {
	        console.log(error)
        })
        
        
    }
    
    setTimeout(function() {location.reload()}, 1500);

}


// function removeUserFromDatabase(userName) {
//     User.findOne({userName: userName}).then((deleteUser) => {
//         Restaurant.find().then((restaurants) => {
//             for (let j in restaurants) {
//                 const rest = restaurants[j]

//                 // remove reservations from restaurant
//                 rest.reservations.array.forEach((reser) => {
//                     if (reser.resvUserName === userName) {
//                         rest.reservations.remove(reser)
//                     }
//                 });

//                 //remove wait tables from restaurant
//                 rest.smallWaitList.array.forEach((wait) => {
//                     if (wait.waitUserName === userName) {
//                         rest.smallWaitList.remove(wait)
//                     }
//                 });

//                 rest.mediumWaitList.array.forEach((wait) => {
//                     if (wait.waitUserName === userName) {
//                         rest.mediumWaitList.remove(wait)
//                     }
//                 });

//                 rest.largeWaitList.array.forEach((wait) => {
//                     if (wait.waitUserName === userName) {
//                         rest.largeWaitList.remove(wait)
//                     }
//                 });

//                 rest.save().then((r) => {}, (error) => {
//                     res.status(400).send(error)
//                 })
//             }
//         }).catch((error) => {
//             res.status(500).send(error)
//         })
//     }).catch((error) => {
// 		res.status(500).send(error)
//     })
    
    
//     User.findOne({userName: userName}).then((deleteUser) => {
        
//     }).catch((error) => {
// 		res.status(500).send(error)
//     })

//     // remove the user from database
//     User.findOneAndRemove({userName: userName}).then((user) =>{
//         if (!user) {
// 			res.status(404).send()
// 		} else {
// 			res.send({ user })
// 		}
// 	}).catch((error) => {
// 		res.status(500).send(error)
// 	})
// }


// function removeRestaurantFromDatabase(name) {

//     Restaurant.findOne({restaurantName: name}).then((deleteRest) =>{
//         User.find().then((users) =>{
//             for (let i in users) {
//                 const u = users[i]

//                 //remove the reservations from user
//                 u.reservations.array.forEach((reser) => {
//                     if (reser.resvRestaurantName === name) {
//                         u.reservations.remove(reser)
//                     }
//                 });

//                 //remove wait tables from user
//                 u.waitList.array.forEach((wait) => {
//                     if (wait.waitRestaurantName === name) {
//                         rest.waitList.remove(wait)
//                     }
//                 });

//                 u.save().then((u) => {}, (error) => {
//                     res.status(400).send(error)
//                 })

//             }
//         }).catch((error) => {
//             res.status(500).send(error)
//         })
//     }).catch((error) => {
// 		res.status(500).send(error)
//     })


//     // remove the restaurant from the database
//     Restaurant.findOneAndRemove({restaurantName: name}).then((rest) =>{
//         if (!rest) {
// 			res.status(404).send()
// 		} else {
// 			res.send({ rest })
// 		}
// 	}).catch((error) => {
// 		res.status(500).send(error)
// 	})
// }