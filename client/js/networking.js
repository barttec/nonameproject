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
function genarateplayertablefromsockettable() {// genarate socket table from player table
    console.log(sockettable)
    sockettable.forEach(player => {
        if(playertable.includes(player.socketid)) { // index 1 gets socketid
            //console.log('%c'+player.username, 'color: White ;background-color: green;padding: 5px;');
        } else {
            console.log('%c'+player.username, 'color: White ;background-color: red;padding: 5px;');
            playertable.push(player.socketid);
            // if(initplayerrecive) {
            //this is defined by network-to-game-client.js
            // this is fucked
            addplayertogame(player.socketid);
            // }
        }
    });
}
function roomclientupdater(data) {
    // we will update the whole table each time
    resetsockettable();
    data.forEach(player => {
        addplayertosockettable(player);
    });
    //console.log(sockettable);
}
function addplayertosockettable(player) {// player = [socketname, socketid];
    let playerobject = {
        socketid: player[1],
        username: player[0]
    }
    sockettable.push(playerobject)
    genarateplayertablefromsockettable(); // regen the socket table
}
function resetsockettable() {
    sockettable = [];
}
function addplayertogame(playerid) {
    let gameobject = new Snake(phaserthis, 8, 8)
    let newgameplayer = {
        playerid: playerid, 
        initialised: false,
        gameobject: gameobject
    }
    gameplayers.push(newgameplayer);
    console.log('player added');
}
function sendmove(data, x, y) {
    // console.log(data);
    let res = [data, x, y]
    socket.emit('playermove', res);
}
var roomname;
var username;
var sockettable = [
    {
        socketid:"asdjakdhsakjdsau", // unique id from server
        username: "jerry", // username set by user on the server
    }
];
var playertable = [];
// get data from server on room change
// data = [
//     [socketname, socketid],
//     [socketname, socketid]
// ];
let initplayerrecive = true;
let initconnection = true;
// {
//     playerid: socket.id, // set the id for orignal players
//     initialised: false,
//     gameobject: snake
// }
let gameplayers = [];
// const io = require("socket.io-client");
const socket = io(); //the socket server will be determined forom the same domain via window.location object if not io("https://server-domain.com"); you can also specifiy namespaces to connect to and use wws: or https: via io("/admin");
socket.on("roomclients", (data) => {
    roomclientupdater(data);
    let htmloutput = [];
    htmloutput.push('total clients:'+String(data.length));
    //console.log('total clients:',data.length);
    data.forEach(client => {
        htmloutput.push(client);
        //console.log(client);        
    });
    document.getElementById('clients').innerHTML = htmloutput.join('\n\r');
    if(initplayerrecive) {
        game = new Phaser.Game(config);
        initplayerrecive = false;
    }
});
socket.on("newjoin", () => {//every time new person joins we need to update all players
    roomusers(); 
    // make this happen automatically on server side
});
socket.on("connect", () => {// recconect to server with name and room
    if(initconnection) {
        if(roomname == undefined) {
            roomname = socket.id// originaly socket joins room of its id, we output that on first connection
        }
        //console.log("%cconnected to server, id: " +roomname, 'color: White ;background-color: green;padding: 5px;');    
        initconnection = false; //each subsequent connection is a reconnect to server
    } else {
        setusername(); // reestablish name on the server
        socket.emit("joinroom", roomname) // we reconnect to room we have disconnected from
        //console.log("%creconnected to room: " +roomname, 'color: White ;background-color: green;padding: 5px;');    
    }
})
socket.on("joinedroom", (data) => {// confirmation of room join
    roomusers();// after room update update players
    //console.log("%cjoined room: " + data, 'color: White ;background-color: blue;padding: 5px;');
})
socket.on("namechanged", (data) => {// confirmation of name change
    //console.log("%cchanged name: " + data, 'color: White ;background-color: blue;padding: 5px;');
})
socket.on("disconnect", () => {// reconnection message & deletion of player table and playertable
    resetsockettable();
    //console.log("%cdisconnected, attempting reconnection", 'color: White ;background-color: red;padding: 5px;');
});
socket.on("playermove", (data) => {// basis of move code
    console.log(data);
    
    let playerid = data[0];
    let direction = data[1];
    gameplayers.forEach(player => {
    if(playerid == player.playerid) {
        switch (direction) {
            case "up":
                player.gameobject.faceUp();       
                break;
            case "down":
                player.gameobject.faceDown();        
                break;
            case "left":
                player.gameobject.faceLeft();            
                break;
            case "right":
                player.gameobject.faceRight();
                break;
            default:
                break;
        }
        player.gameobject.headPosition.x = data[2];
        player.gameobject.headPosition.y = data[3];
    }
    });
    // console.log("server says:", data);
});
socket.on("servermsg", (data) => {
    console.log("server says:", data);
});








joinroom('bruh')
// roomusers()