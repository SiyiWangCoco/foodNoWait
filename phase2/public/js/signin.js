'use strict';

const login = document.querySelector('#login');
login.addEventListener("click", checkLogin);

/* Check whether login info is correct */
function login(e) {
    e.preventDefault();
	const url = '/signin';
    // The data we are going to send in our request
    let data = {
        userName: document.querySelector('#userName').value,
        password: document.querySelector('#password').value
    }
    const request = new Request(url, {
        method: 'post', 
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    });
    fetch(request)
    .then(function(res) {
        const message = document.querySelector('#message')
        if (res.status !== 200) {
            alert("Login failed! Wrong user credentials, please check.")
        }
    }).catch((error) => {
        console.log(error)
    })
}

