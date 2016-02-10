function distance(a, b) {
  var dx = a.x - b.x;
  var dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Circle(game) {
  this.radius = circleRadius;
  this.red = getRandomNumber(0, 255);
  this.green = getRandomNumber(0, 255);
  this.blue = getRandomNumber(0, 255);
  this.color = 'rgb(' + this.red + ',' + this.green + ',' + this.blue + ')';
  Entity.call(this, game, this.radius + Math.random() * (800 - this.radius * 2), this.radius + Math.random() * (600 - this.radius * 2));
  this.velocity = {x: Math.random() * 1000, y: Math.random() * 1000};
  var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
  if (speed > maxSpeed) {
    var ratio = maxSpeed / speed;
    this.velocity.x *= ratio;
    this.velocity.y *= ratio;
  }
}
;



Circle.prototype = new Entity();
Circle.prototype.constructor = Circle;


Circle.prototype.collide = function (other) {
  return distance(this, other) < this.radius + other.radius;
};

Circle.prototype.collideLeft = function () {
  return (this.x - this.radius) < 0;
};

Circle.prototype.collideRight = function () {
  return (this.x + this.radius) > 800;
};

Circle.prototype.collideTop = function () {
  return (this.y - this.radius) < 0;
};

Circle.prototype.collideBottom = function () {
  return (this.y + this.radius) > 600;
};

Circle.prototype.update = function () {
  this.x += this.velocity.x * this.game.clockTick;
  this.y += this.velocity.y * this.game.clockTick;

  if (this.collideLeft() || this.collideRight()) {
    this.velocity.x = -this.velocity.x * friction;
    if (this.collideLeft())
      this.x = this.radius;
    if (this.collideRight())
      this.x = 800 - this.radius;
    this.x += this.velocity.x * this.game.clockTick;
    this.y += this.velocity.y * this.game.clockTick;
  }

  if (this.collideTop() || this.collideBottom()) {
    this.velocity.y = -this.velocity.y * friction;
    if (this.collideTop())
      this.y = this.radius;
    if (this.collideBottom())
      this.y = 600 - this.radius;
    this.x += this.velocity.x * this.game.clockTick;
    this.y += this.velocity.y * this.game.clockTick;
  }

  for (var i = 0; i < this.game.entities.length; i++) {
    var ent = this.game.entities[i];
    if (ent !== this && this.collide(ent)) {
      var temp = {x: this.velocity.x, y: this.velocity.y};

      var dist = distance(this, ent);
      var delta = this.radius + ent.radius - dist;
      var difX = (this.x - ent.x) / dist;
      var difY = (this.y - ent.y) / dist;

      this.x += difX * delta / 2;
      this.y += difY * delta / 2;
      ent.x -= difX * delta / 2;
      ent.y -= difY * delta / 2;

      this.velocity.x = ent.velocity.x * friction;
      this.velocity.y = ent.velocity.y * friction;
      ent.velocity.x = temp.x * friction;
      ent.velocity.y = temp.y * friction;
      this.x += this.velocity.x * this.game.clockTick;
      this.y += this.velocity.y * this.game.clockTick;
      ent.x += ent.velocity.x * this.game.clockTick;
      ent.y += ent.velocity.y * this.game.clockTick;

      if (swapColors) {
        var colorToSwap = getRandomNumber(0, 2);
        if (colorToSwap === 0) {
          var thisColor = this.red;
          var entColor = ent.red;
          this.red = entColor;
          ent.red = thisColor;
        } else if (colorToSwap === 1) {
          var thisColor = this.green;
          var entColor = ent.green;
          this.green = entColor;
          ent.green = thisColor;
        } else {
          var thisColor = this.blue;
          var entColor = ent.blue;
          this.blue = entColor;
          ent.blue = thisColor;
        }
      }

      var whoGetsBig = getRandomNumber(0, 1);
      if (whoGetsBig === 0) {
        this.radius = this.radius * rateOfGrowth;
        ent.radius = ent.radius / rateOfGrowth;
      } else {
        ent.radius = ent.radius * rateOfGrowth;
        this.radius = this.radius / rateOfGrowth;
      }

      this.color = 'rgb(' + this.red + ',' + this.green + ',' + this.blue + ')';
      ent.color = 'rgb(' + ent.red + ',' + ent.green + ',' + ent.blue + ')';
    }


  }


  this.velocity.x -= (1 - friction) * this.game.clockTick * this.velocity.x;
  this.velocity.y -= (1 - friction) * this.game.clockTick * this.velocity.y;
  Entity.prototype.update.call(this);
};

Circle.prototype.draw = function (ctx) {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
  ctx.fill();
  ctx.closePath();

};

document.getElementById('startButton').onclick = function () {
  maxSpeed = parseFloat(document.getElementById('maxSpeed').value);
  circleRadius = parseFloat(document.getElementById('circleRadius').value);
  friction = parseFloat(document.getElementById('friction').value);
  numCircles = parseFloat(document.getElementById('numCircles').value);
  rateOfGrowth = parseFloat(document.getElementById('rateOfGrowth').value);
  if (document.getElementById("swapColors").checked)
    swapColors = 1;
  else
    swapColors = 0;
  for (var i = 0; i < gameEngine.entities.length; i++) {
    gameEngine.entities[i].removeFromWorld = true;
  }

  for (var i = 0; i < numCircles; i++) {
    var circle = new Circle(gameEngine);
    gameEngine.addEntity(circle);
  }


};

document.getElementById('resetButton').onclick = function () {
  document.getElementById("currentValue0").innerHTML = 200;
  document.getElementById("currentValue1").innerHTML = 20;
  document.getElementById("currentValue2").innerHTML = 1;
  document.getElementById("currentValue3").innerHTML = 15;
  document.getElementById("currentValue4").innerHTML = 1;
  friction = 1;
  maxSpeed = 200;
  circleRadius = 20;
  numCircles = 15;
  rateOfGrowth = 1;
  swapColors = 1;
  for (var i = 0; i < gameEngine.entities.length; i++) {
    gameEngine.entities[i].removeFromWorld = true;
  }
  for (var i = 0; i < numCircles; i++) {
    var circle = new Circle(gameEngine);
    gameEngine.addEntity(circle);
  }
};


// the "main" code begins here
var friction = 1;
var maxSpeed = 200;
var circleRadius = 20;
var numCircles = 15;
var rateOfGrowth = 1;
var swapColors = 1;
var gameEngine;

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/white.png");

ASSET_MANAGER.downloadAll(function () {
  console.log("starting up da sheild");
  var canvas = document.getElementById('gameWorld');
  var ctx = canvas.getContext('2d');

  gameEngine = new GameEngine();
  for (var i = 0; i < numCircles; i++) {
    var circle = new Circle(gameEngine);
    gameEngine.addEntity(circle);
  }
  gameEngine.init(ctx);
  gameEngine.start();
});
