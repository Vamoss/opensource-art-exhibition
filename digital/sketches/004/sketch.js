/******************
Code by Vamoss
Original code link:
https://openprocessing.org/sketch/1602696

Author links:
http://vamoss.com.br
http://twitter.com/vamoss
http://github.com/vamoss
******************/

const SEGMENTS = 200;
var centerX, centerY;

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(255);
	strokeWeight(2);
	colorMode(HSB, 360, 100, 100, 100);
	centerX = width/2;
	centerY = height/2;
}

function draw() {
	stroke(abs(sin(frameCount/100))*50 + 320,
				 100,
				 abs(sin(frameCount/300))*50+50,
				 max(100-frameCount/3, 10));
	
	var radius = frameCount*200/(frameCount+200);
  var time = frameCount / 300;
	
	noFill();
	beginShape();
	for (var i = 0; i <= SEGMENTS; i++) {
		var p = pointForIndex(i/SEGMENTS, centerX, centerY, time, frameCount/5, 0.5, radius);
		vertex(p.x, p.y);
	}
	endShape();
}

//code adapted from @GoToLoop
//generates a circular noise with perfect looping
//https://forum.processing.org/one/topic/how-to-make-perlin-noise-loop.html
function pointForIndex(pct, x, y, time, intensity, NOISE_SCALE, INNER_RADIUS) {
  let angle = pct * TWO_PI;
  let cosAngle = cos(angle);
  let sinAngle = sin(angle);
  let noiseValue = noise(NOISE_SCALE * cosAngle + NOISE_SCALE, NOISE_SCALE * sinAngle + NOISE_SCALE, time);
  let radius = INNER_RADIUS + intensity * (noiseValue-0.2);
  return {
		x: radius * cosAngle + x,
		y: radius * sinAngle + y
	};
}