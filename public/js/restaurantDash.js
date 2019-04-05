'use strict'
// const small = document.querySelector("#restaurantUserSmall");
// const medium = document.querySelector("#restaurantUserMedium");
// const large = document.querySelector("#restaurantUserLarge");
// small.addEventListener("click", next);
// medium.addEventListener("click", next);
// large.addEventListener("click", next);

// const currentReservation = document.querySelector("#currentReservation");
// currentReservation.addEventListener('click', removeReservation);

// const timeSlot = document.querySelectorAll(".timeSlot");
// for (let i = 0; i < timeSlot.length; i++) {
// 	timeSlot[i].addEventListener("click", addReservation);
// }

// function removeReservation(e){
// 	e.preventDefault();	
// 	if ((e.target.classList.contains('complete')) || (e.target.classList.contains('Cancel'))) {	
// 		const curReservation = e.target.parentElement.firstElementChild.innerHTML;
// 		const allReservation = document.querySelectorAll(".res");
//   		for (var i = 0; i<allReservation.length; i++) {
// 			if (allReservation[i].firstElementChild.firstElementChild.innerHTML == curReservation) {
// 				allReservation[i].parentElement.removeChild(allReservation[i]);
// 			}
// 		}
// 	}
// }

// upload profile picture
var eleFile = document.querySelector('#resfile');

eleFile.addEventListener('change', function() {
	var file = this.files[0];
	           
	// identify it is of type image                
	if (file.type.indexOf("image") == 0) {
		var reader = new FileReader();
		reader.readAsDataURL(file);           
		reader.onload = function(e) {
			var newUrl = this.result;
			document.querySelector('#currentImage').style.backgroundImage = 'url(' + newUrl + ')';
		};
	}
});
