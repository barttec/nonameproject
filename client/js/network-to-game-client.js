// File Contains:
//     network game input
//     debug echo

// {
//     playerid: socket.id, // set the id for orignal players
//     initialised: false,
//     gameobject: snake
// }
let gameplayers = [];
// function setinitgameplayers(socketid, snakee) {
//     let ob = new Object();
//     ob.playerid = socketid;
//     ob.initialised = false;
//     ob.gameobject = snakee;
//     gameplayers.push(ob)
// }
// you have to wait for server to send back our id ot add yourself to the game
// setinitgameplayers(socket.id, snake);

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
socket.on("playermove", data => {
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

socket.on("servermsg", data => {
    console.log("server says:", data);
});