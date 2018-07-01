let player = new Paddle(20, 225, 15, 100, 14);
let computer = new Paddle(765, 225, 15, 100, 5);
let ball = new Ball(400, 275, 15, 0, 0);
let playerScore = 0;
let computerScore = 0;
let score = '';
let result = 'Press \'Space\' to start.';
let winningScore = 11;
let activeGame = false;

let keys = [];
let mouseY = [];

let controls = 'keyboard';

let hit = new Audio('/bloop.wav');

function step() {
  let canvas = document.getElementById('table');
  let ctx = canvas.getContext("2d");

  canvas.width = 800;
  canvas.height = 550;
  prepTable(ctx);
  scoreDisplay();

  computer.render(ctx);
  player.render(ctx);

  // set control scheme from radio button
  if (document.getElementById('r_keyboard').checked) {
    controls = 'keyboard';
  } else {
    controls = 'mouse';
  }

  if (activeGame) { // activate controls if there's an active game

    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.font = "150px monospace";
    ctx.fillText(playerScore, 150, 315);
    ctx.fillText(computerScore, 550, 315);

    ball.render(ctx);
    ball.bounce(canvas);

    // control by keyboard or mouse depending on selected control scheme
    if (controls === 'keyboard') {
      if (keys['ArrowDown']) {
        player.down();
      } else if (keys['ArrowUp']) {
        player.up();
      }
    } else if (controls === 'mouse') {
      if (mouseY[1] !== 0 && mouseY[0] >= 50 && mouseY[0] <= 500) {
        player.y = mouseY[0] - 50;
      }
    }
  } else {
    menuOverlay(ctx);
  }

  if (ball.velX === 0) { // ball not in play, reset computer position
    computer.reset();
  } else if (ball.y <= computer.y + (computer.height/2)) { // ball higher than computer, move computer up
    computer.up();
  } else { // ball lower than computer, move computer down
    computer.down();
  }

  if (keys[" "]) { // serve the ball when pressing space
    ball = new Ball(400, 275, 15, 0, 0);
    ball.serve();
    keys[" "] = false;
    activeGame = true;
    wawametrics.report('Ball Served')
  }

  if (keys["o"]) { // serve the ball when pressing space

    // keys["o"] = false;
  }

  // document.getElementById("score").innerHTML = `${score}`

  window.requestAnimationFrame(step);
}

let animate = window.requestAnimationFrame(step) ||
              function(callback) { window.setTimeout(callback, 1000/60) };

function Paddle(x, y, width, height, speed) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.speed = speed;
}

function Ball(x, y, radius, velX, velY) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.velX = velX;
  this.velY = velY;
}

menuOverlay = function(ctx) {
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(0, 0, 800, 550);
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(255, 255, 255, 1)";
  ctx.font = "60px monospace";
  ctx.fillText("PONG", 400, 70);
  ctx.font = "30px monospace";
  ctx.fillText(result, 400, 140);
}

Paddle.prototype.render = function(ctx) {
  ctx.fillRect(this.x, this.y, this.width, this.height);
};

Paddle.prototype.up = function() {
  if (this.y > 0) {
    this.y -= this.speed;
  }
}

Paddle.prototype.down = function() {
  if (this.y < 450) {
    this.y += this.speed;
  }
}

Paddle.prototype.reset = function() {
  if (this.y > 225) {
    this.up();
  } else if (this.y < 225) {
    this.down();
  }
}

Ball.prototype.render = function(ctx) {
  this.x += this.velX;
  this.y += this.velY;
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.radius, Math.PI * 2, false);
  ctx.closePath();
  ctx.fillStyle = "#000";
  ctx.fill();
}

Ball.prototype.serve = function() {
  if (playerScore === winningScore || computerScore === winningScore) {
    playerScore = 0;
    computerScore = 0;
  }

  let xPlusMinus = Math.random() < 0.5 ? -1 : 1;
  let yPlusMinus = Math.random() < 0.5 ? -1 : 1;

  this.velX = (6 + (3 * Math.random())) * xPlusMinus;
  this.velY = (4 + (5.5 * Math.random())) * yPlusMinus;
  console.log(this.velX, this.velY);
}

Ball.prototype.reset = function() {
  this.velY = 0;
  this.velX = 0;
  this.x = 400;
  this.y = 275;
}

Ball.prototype.bounce = function(canvas) {
  if (this.x > (canvas.width - this.radius)) {
    // player scores
    ball.reset();
    playerScore++;
  } else if (this.x < 0 + this.radius) {
    // computerScore
    ball.reset();
    computerScore++;
  } else if ((this.y < 0 + this.radius) || (this.y > canvas.height - this.radius)) {
    // ball hits Top/Bottom
    this.velY = this.velY * -1;
  } else if ((this.y >= player.y && this.y <= (player.y + player.height)) && this.x <= (player.width + 20 + this.radius)) {
    // ball hits player
    this.velX = this.velX * -1;
    this.x += 10;
    // increase ball speed if player paddle moving
    if (keys['ArrowDown'] || keys['ArrowUp']) {
      this.velY = this.velY * 1.1;
      this.velX = this.velX * 1.1;
    }
    hit.play();
  } else if ((this.y >= computer.y && this.y <= (computer.y + computer.height)) && this.x >= (765 - this.radius)) {
    // ball hits computer
    this.velX = this.velX * -1;
    this.x -= 10;
    hit.play();
  }
}

prepTable = function(ctx) {
  ctx.moveTo(399.5, 0);
  ctx.lineTo(400.5, 550);
  ctx.strokeStyle = "#888";
  ctx.stroke();
}

scoreDisplay = function() {
  if (playerScore < winningScore && computerScore < winningScore) {
    score = `Player: ${playerScore} -=- Computer: ${computerScore}`
  } else if (playerScore === winningScore) {
    activeGame = false;
    player.reset();
    wawametrics.report('Player won');
    result = `You won! Press SPACE to restart game`
  } else if (computerScore === winningScore){
    activeGame = false;
    player.reset();
    wawametrics.report('Player lost');
    result = `You lost. Press SPACE to restart game`
  }
}

window.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});

window.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

document.getElementById('table').addEventListener("mousemove", (e) => {
  mouseY[0] = e.clientY;
  mouseY[1] = e.movementY;
});

var wawametrics = {};

wawametrics.report = function(eventName) {
  var event = { event: { name: eventName } };
  var request = new XMLHttpRequest();
  request.open("POST", "http://localhost:3000/api/events", true);
  request.setRequestHeader('Content-Type', 'application/json');
  console.log(event);
  request.send(JSON.stringify(event));
}
