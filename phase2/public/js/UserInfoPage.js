'use strict'

var lineUp;
var reservation;

$('body').ready(function() {
	renderUserStatus();
});

function renderUserStatus() {

	const url = "/users/status/get"

	fetch(url).then((res) => {
		if (res.status === 200) {
			return res.json();
		}
	}).then((data) => {
		console.log("user status", data)

		lineUp = data.waitList
		reservation = data.reservations

		var html1 = html2 = '';
	
		for (var i = 0; i < lineUp.length; i++) {
			html1 += '<div class="restaurantRecord" id="'+lineUp[i]['waitRestaurantName']+'">';
			html1 += '<div class="logo">';
			html1 += '<span>Restaurant</span>';
			html1 += '<span>Image</span>';
			html1 += '</div>';
			html1 += '<table>';
			html1 += '<tbody>';
			
			html1 += '<tr>';
			html1 += '<td align="left" height="30" width="200">'+lineUp[i]['waitRestaurantName']+'</td>';
			html1 += '<td align="right" height="30" width="200">about <span class="spanColor time">'+lineUp[i]['waitAhead']*20+'</span> minutes left</td>';
			html1 += '</tr>';

			var tableSize = lineUp[i]['waitTable']
			if (tableSize === "A") {
				tableSize = "Small table (1-2)"
			} else if (tableSize === "B") {
				tableSize = "Medium table (3-4)"
			} else if (tableSize === "C") {
				tableSize = "Large table (5 and above)"
			} else {
				tableSize = "UNKNOWN"
			}
			
			html1 += '<tr>';
			html1 += '<td align="left" height="30" width="200" class="tabsize">'+tableSize+'</td>';
			html1 += '<td align="right" height="30" width="200"><span class="spanColor tableNum">'+lineUp[i]['waitAhead']+'</span> parties ahead</td>';
			html1 += '</tr>';
			
			html1 += '<tr>';
			html1 += '<td align="left" height="30" width="200"><button class="changeTableSize" onclick="showTableSize(this)">Change table size</button></td>';
			html1 += '<td align="right" height="30" width="200"><button class="cancelLineUp" onclick="cancelLineUp(this)">Cancel line up</button></td>';
			html1 += '</tr>';
			
			html1 += '</tbody>';
			html1 += '</table>';
			html1 += '</div>';
		}
		$('.waitInLine').empty();
		$('.waitInLine').append(html1);
		checkNoLineUp();

		for (var i = 0; i < reservation.length; i++) {
			html2 += '<div class="restaurantRecord" id="'+reservation[i]['resvRestaurantName']+'">';
			html2 += '<div class="logo">';
			html2 += '<span>Restaurant</span>';
			html2 += '<span>Image</span>';
			html2 += '</div>';
			html2 += '<table>';
			html2 += '<tbody>';
			
			html2 += '<tr>';
			html2 += '<td align="left" height="30" width="200">'+reservation[i]['resvRestaurantName']+'</td>';
			html2 += '<td align="right" height="30" width="200">'+reservation[i]['resvDate']+'</span></td>';
			html2 += '</tr>';
			
			var tableSize = reservation[i]['resvPeople']
			if (tableSize === 1 || tableSize === 2) {
				tableSize = "Small table (1-2)"
			} else if (tableSize === 3 || tableSize === 4) {
				tableSize = "Medium table (3-4)"
			} else if (tableSize >= 5) {
				tableSize = "Large table (5 and above)"
			} else {
				tableSize = "UNKNOWN"
			}

			html2 += '<tr>';
			html2 += '<td align="left" height="30" width="200" class="tabsize">'+tableSize+'</td>';
			html2 += '<td align="right" height="30" width="200">'+reservation[i]['resvTime']+'</td>';
			html2 += '</tr>';
			
			html2 += '<tr>';
			html2 += '<td align="left" height="30" width="200"><button class="changeTableSize" onclick="showTableSize(this)">Change table size</button></td>';
			html2 += '<td align="right" height="30" width="200"><button class="cancelReservation" onclick="cancelReservation(this)">Cancel reservation</button></td>';
			html2 += '</tr>';
			
			html2 += '</tbody>';
			html2 += '</table>';
			html2 += '</div>';
		}
		$('.reservation').empty();
		$('.reservation').append(html2);
		checkNoReservation();

		checkYourTurnForLineUp();
	})
}

function checkNoLineUp() {
	const html = $('.waitInLine').find('.restaurantRecord').text();
	
	if (!html) {
		var html1 = '';
		
		html1 += '<div class="restaurantRecord">';
		html1 += '<span class="noRecord">No line up now!</span>';
		html1 += '<a href="userHomePage.html"><span>Click here to find more restaurants</span></a>';
		html1 += '</div>';
		
		$('.waitInLine').append(html1);	
	}
}

function checkNoReservation() {
	const html = $('.reservation').find('.restaurantRecord').text();

	if (!html) {
		var html2 = '';
		
		html2 += '<div class="restaurantRecord">';
		html2 += '<span class="noRecord">No reservations now!</span>';
		html2 += '<a href="userHomePage.html"><span>Click here to find more restaurants</span></a>';
		html2 += '</div>';
		
		$('.reservation').append(html2);
	}
}

function checkYourTurnForLineUp() {
	for (var i = 0; i < lineUp.length; i++) {
		const waitRestaurant = lineUp[i]

		if (waitRestaurant.waitAhead === 0) {
			// notify user
			alert('It\'s now your turn in ' + waitRestaurant.waitRestaurantName + '!');

			// update database
			deleteLineUp(waitRestaurant)
		}
	}
}

function deleteLineUp(waitRestaurant) {
	const request = new Request('/users/status/cancelLineUp', {
		method: 'DELETE',
		body: JSON.stringify({ waitRestaurant }),
		headers: {
			'Accept': 'application/json, text/plain, */*',
			'Content-Type': 'application/json'
		}
	});
	
	fetch(request).then((res) => {
		if (res.status === 200) {
			renderUserStatus()
		} else {
			alert("Oops! An error occurred. Failed to cancel line up.")
		}
	}).catch((error) => {
		console.log(error)
	})
}

function cancelLineUp(obj) {
	const waitRestaurantName = $(obj).parents('.restaurantRecord').id
	console.log("cancel line up", waitRestaurantName)

	var waitRestaurant;
	for (var i = 0; i < lineUp.length; i++) {
		if (lineUp[i].waitRestaurantName === waitRestaurantName) {
			waitRestaurant = lineUp[i]
		}
	}

	deleteLineUp(waitRestaurant)
}


function cancelReservation(obj) {
	const resvRestaurantName = $(obj).parents('.restaurantRecord').id
	console.log("cancel reservation", resvRestaurantName)

	var resvRestaurant;
	for (var i = 0; i < reservation.length; i++) {
		if (reservation[i].resvRestaurantName === resvRestaurantName) {
			resvRestaurant = reservation[i]
		}
	}

	const request = new Request('/users/status/cancelReservation', {
		method: 'DELETE',
		body: JSON.stringify({ resvRestaurant }),
		headers: {
			'Accept': 'application/json, text/plain, */*',
			'Content-Type': 'application/json'
		}
	});
	
	fetch(request).then((res) => {
		if (res.status === 200) {
			renderUserStatus()
		} else {
			alert("Oops! An error occurred. Failed to cancel reservation.")
		}
	}).catch((error) => {
		console.log(error)
	})
}











var objs = '';

function showTableSize(obj) {
	objs = obj;
	
	var left = $(obj).offset().left + 130;
	var top = $(obj).offset().top;
	
	$('.tableSize').css('top', top + 'px');
	$('.tableSize').css('left', left + 'px');
	$('.tableSize').show();
}

function changeTableSize(obj) {
	var name = $(obj).text();
	
	$(objs).parents('.restaurantRecord').find('.tabsize').text(name);
	
	$('.tableSize').hide();
	
	objs = "";
}