// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth - 25;
canvas.height = window.innerHeight - 25;
document.body.appendChild(canvas);

// Image map
var imageMap = {};
if(localStorage.getItem('imageMap') === null) {
	loadAssets("https://dl.dropboxusercontent.com/u/3057457/sheet.xml");
}
imageMap = JSON.parse(localStorage.getItem('imageMap'));

var imageMapReady = false;
var imageMapSprite = new Image();
imageMapSprite.onload = function() {
	imageMapReady = true;
};
imageMapSprite.src = "images/sprite/sheet.png";

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/bg/blue.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";

// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};
var mouse = {};
var monster = {};
var monstersCaught = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener("mouseclick", function(e) {
	console.log("mouse clicked");
}, false);

addEventListener("mousemove", function(e) {
	mouse.x = e.clientX;
	mouse.y = e.clientY;
}, false);

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a monster
var reset = function(heroX, heroY) {
	hero.x = heroX;
	hero.y = heroY;

	// Throw the monster somewhere on the screen randomly
	monster.x = 32 + randomW();
	monster.y = 32 + randomH();
};

var randomW = function() {
	return Math.random() * (canvas.width - 64);
};

var randomH = function() {
	return Math.random() * (canvas.height - 64);
};

// Update game objects
var update = function (modifier) {
	if (87 in keysDown) { // Player holding up
		hero.y -= hero.speed * modifier;
	}
	if (83 in keysDown) { // Player holding down
		hero.y += hero.speed * modifier;
	}
	if (65 in keysDown) { // Player holding left
		hero.x -= hero.speed * modifier;
	}
	if (68 in keysDown) { // Player holding right
		hero.x += hero.speed * modifier;
	}

	// Outside of the map?


	// Are they touching?
	if (
		hero.x <= (monster.x + 32) &&
		monster.x <= (hero.x + 32) &&
		hero.y <= (monster.y + 32) &&
		monster.y <= (hero.y + 32)
	) {
		++monstersCaught;
		reset(hero.x, hero.y);
	}
};

// Draw everything
var render = function () {
	if (bgReady) {
		for (var w = 0; w < canvas.width; w += bgImage.width) {
			for (var h = 0; h < canvas.height; h += bgImage.height) {
				ctx.drawImage(bgImage, w, h);
			}
		}
	}

	if(imageMapReady) {
		hero.angle = Math.atan2(hero.y - mouse.y, hero.x - mouse.x) * 180 / Math.PI;
		renderSprite("playerShip3_green", hero.x, hero.y, hero.angle);
	}

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}


	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);
};

var renderSprite = function(name, x, y, angle) {
	try {
		var cockpit = new AtlasImage();
		cockpit.load(imageMap[name]);
		ctx.save();
		ctx.translate(x + cockpit.width/2, y + cockpit.height/2); //move focus to middle position (middle of the ship)
		ctx.rotate(angle);
		cockpit.render(imageMapSprite, x, y);
		ctx.restore();
	}
	catch(e) {
		console.log("Error while loading sprite: ", name, " - ", e);
	}
	
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset(500, 500);
main();
