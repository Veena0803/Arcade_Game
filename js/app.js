'use strict';
/* Global variables */
var players = [
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png'
    ],

SCORE = 0,
LIVES = 3,
GAMESTARTED = false,
GAMEENDED = false,

// Create enemy objects.
createEnemies = function() {
    var enemies = [];
    var x = -100,
        y = 60;
    for (var i = 0; i < 6; i++) {
        enemies.push(new Enemy(Math.floor(Math.random() * (5) + 1) * x, y, Math.floor(Math.random() * (10 - 5 + 1) + 5)));
        y += 85;
        if ((i + 1) % 3 === 0) {
            y = 60;
        }
    }
    return enemies;
},

//Display gems at random positions
displayGems = function() {
    var gems = [];
    var factor = 150;
    for (var i = 0; i < 3; i++) {
        gems.push(new Gems(Math.floor(Math.random() * (factor - (factor - 150)) + (factor - 150)), Math.floor(Math.random() * (250 - 60) + 100)));
        gems.push(new Gems(Math.floor(Math.random() * (factor - (factor - 150)) + (factor - 150)), Math.floor(Math.random() * (250 - 60) + 100)));
        factor += 160;
    }
    return gems;
},

player = null;

// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.speedFactor = speed;
};



// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    var canvas = document.getElementById("mycanvas");
    if (this.x >= canvas.clientWidth + 250) {
        this.resetEnemy();
    }

    this.checkForCollision(player);
    this.x += this.speedFactor * 30 * dt;
};

/* This function will check for collision between the enemies & the player */

Enemy.prototype.checkForCollision = function(player) {
    if (!((this.x > player.x + 50) || (this.y < player.y - 87.5) || (player.x > this.x + 50) || (player.y < this.y - 87.5))) {
        player.x = 0;
        player.y = 420;
        LIVES -= 1;
    }
    return true;
};

// Helps to reset the enemy's position back on the canvas with a new speed factor
Enemy.prototype.resetEnemy = function(dt) {
    this.speedFactor = Math.floor(Math.random() * (10 - 5 + 1) + 5);
    this.x = Math.floor(Math.random() * (5) + 1) * -100;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 100, 175);
};

/* Function to draw the gems on the canvas */
var Gems = function(x, y) {
    this.sprite = 'images/Star.png';
    this.x = x;
    this.y = y;
};

/* Function to collect gems by the player */
Gems.prototype.collectGem = function(player) {
    if (!((this.x - 25 > player.x + 50) || (this.y < player.y) || (player.x > this.x + 25) || (player.y + 87.5 < this.y - 50))) {
        var index = gems.indexOf(this);
        if (index > -1) {
            gems.splice(index, 1);
            SCORE += 100;
        }
    }

};

// Function call to collect gems by the player
Gems.prototype.update = function(dt) {
    this.collectGem(player);
};

// Render function helps to draw gems on the canvas.
Gems.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 50, 100);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/char-boy.png';
    this.x = 0;
    this.y = 420;
};

player = new Player();

//To display different types of players at the bottom of the canvas.
Player.displayPlayers = function(player) {
    var x = 5;
    players.forEach(function(player) {
        ctx.drawImage(Resources.get(player), x, 535, 40, 75);
        x += 40;	
        ctx.font = "20px Arial";
        ctx.fillStyle = "black";
        ctx.fillText("LIVES:" + LIVES, 210, 590);
        ctx.fillText("SCORE:" + SCORE, 290, 590);
    });
};

// Update the player's position, required method for game
// Parameter: dt, a time delta between ticks
Player.prototype.update = function(dt) {
	var $this = this;
    // To display different players on the board at different positions.
    var canvas = document.getElementById("mycanvas");
    canvas.addEventListener("mouseup", function(e) {
        if (!GAMESTARTED && !GAMEENDED) {
            var rect = canvas.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            if ((x >= 5 && x <= 45) && (y >= 563 && y <= 605)) {
                $this.sprite = "images/char-boy.png";
                $this.render();
            } else if ((x >= 45 && x <= 85) && (y >= 563 && y <= 605)) {
                $this.sprite = "images/char-cat-girl.png";
                $this.render();
            } else if ((x >= 85 && x <= 125) && (y >= 563 && y <= 605)) {
                $this.sprite = "images/char-horn-girl.png";
                $this.render();
            } else if ((x >= 125 && x <= 165) && (y >= 563 && y <= 605)) {
                $this.sprite = "images/char-pink-girl.png";
                $this.render();
            } else if ((x >= 165 && x <= 205) && (y >= 563 && y <= 605)) {
                $this.sprite = "images/char-princess-girl.png";
                $this.render();
            }
        }
    }, false);
};

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    if (player.x > 0 || player.y < 420) {
        GAMESTARTED = true;
    }
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 100, 175);

};

Player.prototype.handleInput = function(direction) {
    switch (direction) {
        case 'left':
            this.x = this.x - 100;
            if (this.x < 0) {
                // If at edge, reset player's position and set flag.
                this.x = 0;
            }
            break;

        case 'right':
            this.x = this.x + 100;
            if (this.x > 400) {
                // If at edge, reset player's position and set flag.
                this.x = 400;
            }
            break;
        case 'up':
            this.y = this.y - 100;
            if (this.y < 0) {
                // If at edge, reset player's position and set flag.
                this.y = 0;
            }
            break;
        case 'down':
            this.y = this.y + 100;
            if (this.y > 400) {
                // If at edge, reset player's position and set flag.
                this.y = 400;
            }
            break;
        default:
            event.preventDefault();
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = createEnemies();
var gems = displayGems();
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});