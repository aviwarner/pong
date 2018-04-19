let table_canvas = document.getElementById('table');
let table_context = table_canvas.getContext("2d");

let player = new Paddle(15, 15, 15, 80);
let computer = new Paddle(670, 200, 15, 80);
let ball = new Ball(250, 250, 15);

function Paddle(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
}

function Ball(x, y, radius) {
  this.x = x;
  this.y = y;
  this.radius = radius;
}

Paddle.prototype.render = function() {
  table_context.fillRect(this.x, this.y, this.width, this.height);
};

Ball.prototype.render = function() {
  table_context.beginPath();
  table_context.arc(this.x, this.y, this.radius, Math.PI * 2, false);
  table_context.closePath();
  table_context.fillStyle = "#000";
  table_context.fill();
}

prepTable = function() {
  table_context.moveTo(349.5, 0);
  table_context.lineTo(349.5, 550);
  table_context.strokeStyle = "#888";
  table_context.stroke();
}

window.onload = function() {
  player.render();
  computer.render();
  ball.render();
  prepTable();
}
