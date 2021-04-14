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

var players = [];
var controllers = [];
var snake;
var cursors;
var food;

//  Direction consts
var UP = 0;
var DOWN = 1;
var LEFT = 2;
var RIGHT = 3;

function preload ()
{
    this.load.image('food', 'https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/games/snake/food.png');
    this.load.image('body', 'https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/games/snake/body.png');
}

function create ()
{
    
    food = new Food(this, 3, 4);

    //player one controls and player
    players[0] = new Snake(this, 8, 8);
    controllers[0] = this.input.keyboard.createCursorKeys(); //  Create our keyboard controls
    players[1] = new Snake(this, 1, 1);
    controllers[1] = this.input.keyboard.createCursorKeys(); //  Create our keyboard controls
}

function update (time, delta)
{
    // if (!snake.alive)
    // {
    //     return;
    // }

    /**
    * Check which key is pressed, and then change the direction the snake
    * is heading based on that. The checks ensure you don't double-back
    * on yourself, for example if you're moving to the right and you press
    * the LEFT cursor, it ignores it, because the only valid directions you
    * can move in at that time is up and down.
    */
    // main player
    snake = players[0];
    cursors = controllers[0];
    if (cursors.left.isDown) {
        sendmove("left");
        snake.faceLeft();
    } else if (cursors.right.isDown) {
        sendmove("right");
        snake.faceRight();
    } else if (cursors.up.isDown) {
        sendmove("up");
        snake.faceUp();
    } else if (cursors.down.isDown) {
        sendmove("down");
        snake.faceDown();
    }
    for (let index = 0; index < players.length; index++) {
        snake = players[index];
        cursors = controllers[index];
        if (snake.update(time)) {
            //  If the snake updated, we need to check for collision against food
            if (snake.collideWithFood(food)) {
                repositionFood();
            }
        }
    }
}

/**
* We can place the food anywhere in our 40x30 grid
* *except* on-top of the snake, so we need
* to filter those out of the possible food locations.
* If there aren't any locations left, they've won!
*
* @method repositionFood
* @return {boolean} true if the food was placed, otherwise false
*/
function repositionFood ()
{
    //  First create an array that assumes all positions
    //  are valid for the new piece of food

    //  A Grid we'll use to reposition the food each time it's eaten
    var testGrid = [];

    for (var y = 0; y < 30; y++)
    {
        testGrid[y] = [];

        for (var x = 0; x < 40; x++) {
            testGrid[y][x] = true;
        }
    }
    snake.updateGrid(testGrid);

    //  Purge out false positions
    var validLocations = [];

    for (var y = 0; y < 30; y++) {
        for (var x = 0; x < 40; x++) {
            if (testGrid[y][x] === true) {
                //  Is this position valid for food? If so, add it here ...
                validLocations.push({ x: x, y: y });
            }
        }
    }
    if (validLocations.length > 0){
        //  Use the RNG to pick a random food position
        var pos = Phaser.Math.RND.pick(validLocations);
        //  And place it
        food.setPosition(pos.x * 16, pos.y * 16);
        return true;
    } else {
        return false;
    }
}
