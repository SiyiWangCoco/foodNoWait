'use strict'

const signUpSection = document.querySelector('#signUp');
signUpSection.addEventListener('click', signUp);


function signUp(e) {
	e.preventDefault();
	// upload profile picture


	if (e.target.className === "signupSubmit") {
		const userName = document.querySelector("#userNameInput").value;
		const password = document.querySelector("#newpasswordInput").value;
		const passwordConfirm = document.querySelector("#passwordConfirmInput").value;
		const email = document.querySelector("#emailInput").value;

		let data = {
			userType: "restaurant",
	        userName: userName,
	        password: password,
	        passwordConfirm: passwordConfirm,
	        email: email,
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
	        	if (res === "incorrect email format") {
	        		alert(res)
	        	} else if (res === "user already existed") {
	        		alert(res)
	        	}
	        	const re = /\S+@\S+\.\S+/;
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
	            } else if (!re.test(email)) {
	            	alert("It is not a valid email")
	            }
	        }
	    }).catch((error) => {
	        console.log(error)
	    })
	}
}