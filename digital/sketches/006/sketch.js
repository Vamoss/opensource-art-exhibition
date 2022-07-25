/******************
Code by Vamoss
Original code link:
https://openprocessing.org/sketch/397772

Author links:
http://vamoss.com.br
http://twitter.com/vamoss
http://github.com/vamoss
******************/

var centerX, centerY;

const amplitude = 10;

const totalAnswers = 5;
const answerHeight = 100;
var answers = [];

function setup(){
  createCanvas(800, totalAnswers*answerHeight); 

  centerX = width/2;
  centerY = answerHeight/2;
  
  for(var answer = 0; answer < totalAnswers; answer++){
  	answers.push(new Answer());
    answers[answer].setup();
  }
}

function draw(){
  background(255);
  
  for(var answer = 0; answer < totalAnswers; answer++){
    push();
      translate(0, answer*answerHeight-answer);
      answers[answer].draw();
    pop();
  }
}

class Answer
{
  setup() {
    this.extreme1 = new Extreme();
    this.extreme2 = new Extreme();
    this.ballance = new Ballance();

    this.extreme1.setup(centerX-centerX/2, centerY);
    this.extreme2.setup(centerX+centerX/2, centerY);
    this.ballance.setup();
  } 

  draw() {
    rect(0, 0, width-1, answerHeight-1);

    this.extreme1.update();
    this.extreme2.update();

    var abism = (this.extreme2.pos.x-this.extreme1.pos.x);
    this.ballance.update(this.extreme1.pos.x+abism/2);

    var prevX = 0;
    var prevY = 0;
    for(var x = this.extreme1.pos.x; x < this.extreme2.pos.x; x+=5){
      var percent = (x-this.extreme1.pos.x)/abism;
      var y = centerY + amplitude * (this.cardiogram(percent, this.extreme1.pulse) + this.cardiogram(percent, 1-this.extreme2.pulse));
      if(prevX!=0) line(prevX, prevY, x, y);
      prevX = x;
      prevY = y;
    }

    this.extreme1.draw(this.cardiogram(0.0, this.extreme1.pulse) + this.cardiogram(0.0, 1-this.extreme2.pulse));
    this.extreme2.draw(this.cardiogram(1.0, this.extreme1.pulse) + this.cardiogram(1.0, 1-this.extreme2.pulse));

    var percent = (this.ballance.pos.x-this.extreme1.pos.x)/abism;
    this.ballance.draw(this.cardiogram(percent, this.extreme1.pulse) + this.cardiogram(percent, 1-this.extreme2.pulse));
  }

  cardiogram(percent, time){
    var d = pow((1-abs(percent-(time-0.2)*2)), 5);
    return sin(percent*TWO_PI*10.+frameCount/5)*d;
  }
}

class Extreme
{  
  setup(x, y) {
		this.origin = createVector(x, y);
		this.lastFrameChangeTime = 0;
		this.changeTime = 120;
		this.goX = 0;
		this.pulse = 0;
		this.delay = random(5, 30);
		this.pos = createVector(x, y);
  }
  
  update(){
    if(frameCount - this.lastFrameChangeTime > this.changeTime+this.delay){
      this.lastFrameChangeTime = frameCount;
      var prevGoX = this.goX;
      while(abs(this.goX-prevGoX)<30) this.goX = random(-100, 100);
      this.delay = random(0, 120);
    }
		this.pulse = (frameCount - this.lastFrameChangeTime) / this.changeTime;
		if(this.pulse>1) this.pulse = 1;

		this.pos.x += ((this.origin.x+this.goX) - this.pos.x) * 0.09;
  }
  
  draw(y){
    ellipse(this.pos.x, this.pos.y+y*amplitude, 10, 10);
  }
}

class Ballance
{
  setup() {
		this.pos = createVector(centerX, centerY);
		this.velX = 0;
		this.prevX = 0;
  }
  
	update(x){
		this.pos.x += (x - this.pos.x) * 0.05;
	}
  
  draw(y){
    var y = this.pos.y+y*amplitude;
    this.velX = (this.prevX-this.pos.x);
    
    push();
    translate(this.pos.x, y);
    rotate(this.velX);
    rect(-5, 0, 10, -30);
    pop();
    
    this.prevX = this.pos.x;
  }
}