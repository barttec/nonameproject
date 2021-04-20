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


var player1 = {
    id: socket.id,
    color: getRandomColor(),
    x: (canvas.width/2)+randx,
    y: (canvas.height/2)+randy,
    size: 16,
    name: "player1",
    velocity: {
        x: 0,
        y: 0,
        dx: 0,
        dy: 0
    },
    decelaration: 0.97,
    speed: 1,
    keyarray: [false,false,false,false]// w a s d
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
        x = 3 * 16;
        y = 3 * 16;
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
        size: 16,
        name: name,
        velocity: {
            x: 0,
            y: 0,
            dx: 0,
            dy: 0
        },
        decelaration: 0.97,
        speed: 1,
        keyarray: [false,false,false,false]// w a s d
    }
    playerarray.push(playerobject);
}
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
    drawRectangle("#e8eaec" , 1, 1, canvas.width-2, canvas.height-2);

    playerarray.forEach(player => {
        let yoffset = 20;
        let xoffset = player.name.length * 4.25; // perfect value
        drawText("#000000", "12px Verdana", player.name, player.x-xoffset, player.y-yoffset);
        let x1 = (player.x-player.size);
        let y1 = (player.y-player.size);
        let dx = player.size;
        let dy = player.size;
        drawRectangle(player.color, x1, y1, dx, dy)        
    });
    playerarray.forEach(player => {
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
        }

        //makes the movement presistent
        movePlayer(player);

        //make the game loop around
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
    //draw fps
    drawFps();   
    
    let textOrder = 1;
    drawText("#000000", "12px Verdana", "roomname: ", 13, 15+(textOrder)*15);
    textOrder++;
    drawText("#000000", "12px Verdana", roomname, 20, 15+(textOrder)*15)
    textOrder++;
    drawText("#000000", "12px Verdana", "players:", 13, 15+(textOrder)*15)
    textOrder++;
    for (let index = 0; index < clientarray.length; index++) {
        const client = clientarray[index];
        drawText("#000000", "12px Verdana", client, 20, 15+(textOrder)*15)
        textOrder++
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
function drawText(color, font, text, x, y) {
    context.fillStyle = color;
    context.font = font;
    context.fillText(text, x, y);
}
// Event handlers
function onMouseMove(e) {}
function onMouseDown(e) {
    player1.velocity.x = 0;
    player1.velocity.y = 0;
    player1.x = e.layerX;
    player1.y = e.layerY;
}
function onMouseUp(e) {}
function onMouseOut(e) {}
function keydown(e) {  
    let press = direction(e);
    updateKeyArray(e, press, true);
    movePlayer(player1)
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
    console.log('server get fucked', new Date().getTime()-lastsend);
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

window.onload = function() {
    init();
    joinroom('bruh')
    roomusers();
    setusername();
}
