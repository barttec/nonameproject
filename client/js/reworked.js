class utilManager {
    constructor(){
        this.semiRandomIteratiorVariable = 0;// used for getSemiRandomColor()
    }
    getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    getoneminusone() {
        return Math.ceil(Math.random() * 1) * (Math.round(Math.random()) ? 1 : -1)
    }
    colorsplit(color, gradient) {
        // Accepts HEX COLOR with #FFFFFF
        let HexRGB = color.split("#")[1].match(/.{1,2}/g);
        let colorNoise = this.getRandom(0,gradient)*this.getoneminusone();
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
        return this.rgbToHex(rgb.r,rgb.g,rgb.b)
    }
    componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
    rgbToHex(r, g, b) {
        return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    }
    getMagnitudeVelocity(playerObject) {
        let velocity = Math.round(Math.sqrt((playerObject.velocity.x*playerObject.velocity.x + playerObject.velocity.y*playerObject.velocity.y))*1000)/1000;
        return velocity;
    }
    getSemiRandomColor(selector, maxselector) {
        if(this.semiRandomIteratiorVariable >= 4) {
          this.semiRandomIteratiorVariable = 0;
        } else {
          this.semiRandomIteratiorVariable++;
        }
        let toxicSprings = ["#b3e244", "#53bbe0", "#6a6b4d", "#b3dd52", "#d4f850"];
        let retroWaves = ["#fd7eb0", "#fba9ee", "#68faff", "#ff64c9", "#6d02c3"];
        let Diagperm = ["#ff8152", "#d1471e", "#ff735d", "#ff3b0e", "#c50601"];
        let Glaucous = ["#6082b6", "#799ad0", "#93b6f0", "#b2d2ff", "#d1f0ff"];
        if(selector >= (3*maxselector)/4) {  
          return toxicSprings[this.semiRandomIteratiorVariable]
        } else if(selector >= (2*maxselector)/4) {
          return retroWaves[this.semiRandomIteratiorVariable]
        } else if(selector >= (1*maxselector)/4) {
          return Diagperm[this.semiRandomIteratiorVariable]
        } else {
          return Glaucous[this.semiRandomIteratiorVariable]
        }  
    }
    getMousePos(canvas, e) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: Math.round((e.clientX - rect.left)/(rect.right - rect.left)*canvas.width),
            y: Math.round((e.clientY - rect.top)/(rect.bottom - rect.top)*canvas.height)
        };
    }
    getRandom(min, max) {
        return Math.round((Math.random() * (max - min) + min)*1000)/1000
    }
}
class EventManager {
    constructor() {

    }
}
class Renderer {
    constructor(canvas, context) {
        this.canvas = canvas;
        this.context = context;
        
        this.lastframe = 0;
        this.fpstime = 0;
        this.framecount = 0;
        this.fps = 0;
        this.dt = 0;

    }
    drawLine(startx, starty, endx, endy) {
        this.context.beginPath();
        this.context.moveTo(startx, starty);
        this.context.lineTo(endx, endy);
        this.context.stroke();
        this.context.closePath(); 
    }
    clearScreen(){
        this.drawRectangle("#FFFFFF",0,0,this.canvas.width,this.canvas.height)
    }
    drawRectangle(color, x1, y1, dx, dy) { 
        this.context.fillStyle = color;
        this.context.fillRect(x1, y1, dx, dy);
    }
    drawText(color, text, x, y) {
        this.context.fillStyle = color;
        this.context.font = "12px Verdana";
        this.context.fillText(text, x, y);
    } 
    drawEmptyRectangle(x1, y1, dx, dy) {
        // Filled triangle
        this.context.beginPath();
        this.context.moveTo(x1,y1);
        this.context.lineTo(x1+dy,y1);
        this.context.lineTo(x1+dy,y1+dx);
        this.context.lineTo(x1,y1+dx);
        this.context.lineTo(x1,y1); 
        this.context.lineTo(x1+dx,y1);   
        this.context.strokeStyle = "#d0d0d0"
        this.context.lineWidth = 1.5;
        this.context.stroke();
        this.context.closePath();
    }
    updateFPS(tframe){
        this.dt = (tframe - this.lastframe) / 1000;
        this.lastframe = tframe;
        if(this.fpstime > 0.25){ // measure every fps 0.25 ms
            this.fps = Math.round(this.framecount / this.fpstime); // fps calc
            this.fpstime = 0;
            this.framecount = 0; 
        }
        this.fpstime += this.dt;
        this.framecount++;
        return this.fps;
    }
    renderPlayer(player){
        this.drawRectangle(player.color, x1, y1, dx, dy);
        this.drawEmptyRectangle(x1, y1, dx, dy);
    }
    renderLoop(tframe){ // in ascending order of layers, first = bottom
        let fps = this.updateFPS(tframe);
        this.clearScreen();
        this.drawEmptyRectangle(0,0,this.canvas.height,this.canvas.width);
        this.drawText("#000000",fps,this.canvas.width/2,this.canvas.height/2)
        this.renderPlayers();
    }
}
class PlayerManager extends gameEngine{
    constructor (canvas) {
        super();
        this.canvas = canvas;

        this.initalisePlayer();
    }
    colider(rect1, rect2) {
        let colision = false;
        if (rect1.x < rect2.x + rect2.size &&
            rect1.x + rect1.size > rect2.x &&
            rect1.y < rect2.y + rect2.size &&
            rect1.y + rect1.size > rect2.y) {
            colision = true;
         }
         return colision
    }
    player_place_centre() {
        let randx = Math.floor(Math.random()*(this.canvas.width/4));
        let randy = Math.floor(Math.random()*(this.canvas.height/4));
        if(Math.floor(Math.random()*2)){
            randy = randy * -1;
        }
        if(Math.floor(Math.random()*2)){
            randx = randx * -1;
        }        
        return {x:((this.canvas.width/2)+randx), y:((this.canvas.height/2)+randy)}
    }
    addplayer(id, color, x, y, name) {
        if(color == undefined) {
            color = this.getRandomColor();
        }
        if(x == undefined || y == undefined) {
            x = 3 * this.GLOBALSCALE;
            y = 3 * this.GLOBALSCALE;
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
            size: this.GLOBALSCALE,
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
        this.playerarray.push(playerobject);
    }
    initalisePlayer(){
        this.addplayer(
            String(new Date().getTime()).substr(-10),
            this.getRandomColor(),
            this.player_place_centre().x,
            this.player_place_centre().y,
            "player1"
        );
    }
    onMouseMove(e){
        console.log("mouseMove")
    }
    onMouseDown(e){
        console.log("onMouseDown")
    }
    onMouseUp(e){
        console.log("onMouseUp")
    } 
    onMouseOut(e){
        console.log("onMouseOut")
    }
    keydown(e){
        console.log("keydown")
    }
    keyup(e){
        console.log("keyup")
    }
}
class ParticleSystem {
    constructor() {
        this.particleArray = [];
    }
    addParticles(player, x, y, ammount, lifetime, dx, dy){
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
            this.particlearray.push(particle);
        }
    }    
           
}
class networkManager {
    constructor () {
        this.clientarray = [];
    }
}
class gameEngine extends utilManager {
    constructor (canvas) {

        this.Mycanvas = document.getElementById(canvas);
        this.Mycontext = this.Mycanvas.getContext("2d");
        
        this.GLOBALSCALE = 64;

        this.playerarray = [];


        this.MyEventManager = new EventManager();
        this.MyRenderer = new Renderer(this.Mycanvas, this.Mycontext);
        this.MyPlayerManager = new PlayerManager(this.Mycanvas);
        this.MyParticleSystem = new PlayerManager(this.Mycanvas);
        this.MynetworkManager = new PlayerManager(this.Mycanvas);
    }
    domHooks(){
        this.Mycanvas.addEventListener("mousemove", this.MyPlayerManager.onMouseMove);
        this.Mycanvas.addEventListener("mousedown", this.MyPlayerManager.onMouseDown);
        this.Mycanvas.addEventListener("mouseup", this.MyPlayerManager.onMouseUp);
        this.Mycanvas.addEventListener("mouseout", this.MyPlayerManager.onMouseOut);
        document.addEventListener('keydown', this.MyPlayerManager.keydown);
        document.addEventListener('keyup', this.MyPlayerManager.keyup);
    }
    gameStart(){
        this.domHooks(); // capture events
        window.requestAnimationFrame(this.eventLoop.bind(this)); // needs to bind to right context
    }
    eventLoop(tframe){
        this.MyRenderer.renderLoop(tframe);
        window.requestAnimationFrame(this.eventLoop.bind(this)); // needs to bind to right context
    }

}

var g = new gameEngine("viewport");
var u = new utilManager()
// u.getMagnitudeVelocity({velocity:{x:10,y:10}})

// window.requestAnimationFrame(g.Eventloop);