var player1 = {
    color: "#FF0000",
    x: 100,
    y: 100,
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
    moving: false
}
// w a s d
var keyarray = [false,false,false,false];

function addplayer(color, x, y, name) {
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
    let playerobject = {
        color: color,
        x: x,
        y: y,
        size: 16,
        name: name
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

// The function gets called when the window is fully loaded
// Get the canvas and context
var canvas = document.getElementById("viewport"); 
var context = canvas.getContext("2d");
 
// Timing and frames per second
var lastframe = 0;
var fpstime = 0;
var framecount = 0;
var fps = 0;
 
var playerarray = [player1];

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
        let xoffset = 30;
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

        movePlayer();
        // if(player.moving && (fps % 10 == 0) ) {
        //     // console.log(player.velocity.dx);
        //     player.velocity.x = player.velocity.x + player.velocity.dx;
        //     player.velocity.y = player.velocity.y + player.velocity.dy;
        // }

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

    drawText("#000000", "12px Verdana", player1.moving,75, 15)
    //draw fps
    drawFps();      
}

function drawRectangle(color, x1, y1, dx, dy) {       
    context.fillStyle = color;
    context.fillRect(x1, y1, dx, dy);
}
function drawFps() {
    // Display fps
    context.fillStyle = "#000000";
    context.font = "12px Verdana";
    context.fillText("Fps: " + fps, 13, 15);
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
    movePlayer()
}
function updateKeyArray(e, press, value) {
    switch (press) {
        case "up":
            keyarray[0] = value;
            break;
        case "left":
            keyarray[1] = value;
            break;
        case "down":
            keyarray[2] = value;
            break;
        case "right":
            keyarray[3] = value;
            break;
        default:
            break;
    }
}
function keyup(e) {
    let press = direction(e);
    updateKeyArray(e, press, false);
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

function movePlayer(){
    for (let index = 0; index < keyarray.length; index++) {        
        const value = keyarray[index];
        if(value){
            switch (index) {
                case 0: // up
                    player1.velocity.y += -player1.speed;
                    break;
                case 1: // left
                    player1.velocity.x += -player1.speed;
                    break;
                case 2: // down
                    player1.velocity.y += player1.speed;
                    break;
                case 3: // right
                    player1.velocity.x += player1.speed;
                    break;
                default:
                    break;
            }
        }
    }

}
// function complexMovementHandler(e) {
//     switch (e.key) {
//         case "w":
//             movePlayer(0, -player1.speed, "up");
//             break;
//         case "ArrowUp":
//             movePlayer(0, -player1.speed, "up");
//             break;
//         case "s":
//             movePlayer(0, player1.speed, "down");
//             break;
//         case "ArrowDown":
//             movePlayer(0, player1.speed, "down");
//             break;
//         case "a":
//             movePlayer(-player1.speed, 0, "left");
//             break;
//         case "ArrowLeft":
//             movePlayer(-player1.speed, 0, "left");
//             break;
//         case "d":
//             movePlayer(player1.speed, 0, "right");
//             break;
//         case "ArrowRight":
//             movePlayer(player1.speed, 0, "right");
//             break;
//         default:
//             break;
//     }
// }
//     player1.lastpress = press;
// function movePlayer(x,y,key) {
//         // insta stop
    // if(player1.lastpress != key) {
    //     switch (key) {
    //         case "up":
    //             player1.velocity.y = 0;
    //             break;
    //         case "down":
    //             player1.velocity.y = 0;
    //             break;
    //         case "right":
    //             player1.velocity.x = 0;
    //             break;
    //         case "left":
    //             player1.velocity.x = 0;
    //             break;
    //         default:
    //             break;
    //     }
//     }
//     player1.lastpress = key;
//     player1.velocity.x = player1.velocity.x + x;
//     player1.velocity.y = player1.velocity.y + y;
// }
 // if(player1.lastpress != press) {
            //     switch (press) {
            //         case "up":
            //             player1.velocity.y = 0;
            //             break;
            //         case "down":
            //             player1.velocity.y = 0;
            //             break;
            //         case "right":
            //             player1.velocity.x = 0;
            //             break;
            //         case "left":
            //             player1.velocity.x = 0;
            //             break;
            //         default:
            //             break;
            //     }
            // }

// Call init to start the game
window.onload = init;
// let x;
setInterval(() => {
    console.log(player1.velocity.x,player1.velocity.y);
}, 100);
// document.addEventListener('keydown', function(e){console.log(e.timeStamp); x = e.timeStamp});
// document.addEventListener('keyup', function(e){console.log(x - e.timeStamp);});