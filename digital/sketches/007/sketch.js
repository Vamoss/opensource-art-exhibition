/******************
Code by Vamoss
Original code link:
https://openprocessing.org/sketch/386221

Author links:
http://vamoss.com.br
http://twitter.com/vamoss
http://github.com/vamoss
******************/

var colors;

function setup() {
  createCanvas(600, 600); 
  background(0);
	
	colors = [
		color(0, 67, 88),
		color(31, 138, 112),
		color(190, 219, 57),
		color(255, 31, 26),
		color(253, 116, 0)
	];
} 

function draw() {
  radius = random(width/2-20);
  
  //random select a color
  var col = random(colors);
  
  //circular line
  noFill();
  stroke(col);
  strokeWeight(2);
  ellipse(width/2, height/2, radius*2, radius*2);
  
  //line from center
  if(random()<0.1){
  	strokeWeight(1);
    var angle = random(PI*2);
    line(width/2, height/2, width/2+radius*sin(angle), height/2+radius*cos(angle));
  }
  
  //circles around circular line
  if(random()<0.1){
    var circleSize = random(10, 40);
    var circlesInPerimeter = TWO_PI*radius/circleSize;
    var totalCircles = random(circlesInPerimeter);
    var angle = random(TWO_PI);
    var stepAngle = circleSize*TWO_PI/(TWO_PI*radius);
    fill(col);
    noStroke();
    for(var i=0; i<totalCircles; i++){
      angle += stepAngle;
      arc(width/2+sin(angle)*radius, height/2+cos(angle)*radius, circleSize, circleSize, TWO_PI-angle, TWO_PI+PI-angle);
    }
  }
}