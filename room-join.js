//File contains:
//    room logic
//        room join request
//        reconnecting to a room
//        name genaration
//        name requesting


let roomname;
let username;

function joinroom(data){
    if(data != undefined){
        roomname = data
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
}

function roomusers() {
    socket.emit("roomclients");
}
socket.on("roomclients", (data) => {
    console.log('total clients:',data.length);
    data.forEach(client => {
        console.log(client);        
    });
});


let initconnection = true;
socket.on("connect", () => {
    if(initconnection) {
        roomname = socket.id// originaly socket joins room of its id, we output that on first connection
        console.log("%cconnected to server, id: " +roomname, 'color: White ;background-color: green;padding: 5px;');    
        initconnection = false; //each subsequent connection is a reconnect to server
    } else {
        setusername(); // reestablish name on the server
        socket.emit("joinroom", roomname) // we reconnect to room we have disconnected from
        console.log("%creconnected to room: " +roomname, 'color: White ;background-color: green;padding: 5px;');    
    }
})

socket.on("joinedroom", (data) => {
    console.log("%cjoined room: " + data, 'color: White ;background-color: blue;padding: 5px;');
})

socket.on("namechanged", (data) => {
    console.log("%cchanged name: " + data, 'color: White ;background-color: blue;padding: 5px;');
})

socket.on("disconnect", () => {
    console.log("%cdisconnected, attempting reconnection", 'color: White ;background-color: red;padding: 5px;');
});



function sillyname() {
    var firstNames = ["Runny", "Buttercup", "Dinky", "Stinky", "Crusty", "Greasy","Gidget", "Cheesypoof", "Lumpy", "Wacky", "Tiny", "Flunky","Fluffy", "Zippy", "Doofus", "Gobsmacked", "Slimy", "Grimy", "Salamander", "Oily", "Burrito", "Bumpy", "Loopy", "Snotty", "Irving", "Egbert"];
    var middleNames = ["Waffer", "Lilly","Rugrat","Sand", "Fuzzy","Kitty", "Puppy", "Snuggles","Rubber", "Stinky", "Lulu", "Lala", "Sparkle", "Glitter", "Silver", "Golden", "Rainbow", "Cloud", "Rain", "Stormy", "Wink", "Sugar", "Twinkle", "Star", "Halo", "Angel"];
    var firstName = firstNames[Math.floor(Math.random()*firstNames.length)];
    var middleName = middleNames[Math.floor(Math.random()*middleNames.length)];
    return firstName+" "+middleName;
}