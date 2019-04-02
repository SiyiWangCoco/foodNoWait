$(function() {
	getData();
})

var timeArr = [];
var objs = '';

function getData() {
	var lineUp = [
		{
			'name' : 'JaBistro',
			'tableSize' : 'Small table (1-2)',
			'time' : 50,
			'tableNum' : 5
		},
		{
			'name' : 'Alo',
			'tableSize' : 'Medium table (3-4)',
			'time' : 10,
			'tableNum' : 1
		}
	]
	
	var reservation = [
		{
			'name' : 'Hotopia Sichuan Cuisine',
			'tableSize' : 'Small table (1-2)',
			'date' : 'March 8, 2019',
			'time' : '12:00 pm'
		}
	]
	
	var html1 = html2 = '';
	
	for (var i = 0; i < lineUp.length; i++) {
		html1 += '<div class="restaurantRecord" id="'+lineUp[i]['name']+'">';
		html1 += '<div class="logo">';
		html1 += '<span>Restaurant</span>';
		html1 += '<span>Image</span>';
		html1 += '</div>';
		html1 += '<table>';
		html1 += '<tbody>';
		
		html1 += '<tr>';
		html1 += '<td align="left" height="30" width="200">'+lineUp[i]['name']+'</td>';
		html1 += '<td align="right" height="30" width="200">about <span class="spanColor time">'+lineUp[i]['time']+'</span> minutes left</td>';
		html1 += '</tr>';
		
		html1 += '<tr>';
		html1 += '<td align="left" height="30" width="200" class="tabsize">'+lineUp[i]['tableSize']+'</td>';
		html1 += '<td align="right" height="30" width="200"><span class="spanColor tableNum">'+lineUp[i]['tableNum']+'</span> parties ahead</td>';
		html1 += '</tr>';
		
		html1 += '<tr>';
		html1 += '<td align="left" height="30" width="200"><button class="changeTableSize" onclick="changeTableSize(this)">Change table size</button></td>';
		html1 += '<td align="right" height="30" width="200"><button class="cancelLineUp" onclick="cancelLineUp(this)">Cancel line up</button></td>';
		html1 += '</tr>';
		
		html1 += '</tbody>';
		html1 += '</table>';
		html1 += '</div>';
		
		timeArr.push(lineUp[i]['name']);
	}
	$('.waitInLine').append(html1);
	
	for (var i = 0; i < reservation.length; i++) {
		html2 += '<div class="restaurantRecord">';
		html2 += '<div class="logo">';
		html2 += '<span>Restaurant</span>';
		html2 += '<span>Image</span>';
		html2 += '</div>';
		html2 += '<table>';
		html2 += '<tbody>';
		
		html2 += '<tr>';
		html2 += '<td align="left" height="30" width="200">'+reservation[i]['name']+'</td>';
		html2 += '<td align="right" height="30" width="200">'+reservation[i]['date']+'</span></td>';
		html2 += '</tr>';
		
		html2 += '<tr>';
		html2 += '<td align="left" height="30" width="200" class="tabsize">'+reservation[i]['tableSize']+'</td>';
		html2 += '<td align="right" height="30" width="200">'+reservation[i]['time']+'</td>';
		html2 += '</tr>';
		
		html2 += '<tr>';
		html2 += '<td align="left" height="30" width="200"><button class="changeTableSize" onclick="changeTableSize(this)">Change table size</button></td>';
		html2 += '<td align="right" height="30" width="200"><button class="cancelReservation" onclick="cancelReservation(this)">Cancel reservation</button></td>';
		html2 += '</tr>';
		
		html2 += '</tbody>';
		html2 += '</table>';
		html2 += '</div>';
	}
	$('.reservation').append(html2);
	
	setTimer();
}

function cancelLineUp(obj) {
	$(obj).parents('.restaurantRecord').remove();
	
	checkNoLineUp();
}

function checkNoLineUp() {
	var html = $('.waitInLine').find('.restaurantRecord').text();
	
	if (!html) {
		var html1 = '';
		
		html1 += '<div class="restaurantRecord">';
		html1 += '<span class="noRecord">No line up now!</span>';
		html1 += '<a href="userHomePage.html"><span>Click here to find more restaurants</span></a>';
		html1 += '</div>';
		
		$('.waitInLine').append(html1);	
	}
}

function cancelReservation(obj) {
	$(obj).parents('.restaurantRecord').remove();

	checkNoReservation();
}

function checkNoReservation() {
	var html = $('.reservation').find('.restaurantRecord').text();

	if (!html) {
		var html2 = '';
		
		html2 += '<div class="restaurantRecord">';
		html2 += '<span class="noRecord">No reservations now!</span>';
		html2 += '<a href="userHomePage.html"><span>Click here to find more restaurants</span></a>';
		html2 += '</div>';
		
		$('.reservation').append(html2);
	}
}

function setTimer() {
	
	var time1 = setInterval(function() {		
		var time = parseInt($('#'+timeArr[0]).find('.time').text()) - 10;
		var tableNum = parseInt($('#'+timeArr[0]).find('.tableNum').text()) - 1;
		
		if (time == 0 || tableNum == 0) {
			clearInterval(time1);
			$('#'+timeArr[0]).remove();
			
			alert('It\'s now your turn in ' + timeArr[0] + '!');
			
			checkNoLineUp();
		} else {
			$('#'+timeArr[0]).find('.time').text(time);
			$('#'+timeArr[0]).find('.tableNum').text(tableNum);
		}
	}, 5000)
	
	var time2 = setInterval(function() {		
		var time = parseInt($('#'+timeArr[1]).find('.time').text()) - 10;
		var tableNum = parseInt($('#'+timeArr[1]).find('.tableNum').text()) - 1;
		
		if (time == 0 || tableNum == 0) {
			clearInterval(time2);
			$('#'+timeArr[1]).remove();
			
			alert('It\'s now your turn in ' + timeArr[1] + '!');
			
			checkNoLineUp();
		} else {
			$('#'+timeArr[1]).find('.time').text(time);
			$('#'+timeArr[1]).find('.tableNum').text(tableNum);
		}
	}, 5000)
}

function changeTableSize(obj) {
	objs = obj;
	
	var left = $(obj).offset().left + 130;
	var top = $(obj).offset().top;
	
	$('.tableSize').css('top', top + 'px');
	$('.tableSize').css('left', left + 'px');
	$('.tableSize').show();
}

function selectTableSize(obj) {
	var name = $(obj).text();
	
	$(objs).parents('.restaurantRecord').find('.tabsize').text(name);
	
	$('.tableSize').hide();
	
	objs = "";
}