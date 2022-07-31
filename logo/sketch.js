/******************
Code by Vamoss
Original code link:
https://openprocessing.org/sketch/1621550

Author links:
http://vamoss.com.br
http://twitter.com/vamoss
http://github.com/vamoss
******************/

const TEXTS = ["ARTE  ", "     DE", "CÓDIGO", "ABERTO"];
const FONT_SIZE = 400;
const RESOLUTION = 0.2;
var texts = [];
var font;
var emitters;
var zoom;

//Particle plotter inspired by Felix Auer
//http://www.felixauer.com/javascript/difeqrk.html

var blobs = [];
var colors;
var variation = 7;
var xScale, yScale, centerX, centerY;

//auto change
var changeDuration = 3000;
var lastChange = 0;

var mode = 0;


function preload() {
	font = loadFont("SourceCodePro-Bold.ttf");
}

function setup() {
	var size = min(windowWidth, windowHeight);
	createCanvas(size, size);
	zoom = size / 860;
	
	xScale = width/20;
	yScale = height/20*(width/height);
	
	centerX = width/2;
	centerY = height/2;
	
	colors = colors = [color("#581845"), color("#900C3F"), color("#C70039"), color("#e32c36"), color("#FF5733"), color("#FFC30F"), color("#24fffb")];
	
	emitters = [];
	newText(TEXTS[0], 0, -1);
	newText(TEXTS[1], 0, -1.08);
	newText(TEXTS[2], -2, 0);
	newText(TEXTS[3], 0, 1.2);
}

function draw() {
	let time = frameCount;
	if(mouseIsPressed){
		for(let i = 0; i < 20; i++){
			let x = mouseX + random(-100, 100);
			let y = mouseY + random(-100, 100);
			var blob = getNewBlob(x, y);
			blobs.push(blob);
		}
	}
	emitters.forEach(emitter => {
		if(random() < 0.1){
			var blob = getNewBlob(emitter.x, emitter.y);
			blobs.push(blob);
		}
	});
	
	noStroke();
	fill(43, 34, 68, 10);
	rect(0, 0, width, height);
	
	//auto change
	/*if(time - lastChange > changeDuration) {
		lastChange = time;
		variation++;
		if(variation>11) variation = 0;
	}*/
	
	drawTexts(255);

	var stepsize = 0.04;//deltaTime*0.002;
	for(var i = blobs.length-1; i >= 0; i--){
		let blob = blobs[i];

		var x = getSlopeX(blob.x, blob.y);
		var y = getSlopeY(blob.x, blob.y);
		blob.x += blob.direction * x * stepsize;
		blob.y += blob.direction * y * stepsize;
		
		x = getXPrint(blob.x);
		y = getYPrint(blob.y);
		stroke(blob.color);
		var size = lerp(blob.size, 0, (time-blob.time)/blob.life);
		strokeWeight(size);
		line(x, y, blob.lastX, blob.lastY);
		blob.lastX = x;
		blob.lastY = y;
		
		const border = 200;
		if(x < -border || y < -border || x > width+border || y > height+border || time-blob.time > blob.life){
			blobs.splice(i,1);
		}
	}
	
	drawTexts(30);
}

function drawTexts(alpha) {
	noStroke();
	if(mode) fill(255, alpha);
	else fill(43, 34, 68, alpha);
	textFont(font);
	texts.forEach(t => {
		textSize(t.fontSize);
		text(t.text, t.x, t.y);
	});
}

function newText(t, x, y){
	var fontSize = FONT_SIZE;
	var bounds = font.textBounds(t, 0, 0, fontSize);
	var counter = 1;
	while(bounds.w > width*.9){
		fontSize = FONT_SIZE - counter * 10;
		bounds = font.textBounds(t, 0, 0, fontSize);
		counter++;
	}
	
	var xFinal = centerX - bounds.w / 2 + x;
	var yFinal = centerY + bounds.h / 2 + fontSize * y * 0.9 - 30 * zoom;
	texts.push({x: xFinal, y: yFinal, fontSize, text: t});
	var points = font.textToPoints(t, xFinal, yFinal, fontSize, {sampleFactor: RESOLUTION});
	emitters = emitters.concat(points);
}

function getNewBlob(x, y){
	x += random(-2, 2) / zoom;
	y += random(-2, 2) / zoom;
	return {
					x : getXPos(x),
					y : getYPos(y),
					size : random(3, 10) * zoom,
					lastX : x,
					lastY : y,
					color : colors[floor(random(colors.length))],
					direction : random(0.01, 0.5) * random([1, -1]) / zoom,
					time: frameCount,
					life: random(7, 25)
				};
}

function getSlopeY(x, y){
	switch(variation){
		case 0:return Math.sin(x);
		case 1:return Math.sin(x*5)*y*0.3;
		case 2:return Math.cos(x*y);
		case 3:return Math.sin(x)*Math.cos(y);
		case 4:return Math.cos(x)*y*y;
		case 5:return Math.log(Math.abs(x))*Math.log(Math.abs(y));
		case 6:return Math.tan(x)*Math.cos(y);
		case 7:return -Math.sin(x*0.1)*3;//orbit
		case 8:return (x-x*x*x)*0.01;//two orbits
		case 9:return -Math.sin(x);
		case 10:return -y-Math.sin(1.5*x) + 0.7;
		case 11:return Math.sin(x)*Math.cos(y);
	}
}
	
function getSlopeX(x,y){
	switch(variation){
		case 0:return Math.cos(y);
		case 1:return Math.cos(y*5)*x*0.3;
		case 2: 
		case 3: 
		case 4: 
		case 5: 
		case 6:return 1;
		case 7:return Math.sin(y*0.1)*3;//orbit
		case 8:return y/3;//two orbits
		case 9:return -y;		
		case 10:return -1.5*y;
		case 11:return Math.sin(y)*Math.cos(x);
	}
}

function getXPos(x){
	return (x-centerX)/xScale;
}
function getYPos(y){
	return (y-centerY)/yScale;
}

function getXPrint(x){
	return xScale*x+centerX;
}
function getYPrint(y){
	return yScale*y+centerY;
}

function mousePressed(){
	mode = !mode;
}

function keyPressed(){
	variation++;
	if(variation>11) variation = 0;
}