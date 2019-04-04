'use strict';

const searchClass = document.querySelector("#searchClass");
searchClass.addEventListener("click", loadByClass);
const searchBar = document.querySelector(".searchBar");
searchBar.addEventListener("click", search);

const currentText = document.querySelector(".searchContent").placeholder;
if (currentText !== "Find the restaurant...") {
	searchRestaurant(currentText);
} else {
	findAll();
}

/* Search restaurant by name */
function search(e) {
	e.preventDefault();	
	if (e.target.className === "searchSubmit") {
		const text = e.target.previousElementSibling.value;
		if (text != '') { 
			emptyList();
			searchRestaurant(text);
		} else {
			emptyList();
			findAll();
		}
	}
}


function loadByClass(e) {
	e.preventDefault();	
	if (e.target.innerHTML === "Popular Restaurant") {
		emptyList();
		findFiveMostPopular();
	} else if (e.target.innerHTML === "Seat Available") {
		emptyList();
		extractRestaurantWithAvailableSeat();
	} else if (e.target.innerHTML === "Chinese Food") {
		emptyList();
		extractRestaurantByType("Chinese Food");
	} else if (e.target.innerHTML === "Seafood &amp; Steak") {
		emptyList();
		extractRestaurantByType("Seafood & Steak");
	} else if (e.target.innerHTML === "Dessert") {
		emptyList();
		extractRestaurantByType("Dessert");
	}
}

function findAll() {
	let url = '/restaurants'
	fetch(url)
	.then(function(res) {
	    if (res.status === 200) {
	    	return res.json();    
	    }
	}).then((json) => {
		const restaurants = json;
		if (restaurants.length >= 1) {
			loadRestaurants(restaurants);
		}
	}).catch((error) => {
		console.log(error)
	})
}

function findFiveMostPopular() {
	let url = '/restaurants'
	fetch(url)
	.then(function(res) {
	    if (res.status === 200) {
	    	return res.json();    
	    }
	}).then((json) => {
		const restaurants = json;
		if (restaurants.length <= 5) {
			if (restaurants.length >= 1) {
				loadRestaurants(restaurants);
			}
		} else {
			loadRestaurants(restaurants.sort((a, b) => b.star - a.star).slice(0, 5));
		}
	}).catch((error) => {
		console.log(error)
	})
}


function searchRestaurant(text) {
	let url = '/restaurants'
	fetch(url)
	.then(function(res) {
	    if (res.status === 200) {
	    	return res.json();    
	    }
	}).then((json) => {
		const restaurants = json;
		const specificRestaurants = restaurants.filter((restaurant) => restaurant.restaurantName.toLowerCase().includes(text.toLowerCase()))
		if (specificRestaurants.length >= 1) {
			loadRestaurants(specificRestaurants);
		}
	}).catch((error) => {
		console.log(error)
	})
}

function extractRestaurantWithAvailableSeat() {
	let url = '/restaurants'
	fetch(url)
	.then(function(res) {
	    if (res.status === 200) {
	    	return res.json();    
	    }
	}).then((json) => {
		const restaurants = json;
		const specificRestaurants = restaurants.filter((restaurant) => restaurant.seatAvailable)
		if (specificRestaurants.length >= 1) {
			loadRestaurants(specificRestaurants);
		}
	}).catch((error) => {
		console.log(error)
	})
}

function extractRestaurantByType(restaurantType) {
	let url = '/restaurants'
	fetch(url)
	.then(function(res) {
	    if (res.status === 200) {
	    	return res.json();    
	    }
	}).then((json) => {
		const restaurants = json;
		const specificRestaurants = restaurants.filter((restaurant) => restaurant.restaurantType === restaurantType)
		if (specificRestaurants.length >= 1) {
			loadRestaurants(specificRestaurants);
		}
	}).catch((error) => {
		console.log(error)
	})
}

function emptyList() {
	const restaurants = document.querySelector("#searchList").querySelectorAll(".restaurant");
	for (let i = 0; i < restaurants.length; i++) {
		document.querySelector("#searchList").firstElementChild.firstElementChild.nextElementSibling.removeChild(restaurants[i]);
	}
	if (restaurants.length >= 1) {
		document.querySelector("#searchList").firstElementChild.removeChild(document.querySelector("#searchList").firstElementChild.firstElementChild.nextElementSibling);
	}
}

function loadRestaurants(restaurants) {
	const restaurantList = document.querySelector('.restaurantList');
	const restaurantsElement = document.createElement('div');
	for (let i = 0; i < restaurants.length; i++) {
		const restaurant = restaurants[i];
		const restaurantElement = document.createElement('div');
		restaurantElement.className = 'restaurant';
		
		const pictureLink = document.createElement('a');
		pictureLink.href = '/restaurant/' + restaurant._id 
		const picture = document.createElement('input');
		picture.type = 'image';
		picture.src = 'restaurant/' + restaurant._id + '/picture'
		pictureLink.appendChild(picture);
		restaurantElement.appendChild(pictureLink);

		const restaurantInfo = document.createElement('div');
		restaurantInfo.className = 'restaurantInfo';
		const text1 = document.createElement('p');
		text1.innerHTML = restaurant.restaurantName + ' ';
		const text1Span = document.createElement('span');
		if (restaurant.numOfParties > 1) {
			text1Span.innerHTML = restaurant.numOfParties + ' parties ahead';
		} else if (restaurant.numOfParties == 1) {
			text1Span.innerHTML = restaurant.numOfParties + ' party ahead';
		} else {
			text1Span.innerHTML = 'seating available';
		}
		text1.appendChild(text1Span);
		const text2 = document.createElement('p');
		text2.innerHTML = restaurant.address;
		restaurantInfo.appendChild(text1);
		restaurantInfo.appendChild(text2);
		restaurantElement.appendChild(restaurantInfo);

		restaurantsElement.appendChild(restaurantElement);
	}

	restaurantsElement.className = 'restaurantsInList';
	restaurantList.appendChild(restaurantsElement);

}