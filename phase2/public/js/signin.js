'use strict';

const signin = document.querySelector('#signin');
signin.addEventListener("click", userLogin);

/* Check whether login info is correct */
function userLogin(e) {
    e.preventDefault();
    if (e.target.id === "login") {
        // The data we are going to send in our request
        let data = {
            userName: document.querySelector('#userNameInput').value,
            password: document.querySelector('#userPasswordInput').value
        }

        const request = new Request("/users/signin", {
            method: 'post', 
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        });
        fetch(request)
        .then(function(res) {
            console.log(res.status)
            if (res.status !== 200) {
                swal("", "Login failed! Wrong user credentials, please check.", "error");
            }
        }).catch((error) => {
            console.log(error)
        })
    }
}

