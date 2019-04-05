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
		const phoneNumber = document.querySelector("#phoneNumberInput").value;
		const age = document.querySelector("#ageInput").value;
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
			swal("", "password confirmation does not match", "error");
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
				swal("", "You have signup.", "success");
	            setTimeout(function() {window.location.href = "/users/signin"}, 1500)
	        } else {
	        	const re = /\S+@\S+\.\S+/;
	            if (!userName) {
					swal("", "missing username", "error");
	            } else if (!password) {
					swal("", "missing password", "error");
	            } else if (password.length < 4) {
					swal("", "password must be at least 4 characters", "error");
	            } else if (!passwordConfirm) {
					swal("", "Please confirm your password.", "error");
	            } else if (!email) {
					swal("", "missing email", "error");
	            } else if (!re.test(email)) {
					swal("", "It is not a valid email.", "error");
	            } else {
					swal("", "User existed", "error");
	            }
	        }
	    }).catch((error) => {
	        console.log(error)
	    })
	}
}