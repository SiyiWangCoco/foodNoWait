"use strict"
const { WaitListSchem } = require('./../models/waitList')
const ReservationSchema = require('./../models/reservations');

const log = console.log;

const getInLine = document.querySelector('#getInLine');
const submitComment = document.querySelector('#leaveComment');
const moreTime = document.querySelector('#moreTime');
const reserTime = document.querySelector('#reserTime');


getInLine.addEventListener('click', waitInLine);
submitComment.addEventListener('submit', addComment);
moreTime.addEventListener('submit', book);
reserTime.addEventListener('click', book);


function waitInLine(e) {
    e.preventDefault();

    if (e.target.innerHTML == 'Get in Line') {
        const smallTable = document.querySelector('#small');
        const mediumTable = document.querySelector('#medium');
        const largeTable = document.querySelector('#large');
        const restId = window.location.pathname;

        if (!smallTable.checked && !mediumTable.checked && !largeTable.checked) {
            alert('Select a table');
        }

        let waitList = new WaitListSchem({
            waitUserid: String,
	        waitTime: 0,
	        waitPhone: Number
        })

        if (smallTable.checked == true) {
            const tableNum = document.querySelector('#smallTableNum');
            let waitNum = parseInt(tableNum.innerHTML);
            waitList.waitTable = 'A';
            waitList.waitAhead = waitNum;
            waitNum++;
            waitList.waitNum = waitNum;
            tableNum.innerHTML = waitNum;
        }

        if (mediumTable.checked == true) {
            const tableNum = document.querySelector('#mediumTableNum');
            let waitNum = parseInt(tableNum.innerHTML);
            waitList.waitTable = 'B';
            waitList.waitAhead = waitNum;
            waitNum++;
            waitList.waitNum = waitNum;
            tableNum.innerHTML = waitNum;
        }

        if (largeTable.checked == true) {
            const tableNum = document.querySelector('#largeTableNum');
            let waitNum = parseInt(tableNum.innerHTML);
            waitList.waitTable = 'C';
            waitList.waitAhead = waitNum;
            waitNum++;
            waitList.waitNum = waitNum;
            tableNum.innerHTML = waitNum;
        }

        const request = new Request(`/${restId}/waittable`, {
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
                alert('Line up succeed!');
            } else {
                res.redirect(`/${restId}`);
                alert('Line up failed.');
            }
        }).catch((error) => {
	        console.log(error)
	    })
    }
}


function addComment(e) {
    e.preventDefault();

    const commentMes = document.querySelector('#message').value;
    const restId = window.location.pathname;

    const comment = {
        commentUserid: String,
		commentInfo: commentMes
    }


    const request = new Request(`/${restId}/comment`, {
        method: 'post', 
        body: JSON.stringify(comment),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    });
    
    fetch(request)
    .then((res) => {
        if(res.status === 200) {
            res.redirect(`/${restId}`);
        } else {
            if (!commentUserid) {
                res.redirect('/signin');
            } else if (!commentInfo) {
                alert('Please enter the comment message.');
            } else{
                res.redirect(`/${restId}`);
                alert('Comment failed.');
            }
        }
    }).catch((error) => {
        console.log(error)
    })

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

    const restId = window.location.pathname;

    if (e.target.id == 'moreTime') {
        const reserText = document.querySelector('#time').value;

        const dateAndTime = reserText.split('-');

        if(dateAndTime[0] == undefined || dateAndTime[1] == undefined) {
            alert('Wrong format');
            return;
        }

        const reservation = new ReservationSchema({
            resvUserid: String,
            resvName: String,
            resvTime: reserText,
            resvPhone: Number
        })

        const request = new Request(`/${restId}/reservation`, {
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
                alert('Reservation complete\nDate: ' + dateAndTime[0] + '\nTime: ' + dateAndTime[1]);
            } else {
                if (!resvUserid) {
                    res.redirect('/signin');
                } else {
                    res.redirect(`/${restId}`);
                    alert('Reservation failed.');
                }
            }
        }).catch((error) => {
            console.log(error)
        })

        return;

    }

    const todayOrTom = document.querySelector('#reserDate');
    let dateSelected;
    const d = new Date();
    const t = new Date(new Date().getTime() + 24 * 60 * 60 * 1000); 

    if (todayOrTom.children[0].checked) {
        dateSelected = (d.getMonth + 1) + '.' + d.getDate;
    } else if (todayOrTom.children[1].checked) {
        dateSelected = (t.getMonth + 1) + '.' + t.getDate;
    } else {
        alert('Select a date');
        return;
    }

    const reservation = new ReservationSchema({
        resvUserid: String,
        resvName: String,
        resvTime: dateSelected  + '-' + e.target.innerHTML,
        resvPhone: Number
    })

    const request = new Request(`/${restId}/reservation`, {
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
            alert('Reservation complete\nDate: ' + dateSelected + '\nTime: ' + e.target.innerHTML);
        } else {
            if (!resvUserid) {
                res.redirect('/signin');
            } else {
                res.redirect(`/${restId}`);
                alert('Reservation failed.');
            }
        }
    }).catch((error) => {
        console.log(error)
    })
}