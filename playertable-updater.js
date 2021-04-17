//File contains
//    handling all requests that come form the server
//        reconnecting to a room
//    creation of and updating sockettable

var sockettable = [
    {
        socketid:"asdjakdhsakjdsau", // unique id from server
        username: "jerry", // username set by user on the server
    }
];
var playertable = [];
// genarate socket table from player table
function genarateplayertablefromsockettable() {
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

// get data from server on room change
// data = [
//     [socketname, socketid],
//     [socketname, socketid]
// ];
let initplayerrecive = true;
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
function roomclientupdater(data) {
    // we will update the whole table each time
    resetsockettable();
    data.forEach(player => {
        addplayertosockettable(player);
    });
    //console.log(sockettable);
}

// player = [socketname, socketid];
function addplayertosockettable(player) {
    let playerobject = {
        socketid: player[1],
        username: player[0]
    }
    sockettable.push(playerobject)
    genarateplayertablefromsockettable(); // regen the socket table
}
//every time new person joins we need to update all players
socket.on("newjoin", () => {
    roomusers(); 
    // make this happen automatically on server side
})
// recconect to server with name and room
let initconnection = true;
socket.on("connect", () => {
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
// confirmation of room join
socket.on("joinedroom", (data) => {
    roomusers();// after room update update players
    //console.log("%cjoined room: " + data, 'color: White ;background-color: blue;padding: 5px;');
})
// confirmation of name change
socket.on("namechanged", (data) => {
    //console.log("%cchanged name: " + data, 'color: White ;background-color: blue;padding: 5px;');
})
// reconnection message
// deletion of player table and playertable
socket.on("disconnect", () => {
    resetsockettable();
    //console.log("%cdisconnected, attempting reconnection", 'color: White ;background-color: red;padding: 5px;');
});

function resetsockettable() {
    sockettable = [];
}
