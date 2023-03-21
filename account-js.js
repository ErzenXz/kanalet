var accountSecurityAlerts; null === localStorage.getItem("account-secure.user") ? localStorage.setItem("account-secure.user", 0) : accountSecurityAlerts = localStorage.getItem("account-secure.user");
var vStatus = !1, uStatus = !1;
firebase.auth().onAuthStateChanged(function (e) { var t, n; e ? (document.getElementById("user_div").style.display = "block", document.getElementById("login_div").style.display = "none", uStatus = !0, null != (e = firebase.auth().currentUser) && (firebase.auth().useDeviceLanguage(), t = e.email, n = e.emailVerified, t.toUpperCase(), document.getElementById("user_para").innerHTML = t, localStorage.setItem("uName", t), localStorage.setItem("uID", e.uid), n ? (document.getElementById("verify_btn").style.display = "none", vStatus = !0) : (document.getElementById("tvfalas").style.display = "none", vStatus = !1, send_verification()))) : (document.getElementById("user_div").style.display = "none", document.getElementById("login_div").style.display = "block", document.getElementById("titles").innerHTML = "Login", uStatus = !1) });

// Function to login
function login() {
    var e = (new Date).getTime(); localStorage.setItem("date", e); Swal.fire({ title: "Login in!", html: "This wont take a lot of time!", timer: 1000, timerProgressBar: true, onBeforeOpen: () => { Swal.showLoading(); timerInterval = setInterval(() => { Swal.getContent().querySelector("b").textContent = Swal.getTimerLeft(); }, 100); }, onClose: () => { clearInterval(timerInterval); } }).then(result => { if (result.dismiss === Swal.DismissReason.timer) { } }); var t = document.getElementById("email_field").value, a = document.getElementById("password_field").value; firebase.auth().signInWithEmailAndPassword(t, a).catch(function (e) {
        e.code, e.message;
        Swal.fire({ icon: "error", title: "Oops...", text: "Error : " + error.message });
        accountSecurityAlerts++, localStorage.setItem("account-secure.user", accountSecurityAlerts)
    })
}
function logout() { firebase.auth().signOut(); Swal.fire("Logged out successfuly"); }

// function to create a Account
function create_account() {
    // shows loading
    let timerInterval;
    Swal.fire({
        title: "Creating an account!",
        html: "This wont take a lot of time!.",
        timer: 1000,
        timerProgressBar: true,
        onBeforeOpen: () => {
            Swal.showLoading();
            timerInterval = setInterval(() => {
                Swal.getContent().querySelector("b").textContent = Swal.getTimerLeft();
            }, 100);
        },
        onClose: () => {
            clearInterval(timerInterval);
        }
    }).then(result => {
        if (
            /* Read more about handling dismissals below */
            result.dismiss === Swal.DismissReason.timer
        ) {
            console.log("I was closed by the timer"); // eslint-disable-line
        }
    });
    var userEmail = document.getElementById("email_field").value;
    var userPass = document.getElementById("password_field").value;

    firebase
        .auth()
        .createUserWithEmailAndPassword(userEmail, userPass)
        .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...

            // show something when there is a error
            //   window.alert("Error : " + errorMessage);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Error : " + error.message
            });
        });
}


// Function to verify his email
function send_verification() {
    var user = firebase.auth().currentUser;

    user
        .sendEmailVerification()
        .then(function () {
            // Email sent.
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Email has been send!",
                showConfirmButton: false,
                timer: 1500
            });
        })
        .catch(function (error) {
            // An error happened.
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Error : " + error.message,
                showConfirmButton: false,
                timer: 1500
            });
        });
}


// Function that allows the user to change their password

// We need to add async because we are using await!

async function changePassword() {
    const { value: password } = await Swal.fire({
        title: 'Enter your new password',
        input: 'password',
        inputPlaceholder: 'Enter your password',
        inputAttributes: {
            maxlength: 10,
            autocapitalize: 'off',
            autocorrect: 'off'
        }
    })

    if (password) {
        var y = new Date();
        var s = y.getTime();


        var oldTime = localStorage.getItem("date");
        var newTime = s;

        var secureTime = newTime - oldTime;
        console.log(secureTime);

        if (secureTime > 24 * 60 * 60000) {
            if (localStorage.getItem("date"))
                var user = firebase.auth().currentUser;
            var response = password;
            var newPassword = response;

            user
                .updatePassword(newPassword)
                .then(function () {
                    // Update successful.
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: "Your password has been changed",
                        showConfirmButton: false,
                        timer: 1500
                    });
                })
                .catch(function (error) {
                    // An error happened.
                    Swal.fire({
                        position: "top-end",
                        icon: "error",
                        title: "Error : " + error.message,
                        showConfirmButton: false,
                        timer: 1500
                    });
                });
            // sets the response to nothing to secure the change password
            var response = " ";
        } else {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Error : You need to wait at least 1 day to change your password",
                showConfirmButton: false,
                timer: 1500
            });
            localStorage.setItem("account-secure.user", 0);

        }

    }
}



// Change email with this code
function changeEmail() {
    if (vStatus === true) {
        var user = firebase.auth().currentUser;
        var next_email = prompt("Whats your new email addres?");

        user
            .updateEmail(next_email)
            .then(function () {
                // Update successful.
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Your email has been changed!",
                    showConfirmButton: false,
                    timer: 1500
                });
            })
            .catch(function (error) {
                // An error happened.
                Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: "Error : " + error.message,
                    showConfirmButton: false,
                    timer: 1500
                });
            });
    } else {
        // An error happened.
        Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Error : You need to verify your email!",
            showConfirmButton: false,
            timer: 1500
        });
    }
}

// Function to delete his account 
function deleteAccount() {
    // Check is the user is verified
    if (vStatus) {
        var r = confirm("Are you sure you want to delete your account?");
        if (r == true) {
            var user = firebase.auth().currentUser;

            user
                .delete()
                .then(function () {
                    // User deleted.
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: "Your account has been deleted!",
                        showConfirmButton: false,
                        timer: 1500
                    });
                })
                .catch(function (error) {
                    // An error happened.
                    Swal.fire({
                        position: "top-end",
                        icon: "error",
                        title: "Error : " + error.message,
                        showConfirmButton: false,
                        timer: 1500
                    });
                });
        } else {
            console.clear;
            console.info("Your account is not deleted!!");
        }

    } else {
        // An error happened.
        Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Error : You need to verify your email!",
            showConfirmButton: false,
            timer: 1500
        });
    }

}

// Sends the user to watch tv

function tvFalas() {
    // Sending you to TV FALAS.
    Swal.fire({
        position: "top-end",
        icon: "succes",
        title: "Sending you to TV Falas!",
        showConfirmButton: false,
        timer: 1500
    });
    location.replace("index");
}


// Function to sign with google

function signgoogle() {
    var provider = new firebase.auth.GoogleAuthProvider();

    // Sign in with google

    firebase
        .auth()
        .signInWithPopup(provider)
        .then(function (result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            // ...
        })
        .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(error.message);
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });
}

// Get user data
var user = firebase.auth().currentUser;



// Find user ip address
function ipaddres() {
    const ipAPI = "//api.ipify.org?format=json";

    Swal.queue([
        {
            title: "Your public IP",
            confirmButtonText: "Show my public IP",
            text: "Your public IP will be received " + "Soon",
            showLoaderOnConfirm: true,
            preConfirm: () => {
                return fetch(ipAPI)
                    .then(response => response.json())
                    .then(data => Swal.insertQueueStep(data.ip))
                    .catch(() => {
                        Swal.insertQueueStep({
                            icon: "error",
                            title: "Unable to get your public IP"
                        });
                    });
            }
        }
    ]);
}



document.addEventListener("keydown", function (event) {
    if (event.which === 13) {
        if (uStatus === false) {
            login();
        }
        else {
            console.error("You are already logged in!");
        }

    }
})



const imageSlot = document.querySelector('.imageslot')

function showImage() {

    const photoskey = 'D21Dh_uPDtTpGEpro4FuUpM2NEmtkAdzf2r-oV0YX-E';
    const proxy = 'https://cors-anywhere.herokuapp.com/';
    const api = `${proxy}https://api.unsplash.com/photos/random?client_id=${photoskey}&?query=nature`;


    fetch(api)
        .then(response => {
            return response.json();
        })
        .then(data => {
            document.getElementById("image-profile").src = data.urls.small;
        });

}


// Version 1.1
/*

Added :

User can change their password 1 day after they logged in!
Fixed Verify
Users cant change email and delete their account without verifing their email




*/
// When the user clicks enter on their keybord it will try to login the user

// Function to reset their password via email

async function forgotPass() {
    const { value: email } = await Swal.fire({
        title: 'Whats the email address?',
        input: 'email',
        inputPlaceholder: 'Enter your email address'
    })

    if (email) {
        var auth = firebase.auth();
        var response_email = email;
        var emailAddress = response_email;

        auth
            .sendPasswordResetEmail(emailAddress)
            .then(function () {
                // Email sent.
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Email has been send!",
                    showConfirmButton: false,
                    timer: 1500
                });
            })
            .catch(function (error) {
                // An error happened.
                Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: "Error : " + error.message,
                    showConfirmButton: false,
                    timer: 1500
                });
            });
        var response_email = " ";
    }
}
