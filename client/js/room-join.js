//File contains:
//    server join
//    room logic
//        room join request
//        name genaration
//        name requesting


var roomname;
var username;


// const io = require("socket.io-client");
const socket = io(); //the socket server will be determined forom the same domain via window.location object if not io("https://server-domain.com"); you can also specifiy namespaces to connect to and use wws: or https: via io("/admin");
console.log('socketio module loaded');

function joinroom(data){
    if(data != undefined){
        roomname = data
        console.log('setting roomname to input name');
        
    }
    setusername(); // give client username before connecting
    socket.emit("joinroom", roomname);
}
function setusername(data){
    if(data != undefined){
        username = data
    } else if( username == undefined) { 
        username = sillyname();
    }
    socket.emit("setusername", username)
    roomusers() // update the playertable
}

function roomusers() {
    socket.emit("roomclients");
}

function sillyname() {
    var firstNames = ["Runny", "Buttercup", "Dinky", "Stinky", "Crusty", "Greasy","Gidget", "Cheesypoof", "Lumpy", "Wacky", "Tiny", "Flunky","Fluffy", "Zippy", "Doofus", "Gobsmacked", "Slimy", "Grimy", "Salamander", "Oily", "Burrito", "Bumpy", "Loopy", "Snotty", "Irving", "Egbert"];
    var middleNames = ["Waffer", "Lilly","Rugrat","Sand", "Fuzzy","Kitty", "Puppy", "Snuggles","Rubber", "Stinky", "Lulu", "Lala", "Sparkle", "Glitter", "Silver", "Golden", "Rainbow", "Cloud", "Rain", "Stormy", "Wink", "Sugar", "Twinkle", "Star", "Halo", "Angel"];
    var firstName = firstNames[Math.floor(Math.random()*firstNames.length)];
    var middleName = middleNames[Math.floor(Math.random()*middleNames.length)];
    return firstName+" "+middleName;
}