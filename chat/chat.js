// Getting all elements

let ulList = document.querySelector('#messages');
let main1 = document.querySelector('.main');
let progressbar = document.querySelector('.loader');
let spamUuid = 0;
let timeBlocked;
let uName = prompt("What is your name?") || "Anonymous";
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

    var attriute5 = document.createAttribute("title");
    attriute5.value = `${time_ago(snapshot.val().time)}`;


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
    list.setAttributeNode(attriute5);

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

function time_ago(time) {

    switch (typeof time) {
        case 'number':
            break;
        case 'string':
            time = +new Date(time);
            break;
        case 'object':
            if (time.constructor === Date) time = time.getTime();
            break;
        default:
            time = +new Date();
    }
    var time_formats = [
        [60, 'seconds', 1], // 60
        [120, '1 minute ago', '1 minute from now'], // 60*2
        [3600, 'minutes', 60], // 60*60, 60
        [7200, '1 hour ago', '1 hour from now'], // 60*60*2
        [86400, 'hours', 3600], // 60*60*24, 60*60
        [172800, 'Yesterday', 'Tomorrow'], // 60*60*24*2
        [604800, 'days', 86400], // 60*60*24*7, 60*60*24
        [1209600, 'Last week', 'Next week'], // 60*60*24*7*4*2
        [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
        [4838400, 'Last month', 'Next month'], // 60*60*24*7*4*2
        [29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
        [58060800, 'Last year', 'Next year'], // 60*60*24*7*4*12*2
        [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
        [5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
        [58060800000, 'centuries', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
    ];
    var seconds = (+new Date() - time) / 1000,
        token = 'ago',
        list_choice = 1;

    if (seconds == 0) {
        return 'Just now'
    }
    if (seconds < 0) {
        seconds = Math.abs(seconds);
        token = 'from now';
        list_choice = 2;
    }
    var i = 0,
        format;
    while (format = time_formats[i++])
        if (seconds < format[0]) {
            if (typeof format[2] == 'string')
                return format[list_choice];
            else
                return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
        }
    return time;
}

