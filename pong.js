let player = new Paddle(20, 200, 15, 100, 13);
let computer = new Paddle(665, 200, 15, 100, 10);
let ball = new Ball(250, 250, 15);

let keys = [];

function step() {
  let canvas = document.getElementById('table');
  let ctx = canvas.getContext("2d");

  canvas.width = 700;
  canvas.height = 550;
  prepTable(ctx);

  computer.render(ctx);
  player.render(ctx);
  ball.render(ctx);

  if (keys['ArrowDown'] && player.y < 450) {
    player.down();
  } else if (keys['ArrowUp'] && player.y > 0) {
    player.up();
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

function Ball(x, y, radius) {
  this.x = x;
  this.y = y;
  this.radius = radius;
}

Paddle.prototype.render = function(ctx) {
  ctx.fillRect(this.x, this.y, this.width, this.height);
};

Paddle.prototype.up = function() {
  this.y -= this.speed;
}

Paddle.prototype.down = function() {
  this.y += this.speed;
}

Ball.prototype.render = function(ctx) {
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.radius, Math.PI * 2, false);
  ctx.closePath();
  ctx.fillStyle = "#000";
  ctx.fill();
}

prepTable = function(ctx) {
  ctx.moveTo(349.5, 0);
  ctx.lineTo(349.5, 550);
  ctx.strokeStyle = "#888";
  ctx.stroke();
}

window.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});

window.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});
