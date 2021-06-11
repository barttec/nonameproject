
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

//#region DOM and events
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
    // console.log("mouseMove")
}
function onMouseDown(e){
    // let pos = getMousePos(canvas, e);
    // playerarray[0].x = pos.x;
    // playerarray[0].y = pos.y;
}
function onMouseUp(e){
    // console.log("onMouseUp")
} 
function onMouseOut(e){
    // console.log("onMouseOut")
}
//#endregion

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

function startGame() {
    connectDomCanvas();
    connectDomHooks();
    eventLoop();
}
function keydown(e) {  
    changeAngle(e);
}
function changeAngle(e) {
    if(player.angle < 0) {
        player.angle = 0;
    }
    if(player.angle > 360) {
        player.angle = 360;
    }
    if(["w","ArrowUp"].includes(e.key)){
        player.angle
    }
    if(["s","ArrowDown"].includes(e.key)){
        player.y -= player.size
    }
    if(["a","ArrowLeft"].includes(e.key)){        
        if(player.angle < 180 && player.angle >= 0){ // divide into sector but dont overshoot
            player.angle += player.rotationSpeed
        } else if(player.angle > 180 && player.angle <= 360) {
            player.angle -= player.rotationSpeed
        }
    }
    if(["d","ArrowRight"].includes(e.key)){

    }
}
function keyup(e){
    
}
let GLOBALSCALE = 32;
let player = {
    x: 0,
    y: 0,
    rotationSpeed: 10,
    speed: 10,
    angle: 0,
    velocity: 0,
    color: getRandomColor()
}
function eventLoop(tframe) {
    clearScreen();

    updateFPS();
    drawText("#555555",fps+" fps",10,20);
    drawText("#555555",player.angle+" deg",10,40);

    

    window.requestAnimationFrame(eventLoop)
}
startGame()



