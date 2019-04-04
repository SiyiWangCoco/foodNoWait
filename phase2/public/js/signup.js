'use strict'

const signUpSection = document.querySelector('#signUp');
signUpSection.addEventListener('click', signUp);

function signUp(e) {
	e.preventDefault();
	let gender = null;

	if (e.target.className === "signupSubmit") {
		const userName = document.querySelector("#userNameInput").value;
		const password = document.querySelector("#newpasswordInput").value;
		const passwordConfirm = document.querySelector("#passwordConfirmInput").value;
		const email = document.querySelector("#emailInput").value;
		const firstName = document.querySelector("#firstNameInput").value;
		const lastName = document.querySelector("#lastNameInput").value;
		const phoneNumber = parseInt(document.querySelector("#phoneNumberInput").value);
		const age = parseInt(document.querySelector("#ageInput").value);
		const genderSelect = document.querySelector("#genderSelect");
		if (genderSelect.options[genderSelect.selectedIndex]) {
			gender = genderSelect.options[genderSelect.selectedIndex].value;
		}

		let data = {
			userType: "customer",
	        userName: userName,
	        password: password,
	        passwordConfirm: passwordConfirm,
	        email: email,
	        firstName: firstName,
	        lastName: lastName,
	        phoneNumber: phoneNumber,
	        age: age,
	        gender: gender
	    }

	    if (passwordConfirm !== password) {
	        alert("password confirmation does not match");
	        return;
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
	        if (res.status === 200) {
	            console.log('User has signed up')
	            alert("You have signup")
	        } else {
	        	const re = /\S+@\S+\.\S+/;
	            if (!userName) {
	            	alert("missing username");
	            } else if (!password) {
	            	alert("missing password");
	            } else if (password.length < 4) {
	            	alert("password must be at least 4 characters")
	            } else if (!passwordConfirm) {
	            	alert("Please confirm your password.")
	            } else if (!email) {
	            	alert("missing email");
	            } else if (!re.test(email)) {
	            	alert("It is not a valid email")
	            } else {
	            	alert("User existed")
	            }
	        }
	    }).catch((error) => {
	        console.log(error)
	    })
	}
}