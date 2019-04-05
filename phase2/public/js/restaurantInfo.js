"use strict"

const getInLine = document.querySelector('#getInLine');
const submitComment = document.querySelector('#leaveComment');
const reserTime = document.querySelector('#reserTime');

getInLine.addEventListener('click', waitInLine);
submitComment.addEventListener('click', addComment);
reserTime.addEventListener('click', book);

function waitInLine(e) {
    e.preventDefault();

    if (e.target.innerHTML == 'Get in Line') {
        const smallTable = document.querySelector('#small');
        const mediumTable = document.querySelector('#medium');
        const largeTable = document.querySelector('#large');
        const pathname = window.location.pathname.split("/")
        const restId = pathname[pathname.length - 1];
        let waitList = {};

        waitList.waitRestaurantName = document.querySelector("#resName").innerText


        if (!smallTable.checked && !mediumTable.checked && !largeTable.checked) {
            swal("", "Please select a table.", "error");
        }

        if (smallTable.checked == true) {
            const tableNum = document.querySelector('#smallTableNum');
            let waitNum = parseInt(tableNum.innerHTML);
            waitList.waitTable = "A";
            waitList.waitAhead = parseInt(tableNum.innerHTML) + 1;
            tableNum.innerHTML = waitNum + 1;
        }

        if (mediumTable.checked == true) {
            const tableNum = document.querySelector('#mediumTableNum');
            let waitNum = parseInt(tableNum.innerHTML);
            waitList.waitTable = "B";
            waitList.waitAhead = parseInt(tableNum.innerHTML) + 1;
            tableNum.innerHTML = waitNum + 1;
        }

        if (largeTable.checked == true) {
            const tableNum = document.querySelector('#largeTableNum');
            let waitNum = parseInt(tableNum.innerHTML);
            waitList.waitTable = "C";
            waitList.waitAhead = parseInt(tableNum.innerHTML) + 1;
            tableNum.innerHTML = waitNum + 1;
        }

        const request = new Request(`/restaurant/${restId}/waittable`, {
	        method: 'post', 
	        body: JSON.stringify(waitList),
	        headers: {
	            'Accept': 'application/json, text/plain, */*',
	            'Content-Type': 'application/json'
	        },
        });
        
        fetch(request)
        .then((res) => {
            if(res.status === 200) {
                swal("", "Line up succeed!", "success");
            } else {
                swal("", "Line up failed.", "error");
            }
        }).catch((error) => {
	        console.log(error)
	    })
    }
}


function addComment(e) {
    e.preventDefault();

    if (e.target.id === "submitButton") {

        const commentMes = document.querySelector('#message').value;
        if (!commentMes) {
            swal("", "Please enter the comment message.", "error");
            return;
        }
        const pathname = window.location.pathname.split("/")
        const restId = pathname[pathname.length - 1];

        const comment = {
    		commentInfo: commentMes
        }

        const request = new Request(`/restaurant/${restId}/comment`, {
            method: 'post', 
            body: JSON.stringify(comment),
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        });
        
        fetch(request)
        .then((res) => {
            if (res.status === 200) {
                window.location.href = window.location.href;
            } else {
                if(res.status !== 200) {
                    swal("", "Failed to comment.", "error");
                }
            }
        }).catch((error) => {
            console.log(error)
        })
    }
    // const history = document.querySelector('#commentsHis');
    // const newComment = document.createElement('div');
    // newComment.className = 'userComment';
    // const commentUser = document.createElement('span');
    // commentUser.className = 'user';
    // commentUser.appendChild(document.createTextNode('User1: '));
    // const commentText = document.createElement('span');
    // commentText.className = 'commentText';
    // commentText.appendChild(document.createTextNode(commentMes));

    // newComment.appendChild(commentUser);
    // newComment.appendChild(commentText);
    // history.appendChild(newComment);
}


function book(e) {
    e.preventDefault();

    if (e.target.className === "time") {

        const pathname = window.location.pathname.split("/")
        const restId = pathname[pathname.length - 1];
        const peopleSelect = document.querySelector("#peopleSelect");
        let peopleNum = 1;
        if (peopleSelect.options[peopleSelect.selectedIndex]) {
            peopleNum = peopleSelect.options[peopleSelect.selectedIndex].value;
        }
        const date = document.querySelector("#date").value;
        const time = e.target.innerHTML

        const reservation = {
            resvTime: time,
            resvDate: date,
            resvPeople: peopleNum,
            resvRestaurantName: document.querySelector("#resName").innerText
        }

        const request = new Request(`/restaurant/${restId}/reservation`, {
            method: 'post', 
            body: JSON.stringify(reservation),
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        });
        
        fetch(request)
        .then((res) => {
            if(res.status === 200) {
                swal("", 'Reservation complete\nDate: ' + date + '\nTime: ' + time + '\nPeople: ' + peopleNum, "success");
            } else {
                swal("", "Reservation failed.", "error");
            }
        }).catch((error) => {
            console.log(error)
        })
    }
}