// Draw a frame with a border
function drawFrame() {
    let textOrder = 1;
    drawText("#000000", "roomname: ", 13, 15+(textOrder)*15);
    textOrder++;
    drawText("#000000", roomname, 20, 15+(textOrder)*15)
    textOrder++;
    drawText("#000000", "players:", 13, 15+(textOrder)*15)
    textOrder++;
    for (let index = 0; index < clientarray.length; index++) {
        const client = clientarray[index];
        drawText("#000000", client, 20, 15+(textOrder)*15)
        textOrder++
    }
}
function drawFps() {
    // Display fps
    context.fillStyle = "#000000";
    context.font = "12px Verdana";
    context.fillText("fps: " + fps, 13, 15);
}
function drawText(color, text, x, y) {
    let font = "12px Verdana";
    context.fillStyle = color;
    context.font = font;
    context.fillText(text, x, y);
}
let lastsend = new Date().getTime();
function multiplayermove() {
    // console.log('server get fucked', new Date().getTime()-lastsend);
    lastsend = new Date().getTime();
    socket.emit("playermove", player1)
}
function keyup(e) {
    let press = direction(e);
    updateKeyArray(e, press, false);
    // player1.moving = false;
}

function KillPlayer(playerKilled) {
    for (let index = 0; index < playerarray.length; index++) {
        const player = playerarray[index];
        if(playerKilled == player) {
            playerarray.splice(index, 1);    
        }
    }
    // console.log(playerKilled.name, " is kill");
    // playerKilled.size = 32;
}
function nextcolision(movingPlayerActual,stationaryPlayerActual,samplerate) {
    let movingPlayer = JSON.parse(JSON.stringify(movingPlayerActual))
    let stationaryPlayer = JSON.parse(JSON.stringify(stationaryPlayerActual))
    
    let dx = (movingPlayer.velocity.x/samplerate)
    let dy = (movingPlayer.velocity.y/samplerate)

    let colision = false;
    for (let index = 0; index <= samplerate; index++) {
        
        let fakeplayer = {x: movingPlayer.x,y: movingPlayer.y, size: movingPlayer.size};

        fakeplayer.x = fakeplayer.x + (dx*index);
        fakeplayer.y = fakeplayer.y + (dy*index);

        drawRectangle("#aeaeae", fakeplayer.x-fakeplayer.size, fakeplayer.y-fakeplayer.size, fakeplayer.size,fakeplayer.size);
        if(colider(fakeplayer, stationaryPlayer)){
            colision = true;
        }        
    }
    return colision;
}
let ammount = 100;
function playerHit(playerHit, playerHitting) {
    if(playerHit.size <= 5){
        KillPlayer(playerHit);
    } else {
        let vel = getMagnitudeVelocity(playerHitting);
        playerHit.size -= vel;
        if(playerHit.size <= 0) {
            playerHit.size = 3;
        }   
        addParticles(playerHit,playerHit.x,playerHit.y,ammount,100, Math.pow(playerHitting.velocity.x,3), Math.pow(playerHitting.velocity.y,3))
    }
}
joinroom("bruh")