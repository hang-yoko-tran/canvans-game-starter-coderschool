/*
  Code modified from:
  http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
  using graphics purchased from vectorstock.com
*/

/* Initialization.
Here, we create and add our "canvas" to the page.
We also load all of our images. 
*/


let canvas;
let ctx;
let username = 'Anonymous';
canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.getElementById("canvas").appendChild(canvas);

let bgReady, heroReady, monsterReady;
let bgImage, heroImage, monsterImage;


let startTime = Date.now();
const SECONDS_PER_ROUND = 30;
let elapsedTime = 0;
let score = 0;


function getAppState() {
  return JSON.parse(localStorage.getItem('appSate')) || {
    currentHighScore: 0,
    bestPlayer: username,
    currentUser: document.getElementById('user-name').innerHTML || 'Anonymous',
  }

}

function save(appState) {
  return localStorage.setItem('appSate', JSON.stringify(appState))
}

function signIn() {
  username = document.getElementById("user-name").value;
  appState = getAppState();
  appState.currentUser = username;
  document.getElementById("take-username").innerHTML = username;
  save(appState);
}

function loadImages() {
  bgImage = new Image();
  bgImage.onload = function () {
    // show the background image
    bgReady = true;
  };
  bgImage.src = "images/background_2.png";
  heroImage = new Image();
  heroImage.onload = function () {
    // show the hero image
    heroReady = true;
  };
  heroImage.src = "images/bird_1.png";

  monsterImage = new Image();
  monsterImage.onload = function () {
    // show the monster image
    monsterReady = true;
  };
  monsterImage.src = "images/moon.png";
}

/** 
 * Setting up our characters.
 * 
 * Note that heroX represents the X position of our hero.
 * heroY represents the Y position.
 * We'll need these values to know where to "draw" the hero.
 * 
 * The same applies to the monster.
 */

let heroX = canvas.width / 2;
let heroY = canvas.height / 2;

let monsterX = 100;
let monsterY = 100;

/** 
 * Keyboard Listeners
 * You can safely ignore this part, for now. 
 * 
 * This is just to let JavaScript know when the user has pressed a key.
*/
let keysDown = {};
function setupKeyboardListeners() {
  // Check for keys pressed where key represents the keycode captured
  // For now, do not worry too much about what's happening here. 
  addEventListener("keydown", function (key) {
    keysDown[key.keyCode] = true;
  }, false);

  addEventListener("keyup", function (key) {
    delete keysDown[key.keyCode];
  }, false);
}


/**
 *  Update game objects - change player position based on key pressed
 *  and check to see if the monster has been caught!
 *  
 *  If you change the value of 5, the player will move at a different rate.
 */
let update = function () {
  // Update the time.
  elapsedTime = Math.floor((Date.now() - startTime) / 1000);

  if (elapsedTime)

    if (38 in keysDown) { // Player is holding up key
      heroY -= 5;
    }
  if (40 in keysDown) { // Player is holding down key
    heroY += 5;
  }
  if (37 in keysDown) { // Player is holding left key
    heroX -= 5;
  }
  if (39 in keysDown) { // Player is holding right key
    heroX += 5;
  }


  // Hero going left off screen
  if (heroX <= 0) {
    heroX = 0
  }

  // Hero going right off screen
  if (heroX >= 480) {
    heroX = 480;
  }

  // Hero going up off screen
  if (heroY <= 0) {
    heroY = 0
  }

  // Hero going down off screen
  if (heroY >= 450) {
    heroY = 450;
  }



  // Check if player and monster collided. Our images
  // are about 32 pixels big.
  if (
    heroX <= (monsterX + 32)
    && monsterX <= (heroX + 32)
    && heroY <= (monsterY + 32)
    && monsterY <= (heroY + 32)
  ) {
    // Pick a new location for the monster.
    // Note: Change this to place the monster at a new, random location.
    score++;
    // console.log("score");

    document.getElementById("score").innerHTML = score;
    monsterX = Math.floor(Math.random() * canvas.width - 10);
    monsterY = Math.floor(Math.random() * canvas.height - 10);
    const appState = getAppState();
    console.log('appstore', appState);
    if (score > appState.currentHighScore) {
      appState.currentHighScore = score;
      appState.bestPlayer = username;
    }
    save(appState);
  }
};


function reset() {
  window.location.reload()
}

/**
 * This function, render, runs as often as possible.
 */
var render = function () {
  ctx.font = "16px ArialÏ"
  if (elapsedTime < SECONDS_PER_ROUND) {
    if (bgReady) {
      ctx.drawImage(bgImage, 0, 0);
    }
    if (heroReady) {
      ctx.drawImage(heroImage, heroX, heroY);
    }
    if (monsterReady) {
      ctx.drawImage(monsterImage, monsterX, monsterY);
    }
    ctx.fillText(`Seconds Remaining: ${SECONDS_PER_ROUND - elapsedTime}`, 10, 10);
    document.getElementById("timer").innerHTML = 30 - elapsedTime;
  } else {
    ctx.fillText(`GAME OVER`, 400, 400);
    // return;
  }

};

/**
 * The main game loop. Most every game will have two distinct parts:
 * update (updates the state of the game, in this case our hero and monster)
 * render (based on the state of our game, draw the right things)
 */
var main = function () {
  update();
  render();
  // Request to do this again ASAP. This is a special method
  // for web browsers. 
  requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame.
// Safely ignore this line. It's mostly here for people with old web browsers.
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
loadImages();
setupKeyboardListeners();
appState = getAppState();
document.getElementById("high-score").innerHTML = appState.currentHighScore;
document.getElementById("best-player").innerHTML = appState.bestPlayer;
main();