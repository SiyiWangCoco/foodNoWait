'use strict'

$('body').ready(function() {
	renderProfile();
});

function renderProfile() {
	
	const url = "/users/profile/get"

	fetch(url).then((res) => {
		if (res.status === 200) {
			return res.json();
		}
	}).then((data) => {
		var userName = data.userName
		var accountType = data.accountType
		var firstName = data.firstName
		var lastName = data.lastName
		var email = data.email
		var gender = data.gender
		var age = data.age
		var phone = data.phone
		var description = data.description
	
		document.querySelector('#username').setAttribute('value', userName)
		document.querySelector('#accountType').setAttribute('value', accountType)
		document.querySelector('#firstName').setAttribute('value', firstName)
		document.querySelector('#lastName').setAttribute('value', lastName)
		document.querySelector('#email').setAttribute('value', email)
		document.querySelector('#age').setAttribute('value', age)
		document.querySelector('#phone').setAttribute('value', phone)
		document.querySelector('#description').setAttribute('value', description)
	
		if (gender == "female") {
			document.querySelector('#genderF').setAttribute('selected', "selected")
		} else if (gender == "male") {
			document.querySelector('#genderM').setAttribute('selected', "selected")
		} else if (gender == "other") {
			document.querySelector('#genderO').setAttribute('selected', "selected")
		} else {
			document.querySelector('#genderU').setAttribute('selected', "selected")
		}

		document.querySelector('#oldPassword').value = ''
		document.querySelector('#newPassword').value = ''
		document.querySelector('#confirmPassword').value = ''
	}).catch((error) => {
		console.log(error)
	})
	
}

// upload profile picture
var eleFile = document.querySelector('#file');
if (eleFile) {
	eleFile.addEventListener('change', function() {
		var file = this.files[0];
		           
		// identify it is of type image                
		if (file.type.indexOf("image") == 0) {
			var reader = new FileReader();
			reader.readAsDataURL(file);           
			reader.onload = function(e) {
				var newUrl = this.result;
				document.querySelector('#preview').style.backgroundImage = 'url(' + newUrl + ')';
			};
		}
	});
}



// change profile information
const infoButton = document.getElementById("infoButton")
infoButton.onclick = changeInfo

function changeInfo() {
	
	// get current user information
	const firstName = $('#firstName').val();
	const lastName = $('#lastName').val();
	const email = $('#email').val();
	const gender = $('#gender').val();
	const age = $('#age').val();
	const phone = $('#phone').val();
	const description = $('#description').val();
	
	const data = {
		firstName: firstName, 
		lastName: lastName, 
		email: email, 
		gender: gender,
		age: age,
		phone: phone,
		description: description,
	}

	const request = new Request('/users/profile/edit', {
		method: 'POST', 
		body: JSON.stringify(data),
		headers: {
			'Accept': 'application/json, text/plain, */*',
			'Content-Type': 'application/json'
		}
	});
	
	fetch(request).then((res) => {
		if (res.status === 200) {
			swal("", "Successfully updated profile!", "success");
		} else {
			swal("", "Oops! An error occurred. Failed to update profile.", "error");
		}

		renderProfile();
	}).catch((error) => {
		console.log(error)
	})
}

// change password
const pwdButton = document.getElementById("pwdButton")
pwdButton.onclick = changePwd

function changePwd() {
	
	const oldPassword = document.getElementById('oldPassword').value;
	const newPassword = document.getElementById('newPassword').value;
	const confirmPassword = document.getElementById('confirmPassword').value;
	const data = {
		oldPassword: oldPassword,
		newPassword: newPassword,
		confirmPassword: confirmPassword
	}
    
	const request = new Request('/users/profile/pwd', {
		method: 'POST', 
		body: JSON.stringify(data),
		headers: {
			'Accept': 'application/json, text/plain, */*',
			'Content-Type': 'application/json'
		}
	});
	
	fetch(request).then((res) => {
		if (res.status === 200) {
			swal("", "Successfully updated password!", "success");
		} else if (res.status == 300) {
			swal("", "Password must be at least 4 characters.", "error");
		} else if (res.status === 400) {
			swal("", "Cannot change password! Old password does not match record or new password does not match the confirm password.", "error");
		} else {
			swal("", "Oops! An error occurred. Failed to update password.", "error");
		}

		renderProfile();
	}).catch((error) => {
		console.log(error)
	})
}