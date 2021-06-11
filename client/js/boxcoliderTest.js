// The function gets called when the window is fully loaded
// Get the canvas and context


var player = {
    x: 100,
    y: 100,
    size: 16,
    color: "#000000",
    velocity: {
        x: 2,
        y: 1
    },
    inColision: false
}
var player2 = {
    x: 200,
    y: 200,
    size: 16,
    color: "#FF0000",
    inColision: false
}

var particlearray = [];

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
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

    drawRectangle("#d0d0d0", 0, 0, canvas.width, canvas.height);
    drawRectangle("#e8eaec" , 1, 1, canvas.width-2, canvas.height-2);

    drawPlayers();
}
// Update the game state
// Get the mouse position
function getMousePos(canvas, e) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: Math.round((e.clientX - rect.left)/(rect.right - rect.left)*canvas.width),
        y: Math.round((e.clientY - rect.top)/(rect.bottom - rect.top)*canvas.height)
    };
}
setInterval(function(){addParticles(100,100,100,100, player.velocity.x, player.velocity.y)}, 100)
function drawPlayers() {
    // change player position
    player.x = player.x + player.velocity.x;
    player.y = player.y + player.velocity.y; 
    
    // player
    let x1 = (player.x-player.size);
    let y1 = (player.y-player.size);
    // let x1 = (player.x);
    // let y1 = (player.y);
    let dx = player.size;
    let dy = player.size;
    drawRectangle(player.color, x1, y1, dx, dy);    

    // player 2
    let x2 = (player2.x-player2.size);
    let y2 = (player2.y-player2.size);
    // let x2 = (player2.x);
    // let y2 = (player2.y);
    let dx2 = player2.size;
    let dy2 = player2.size;
    drawRectangle(player2.color, x2, y2, dx2, dy2);
    
    renderParticles()

    // colision
    samplerates = Math.round(getMagnitudeVelocity(player));
    if(nextcolision(player, player2, samplerates)) {
        if(!player2.inColision) {
            playerHit(player2,player)
        }
        player2.inColision = true;   
    } else {
        player2.inColision = false;
    }
    if(player.x > canvas.width) {
        player.velocity.x = -player.velocity.x
    }   
    if(player.x < 0) {
        player.velocity.x = -player.velocity.x
    }
    if(player.y > canvas.height) {
        player.velocity.y = -player.velocity.y
    }   
    if(player.y < 0) {
        player.velocity.y = -player.velocity.y
    }
}
let ammount = 100;
function playerHit(playerHit, playerHitting) {
    if(playerHit.size <= 5){
        KillPlayer(playerHit);
    } else {
        let vel = getMagnitudeVelocity(playerHitting);
        playerHit.size -= vel;
        if(playerHit.size < 0) {
            playerHit.size = 0;
        }   
        addParticles(playerHit.x,playerHit.y,ammount,100, Math.pow(playerHitting.velocity.x,3), Math.pow(playerHitting.velocity.y,3))
    }
}
function KillPlayer(playerKilled) {
    console.log(playerKilled.name, " is kill");
    playerKilled.size = 32;
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
function addParticles(x, y, ammount, lifetime, dx, dy){
    for (let index = 0; index < ammount; index++) {
        // if(dx == 0) {
        //     dx = 10*getoneminusone();
        // }
        // if(dy == 0) {
        //     dy = 10*getoneminusone();
        // }
        // dx = Math.sin(dx * (2 * Math.PI)),
        // dy = Math.cos(dy * (2 * Math.PI))
        let particle = {
            x: x,
            y: y,
            dx: dx,
            dy: dy,
            color: getRandomColor(),
            size: 16 * Math.random(),
            lifetime: lifetime, // frames
            TotalLifetime: lifetime
        }
        particlearray.push(particle);
    }
}
function getoneminusone() {
    return Math.ceil(Math.random() * 1) * (Math.round(Math.random()) ? 1 : -1)
}
function renderParticles() {
    for (let index = 0; index < particlearray.length; index++) {
        var particle = particlearray[index];
        if(particle.lifetime > 0){
            particle.x += particle.dx;
            particle.y += particle.dy;
            drawRectangle(particle.color, (particle.x-particle.size), (particle.y-particle.size), particle.size, particle.size)
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

function getMagnitudeVelocity(playerObject) {
    let velocity = Math.round(Math.sqrt((playerObject.velocity.x*playerObject.velocity.x + playerObject.velocity.y*playerObject.velocity.y))*1000)/1000;
    return velocity;
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
let down = false;
function onMouseMove(e) {
    if(down){
        let pos = getMousePos(canvas, e);
        player.x = pos.x;
        player.y = pos.y;
    }
}
function onMouseDown(e) {
    down = true;    
}
function onMouseUp(e) {
    down = false;
}
function onMouseOut(e) {
    down = false;
}
function keydown(e) {}
function keyup(e) {}

function drawLine(startx, starty, endx, endy) {
    context.beginPath();
    context.moveTo(startx, starty);
    context.lineTo(endx, endy);
    context.stroke();
    context.closePath(); 
}
