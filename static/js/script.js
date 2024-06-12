// Show or hide upload button based on user authentication
const loginButton = document.getElementById('loginButton');
const signupButton = document.getElementById('signupButton');
const uploadButton = document.getElementById('uploadButton');
const uploadCard = document.getElementById('uploadCard');

// By default, the user is logged out
//uploadButton.disabled = true;

// Login event listener
loginButton.addEventListener('click', function () {
    uploadButton.disabled = false;
});

// Signup event listener
signupButton.addEventListener('click', function () {
    uploadButton.disabled = false;
});

// Upload button event listener
uploadButton.addEventListener('click', function () {
    const isLoggedIn = uploadButton.disabled === true;
    if (isLoggedIn) {
        alert('You are logged in. Ready to upload!');

    } else {
        alert('Please login to access the upload feature.');
        $('#loginModal').modal('show');
    }
});

// Switch to signup modal
document.getElementById('goToSignup').addEventListener('click', function () {
    $('#loginModal').modal('hide');
    $('#signupModal').modal('show');
});

// Switch to login modal
document.getElementById('goToLogin').addEventListener('click', function () {
    $('#signupModal').modal('hide');
    $('#loginModal').modal('show');
});

// Reset upload button
document.getElementById('resetUpload').addEventListener('click', function () {
    document.getElementById('imageUpload').value = '';
});
function previewImage(event) {
    var reader = new FileReader();
    reader.onload = function() {
        var output = document.getElementById('preview-image');
        output.src = reader.result;
        output.style.display = 'block'; // Show the image
    };
    reader.readAsDataURL(event.target.files[0]);
}
function resetForm() {
    document.getElementById('image-file-input').value = "";
    var previewImage = document.getElementById('preview-image');
    previewImage.src = "#";
    previewImage.style.display = 'none'; // Hide the image
}
  function resetForm() {
    var form = document.querySelector('#upload-card form');
    form.reset();
    var previewImage = document.getElementById('preview-image');
    previewImage.src = "#";
  }


//login modal 

// Function to generate and refresh CAPTCHA
function refreshCaptcha() {
var captcha = generateCaptcha();
document.getElementById('captcha').value = captcha;
}

// Function to generate random CAPTCHA code
function generateCaptcha() {
var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
var string_length = 6;
var captcha = '';
for (var i = 0; i < string_length; i++) {
    var rnum = Math.floor(Math.random() * chars.length);
    captcha += chars.substring(rnum, rnum + 1);
}
return captcha;
}

// Function to validate CAPTCHA
function validateCaptcha(input) {
var captcha = document.getElementById('captcha').value;
return input === captcha;
}

// Form submission event listener
document.getElementById('loginForm').addEventListener('submit', function (event) {
var username = document.getElementById('username').value;
var password = document.getElementById('password').value;
var captchaInput = document.getElementById('captchaInput').value;

// Validate CAPTCHA
if (!validateCaptcha(captchaInput)) {
    alert('CAPTCHA verification failed. Please try again.');
    event.preventDefault(); // Prevent form submission
    return;
}

// Perform login authentication here
// Add your login authentication logic

// For demonstration purposes, alert a success message
alert('Login successful! Username: ' + username + ', Password: ' + password);

// Prevent default form submission
event.preventDefault();
});



// Function to validate email format
function isValidEmail(email) {
// Regular expression for email validation
var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
return emailRegex.test(email);
}

// Function to validate password length
function isValidPassword(password) {
return password.length >= 6; // Minimum length of 6 characters
}

// Function to validate phone number format
function isValidPhoneNumber(phone) {
// Regular expression for phone number validation
var phoneRegex = /^\d{10}$/; // Assuming a 10-digit phone number
return phoneRegex.test(phone);
}

// Form submission event listener
document.getElementById('signupForm').addEventListener('submit', function (event) {
var name = document.getElementById('name').value;
var email = document.getElementById('email2').value;
var password = document.getElementById('password2').value;
var confirmPassword = document.getElementById('confirm-password').value;
var dob = document.getElementById('dob').value;
var phone = document.getElementById('phone').value;
var gender = document.getElementById('gender').value;

var isValid = true;

// Validate name
if (name.trim() === '') {
    document.getElementById('name-error').innerText = 'Please enter your name';
    isValid = false;
} else {
    document.getElementById('name-error').innerText = '';
}

// Validate email
if (!isValidEmail(email)) {
    document.getElementById('email-error2').innerText = 'Please enter a valid email';
    isValid = false;
} else {
    document.getElementById('email-error2').innerText = '';
}

// Validate password
if (!isValidPassword(password)) {
    document.getElementById('password-error2').innerText = 'Password must be at least 6 characters long';
    isValid = false;
} else {
    document.getElementById('password-error2').innerText = '';
}

// Validate confirm password
if (password !== confirmPassword) {
    document.getElementById('confirm-password-error').innerText = 'Passwords do not match';
    isValid = false;
} else {
    document.getElementById('confirm-password-error').innerText = '';
}

// Validate date of birth
if (dob.trim() === '') {
    document.getElementById('dob-error').innerText = 'Please enter your date of birth';
    isValid = false;
} else {
    document.getElementById('dob-error').innerText = '';
}

// Validate phone number
if (!isValidPhoneNumber(phone)) {
    document.getElementById('phone-error').innerText = 'Please enter a valid phone number';
    isValid = false;
} else {
    document.getElementById('phone-error').innerText = '';
}

// Prevent form submission if validation fails
if (!isValid) {
    event.preventDefault();
}
});

// Function to validate email format
function isValidEmail(email) {
  // Regular expression for email validation
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Form submission event listener
document.getElementById('loginForm').addEventListener('submit', function (event) {
  var email = document.getElementById('email').value;

  // Validate email
  if (!isValidEmail(email)) {
      // Display error message
      document.getElementById('email').classList.add('is-invalid');
      event.preventDefault(); // Prevent form submission
  } else {
      // Remove error message
      document.getElementById('email').classList.remove('is-invalid');
  }
});

/*FORGOT PASSWORD VALIDATION*/
var storedOTP;
function sendOTP() {
    // Generate a random OTP (for demonstration purposes)
    storedOTP = Math.floor(100000 + Math.random() * 900000);
  
    // Change this to your email sending function
    Email.send({
        Host : "smtp.elasticemail.com",
        Username : "swastikathakur2345@gmail.com",
        Password : "EDD596B2EBB19FC54C7F960BF292A051508F",
        To : document.getElementById('email').value,
        From : "swastikathakur2345@gmail.com",
        Subject : "OTP for Password Reset",
        Body : "Your OTP is: " + storedOTP,
    }).then(
      function(response){
        if(response === 'OK'){
            // If email sent successfully, display the OTP input field
            document.querySelector('.otpverify').style.display = 'flex';
            alert("OTP Sent Successfully to " + document.getElementById('email').value);
        }
        else{
            alert("Error sending OTP: "+ response);
        }
      }
    );
  }
  
function verifyOTP() {
    var enteredOTP = document.getElementById('otp_inp').value;
    // Here you would compare the entered OTP with the one sent via email
    // For demonstration purposes, we're just alerting whether it's correct or not
    if (enteredOTP === storedOTP.toString()) {
        alert("OTP Verified Successfully!");
        // Proceed with password reset or whatever action is needed
        document.querySelector('.new-password').style.display = "block";
        document.getElementById('otp-btn').style.display = "none";
    } else {
        alert("Invalid OTP. Please try again.");
    }
    
  }

function changePassword() {
    var newPassword = document.getElementById("newPassword").value;
    var confirmPassword = document.getElementById("confirmPassword").value;

    if (newPassword !== confirmPassword) {
        alert("Passwords do not match. Please try again.");
        return;
    }

    // Your code to change password goes here
    alert("Password changed successfully.");
}


function updateUserInitial(initial) {
    const userInitial = document.querySelector(`[data-initial="${initial}"]`);
    if (userInitial) {
        userInitial.classList.add("active");
    }
}

document.addEventListener('DOMContentLoaded', function() {
    var uploadCard = document.getElementById('upload-card');

    function disableScroll() {
        document.body.classList.add('no-scroll');
    }

    function enableScroll() {
        document.body.classList.remove('no-scroll');
    }

    if (uploadCard) {
        uploadCard.addEventListener('mouseenter', disableScroll);
        uploadCard.addEventListener('mouseleave', enableScroll);
    }
});