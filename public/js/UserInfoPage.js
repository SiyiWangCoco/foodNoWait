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
		lineUp = data.waitList
		reservation = data.reservations

		var html1 = '';
		var html2 = '';
	
		for (var i = 0; i < lineUp.length; i++) {
			html1 += '<div class="restaurantRecord" id="'+lineUp[i]._id+'">';
			html1 += `<div class="logo" style="background-image: url('/restaurant/${lineUp[i].waitId}/picture')">`;
			html1 += '</div>';
			html1 += '<table class="table">';
			html1 += '<tbody>';
			
			html1 += '<tr>';
			html1 += '<td align="left" height="30" width="200">'+lineUp[i].waitRestaurantName+'</td>';
			html1 += '<td align="right" height="30" width="200">about <span class="spanColor time">'+lineUp[i].waitAhead*20+'</span> minutes left</td>';
			html1 += '</tr>';

			var tableSize = lineUp[i].waitTable
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
			html1 += '<td align="right" height="30" width="200"><span class="spanColor tableNum">'+lineUp[i].waitAhead+'</span> parties ahead</td>';
			html1 += '</tr>';
			
			html1 += '<tr>';
			html1 += '<td align="left" height="30" width="200"><button class="btn" onclick="showTableSize(this)">Change table size</button></td>';
			html1 += '<td align="right" height="30" width="200"><button class="btn" onclick="cancelLineUp(this)">Cancel line up</button></td>';
			html1 += '</tr>';
			
			html1 += '</tbody>';
			html1 += '</table>';
			html1 += '</div>';
		}
		$('.waitInLine').append(html1);
		checkNoLineUp();

		for (var i = 0; i < reservation.length; i++) {
			html2 += '<div class="restaurantRecord" id="'+reservation[i]._id+'">';
			html2 += `<div class="logo" style="background-image: url('/restaurant/${reservation[i].resvId}/picture')">`;
			html2 += '</div>';
			html2 += '<table class="table">';
			html2 += '<tbody>';
			
			html2 += '<tr>';
			html2 += '<td align="left" height="30" width="200">'+reservation[i].resvRestaurantName+'</td>';
			html2 += '<td align="right" height="30" width="200">'+reservation[i].resvDate+'</span></td>';
			html2 += '</tr>';
			
			html2 += '<tr>';
			html2 += '<td align="right" height="30" width="200">Table for <span class="spanColor tableNum">'+reservation[i].resvPeople+'</span></td>';
			html2 += '<td align="right" height="30" width="200">'+reservation[i].resvTime+'</td>';
			html2 += '</tr>';
			
			html2 += '<tr>';
			html2 += '<td align="left" height="30" width="200">Number of people: <input type="text" class="changeResvPeople"><button class="btn" onclick="changeResvPeople(this)">Change</button></td>';
			html2 += '<td align="right" height="30" width="200"><button class="btn" onclick="cancelReservation(this)">Cancel reservation</button></td>';
			html2 += '</tr>';
			
			html2 += '</tbody>';
			html2 += '</table>';
			html2 += '</div>';
		}
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
		html1 += '<a href="/search"><span>Click here to find more restaurants</span></a>';
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
		html2 += '<a href="/search"><span>Click here to find more restaurants</span></a>';
		html2 += '</div>';
		
		$('.reservation').append(html2);
	}
}

function checkYourTurnForLineUp() {
	for (var i = 0; i < lineUp.length; i++) {
		const waitRestaurant = lineUp[i]
		const waitRestaurantId = waitRestaurant._id

		if (waitRestaurant.waitAhead <= 0) {
			// notify user
			swal("", 'It\'s now your turn in ' + waitRestaurant.waitRestaurantName + '!', "info");

			// update database
			const request = new Request('/users/status/deleteLineUp', {
				method: 'DELETE',
				body: JSON.stringify({ waitRestaurantId }),
				headers: {
					'Accept': 'application/json, text/plain, */*',
					'Content-Type': 'application/json'
				}
			});
			
			fetch(request).then((res) => {
				if (res.status === 200) {
					setTimeout(function() {window.location.href = "/users/status"}, 2500);
				} else {
					swal("", "Oops! An error occurred. Failed to cancel line up.", "error");
				}
			}).catch((error) => {
				console.log(error)
			})
		}
	}
}

function cancelLineUp(obj) {
	const waitRestaurantId = $(obj).parents('.restaurantRecord').attr('id')

	var waitRestaurant;
	for (var i = 0; i < lineUp.length; i++) {
		if (lineUp[i]._id === waitRestaurantId) {
			waitRestaurant = lineUp[i]
		}
	}

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
			window.location.href = "/users/status";
		} else {
			swal("", "Oops! An error occurred. Failed to cancel line up.", "error");
		}
	}).catch((error) => {
		console.log(error)
	})
}

function cancelReservation(obj) {
	const resvRestaurantId = $(obj).parents('.restaurantRecord').attr('id')

	var resvRestaurant;
	for (var i = 0; i < reservation.length; i++) {
		if (reservation[i]._id === resvRestaurantId) {
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
			window.location.href = "/users/status";
		} else {
			swal("", "Oops! An error occurred. Failed to cancel reservation.", "error");
		}
	}).catch((error) => {
		console.log(error)
	})
}



var objs = '';

function showTableSize(obj) {
	objs = obj;
	
	const left = $(obj).offset().left + 130;
	const top = $(obj).offset().top;
	
	$('.tableSize').css('top', top + 'px');
	$('.tableSize').css('left', left + 'px');
	$('.tableSize').show();
}

$(document).mouseup(function (e)
{
    var container = $(".tableSize");

    if (!container.is(e.target) // if the target of the click isn't the container...
        && container.has(e.target).length === 0) // ... nor a descendant of the container
    {
        container.hide();
    }
});

function changeTableSize(obj) {
	const name = $(obj).text();

	var tableSize;
	if (name === "Small table (1-2)") {
		tableSize = 'A'
	} else if (name === "Medium table (3-4)") {
		tableSize = 'B'
	} else if (name === "Large table (5 and above)") {
		tableSize = 'C'
	}

	const waitRestaurantId = $(objs).parents('.restaurantRecord').attr('id')

	var waitRestaurant;
	for (var i = 0; i < lineUp.length; i++) {
		if (lineUp[i]._id === waitRestaurantId) {
			waitRestaurant = lineUp[i]
		}
	}
	
	const data = { waitRestaurant: waitRestaurant, tableSize: tableSize }

	const request = new Request('/users/status/changeTableSize', {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Accept': 'application/json, text/plain, */*',
			'Content-Type': 'application/json'
		}
	});
	
	fetch(request).then((res) => {
		if (res.status === 200) {
			// update html
			$('.tableSize').hide();
			
			objs = "";

			window.location.href = "/users/status";
		} else {
			swal("", "Oops! An error occurred. Failed to change table size.", "error");
		}
	}).catch((error) => {
		console.log(error)
	})
}

function changeResvPeople(obj) {
	const input = $(obj).parent().children(':first-child').val();

	if (input != '') {
		const resvPeople = parseInt(input)

		if (resvPeople) {
			const resvRestaurantId = $(obj).parents('.restaurantRecord').attr('id')
	
			var resvRestaurant;
			for (var i = 0; i < reservation.length; i++) {
				if (reservation[i]._id === resvRestaurantId) {
					resvRestaurant = reservation[i]
				}
			}
	
			const data = { resvRestaurant: resvRestaurant, resvPeople: resvPeople }
	
			const request = new Request('/users/status/changeResvPeople', {
				method: 'POST',
				body: JSON.stringify(data),
				headers: {
					'Accept': 'application/json, text/plain, */*',
					'Content-Type': 'application/json'
				}
			});
			
			fetch(request).then((res) => {
				if (res.status === 200) {
					window.location.href = "/users/status";
				} else {
					swal("", "Oops! An error occurred. Failed to change the number of reservation people.", "error");
				}
			}).catch((error) => {
				console.log(error)
			})
		} else {
			$('.changeResvPeople').val = ''
			swal("", "Integer expected!", "error");
		}
	}
}