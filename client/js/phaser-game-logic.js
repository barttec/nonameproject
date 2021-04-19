var config = {
    type: Phaser.WEBGL,
    width: 640,
    height: 480,
    backgroundColor: '#bfcc00',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var snake;
var controller;
var snake;
var cursors;
var food;

//  Direction consts
var UP = 0;
var DOWN = 1;
var LEFT = 2;
var RIGHT = 3;


var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('food', 'https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/games/snake/food.png');
    this.load.image('body', 'https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/games/snake/body.png');
}
function create ()
{
    //player one controls and player
    snake = new Square(this, 8, 8);
    cursors = this.input.keyboard.createCursorKeys(); //  Create our keyboard controls
}

function update (time, delta) 
{
    console.log(cursors.right.isDown && cursors.up.isDown);
    
    if (cursors.right.isDown && cursors.up.isDown) {
        snake.movedirection(45, time);
    }
    if (cursors.left.isDown && cursors.up.isDown) {
        snake.movedirection(135, time);
    }
    if (cursors.left.isDown && cursors.down.isDown) {
        snake.movedirection(225, time);
    }
    if (cursors.right.isDown && cursors.down.isDown) {
        snake.movedirection(315, time);
    }
    if (cursors.left.isDown) {
        snake.movedirection(180, time);
    }
    if (cursors.down.isDown) {
        snake.movedirection(270, time);
    }
    if (cursors.right.isDown) {
        snake.movedirection(0, time);
    }
    if (cursors.up.isDown) {
        snake.movedirection(90, time);
    }
}

