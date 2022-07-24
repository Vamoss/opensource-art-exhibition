/******************
Code by Vamoss
Original code link:
https://www.openprocessing.org/sketch/1056707

Author links:
http://vamoss.com.br
http://twitter.com/vamoss
http://github.com/vamoss
******************/

var canvas;
var colors;
var colorCount = 0;

const size = 15;
const total = 10;

var positions = [];

var destiny = {x:0, y:0};
var changeTime = 0;
var changeDuration = 0;

function setup() {
	const size = min(windowWidth, windowHeight);
	createCanvas(size*4, size);
	pixelDensity(2);
	background(0);
	strokeWeight(2);
	
	colors = [color("#2b2244"), color("#581845"), color("#900C3F"), color("#C70039"), color("#e32c36"), color("#FF5733"), color("#FFC30F"), color("#24fffb"), color("#2b2244")];
	
	for(var i = 0; i < total; i++){
		positions.push({
			pos : {x: width/2, y: height/2},
			dir: 1,
			radius: 5,
			angle: 0,
			nextChange: 0
		});
	}
}

function draw() {

	if(frameCount - changeTime > changeDuration){
		changeTime = frameCount;
		changeDuration = random(60, 90);
		destiny.x += random(-width/4, width/4);
		destiny.x = constrain(destiny.x, 0, width);
		destiny.y = random(height);
	}
	console.log(destiny.x, destiny.y, changeTime, changeDuration)

	//lerp array of colors
	colorCount += noise(frameCount/1000)/200;
	var col = lerpColors(colorCount%1, colors);

	//draw

	positions.forEach(p => {
		p.angle += 1/p.radius*p.dir;

		let prevPosX = p.pos.x;
		let prevPosY = p.pos.y;
		p.pos.x += cos(p.angle) * p.radius;
		p.pos.y += sin(p.angle) * p.radius;
		
		noStroke();
		fill(col);
		circle(p.pos.x, p.pos.y, size*2);

		//countour 180 degrees around front movement area
		stroke(255);
		noFill();
		beginShape();
		var f = frameCount / 10;
		var aa = atan2(p.pos.y - prevPosY, p.pos.x - prevPosX) - PI/2;
		for(var a = -0.2; a < PI+0.2; a+=PI/10){
			vertex(cos(a + aa) * (size+1) + p.pos.x, sin(a + aa) * (size+1) + p.pos.y);
		}
		endShape();

		//change direction
		if(p.pos.x < (size+10) || p.pos.x > width-(size+10) || p.pos.y < (size+10) || p.pos.y > height-(size+10)){
			p.angle += PI * p.dir;
		}else{
			if(frameCount > p.nextChange){
				var x1 = p.pos.x + cos(p.angle+1/p.radius*p.dir) * p.radius;
				var y1 = p.pos.y + sin(p.angle+1/p.radius*p.dir) * p.radius;
				var x2 = p.pos.x + cos(p.angle+1/p.radius*-p.dir) * p.radius;
				var y2 = p.pos.y + sin(p.angle+1/p.radius*-p.dir) * p.radius;
				var dist1 = dist(destiny.x, destiny.y, x1, y1);
				var dist2 = dist(destiny.x, destiny.y, x2, y2);
				if(dist2 < dist1){
					p.dir *= -1;
					p.radius = constrain(dist2/20, 5, 8);
					p.nextChange = frameCount + random(3, 15);
				}
			}
		}
	});
}

function mod(n, m) {
  return ((n % m) + m) % m;
};

function angleDiff(targetA, sourceA){
	var a = targetA - sourceA;
	return (a + PI) % TWO_PI - PI;
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