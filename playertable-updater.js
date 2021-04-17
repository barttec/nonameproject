//File contains
//    handling all requests that come form the server
//        reconnecting to a room
//    creation of and updating playertable

var playertable = [
    {
        socketid:"asdjakdhsakjdsau", // unique id from server
        username: "jerry", // username set by user on the server
        initialised: false // state in the game
    }
];
var sockettable = [];
// genarate socket table from player table
function genaratesockettablefromplayertable() {
    sockettable = [];
    playertable.forEach(player => {
        sockettable.push(player.socketid);
    });
}
// get data from server on room change
// data = [
//     [socketname, socketid],
//     [socketname, socketid]
// ];
socket.on("roomclients", (data) => {
    roomclientupdater(data);
    let htmloutput = [];
    htmloutput.push('total clients:'+String(data.length));
    console.log('total clients:',data.length);
    data.forEach(client => {
        htmloutput.push(client);
        console.log(client);        
    });
    document.getElementById('clients').innerHTML = htmloutput.join('\n\r');
});
function roomclientupdater(data) {
    // we will update the whole table each time
    resetplayertable();
    data.forEach(player => {
        // if(sockettable.includes(player[1])) { // index 1 gets socketid
        //     return true;
        // } else {
        //     addplayertoplayertable(player)
        // }
        addplayertoplayertable(player);
    });
    console.log(playertable);
}

// player = [socketname, socketid];
function addplayertoplayertable(player) {
    let playerobject = {
        socketid: player[1],
        username: player[0],
        initialised: false
    }
    playertable.push(playerobject)
    genaratesockettablefromplayertable(); // regen the socket table
}
//every time new person joins we need to update all players
socket.on("newjoin", () => {
    roomusers(); 
    // make this happen automatically on server side
})

// update players name
socket.on("namechange", (data) => {
    roomusers();
    // make this happen automatically on server side
});
// recconect to server with name and room
let initconnection = true;
socket.on("connect", () => {
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
// confirmation of room join
socket.on("joinedroom", (data) => {
    roomusers();// after room update update players
    console.log("%cjoined room: " + data, 'color: White ;background-color: blue;padding: 5px;');
})
// confirmation of name change
socket.on("namechanged", (data) => {
    console.log("%cchanged name: " + data, 'color: White ;background-color: blue;padding: 5px;');
})
// reconnection message
// deletion of player table and sockettable
socket.on("disconnect", () => {
    resetplayertable();
    console.log("%cdisconnected, attempting reconnection", 'color: White ;background-color: red;padding: 5px;');
});

function resetplayertable() {
    playertable = [];
    sockettable = [];
}
