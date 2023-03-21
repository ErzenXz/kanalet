// Getting all elements

let ulList = document.querySelector('#messages');
let main1 = document.querySelector('.main');
let progressbar = document.querySelector('.loader');
let spamUuid = 0;
let timeBlocked;
let uName = "Erzen";
let uID = "abc";
let cTime;


// Function to check if the user is logged in!


function checkUser() {
    if (uName === null && uID === null) {
        location.replace("https://www.blockcraftgg.tk");
    }
}

// Function that allows the user to send messages

function sendMessage() {
    // Get the message
    var message = document.getElementById('message').value;

    if (document.getElementById('message').value === "") {
        Swal.fire(
            'Hello!',
            'You cant send empty messages!',
            'error'
        );
        return false;
    }

    // Get the current time

    var time = new Date();
    // Verify the message

    var str = message;

    if (str.length >= 50) {
        Swal.fire(
            'Hello!',
            'You reached the maximum length!',
            'error'
        );
        return false;
    }

    // Send the message to firebase 

    firebase.database().ref("messages").push().set({
        "sender": uName,
        "message": message,
        "time": time.getTime(),
        "uuid": uID
    });

    // Set the text to none

    document.getElementById('message').value = "";


    // Prevent the page from submiting
    return false;
}


// Listen for incoming messeges

firebase.database().ref("messages").on("child_added", function (snapshot) {
    main1.classList.remove("hidden");
    progressbar.classList.add("hidden");

    // Get the messages
    var list = document.createElement("li");
    list.innerText = snapshot.val().sender + ": " + snapshot.val().message;

    var attriute = document.createAttribute("id");
    attriute.value = `message-${snapshot.key}`;


    // Allow the maker to delete this

    if (snapshot.val().uuid === uID) {
        var btn = document.createElement('button');
        btn.textContent = "Delete";

        var attriute2 = document.createAttribute("onclick");
        attriute2.value = `deleteMessage(this)`;

        var attriute3 = document.createAttribute("data-id");
        attriute3.value = `${snapshot.key}`;

        var attriute4 = document.createAttribute("class");
        attriute4.value = `button`;

        btn.setAttributeNode(attriute2);
        btn.setAttributeNode(attriute3);
        btn.setAttributeNode(attriute4);

        list.appendChild(btn);


    }
    ulList.appendChild(list);
    list.setAttributeNode(attriute);

    $('#messages').animate({ scrollTop: $('#messages').prop("scrollHeight") }, 100);

});

function deleteMessage(self) {
    // Get message ID
    var messageID = self.getAttribute("data-id");
    // Delete the message
    firebase.database().ref("messages").child(messageID).remove();
}

// Now show that the message was deleted

firebase.database().ref("messages").on("child_removed", function (snapshot) {
    document.getElementById(`message-${snapshot.key}`).innerText = "This messages has been deleted!";
});



document.addEventListener("keydown", function (event) {
    if (event.which === 13) {
        sendMessage();
    }
})

