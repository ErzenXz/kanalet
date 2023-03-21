const inputs = document.querySelectorAll(".input");


function addcl() {
    let parent = this.parentNode.parentNode;
    parent.classList.add("focus");
}

function remcl() {
    let parent = this.parentNode.parentNode;
    if (this.value == "") {
        parent.classList.remove("focus");
    }
}


inputs.forEach(input => {
    input.addEventListener("focus", addcl);
    input.addEventListener("blur", remcl);
});

firebase.auth().useDeviceLanguage();

function login() {

    // Show that we are trying to login

    Swal.fire({ title: "Login in!", html: "This wont take a lot of time!", timer: 1e3, timerProgressBar: !0, onBeforeOpen: () => { Swal.showLoading(), timerInterval = setInterval(() => { Swal.getContent().querySelector("b").textContent = Swal.getTimerLeft() }, 100) }, onClose: () => { clearInterval(timerInterval) } }).then(e => { e.dismiss, Swal.DismissReason.timer });

    // Get the email and the password
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...

        // Show the error

        Swal.fire(
            'Error',
            'Error: ' + errorMessage,
            'error'
        )
    });
}


function register() {

    // Show that we are trying to regiter

    Swal.fire({ title: "Creating Account", html: "This wont take a lot of time!", timer: 1e3, timerProgressBar: !0, onBeforeOpen: () => { Swal.showLoading(), timerInterval = setInterval(() => { Swal.getContent().querySelector("b").textContent = Swal.getTimerLeft() }, 100) }, onClose: () => { clearInterval(timerInterval) } }).then(e => { e.dismiss, Swal.DismissReason.timer });

    // Get the email and the password
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...

        // Show the error

        Swal.fire(
            'Error',
            'Error: ' + errorMessage,
            'error'
        )
    });
}


firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        location.replace("../index.html");

        // ...
    } else {
        // User is signed out.

        // ...
    }
});


async function sendEmail() {
    const { value: email } = await Swal.fire({
        title: 'Input email address',
        input: 'email',
        inputPlaceholder: 'Enter your email address'
    })

    if (email) {
        forgotPassword(email);
    }
}

function forgotPassword(email) {
    var auth = firebase.auth();
    var emailAddress = email;

    auth.sendPasswordResetEmail(emailAddress).then(function () {
        // Email sent.
    }).catch(function (error) {
        // An error happened.
        Swal.fire(
            'Error',
            'Error: ' + error.message,
            'error'
        )
    });
}