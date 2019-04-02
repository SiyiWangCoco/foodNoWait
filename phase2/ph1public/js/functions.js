'use strict';

/* Get the current file name to see which page I am at. */
const currentPath = window.location.pathname;
const fileName = currentPath.substring(currentPath.lastIndexOf('/') + 1);

/* The global variable about accounts (which should be done with server) */
/* The following information should be retrieved from server */
const customers = [];
const customer = { 
	id: 1,
	username: "user",
	password: "user"
};
customers.push(customer);

const restaurantAccounts = [];
const restaurantAccount1 = {
	id: 1,
	username: null,
	password: null,
	name: 'JaBistro',
	address: '222 Richmod St W.',
	src: 'picture/JaBistro.png',
	phone: "6477480222",
	rank: 1,
	chineseFood: false,
	seafoodSteak: true,
	dessert: false,
	availabilty: true,
	numOfParties: 0
};

const restaurantAccount2 = {
	id: 2,
	username: "user2",
	password: "user2",
	name: 'SiChuan Ren HotPot',
	address: '460 Dundas St W.',
	src: 'picture/SichuanRenHotPot.png',
	phone: "6473418080",
	rank: 2,
	chineseFood: true,
	seafoodSteak: false,
	dessert: false,
	availabilty: false,
	numOfParties: 4
};

const restaurantAccount3 = {
	id: 3,
	username: null,
	password: null,
	name: 'Millie Creperie',
	address: '161 Baldwin Street',
	src: 'picture/MillieCreperie.jpg',
	phone: "4169771922",
	rank: 3,
	chineseFood: false,
	seafoodSteak: false,
	dessert: true,
	availabilty: true,
	numOfParties: 0
};

const restaurantAccount4 = {
	id: 4,
	username: null,
	password: null,
	name: 'Buca',
	address: '604 King Street W',
	src: 'picture/Buca.jpg',
	phone: "4168651600",
	rank: 4,
	chineseFood: false,
	seafoodSteak: true,
	dessert: false,
	availabilty: true,
	numOfParties: 0
};

const restaurantAccount5 = {
	id: 5,
	username: null,
	password: null,
	name: 'Red Robster',
	address: '20 Dundas Street West',
	src: 'picture/RedRobster.jpg',
	phone: "4163488938",
	rank: 5,
	chineseFood: false,
	seafoodSteak: true,
	dessert: false,
	availabilty: false,
	numOfParties: 1
}

restaurantAccounts.push(restaurantAccount1, restaurantAccount2, restaurantAccount3,
	restaurantAccount4, restaurantAccount5);



if (fileName == "Buca.html" || fileName == "JaBistro.html" || fileName == "MillieCreperie.html"
	|| fileName == "RedRobster.html" || fileName == "SichuanRenHotPot.html") {
	loadHeaderUser();
	const getInLine = document.querySelector('#getInLine');
	const submitComment = document.querySelector('#leaveComment');
	const reserTime = document.querySelector('#reserTime');
	getInLine.addEventListener('click', waitInLine);
	submitComment.addEventListener('click', addComment);
	reserTime.addEventListener('click', book);
}

if (fileName == "userHomePage.html") {
	loadPopular(true);
	loadHeaderUser();
	const searchBar = document.querySelector(".searchBar");
	searchBar.addEventListener("click", homepageSearch);
}

if (fileName == "AdminProfile.html") {
	loadHeaderAdmin(); 
}

if (fileName == "CustomerProfile.html") {
	loadHeaderUser();
}

if (fileName == "RestaurantProfile.html") {
	loadHeaderRestaurant();
}

if (fileName == "UserInfoPage.html") {
	loadHeaderUser();
}

// homepage
if (fileName == "index.html") {
	loadPopular(true);
	loadHeaderDefault();
	const searchBar = document.querySelector(".searchBar");
	searchBar.addEventListener("click", homepageSearch);
}

if (fileName == "searchPage.html") {
	const searchClass = document.querySelector("#searchClass");
	searchClass.addEventListener("click", loadByClass);
	const searchBar = document.querySelector(".searchBar");
	searchBar.addEventListener("click", search);
	loadHeaderUser();
}

if (fileName == "signin.html") {
	const login = document.querySelector('.login');
	login.addEventListener("click", checkLogin);
	loadHeaderDefault();
}

if (fileName == "restaurantUserHomePage.html") {
	loadHeaderRestaurant();

	const small = document.querySelector("#restaurantUserSmall");
	const medium = document.querySelector("#restaurantUserMedium");
	const large = document.querySelector("#restaurantUserLarge");
	small.addEventListener("click", deductNumber);
	medium.addEventListener("click", deductNumber);
	large.addEventListener("click", deductNumber);

	const smallPlus = document.querySelector("#restaurantUserSmallPlus");
	const mediumPlus = document.querySelector("#restaurantUserMediumPlus");
	const largePlus = document.querySelector("#restaurantUserLargePlus");
	smallPlus.addEventListener("click", addNumber);
	mediumPlus.addEventListener("click", addNumber);
	largePlus.addEventListener("click", addNumber);

	const currentReservation = document.querySelector("#currentReservation");
	currentReservation.addEventListener('click', removeReservation);

	const timeSlot = document.querySelectorAll(".timeSlot");
	for (let i = 0; i < timeSlot.length; i++) {
		timeSlot[i].addEventListener("click", addReservation);
	}
}

if (fileName == 'adminHomePage.html') {
	loadHeaderAdmin();
	const restaurantLists = document.querySelector("#adminRestaurantInfomaton");
	restaurantLists.addEventListener('click', removeRestaurantAdmin);
}

function linkToRestaurant(e) {
	e.preventDefault();
	if (e.target.innerHTML === "See more..." || e.target.type == "image") {
		if (fileName === "index.html") {
			alert("Please sign in first.");
			window.location.href = "signin.html";
		} else if (e.target.innerHTML === "See more...") {
			window.location.href = "searchPage.html";
		} else if (e.target.type === "image") {
			if (e.target.nextElementSibling.firstElementChild.innerHTML.includes("JaBistro")) {
				window.location.href = "JaBistro.html";
			} else if (e.target.nextElementSibling.firstElementChild.innerHTML.includes("SiChuan Ren HotPot")) {
				window.location.href = "SichuanRenHotPot.html";
			} else if (e.target.nextElementSibling.firstElementChild.innerHTML.includes("Millie Creperie")) {
				window.location.href = "MillieCreperie.html";
			} else if (e.target.nextElementSibling.firstElementChild.innerHTML.includes("Buca")) {
				window.location.href = "Buca.html";
			} else if (e.target.nextElementSibling.firstElementChild.innerHTML.includes("Red Robster")) {
				window.location.href = "RedRobster.html";
			}
		}
	}
}

function homepageSearch(e) {
	e.preventDefault();
	if (e.target.className == "searchSubmit") {
		if (fileName === "index.html") {
			alert("Please sign in first.");
			window.location.href = "signin.html";
		} else {
			window.location.href = "searchPage.html";
		}
	}
}

/* Add new reservation */
function addReservation(e) {
	e.preventDefault();	
	const time = e.target.innerHTML;
	const name = document.querySelector("#reservationName").value;
	const phone = document.querySelector("#reservationPhone").value;
	const reservation = document.createElement("div");
	reservation.className = "res";	
	const reservationInfo = document.createElement("p");
	const text = document.createTextNode(time + ": " + name + " Phone Number: " + phone + " ");
	const span = document.createElement("span");
	span.appendChild(text);
	reservationInfo.appendChild(span);
	reservation.appendChild(reservationInfo);
	const complete = document.createElement("button");
	complete.appendChild(document.createTextNode(" Complete "));
	complete.className = "complete";
	const cancel = document.createElement("button")
	cancel.appendChild(document.createTextNode(" Cancel "));
	cancel.className = "Cancel";
	reservationInfo.appendChild(complete);
	reservationInfo.appendChild(cancel);
	document.querySelector("#currentReservation").appendChild(reservation);
}

/* Add lining number */
function addNumber(e) {
	e.preventDefault();	
	if (e.target.id === "restaurantUserSmallPlus") {
		document.querySelector("#restaurantUserSmallNumber").innerHTML = parseInt(document.querySelector("#restaurantUserSmallNumber").innerHTML) + 1;
	} else if (e.target.id === "restaurantUserMediumPlus") {
		document.querySelector("#restaurantUserMediumNumber").innerHTML = parseInt(document.querySelector("#restaurantUserMediumNumber").innerHTML) + 1;
	} else if (e.target.id === "restaurantUserLargePlus") {
		document.querySelector("#restaurantUserLargeNumber").innerHTML = parseInt(document.querySelector("#restaurantUserLargeNumber").innerHTML) + 1;
	}
}

/* Deduct lining number */
function deductNumber(e) {
	e.preventDefault();	
	if (e.target.id === "restaurantUserSmall" || e.target.id === "smallNumber") {
		if (parseInt(document.querySelector("#restaurantUserSmallNumber").innerHTML) >= 1) {
			document.querySelector("#restaurantUserSmallNumber").innerHTML = parseInt(document.querySelector("#restaurantUserSmallNumber").innerHTML) - 1;
			document.querySelector("#smallNumber").innerHTML++;
		}
	} else if (e.target.id === "restaurantUserMedium" || e.target.id === "mediumNumber") {
		if (parseInt(document.querySelector("#restaurantUserMediumNumber").innerHTML) >= 1) {
			document.querySelector("#restaurantUserMediumNumber").innerHTML = parseInt(document.querySelector("#restaurantUserMediumNumber").innerHTML) - 1;
			document.querySelector("#mediumNumber").innerHTML++;
		}
	} else if (e.target.id === "restaurantUserLarge" || e.target.id === "largeNumber") {
		if (parseInt(document.querySelector("#restaurantUserLargeNumber").innerHTML) >= 1) {
			document.querySelector("#restaurantUserLargeNumber").innerHTML = parseInt(document.querySelector("#restaurantUserLargeNumber").innerHTML) - 1;
			document.querySelector("#largeNumber").innerHTML++;
		}
	}
}

/* Check whether login info is correct */
function checkLogin(e) {
	e.preventDefault();	
	if (e.target.className === "login") {
		if (document.querySelector("#userName").value === customers[0].username &&
			document.querySelector("#userPassword").value === customers[0].password) {
			window.location.href = "userHomePage.html";
		} else if (document.querySelector("#userName").value === restaurantAccounts[1].username &&
			document.querySelector("#userPassword").value === restaurantAccounts[1].password) {
			window.location.href = "restaurantUserHomePage.html";
		} else if (document.querySelector("#userName").value === "admin" &&
			document.querySelector("#userPassword").value === "admin") {
			window.location.href = "adminHomePage.html";
		} else {
			alert("Account not exists or password is incorrect.");
		}
	}
}

/* Search restaurant by name */
function search(e) {
	e.preventDefault();	
	if (e.target.className === "searchSubmit") {
		const text = e.target.previousElementSibling.value;
		if (text != '') { 
			const restaurants = restaurantAccounts.filter((restaurant) => restaurant.name.toLowerCase().includes(text.toLowerCase()));
			emptyList();
			if (restaurants.length >= 1) {
				loadRestaurants(restaurants);
			}
		}
	}
}

function loadHeaderDefault() {

	const header = document.createElement("div")
	header.id = "header";

	const logo = document.createElement("div");
	logo.id = "logo";
	const button = document.createElement("button");
	const logoImg = document.createElement("img");
	logoImg.className = "FoodNoWaitLogo";
	logoImg.src = "picture/piglogo.png";
	button.appendChild(logoImg);
	logo.appendChild(button);
	const iconLink = document.createElement("a");
	iconLink.href = "index.html";
	iconLink.innerHTML = " FoodNoWait";
	logo.appendChild(iconLink);

	const buttonMenu = document.createElement("div");
	buttonMenu.className = "buttonMenu";
	const homepageLink = document.createElement("a");
	homepageLink.href = "index.html";
	homepageLink.innerHTML = " HOMEPAGE ";
	const loginLink = document.createElement("a");
	loginLink.href = "signin.html";
	loginLink.innerHTML = " LOGIN ";
	const loginImg = document.createElement("img");
	loginImg.className = "loginButton";
	loginImg.src = "picture/headeruserbutton.png";
	loginLink.appendChild(loginImg);
	buttonMenu.appendChild(homepageLink);
	buttonMenu.appendChild(loginLink);

	header.appendChild(logo);
	header.appendChild(buttonMenu);
	document.body.insertBefore(header, document.body.firstElementChild);
}

function loadHeaderRestaurant() {
	const header = document.createElement("div")
	header.id = "header";

	const logo = document.createElement("div");
	logo.id = "logo";
	const button = document.createElement("button");
	const logoImg = document.createElement("img");
	logoImg.className = "FoodNoWaitLogo";
	logoImg.src = "picture/piglogo.png";
	button.appendChild(logoImg);
	logo.appendChild(button);
	const iconLink = document.createElement("a");
	iconLink.href = "restaurantUserHomePage.html";
	iconLink.innerHTML = " FoodNoWait";
	logo.appendChild(iconLink);

	const buttonMenu = document.createElement("div");
	buttonMenu.className = "buttonMenu";
	const homepageLink = document.createElement("a");
	homepageLink.href = "restaurantUserHomePage.html";
	homepageLink.innerHTML = " HOMEPAGE ";
	const user = document.createElement("a");
	user.appendChild(document.createTextNode("user2"));
	user.href = "RestaurantProfile.html";
	buttonMenu.appendChild(homepageLink);
	buttonMenu.appendChild(user);
	header.appendChild(logo);
	header.appendChild(buttonMenu);
	const logout = document.createElement("a");
	logout.appendChild(document.createTextNode("logout"));
	logout.href = "index.html"
	buttonMenu.appendChild(logout);
	header.appendChild(logo);
	header.appendChild(buttonMenu);
	document.body.insertBefore(header, document.body.firstElementChild);
}

function loadHeaderUser() {
	const header = document.createElement("div")
	header.id = "header";

	const logo = document.createElement("div");
	logo.id = "logo";
	const button = document.createElement("button");
	const logoImg = document.createElement("img");
	logoImg.className = "FoodNoWaitLogo";
	logoImg.src = "picture/piglogo.png";
	button.appendChild(logoImg);
	logo.appendChild(button);
	const iconLink = document.createElement("a");
	iconLink.href = "userHomePage.html";
	iconLink.innerHTML = " FoodNoWait";
	logo.appendChild(iconLink);

	const buttonMenu = document.createElement("div");
	buttonMenu.className = "buttonMenu";
	const homepageLink = document.createElement("a");
	homepageLink.href = "userHomePage.html";
	homepageLink.innerHTML = " HOMEPAGE ";
	const user = document.createElement("a");
	user.appendChild(document.createTextNode("user"));
	user.href = "CustomerProfile.html";
	header.appendChild(logo);
	header.appendChild(buttonMenu);


	buttonMenu.appendChild(homepageLink);
	buttonMenu.appendChild(user);
	const line = document.createElement("a");
	line.appendChild(document.createTextNode("Lining/Reservation"));
	line.href = "UserInfoPage.html";
	const logout = document.createElement("a");
	logout.appendChild(document.createTextNode("logout"));
	logout.href = "index.html"
	buttonMenu.appendChild(line);
	buttonMenu.appendChild(logout);
	header.appendChild(logo);
	header.appendChild(buttonMenu);
	document.body.insertBefore(header, document.body.firstElementChild);
}

function loadHeaderAdmin() {
	const header = document.createElement("div")
	header.id = "header";

	const logo = document.createElement("div");
	logo.id = "logo";
	const button = document.createElement("button");
	const logoImg = document.createElement("img");
	logoImg.className = "FoodNoWaitLogo";
	logoImg.src = "picture/piglogo.png";
	button.appendChild(logoImg);
	logo.appendChild(button);
	const iconLink = document.createElement("a");
	iconLink.href = "adminHomePage.html";
	iconLink.innerHTML = " FoodNoWait";
	logo.appendChild(iconLink);

	const buttonMenu = document.createElement("div");
	buttonMenu.className = "buttonMenu";
	const homepageLink = document.createElement("a");
	homepageLink.href = "adminHomePage.html";
	homepageLink.innerHTML = " HOMEPAGE ";
	const admin = document.createElement("a");
	admin.appendChild(document.createTextNode("admin"));
	admin.href = "AdminProfile.html";
	buttonMenu.appendChild(homepageLink);
	buttonMenu.appendChild(admin);
	const logout = document.createElement("a");
	logout.appendChild(document.createTextNode("logout"));
	logout.href = "index.html"
	buttonMenu.appendChild(logout);
	header.appendChild(logo);
	header.appendChild(buttonMenu);
	document.body.insertBefore(header, document.body.firstElementChild);
}

function loadByClass(e) {
	e.preventDefault();	
	if (e.target.innerHTML === "Popular Restaurant") {
		emptyList();
		loadPopular(false);
	} else if (e.target.innerHTML === "Seat Available") {
		emptyList();
		loadSeat();
	} else if (e.target.innerHTML === "Chinese Food") {
		emptyList();
		loadChineseFood();
	} else if (e.target.innerHTML === "Seafood &amp; Steak") {
		emptyList();
		loadSeafoodSteak();
	} else if (e.target.innerHTML === "Dessert") {
		emptyList();
		loadDessert();
	}
}

/* Empty restaurant list */
function emptyList() {
	const restaurants = document.querySelector("#searchList").querySelectorAll(".restaurant");
	for (let i = 0; i < restaurants.length; i++) {
		document.querySelector("#searchList").firstElementChild.firstElementChild.nextElementSibling.removeChild(restaurants[i]);
	}
	if (restaurants.length >= 1) {
		document.querySelector("#searchList").firstElementChild.removeChild(document.querySelector("#searchList").firstElementChild.firstElementChild.nextElementSibling);
	}
}


/* Load restaurants that have seat available */
function loadSeat() {
	// Get restaurants that have seat available from server
	// code below requires server call
	const restaurants = restaurantAccounts.filter((restaurant) => restaurant.availabilty === true);
	loadRestaurants(restaurants, false);
}

/* Load top 5 most popular restaurants. */
function loadPopular(seeMore) {
	// Get restaurants that are most popular from server
	// code below requires server call
	const restaurants = restaurantAccounts.slice(0, 5);
	loadRestaurants(restaurants, seeMore);
}

/* Load restaurants that have steak and seafood. */
function loadSeafoodSteak() {
	// Get restaurants that have steak and seafood from server
	// code below requires server call
	const restaurants = restaurantAccounts.filter((restaurant) => restaurant.seafoodSteak === true);
	loadRestaurants(restaurants, false);
}

/* Load restaurants that have Chinese food. */
function loadChineseFood() {
	// Get restaurants that have Chinese food from server
	// code below requires server call
	const restaurants = restaurantAccounts.filter((restaurant) => restaurant.chineseFood === true);
	loadRestaurants(restaurants, false);
}

/* Load restaurants that have desserts. */
function loadDessert() {
	// Get restaurants that have desserts from server
	// code below requires server call
	const restaurants = restaurantAccounts.filter((restaurant) => restaurant.dessert === true);
	loadRestaurants(restaurants, false);
}



/* Load all restaurants given input */
function loadRestaurants(restaurants, seeMore) {
	const restaurantList = document.querySelector('.restaurantList');
	const restaurantsElement = document.createElement('div');
	for (let i = 0; i < restaurants.length; i++) {
		const restaurant = restaurants[i];
		const restaurantElement = document.createElement('div');
		restaurantElement.className = 'restaurant';

		const picture = document.createElement('input');
		picture.type = 'image';
		picture.src = restaurant.src;
		restaurantElement.appendChild(picture);

		const restaurantInfo = document.createElement('div');
		restaurantInfo.className = 'restaurantInfo';
		const text1 = document.createElement('p');
		text1.innerHTML = restaurant.name + ' ';
		const text1Span = document.createElement('span');
		if (restaurant.numOfParties > 1) {
			text1Span.innerHTML = restaurant.numOfParties + ' parties ahead';
		} else if (restaurant.numOfParties == 1) {
			text1Span.innerHTML = restaurant.numOfParties + ' party ahead';
		} else {
			text1Span.innerHTML = 'seating available';
		}
		text1.appendChild(text1Span);
		const text2 = document.createElement('p');
		text2.innerHTML = restaurant.address;
		restaurantInfo.appendChild(text1);
		restaurantInfo.appendChild(text2);
		restaurantElement.appendChild(restaurantInfo);

		restaurantsElement.appendChild(restaurantElement);
	}

	restaurantsElement.className = 'restaurants';
	restaurantList.appendChild(restaurantsElement);
	if (seeMore === true) {
		const link = document.createElement('a');
		link.href = 'searchPage.html';
		link.innerHTML = 'See more...';
		restaurantsElement.appendChild(link);
	}

	const restaurants_ = document.querySelector(".restaurants");
	if (restaurants_ != null) {
		restaurants_.addEventListener("click", linkToRestaurant);
	}

}

function removeRestaurantAdmin(e){
	e.preventDefault();	
	if (e.target.classList.contains('remove')) {	
		const restaurantRemove = e.target.parentElement.firstElementChild.firstElementChild.innerHTML;
		const allRestaurant = document.querySelectorAll(".restaurants");
		if (confirm("Sure to remove the restaurant? (Please remove the restaurant only if it is closed forever!)")) {
  			for (var i = 0; i<allRestaurant.length; i++) {
				if (allRestaurant[i].firstElementChild.firstElementChild.firstElementChild.innerHTML == restaurantRemove) {
					allRestaurant[i].parentElement.removeChild(allRestaurant[i]);
				}
			}
		} else {
  			return;
		}	
	}
}

function removeReservation(e){
	e.preventDefault();	
	if ((e.target.classList.contains('complete')) || (e.target.classList.contains('Cancel'))) {	
		const curReservation = e.target.parentElement.firstElementChild.innerHTML;
		const allReservation = document.querySelectorAll(".res");
  		for (var i = 0; i<allReservation.length; i++) {
			if (allReservation[i].firstElementChild.firstElementChild.innerHTML == curReservation) {
				allReservation[i].parentElement.removeChild(allReservation[i]);
			}
		}
	}
}


function waitInLine(e) {
    e.preventDefault();

    if (e.target.innerHTML == 'Get in Line') {
        const smallTable = document.querySelector('#small');
        const mediumTable = document.querySelector('#medium');
        const largeTable = document.querySelector('#large');
        if (smallTable.checked == false && mediumTable.checked == false && largeTable.checked == false) {
            alert("Select a table!");
            return;
        }

        if (smallTable.checked == true) {
            const tableNum = document.querySelector('#smallTableNum');
            let waitNum = parseInt(tableNum.innerHTML);
            waitNum++;
            tableNum.innerHTML = waitNum;
        }

        if (mediumTable.checked == true) {
            const tableNum = document.querySelector('#mediumTableNum');
            let waitNum = parseInt(tableNum.innerHTML);
            waitNum++;
            tableNum.innerHTML = waitNum;
        }

        if (largeTable.checked == true) {
            const tableNum = document.querySelector('#largeTableNum');
            let waitNum = parseInt(tableNum.innerHTML);
            waitNum++;
            tableNum.innerHTML = waitNum;
        }
        alert("Lining succeeded!");
    }
}


function addComment(e) {
    e.preventDefault();

    if (e.target.id === "submitButton") {
	    const commentMes = document.querySelector('#message').value;

	    const history = document.querySelector('#commentsHis');
	    const newComment = document.createElement('div');
	    newComment.className = 'userComment';
	    const commentUser = document.createElement('span');
	    commentUser.className = 'user';
	    commentUser.appendChild(document.createTextNode('User: '));
	    const commentText = document.createElement('span');
	    commentText.className = 'commentText';
	    commentText.appendChild(document.createTextNode(commentMes));

	    newComment.appendChild(commentUser);
	    newComment.appendChild(commentText);
	    history.appendChild(newComment);
	}
}


function book(e) {
    e.preventDefault();
    let date;
    if (document.querySelector("#today").checked) {
    	date = "today";
    } else if (document.querySelector("#tomorrow").checked) {
    	date = "tomorrow";
    } else {
    	alert("Select a date first");
    	return;
    }
    alert(date + " " + e.target.innerHTML + "'s reservation succeeded")
}