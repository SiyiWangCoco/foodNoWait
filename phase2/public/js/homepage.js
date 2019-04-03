'use strict';

findFiveMostPopular();

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
			loadRestaurants(restaurants);
		} else {
			loadRestaurants(restaurants.sort((a, b) => b.star - a.star).slice(0, 5));
		}
	}).catch((error) => {
		console.log(error)
	})

}

/* Load all restaurants given input */
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
	const link = document.createElement('a');
	link.href = '/search';
	link.innerHTML = 'See more...';
	link.className = "seeMore";
	restaurantsElement.appendChild(link);
}
