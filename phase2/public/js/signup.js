'use strict'
const validator = require('validator');

const signUpSection = document.querySelector('#signUp');
signUpSection.addEventListener(signUp);

function signUp(e) {
	e.preventDefault();

	if (e.target.className === "signupSubmit") {
		const userName = document.querySelector("#userNameInput").value;
		const password = document.querySelector("#newpasswordInput").value;
		const passwordConfirm = document.querySelector("#passwordConfirmInput").value;
		const email = document.querySelector("#emailInput").value;
		const userTypeSelect = document.querySelector("#userTypeSelect");
		if (!userTypeSelect.options[userTypeSelect.selectedIndex]) {
			alert("Please choose your user type");
			return;
		}
		const userType = userTypeSelect.options[userTypeSelect.selectedIndex].value;
		const firstName = document.querySelector("#firstNameInput").value;
		const lastName = document.querySelector("#lastNameInput").value;
		const phoneNumber = parseInt(document.querySelector("#phoneNumber").value);
		const age = parseInt(document.querySelector("#ageInput").value);
		const genderSelect = document.querySelector("#genderSelect");
		if (!genderSelect.options[genderSelect.selectedIndex]) {
			const gender = null;
		} else {
			const gender = genderSelect.options[genderSelect.selectedIndex].value;
		}

		let data = {
	        userName: userNamee,
	        password: password,
	        passwordConfirm: passwordConfirm,
	        email: email,
	        userType: userType,
	        firstName: firstName,
	        lastName: lastName,
	        phoneNumber: phoneNumber,
	        age: age,
	        gender: gender
	    }

	    // Create our request constructor with all the parameters we need
	    const request = new Request('/users', {
	        method: 'post', 
	        body: JSON.stringify(data),
	        headers: {
	            'Accept': 'application/json, text/plain, */*',
	            'Content-Type': 'application/json'
	        },
	    });
	    fetch(request)
	    .then(function(res) {
	        // Handle response we get from the API
	        // Usually check the error codes to see what happened
	        const message = document.querySelector('#message')
	        if (res.status === 200) {
	            console.log('User has signed up')
	            alert("You have signup")
	        } else {
	            if (!userName) {
	            	alert("missing username");
	            } else if (!password) {
	            	alert("missing password");
	            } else if (password.length < 4) {
	            	alert("password must be at least 4 characters")
	            } else if (!passwordConfirm) {
	            	alert("Please confim your password.")
	            } else if (passwordConfirm !== password) {
	            	alert("password confirmation does not match");
	            } else if (!email) {
	            	alert("missing email");
	            } else if (!validator.isEmail(email)) {
	            	alert("It is not a valid email")
	            }
	        }
	    }).catch((error) => {
	        console.log(error)
	    })
	}
}