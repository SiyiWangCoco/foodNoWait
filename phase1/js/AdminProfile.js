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
	var password = $('#password').val();

	$('#result').html(' ');
	
	$('#result').append('<div>'+'<em>Username:</em>'+username+'</div>');
	$('#result').append('<div>'+'<em>Account Type:</em>'+accountType+'</div>');
	$('#result').append('<div>'+'<em>Password:</em>'+password+'</div>');
}

showStorage()