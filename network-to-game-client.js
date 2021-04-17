// File Contains:
//     network game input
//     debug echo

function sendmove(data) {
    // console.log(data);
    socket.emit('playermove', data);
}
socket.on("playermove", data => {
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

socket.on("servermsg", data => {
    console.log("server says:", data);
});