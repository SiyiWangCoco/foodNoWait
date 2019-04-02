var button = document.getElementById("button")
var result = document.getElementById("result")

button.onclick = submit
function submit() {
	var oldPassword = document.getElementById('oldPassword').value;
	var newPassword = document.getElementById('newPassword').value;
	var confirmPassword = document.getElementById('confirmPassword').value;
    var record = $('#password').val();

    if (oldPassword !== '' && newPassword !== '' && confirmPassword !== '') {
        if (oldPassword !== record || newPassword !== confirmPassword) {
            alert('Cannot change password! Old password does not match record or new password does not match the confirm password.')
        } else {
			$('#password').val(newPassword);
        }
    }
	
	showStorage();
}

function showStorage() {
	var username = $('#username').val();
	var accountType = $('#accountType').val();
	var firstName = $('#firstName').val();
	var lastName = $('#lastName').val();
	var email = $('#email').val();
	var gender = $('#gender').val();
	var age = $('#age').val();
	var phone = $('#phone').val();
	var description = $('#description').val();
	var password = $('#password').val();

	$('#result').html(' ');
	
	$('#result').append('<div>'+'<em>Username:</em>'+username+'</div>');
	$('#result').append('<div>'+'<em>Account Type:</em>'+accountType+'</div>');
	$('#result').append('<div>'+'<em>First Name:</em>'+firstName+'</div>');
	$('#result').append('<div>'+'<em>Last Name:</em>'+lastName+'</div>');
	$('#result').append('<div>'+'<em>Email:</em>'+email+'</div>');
	$('#result').append('<div>'+'<em>Gender:</em>'+gender+'</div>');
	$('#result').append('<div>'+'<em>Age:</em>'+age+'</div>');
	$('#result').append('<div>'+'<em>Phone:</em>'+phone+'</div>');
	$('#result').append('<div>'+'<em>Description:</em>'+description+'</div>');
	$('#result').append('<div>'+'<em>Password:</em>'+password+'</div>');
}

showStorage()

// upload profile picture
var preview = document.querySelector('#preview');
var eleFile = document.querySelector('#file');

eleFile.addEventListener('change', function() {
	var file = this.files[0];
	           
	// identify it is of type image                
	if (file.type.indexOf("image") == 0) {
		var reader = new FileReader();
		reader.readAsDataURL(file);           
		reader.onload = function(e) {
			var newUrl = this.result;
			preview.style.backgroundImage = 'url(' + newUrl + ')';
		};
	}
});