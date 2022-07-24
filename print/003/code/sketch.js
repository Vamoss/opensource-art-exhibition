/******************
Code by Vamoss
Original code link:
https://www.openprocessing.org/sketch/869572

Author links:
http://vamoss.com.br
http://twitter.com/vamoss
http://github.com/vamoss
******************/

var circles = [], colors

function setup() {
	var size = min(windowWidth, windowHeight) / 2;
	createCanvas(size*4, size)
	pixelDensity(6)
	background("#1a0633")
	stroke(0, 100)
	frameRate(30);
	
	colors = [color("#1a0633"), color("#581845"), color("#900C3F"), color("#C70039"), color("#FF5733"), color("#FFC30F")]

	for(var i = 0; i < 1; i++){
		addCircle(createVector(random(width*0.05, width*0.20), random(height)))			
	}
	for(var i = 0; i < 1; i++){
		addCircle(createVector(random(width*0.30, width*0.45), random(height)))			
	}
	for(var i = 0; i < 1; i++){
		addCircle(createVector(random(width*0.55, width*0.70), random(height)))			
	}
	for(var i = 0; i < 1; i++){
		addCircle(createVector(random(width*0.80, width*0.95), random(height)))			
	}
}

function addCircle(pos){
	circles.push({
		pos: pos,
		prevPos: pos.copy(),
		dir: random() > 0.5 ? 1 : -1,
		radius: random(3, 10),
		angle: random(TWO_PI),
		color: pos.x/width,
		stroke: 0
	})
}

function draw() {
	for(var i = 0; i < circles.length; i++){
		var circle = circles[i]
		
		circle.angle += 1/circle.radius*circle.dir
		circle.pos.x += cos(circle.angle) * circle.radius
		circle.pos.y += sin(circle.angle) * circle.radius
		
		if(random() < 0.1) {
			circle.dir *= -1
			circle.radius = random(1, 10)
		}
		
		if(circle.pos.x < 0 || circle.pos.x > width || circle.pos.y < 0 || circle.pos.y > height){
			circle.dir *= -1
			circle.angle += PI
		}
		
		circle.color += (noise(millis()/100, i) - 0.45) * 0.1
		circle.color = constrain(circle.color, 0, 1)
		
		circle.stroke += (circle.radius * 2 - circle.stroke) * 0.09
		
		strokeWeight(circle.stroke)
		stroke(lerpColors(circle.color, colors))
		line(circle.prevPos.x, circle.prevPos.y, circle.pos.x, circle.pos.y)
		
		circle.prevPos.x = circle.pos.x
		circle.prevPos.y = circle.pos.y
	}
}

function mousePressed(){
	addCircle(createVector(mouseX, mouseY))
}

/**
 * lerp color from multiple color array
 * param {Integer} [t] lerp factor from 0 to 1
 * param {Array} [[color, color]] colors to lerp, minimum 2 colors in array
 */
function lerpColors(t, colors)
{
	let i = Math.floor(t*(colors.length-1));
	if(i < 0) return colors[0];
	if(i >= colors.length-1) return colors[colors.length-1];

	let percent = (t - i / (colors.length-1)) * (colors.length-1);
	return color(
		colors[i]._getRed() + percent*(colors[i+1]._getRed()-colors[i]._getRed()),
		colors[i]._getGreen() + percent*(colors[i+1]._getGreen()-colors[i]._getGreen()),
		colors[i]._getBlue() + percent*(colors[i+1]._getBlue()-colors[i]._getBlue())
	)
}

function keyPressed(){
	saveCanvas();
}