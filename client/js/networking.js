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

    // set player name connect two systems
    // first time will cause error so we catch it
    try{ 
        player1.name = username;
    } catch(e) {
        console.log(e)
    }

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

var roomname;
var username;
// get data from server on room change
// data = [
//     [socketname, socketid],
//     [socketname, socketid]
// ];
let initconnection = true;

// const io = require("socket.io-client");
const socket = io(); //the socket server will be determined forom the same domain via window.location object if not io("https://server-domain.com"); you can also specifiy namespaces to connect to and use wws: or https: via io("/admin");
socket.on("roomclients", (data) => {
    // console.log(data);
    clientarray = [];
    data.forEach(client => {
        clientarray.push(client[0]);
    });
});
socket.on("connect", () => {// recconect to server with name and room
    // set player id
    player1.id = socket.id;
    // check inital connection
    if(initconnection) {
        if(roomname == undefined) {
            roomname = socket.id// originaly socket joins room of its id, we output that on first connection
        }
        console.log("%cconnected to server, id: " +roomname, 'color: White ;background-color: green;padding: 5px;');    
        initconnection = false; //each subsequent connection is a reconnect to server
    } else {
        setusername(); // reestablish name on the server
        socket.emit("joinroom", roomname) // we reconnect to room we have disconnected from
        console.log("%creconnected to room: " +roomname, 'color: White ;background-color: green;padding: 5px;');    
    }
})
socket.on("joinedroom", (data) => {// confirmation of room join

    roomusers();// after room update update players
    console.log("%cjoined room: " + data, 'color: White ;background-color: blue;padding: 5px;');
})
socket.on("namechanged", (data) => {// confirmation of name change
    console.log("%cchanged name: " + data, 'color: White ;background-color: blue;padding: 5px;');
})
socket.on("disconnect", () => {// reconnection message & deletion of player table and playertable
    console.log("%cdisconnected, attempting reconnection", 'color: White ;background-color: red;padding: 5px;');
});

socket.on("dcbruh", data => {  
    for (let index = 0; index < playerarray.length; index++) {
        const player = playerarray[index];
        if(data.rooms[0] == player.id) {
            console.log('nigga');
            playerarray.splice(index,1);// index items to splice
        } else {
            console.log(data);
        }
    }
    roomusers()
});
socket.on("playerjoin", (data) => {// recconect to server with name and room
    roomusers();
    socket.emit("playermove", player1)
});
let crazymode = false;
socket.on("playermove", (data) => {// recconect to server with name and room
    handleplayermove(data, crazymode);
});
function handleplayermove(data) {
    if(!crazymode) {
        let found = false;
        playerarray.forEach(player => {
            if(data.id == player.id) {
                player.name = data.name
                player.keyarray = data.keyarray;
                player.velocity = data.velocity;
                player.x = data.x;
                player.y = data.y;
                found = true;
            }
        });
        if(!found){
            playerarray.push(data);
        }
    } else {
        playerarray.forEach(player => {
            if(data.id === player.id) {
                player.keyarray = data.keyarray;
            } else {
                playerarray.push(data);
            }
        });
        if(playerarray.length > 200){
            playerarray = playerarray.splice(0, 150);
        }
    }
}
// // roomusers()
