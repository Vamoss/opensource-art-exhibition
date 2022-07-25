/******************
Code by Vamoss
Original code link:
https://www.openprocessing.org/sketch/830365

Author links:
http://vamoss.com.br
http://twitter.com/vamoss
http://github.com/vamoss
******************/

let angle = 0;
let radius = 200;

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(255);
	strokeWeight(0.5);
	stroke(0, 50);
}

function draw() {
	const MAX_RADIUS = min(width, height) / 2 - 100;
	for(let i = 0; i < 200; i++){
		let prevX = cos(angle) * radius + width / 2;
		let prevY = sin(angle) * radius + height / 2;
		angle += 0.01;
		radius += noise(angle) - 0.48;
		radius = constrain(radius, -MAX_RADIUS, MAX_RADIUS);
		let curX = cos(angle) * radius + width / 2;
		let curY = sin(angle) * radius + height / 2;
		line(prevX, prevY, curX, curY);
	}
}