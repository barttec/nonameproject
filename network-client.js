// File Contains:
//     inital connection call to server
//     network game input
//     debug echo


// const io = require("socket.io-client");
const socket = io(); //the socket server will be determined forom the same domain via window.location object if not io("https://server-domain.com"); you can also specifiy namespaces to connect to and use wws: or https: via io("/admin");
console.log('socketio module loaded');

function sendmove(data) {
    console.log(data);
    socket.emit('move', data);
}
socket.on("playermove", (data) => {
    switch (data) {
        case "up":
            players[1].faceUp();       
            break;
        case "down":
            players[1].faceDown();        
            break;
        case "left":
            players[1].faceLeft();            
            break;
        case "right":
            players[1].faceRight();
            break;
        default:
            break;
    }   
    console.log("server says:", data);
});

socket.on("echo", (data) => {
    console.log("server says:", data);
});