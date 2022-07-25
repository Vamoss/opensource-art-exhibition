/******************
Code by Vamoss
Original code link:
https://openprocessing.org/sketch/1618424

Author links:
http://vamoss.com.br
http://twitter.com/vamoss
http://github.com/vamoss
******************/

var colors 

var dots = [];
var centerX;
const modulo = 30;

function setup() {
  createCanvas(600, 600); 
  frameRate(30);
  background(255);
  noStroke();
	
	colors = ["#23E5CA", "#23E5CA", "#23E5CA", "#100DE6", "#F94325", "#DF628A", "#E2658B", "#F0BB73", "#453CA5"];
  colors = colors.map(c => c = color(c));
	
  centerX = width/2;
  
  for(var i=0; i<300; i++){
    dots.push(new Dot());
    dots[i].setup(i);
  }
} 

function draw() {
  
  for(var i=0; i<dots.length; i++){
    var modIndex = mod(i-modulo, modulo);
    if(dots[i].radius>dots[modIndex].radius) {
      dots[i].amplitude = dots[modIndex].amplitude;
      dots[i].size = dots[modIndex].size;
      dots[i].col = dots[modIndex].col;
    }else if(random(1)>0.95){
      dots[i].amplitude = random(1);
      dots[i].size = random(1);
      dots[i].col = random(colors);
    }
    
    dots[i].update();
    dots[i].draw();
  }
}

function mod(x, m) {
    return (x%m + m)%m;
}

class Dot
{ 
  setup(i) {
		this.pos = createVector(0, 0, 10);
		this.velocity = random(50, 100);
		this.counter = random(1000);
		this.size = 0;
		this.curSize = 0;
		this.amplitude;
		this.curAmplitude = 0;
		this.radius = 0;
		this.radiusCounter = 0;
		this.index = i;
		this.col = random(colors);
		this.curCol = random(colors);
  }
  
  update(){
   this.curAmplitude+=(this.amplitude-this.curAmplitude)*0.001;
   this.curCol = lerpColor(this.curCol, this.col, .03);
   this.radiusCounter-=1.5;
   this.radius = this.radiusCounter + this.curAmplitude*100;
   if(this.radius < 0) {
     this.radiusCounter = centerX/2 + this.index/modulo*10;
     this.curSize = 0;
   }else{
     this.curSize+=(this.size-this.curSize)*0.01;
   }
   this.pos.x = cos((this.index+frameCount/this.velocity)/modulo*TWO_PI)*this.radius+centerX;
   this.pos.y = sin((this.index+frameCount/this.velocity)/modulo*TWO_PI)*this.radius+centerX; 
  }
  
  draw(){
    fill(this.curCol);
    push();
    ellipse(this.pos.x, this.pos.y, this.curSize*10, this.curSize*10);
    pop();
  }
}