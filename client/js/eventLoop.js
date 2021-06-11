//#region Utiltiy functions
function getRandomColor(){
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};
function getoneminusone() {
    return Math.ceil(Math.random() * 1) * (Math.round(Math.random()) ? 1 : -1)
};
function colorsplit(color, gradient){
    // Accepts HEX COLOR with #FFFFFF
    let HexRGB = color.split("#")[1].match(/.{1,2}/g);
    let colorNoise = getRandom(0,gradient)*getoneminusone();
    let rgb = {
        r: Math.floor(parseInt(HexRGB[0], 16) + colorNoise),
        g: Math.floor(parseInt(HexRGB[1], 16) + colorNoise),
        b: Math.floor(parseInt(HexRGB[2], 16) + colorNoise)
    }
    //preventing illegal colors
    if(rgb.r > 255) { rgb.r = 255 }
    if(rgb.g > 255) { rgb.g = 255 }
    if(rgb.b > 255) { rgb.b = 255 }
    if(rgb.r < 0) { rgb.r = 0 }
    if(rgb.g < 0) { rgb.g = 0 }
    if(rgb.b < 0) { rgb.b = 0 }
    // console.log(colorNoise);
    return rgbToHex(rgb.r,rgb.g,rgb.b)
};
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
};
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
};
function getMagnitudeVelocity(playerObject) {
    let velocity = Math.round(Math.sqrt((playerObject.velocity.x*playerObject.velocity.x + playerObject.velocity.y*playerObject.velocity.y))*1000)/1000;
    return velocity;
};
var semiRandomIteratiorVariable = 0;// used for getSemiRandomColor()
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
};
function getMousePos(canvas, e) {
    let rect = canvas.getBoundingClientRect();
    return {
        x: Math.round((e.clientX - rect.left)/(rect.right - rect.left)*canvas.width),
        y: Math.round((e.clientY - rect.top)/(rect.bottom - rect.top)*canvas.height)
    };
};
function getRandom(min, max) {
    return Math.round((Math.random() * (max - min) + min)*1000)/1000
};
function colider(rect1, rect2) {
    let colision = false;
    if (rect1.x < rect2.x + rect2.size &&
        rect1.x + rect1.size > rect2.x &&
        rect1.y < rect2.y + rect2.size &&
        rect1.y + rect1.size > rect2.y) {
        colision = true;
        }
        return colision
};
//#endregion

//#region DOM Canvas setup and DOM event handling
let canvas; 
let context;
function connectDomCanvas() {
    canvas = document.getElementById("viewport"); 
    context = canvas.getContext("2d");
}
function connectDomHooks(){
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mouseout", onMouseOut);
    document.addEventListener('keydown', keydown);
    document.addEventListener('keyup', keyup);
}
function onMouseMove(e){
    console.log("mouseMove")
}
function onMouseDown(e){
    let pos = getMousePos(canvas, e);
    playerarray[0].x = pos.x;
    playerarray[0].y = pos.y;
}
function onMouseUp(e){
    console.log("onMouseUp")
} 
function onMouseOut(e){
    console.log("onMouseOut")
}
function keyup(e){
    let press = direction(e);
    updateKeyArray(e, press, false);
}
function keydown(e) {  
    let press = direction(e);
    updateKeyArray(e, press, true);
    movePlayer(playerarray[0]);
    // playerarray[0].moving = true;
}
function updateKeyArray(e, press, value) {
    let oldkeyarray = JSON.stringify(playerarray[0].keyarray); // deepcopy of playerarray[0].keyarray
    switch (press) {
        case "up":
            playerarray[0].keyarray[0] = value;
            break;
        case "left":
            playerarray[0].keyarray[1] = value;
            break;
        case "down":
            playerarray[0].keyarray[2] = value;
            break;
        case "right":
            playerarray[0].keyarray[3] = value;
            break;
        default:
            break;
    }    
    if(oldkeyarray === JSON.stringify(playerarray[0].keyarray)){
        return true;
    } else {
        return false;//multiplayermove();
    }
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

//#endregion

//#region Rendering onto the canvas
//#region Fps count and managment
lastframe = 0;
fpstime = 0;
framecount = 0;
fps = 0;
dt = 0;
function updateFPS(tframe){
    dt = (tframe - lastframe) / 1000;
    lastframe = tframe;
    if(fpstime > 0.25){ // measure every fps 0.25 ms
        fps = Math.round(framecount / fpstime); // fps calc
        fpstime = 0;
        framecount = 0; 
    }
    fpstime += dt;
    framecount++;
    return fps;
}
//#endregion
//#region Render methods
function drawRectangle(color, x1, y1, dx, dy) { 
    context.fillStyle = color;
    context.fillRect(x1, y1, dx, dy);
}
function drawLine(startx, starty, endx, endy) {
    context.beginPath();
    context.moveTo(startx, starty);
    context.lineTo(endx, endy);
    context.stroke();
    context.closePath(); 
}
function drawEmptyRectangle(x1, y1, dx, dy) {
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
function drawText(color, text, x, y) {
    context.fillStyle = color;
    context.font = "12px Verdana";
    context.fillText(text, x, y);
} 
function clearScreen(){
    drawRectangle("#FFFFFF",0,0,canvas.width,canvas.height)
}
//#endregion
//#region  Renderer Loop
let GLOBALSCALE = 32;
function renderLoop(tframe){ // in ascending order of layers, first = bottom
    let fps = updateFPS(tframe);
    clearScreen();
    drawEmptyRectangle(0,0,canvas.height,canvas.width);
    renderParticles();
    renderPlayers();
    // list.push([updatePlayerPosition]);
    updatePlayerPosition()
    drawText("#000000", fps, 13, 15);
}
//#endregion
//#endregion

//#region Add player
let playerarray = [];
function player_place_centre() {
    let randx = Math.floor(Math.random()*(canvas.width/4));
    let randy = Math.floor(Math.random()*(canvas.height/4));
    if(Math.floor(Math.random()*2)){
        randy = randy * -1;
    }
    if(Math.floor(Math.random()*2)){
        randx = randx * -1;
    }        
    return {x:((canvas.width/2)+randx), y:((canvas.height/2)+randy)}
}
function addplayer(id, color, x, y, name) {
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
function initalisePlayer(){
    addplayer(
        String(new Date().getTime()).substr(-10),
        getRandomColor(),
        player_place_centre().x,
        player_place_centre().y,
        "player1"
    );
}
//#endregion

//#region PlayerLogic
function updatePlayerPosition() {
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
            if(getMagnitudeVelocity(player) > 0) {
                list.push([goParticles,[player]]);
            }
        } else {
            list.push([moveParticles,[player]]);
        }

        //makes the movement presistent
        movePlayer(player);
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
function playerColision() {
    playerarray.forEach(player2 => {
        if(player2 != player) {
            var samplerates = Math.round(getMagnitudeVelocity(player));
            if(nextcolision(player, player2, samplerates)) {
                if(!player2.inColision) {
                    playerHit(player2,player);
                }
                player2.inColision = true;   
                console.log(player2.inColision);
                
            } else {
                player2.inColision = false;
            }
        }
    });
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
function renderPlayers() {
    playerarray.forEach(player => {
        drawRectangle(
            player.color,
            (player.x-player.size),
            (player.y-player.size),
            player.size,
            player.size
        );
        drawEmptyRectangle(
            (player.x-player.size),
            (player.y-player.size),
            player.size,
            player.size
        );
        let yoffset = 5;
        let xoffset = player.name.length; // perfect value
        drawText(
            "#000000",
            player.name,
            (player.x-player.size-xoffset),
            (player.y-player.size-yoffset)
        );
    });
}

//#endregion

//#region particle system
var particleArray = [];
function renderParticles() {
    for (let index = 0; index < particleArray.length; index++) {
        var particle = particleArray[index];
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
            particleArray.splice(index, 1);
        }
    }
}
function addParticles(color, x, y, ammount, lifetime, dx, dy){
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
            color: colorsplit(color,25),//getSemiRandomColor(1,3),
            size: GLOBALSCALE * Math.random(),
            lifetime: lifetime, // frames
            TotalLifetime: lifetime
        }
        particleArray.push(particle);
    }
}
function particleSpawner() {
    let player = playerarray[0];
    list.push([
        addParticles,
        [
            getRandomColor(),
            player.x-player.size/2,
            player.y-player.size/2,
            10,
            100,
            getRandom(-10,10),
            getRandom(-10,10)
        ],
        50,
        "interval"
    ]);
}
function moveParticles(player){
    addParticles(player.color, player.x-player.size/2,player.y-player.size/2,Math.floor(getMagnitudeVelocity(player)),player.size, -player.velocity.x*0.2, -player.velocity.y*0.2)
}
function goParticles(player) {
    addParticles(player.color, player.x-player.size/2,player.y-player.size/2,5,player.size, -player.velocity.x*0.2, -player.velocity.y*0.2)
}
//#endregion

//#region Event Loop
let list = [];
let intervalList = [];
let log = [];
let evCount = 0;
function eventLoop(tframe){
    if(list.length > 0) {
        let exsex = list.shift()
        if(exsex.length === 4){// func, args, time of sending
            if(exsex[3] === "timeout") {
                intervalList.push(setTimeout(function(){ exsex[0](...exsex[1]) }, exsex[2]));
            } else if(exsex[3] === "interval"){
                intervalList.push(setInterval(function(){ exsex[0](...exsex[1]) }, exsex[2]));
            }
            
        } else if(exsex.length === 2) {
            exsex[0](...exsex[1])

        } else if(exsex.length === 1) {
            exsex[0]()
        }
        log.push({
            function: exsex[0].name,
            time: tframe,
        })
        evCount++;
    }
    renderLoop(tframe);
    window.requestAnimationFrame(eventLoop);
}
function startGame(canvasName) {
    // visuals setup
    list.push([connectDomCanvas,[canvasName]]);
    list.push([connectDomHooks]);
    list.push([initalisePlayer]);
    // begin the game loop
    window.requestAnimationFrame(eventLoop);// fixes errors caused by run without tframe being defined
}
//#endregion

startGame()