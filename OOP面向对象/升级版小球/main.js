const BALLS_COUNT = 2;
const BALL_SIZE_MIN = 10;
const BALL_SIZE_MAX = 20;
const BALL_SPEED_MAX = 7;

// 设定画布
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// 设定画布长宽
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// 生成随机数的函数
function random(min, max) {
  return Math.floor(Math.random() * (max-min)) + min;
}

// 生成随机颜色的函数
function randomColor() {
  return 'rgb(' +
         random(0, 255) + ', ' +
         random(0, 255) + ', ' +
         random(0, 255) + ')';
}

// 定义 Shpae 构造器
function Shape(x, y, velX, velY, exists) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.exists = exists;
}
//绘制函数
function Ball(x, y, velX, velY, color, size){
  Shape.call(this, x, y, velX, velY, true);
  this.color = color;
  this.size = size;
 
}
// 定义绘制球的函数
Ball.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
};

// 定义更新球的函数
Ball.prototype.update = function() {
  if((this.x + this.size) >= width) {
    this.velX = -(this.velX);
  }

  if((this.x - this.size) <= 0) {
    this.velX = -(this.velX);
  }

  if((this.y + this.size) >= height) {
    this.velY = -(this.velY);
  }

  if((this.y - this.size) <= 0) {
    this.velY = -(this.velY);
  }

  this.x += this.velX;
  this.y += this.velY;
};

// 定义碰撞检测函数
Ball.prototype.collisionDetect = function() {
  for(let j = 0; j < balls.length; j++) {
    if(this !== balls[j]) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].color = this.color = randomColor();        
      }
    }
  }
};


//--------------------绘制恶魔圈--------------------------

function EvilCircle(x, y, exists){
  Shape.call(this, x, y, 20, 20, exists);
  this.color = 'white';
  this.size = 20;
}

EvilCircle.prototype.draw = function(){
  ctx.beginPath();
  ctx.lineWidth = '3';
  ctx.strokeStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.stroke();
  
}
EvilCircle.prototype.checkBounds = function(){
  if((this.x + this.size) >= width) {
    this.x -= this.size;
  }

  if((this.x - this.size) <= 0) {
    this.x += this.size;
  }

  if((this.y + this.size) >= height) {
    this.y -= this.size;
  }

  if((this.y - this.size) <= 0) {
    this.y += this.size;
  }

}
EvilCircle.prototype.setControls = function(){
  window.onkeydown = e => {
    if (e.key === 'a') {
      this.x -= this.velX;
    } else if (e.key === 'd') {
      this.x += this.velX;
    } else if (e.key === 'w') {
      this.y -= this.velY;
    } else if (e.key === 's') {
      this.y += this.velY;
    }
  };
}

EvilCircle.prototype.collisionDetect = function(){
  for(let j = 0; j < balls.length; j++) {
    if(this !== balls[j]) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].exists = false;        
      }
    }
  }
}

// 定义一个数组来保存所有的球
const balls = [];

//创建一个新恶魔圈

var circle = new EvilCircle(width/2, height/2, true);
circle.setControls();

var myi = document.getElementById("count");

// 定义一个循环来不停地播放
function loop() {
  ctx.fillStyle = 'rgb(0, 0, 0, 0.25)';
  ctx.fillRect(0, 0, width, height);
  
  while(balls.length < BALLS_COUNT) {
    const size = random(BALL_SIZE_MIN, BALL_SIZE_MAX);
    const ball = new Ball(
      // 为避免绘制错误，球至少离画布边缘球本身一倍宽度的距离
      random(0 + size, width - size),
      random(0 + size, height - size),
      random(-BALL_SPEED_MAX, BALL_SPEED_MAX),
      random(-BALL_SPEED_MAX, BALL_SPEED_MAX),
      randomColor(),
      size
    );
    balls.push(ball);
  }
  circle.draw();
  circle.checkBounds();
  circle.collisionDetect();

  for(let i = 0; i < balls.length; i++) {
    if(balls[i].exists == true)
    {
      balls[i].draw();
      balls[i].update();
      balls[i].collisionDetect();
    }
  }
  if(counter() == 0)  
    return function(){
            alert("赢了!");
            
          }
  requestAnimationFrame(loop);
}

function counter(){
  var count = 0;
  for(var i = 0; i < balls.length; i++){
    
    if(balls[i].exists == true) {
      count++;
    }
  }
  if(count <= 0) {
    count = 0;
    
  }
  myi.innerHTML = count;
  return count;
}

loop();
