let player = new Paddle(20, 200, 15, 100, 13);
let computer = new Paddle(765, 200, 15, 100, 4.5);
let ball = new Ball(400, 275, 15, 0, 0);

let keys = [];

function step() {
  let canvas = document.getElementById('table');
  let ctx = canvas.getContext("2d");

  canvas.width = 800;
  canvas.height = 550;
  prepTable(ctx);

  computer.render(ctx);
  player.render(ctx);
  ball.render(ctx);
  ball.bounce(canvas);

  if (keys['ArrowDown']) {
    player.down();
  } else if (keys['ArrowUp']) {
    player.up();
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
  }

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
  if (this.y > 200) {
    this.up();
  } else if (this.y < 200) {
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
  let xPlusMinus = Math.random() < 0.5 ? -1 : 1;
  let yPlusMinus = Math.random() < 0.5 ? -1 : 1;
  this.velX = (3 + (5 * Math.random())) * xPlusMinus;
  this.velY = (3 + (5 * Math.random())) * yPlusMinus;
  console.log(this.velX, this.velY);
}

Ball.prototype.bounce = function(canvas) {
  if ((this.x > canvas.width - this.radius) || (this.x < 0 + this.radius)) {
    // ball hits R/L edge, reset
    this.velY = 0;
    this.velX = 0;
    this.x = 400;
    this.y = 275;
  } else if ((this.y < 0 + this.radius) || (this.y > canvas.height - this.radius)) {
    // ball hits Top/Bottom
    this.velY = this.velY * -1;
  } else if ((this.y >= player.y && this.y <= (player.y + player.height)) && this.x <= (player.width + 20 + this.radius)) {
    // ball hits player
    this.velX = this.velX * -1;
    // increase ball speed if player paddle moving
    if (keys['ArrowDown'] && player.y < 450) {
      this.velY += 1.5;
    } else if (keys['ArrowUp'] && player.y > 0) {
      this.velY -= 1.5;
    }
  } else if ((this.y >= computer.y && this.y <= (computer.y + computer.height)) && this.x >= (765 - this.radius)) {
    // ball hits computer
    this.velX = this.velX * -1;
  }
}

prepTable = function(ctx) {
  ctx.moveTo(399.5, 0);
  ctx.lineTo(400.5, 550);
  ctx.strokeStyle = "#888";
  ctx.stroke();
}

window.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});

window.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});
