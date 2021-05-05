// The function gets called when the window is fully loaded
// Get the canvas and context


var canvas = document.getElementById("viewport"); 
var context = canvas.getContext("2d");

let randx = Math.floor(Math.random()*(canvas.width/4));
let randy = Math.floor(Math.random()*(canvas.height/4));
if(Math.floor(Math.random()*2)){
    randy = randy * -1;
}
if(Math.floor(Math.random()*2)){
    randx = randx * -1;
}

const GLOBALSCALE = 64;

var player1 = {
    id: socket.id,
    color: getRandomColor(),
    x: (canvas.width/2)+randx,
    y: (canvas.height/2)+randy,
    size: GLOBALSCALE,
    name: "player1",
    velocity: {
        x: 0,
        y: 0,
        dx: 0,
        dy: 0
    },
    decelaration: 0.97,
    speed: 1,
    keyarray: [false,false,false,false],// w a s d
    recoil: 0.5,
    inColision: false
}

var clientarray = [];

// Timing and frames per second
var lastframe = 0;
var fpstime = 0;
var framecount = 0;
var fps = 0;
 
var playerarray = [player1];
 
function addplayer(id, color, x, y, name, ) {
    if(color == undefined) {
        color = getRandomColor();
    }
    if(x == undefined || y == undefined) {
        x = 3 * GLOBALSCALE;
        y = 3 * GLOBALSCALE;
    }
    if(name == undefined) {
        name = "machine";
    }
    if(id == undefined) {
        throw console.error('fuck this shit we need an id');
    }
    let playerobject = {
        id: id,
        color: color,
        x: x,
        y: y,
        size: GLOBALSCALE,
        name: name,
        velocity: {
            x: 0,
            y: 0,
            dx: 0,
            dy: 0
        },
        decelaration: 0.97,
        speed: 1,
        keyarray: [false,false,false,false],// w a s d
        recoil: 0.5,
        inColision: false
    }
    playerarray.push(playerobject);
}
// Initialize the game
function init() {
    // canvas.style.top = client
    // Add mouse events
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mouseout", onMouseOut);
    document.addEventListener('keydown', keydown);
    document.addEventListener('keyup', keyup);
    // Enter main loop
    main(0);
}
// Main loop
function main(tframe) {
    // Request animation frames
    window.requestAnimationFrame(main);
 
    // Update and render the game
    update(tframe);
    render();
}
// Update the game state
function update(tframe) {
    var dt = (tframe - lastframe) / 1000;
    lastframe = tframe;
    // Update the fps counter
    updateFps(dt);
}
function updateFps(dt) {    
    if (fpstime > 0.25) {
        // Calculate fps
        fps = Math.round(framecount / fpstime);
 
        // Reset time and framecount
        fpstime = 0;
        framecount = 0;
    }
 
    // Increase time and framecount
    fpstime += dt;
    framecount++;
}
// Get the mouse position
function getMousePos(canvas, e) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: Math.round((e.clientX - rect.left)/(rect.right - rect.left)*canvas.width),
        y: Math.round((e.clientY - rect.top)/(rect.bottom - rect.top)*canvas.height)
    };
}
// Render the game
function render() {
    // Draw the frame
    drawFrame();
}
// Draw a frame with a border
function drawFrame() {
    // Draw background and a border
    drawRectangle("#d0d0d0", 0, 0, canvas.width, canvas.height);
    // drawRectangle("#e8eaec" , 1, 1, canvas.width-2, canvas.height-2);

    drawPlayers();
    // moveBullets();
    //draw fps
    drawFps();   
    
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

function drawPlayers() {
    playerarray.forEach(player => {
        let yoffset = 20;
        let xoffset = player.name.length * 4.25; // perfect value
        // drawText("#000000", player.name, player.x-xoffset, player.y-yoffset);
        let x1 = (player.x-player.size);
        let y1 = (player.y-player.size);
        let dx = player.size;
        let dy = player.size;
        renderParticles();
        drawRectangle(player.color, x1, y1, dx, dy)        ;
        drawEmptyRectangle(x1, y1, dx, dy);
        // change player position
        player.x = player.x + player.velocity.x;
        player.y = player.y + player.velocity.y;    

        // decrese player velocity
        player.velocity.x = Math.round((player.velocity.x * player.decelaration)*1000)/1000;
        player.velocity.y = Math.round((player.velocity.y * player.decelaration)*1000)/1000;

        // decelaration when player is not moving
        // check if moing
        let count = 0;
        player.keyarray.forEach(key => {
            if(key) { count++;}
        });
        if(count == 0) {
            player.velocity.x = Math.round((player.velocity.x * (player.decelaration*player.decelaration))*1000)/1000;
            player.velocity.y = Math.round((player.velocity.y * (player.decelaration*player.decelaration))*1000)/1000;    
            if(getMagnitudeVelocity(player) > 0) {
                goParticles(player)
            }
        } else {
            moveParticles(player);
        }

        //makes the movement presistent
        movePlayer(player);
        playerarray.forEach(player2 => {
            if(player2 != player) {
                var samplerates = Math.round(getMagnitudeVelocity(player));
                if(nextcolision(player, player2, samplerates)) {
                    if(!player2.inColision) {
                        playerHit(player2,player)
                    }
                    player2.inColision = true;   
                    console.log(player2.inColision);
                    
                } else {
                    player2.inColision = false;
                }
            }
        });
        // make them loop around
        if(player.x > canvas.width){
            player.x = 0;
        }
        if(player.y > canvas.height){
            player.y = 0;
        }
        if(player.x < 0){
            player.x = canvas.width;
        }
        if(player.y < 0){
            player.y = canvas.height;
        }
    });
}
// var player = player1;
// setInterval(function(){addParticles(player.x-player.size/2,player.y-player.size/2,10,100, player.velocity.x, player.velocity.y)}, 50)
function moveParticles(player){
    addParticles(player, player.x-player.size/2,player.y-player.size/2,Math.floor(getMagnitudeVelocity(player)),player.size, -player.velocity.x*0.2, -player.velocity.y*0.2)
}
function goParticles(player) {
    addParticles(player, player.x-player.size/2,player.y-player.size/2,5,player.size, -player.velocity.x*0.2, -player.velocity.y*0.2)
}
let semiRandomIteratiorVariable = 0;
function getSemiRandomColor(selector, maxselector) {
    if(semiRandomIteratiorVariable >= 4) {
      semiRandomIteratiorVariable = 0;
    } else {
      semiRandomIteratiorVariable++;
    }
    let toxicSprings = ["#b3e244", "#53bbe0", "#6a6b4d", "#b3dd52", "#d4f850"];
    let retroWaves = ["#fd7eb0", "#fba9ee", "#68faff", "#ff64c9", "#6d02c3"];
    let Diagperm = ["#ff8152", "#d1471e", "#ff735d", "#ff3b0e", "#c50601"];
    let Glaucous = ["#6082b6", "#799ad0", "#93b6f0", "#b2d2ff", "#d1f0ff"];
    if(selector >= (3*maxselector)/4) {  
      return toxicSprings[semiRandomIteratiorVariable]
    } else if(selector >= (2*maxselector)/4) {
      return retroWaves[semiRandomIteratiorVariable]
    } else if(selector >= (1*maxselector)/4) {
      return Diagperm[semiRandomIteratiorVariable]
    } else {
      return Glaucous[semiRandomIteratiorVariable]
    }  
  }
var particlearray = [];
function addParticles(player, x, y, ammount, lifetime, dx, dy){
    for (let index = 0; index < ammount; index++) {
        // if(dx == 0) {
        //     dx = 10*getoneminusone();
        // }
        // if(dy == 0) {
        //     dy = 10*getoneminusone();
        // }
        let rd = Math.random();
        // dx = dx*Math.random();
        // dy = dy*Math.random();
        let particle = {
            x: x,
            y: y,
            dx: dx,
            dy: dy,
            color: colorsplit(player.color,25),//getSemiRandomColor(1,3),
            size: GLOBALSCALE * Math.random(),
            lifetime: lifetime, // frames
            TotalLifetime: lifetime
        }
        particlearray.push(particle);
    }
}
function getoneminusone() {
    return Math.ceil(Math.random() * 1) * (Math.round(Math.random()) ? 1 : -1)
}
function drawEmptyRectangle(x1, y1, dx, dy) {
    // Filled triangle
    context.beginPath();
    context.moveTo(x1,y1);
    context.lineTo(x1+dy,y1);
    context.lineTo(x1+dy,y1+dx);
    context.lineTo(x1,y1+dx);
    context.lineTo(x1,y1); 
    context.lineTo(x1+dx,y1);   
    context.strokeStyle = "#d0d0d0"
    context.lineWidth = 1.5;
    context.stroke();
    context.closePath();
}
function renderParticles() {
    for (let index = 0; index < particlearray.length; index++) {
        var particle = particlearray[index];
        if(particle.lifetime > 0){
            particle.x += particle.dx;
            particle.y += particle.dy;
            drawRectangle(particle.color, (particle.x-particle.size/2), (particle.y-particle.size/2), particle.size, particle.size)

            particle.lifetime -= 1;
            particle.size = particle.size * (particle.lifetime/particle.TotalLifetime)

            // kill particles off screen
            if(particle.x > canvas.width || particle.y > canvas.height || particle.x < 0 || particle.y < 0){
                particle.lifetime = 0;
            }
        } else {
            particlearray.splice(index, 1);
        }
    }
}
function drawRectangle(color, x1, y1, dx, dy) {       
    context.fillStyle = color;
    context.fillRect(x1, y1, dx, dy);
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
function onMouseMove(e) {}
function onMouseDown(e) {
    // console.log(e)
    // fire(player1);
}
function onMouseUp(e) {}
function onMouseOut(e) {}
function keydown(e) {  
    let press = direction(e);
    updateKeyArray(e, press, true);
    movePlayer(player1);
    // player1.moving = true;
}
function updateKeyArray(e, press, value) {
    let oldkeyarray = JSON.stringify(player1.keyarray); // deepcopy of player1.keyarray
    switch (press) {
        case "up":
            player1.keyarray[0] = value;
            break;
        case "left":
            player1.keyarray[1] = value;
            break;
        case "down":
            player1.keyarray[2] = value;
            break;
        case "right":
            player1.keyarray[3] = value;
            break;
        default:
            break;
    }    
    if(oldkeyarray === JSON.stringify(player1.keyarray)){
        return true;
    } else {
        multiplayermove();
    }
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
function direction(e) {
    let press;
    if(["w","ArrowUp"].includes(e.key)){
        press = "up"
    }
    if(["s","ArrowDown"].includes(e.key)){
        press = "down"
    }
    if(["a","ArrowLeft"].includes(e.key)){
        press = "left"
    }
    if(["d","ArrowRight"].includes(e.key)){
        press = "right"
    }
    return press;
}
function movePlayer(player){ 
    for (let index = 0; index < player.keyarray.length; index++) {        
        const value = player.keyarray[index];
        if(value){
            switch (index) {
                case 0: // up
                    player.velocity.y += -player.speed;
                    break;
                case 1: // left
                    player.velocity.x += -player.speed;
                    break;
                case 2: // down
                    player.velocity.y += player.speed;
                    break;
                case 3: // right
                    player.velocity.x += player.speed;
                    break;
                default:
                    break;
            }
        }
    }

}

function drawLine(startx, starty, endx, endy) {
    context.beginPath();
    context.moveTo(startx, starty);
    context.lineTo(endx, endy);
    context.stroke();
    context.closePath(); 
}
function colider(rect1, rect2) {
    let colision = false;
    if (rect1.x < rect2.x + rect2.size &&
        rect1.x + rect1.size > rect2.x &&
        rect1.y < rect2.y + rect2.size &&
        rect1.y + rect1.size > rect2.y) {
        colision = true;
     }
     return colision
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