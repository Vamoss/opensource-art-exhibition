/******************
Code by Vamoss
Original code link:
https://www.openprocessing.org/sketch/738615

Author links:
http://vamoss.com.br
http://twitter.com/vamoss
http://github.com/vamoss
******************/

let canvas, ctx, size, rings;

const duration = 3000;
const space = 10;

//custom out -> in ease
//http://fooplot.com/#W3sidHlwZSI6MCwiZXEiOiI0KigoeC0wLjUpXjMpKzAuNSIsImNvbG9yIjoiIzE1RkYwMCJ9LHsidHlwZSI6MTAwMCwid2luZG93IjpbIi0xLjA3NDQxMjkxMjYzOTk5OSIsIjEuMTA2NjI1MTY3MzU5OTk5NiIsIi0wLjEzMDI3NTA4MjIzOTk5OTczIiwiMS4yMTE5MDIxOTc3NTk5OTk1Il19XQ--
easeInOut = t => 4*pow(t-0.5,3)+0.5;

function setup() {
	size = min(windowWidth, windowHeight);
	createCanvas(size, size);
	pixelDensity(8);
	size = min(width, height) / 20;
	rings = floor((min(width, height)-size) / 2 / (size+space));
	
	canvas = createGraphics(size, size);
	canvas.noStroke();
	ctx = canvas.drawingContext;
}

function draw() {
	background(0);
	
	let total = 0;
	for(let j = 0; j < rings; j++){
		let radius = (j+1) * (size+space);
		let progress = 1 - j / rings;
		progress *= mouseX / width * 8;
		let loop = easeInOut((millis()/duration + progress)%1);
		let phase = loop*size*2-size;
		total += 6;
		for(let i = 0; i < total; i++){
			let angle = TWO_PI * i/total;
			canvas.clear();
			ctx.globalCompositeOperation="source-over";
			canvas.fill(255, 255, 0);
			canvas.rect(0, 0, size, size);
			canvas.fill(0);
			canvas.ellipse(phase*cos(angle)+size/2, phase*sin(angle)+size/2, size-4, size-4);
			ctx.globalCompositeOperation="destination-atop";
			canvas.ellipse(size/2, size/2, size, size);

			let x = cos(angle) * radius;
			let y = sin(angle) * radius;
			image(canvas, (width-size)/2 + x, (height-size)/2 + y);
		}
	}
}

function keyPressed() {
	saveCanvas();
}