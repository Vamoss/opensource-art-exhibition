var colors;
var triangles;
var RADI;//radius

//GUI
var config = {
	logo		: true,
	logoY		: 12,
	intensity	: 0,
	velocity	: 0.2,
	animate		: true,
}

//LOGO
var A = [[0,8],[0,7],[0,6],[0,5],[0,4],[0,3],[0,2],[0,1],[1,1],[1,0],[2,0],[2,1],[3,1],[3,2],[3,3],[3,4],[3,5],[3,6],[3,7],[3,8],[1,5],[1,4],[2,4],[2,5]];
var B = [[0,9],[0,8],[0,7],[0,6],[0,5],[0,4],[0,3],[0,2],[0,1],[1,1],[1,2],[2,2],[2,3],[3,3],[3,4],[3,5],[2,5],[2,6],[2,7],[3,7],[3,8],[3,9],[2,9],[2,10],[1,10],[1,9]];
var C = [[3,7],[2,7],[2,8],[1,8],[1,7],[0,7],[0,6],[0,5],[0,4],[0,3],[0,2],[0,1],[1,1],[1,0],[2,0],[2,1],[3,1]];
var D = [[1,8],[1,7],[1,6],[1,5],[1,4],[1,3],[1,2],[1,1],[1,0],[2,0],[2,1],[3,1],[3,2],[4,2],[4,3],[4,4],[4,5],[4,6],[3,6],[3,7],[2,7],[2,8]];
var E = [[3,7],[2,7],[2,8],[1,8],[1,7],[0,7],[0,6],[0,5],[0,4],[0,3],[0,2],[0,1],[1,1],[1,0],[2,0],[2,1],[3,1],[3,2],[3,3],[2,3],[2,4],[1,4],[1,5]];
var G = [[2,4],[2,5],[3,5],[3,6],[3,7],[2,7],[2,8],[1,8],[1,7],[0,7],[0,6],[0,5],[0,4],[0,3],[0,2],[0,1],[1,1],[1,0],[2,0],[2,1],[3,1]];
var I = [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,8]];
var O = [[3,7],[2,7],[2,8],[1,8],[1,7],[0,7],[0,6],[0,5],[0,4],[0,3],[0,2],[0,1],[1,1],[1,0],[2,0],[2,1],[3,1],[3,2],[3,3],[3,4],[3,5],[3,6]];
var R = [[1,8],[1,7],[1,6],[1,5],[1,4],[1,3],[1,2],[1,1],[1,0],[2,0],[2,1],[3,1],[3,2],[4,2],[4,3],[4,4],[3,4],[3,5],[2,5],[2,6],[2,7],[3,7],[3,8],[4,8]];
var T = [[1,1],[1,0],[2,0],[2,1],[3,1],[3,0],[4,0],[4,1],[5,1],[5,0],[3,2],[3,3],[3,4],[3,5],[3,6],[3,7],[3,8]];
var Ó = O.slice();Ó.push([2, 0, 1]);

var word = [[A, 0, 0], [R, 4, 0], [T, 8, 0], [E, 14, 0], [D, 20, 0], [E, 26, 0],
			[C, 0, 10], [Ó, 5, 9, 1], [D, 9, 9, 1], [I, 15, 9, 1], [G, 17, 9, 1], [O, 22, 10],
			[A, 0, 20], [B, 5, 19], [E, 10, 20], [R, 14, 20], [T, 18, 20], [O, 24, 20]];

var totalWordTriangles;
var triangleTween = [];
var timeline;

function setup(){
	var SIZE = min(windowWidth, windowHeight)
	createCanvas(SIZE, SIZE);
	RADI = width/32*(2/3);//WIDTH / (TOTAL WORD WIDTH[30] + BORDER[2]) * (2/3)
	
	noiseDetail(2);
	pixelDensity(1);
	strokeCap(ROUND);
	drawingContext.lineJoin = "round";
	
	colors = "900C3F-C70039-E32C36-FF5733-DCA80D-1AC7C4".split("-").map(hex => color("#"+hex));
	
	//animations
	timeline = anime.timeline();	
	
	//animate word
	totalWordTriangles = word.reduce((currentCount, letter) => currentCount + letter[0].length, 0);
	for(var i = 0; i < totalWordTriangles; i++){
	triangleTween.push({size: 0});
	}
	timeline.add({
	targets: triangleTween,
	size: 1,
	easing: 'spring(1, 80, 10, 0)',
	delay: anime.stagger(100, {grid: [totalWordTriangles/3, 6], from: 'center', easing: 'cubicBezier(0.000, 0.345, 1.000, 0.690)'})
	});
	
	//animate bg
	timeline.add({
	targets: config,
	intensity: 400,
	easing: 'easeInOutQuad',
	duration: 6000
	}, '-='+5000);

	reset();
}

function draw() {
	background(255);
	
	timeline.seek(frameCount / 30 * 1000);
	
	//BG
	if(config.animate){
	var time = frameCount/100 * config.velocity;
	triangles.forEach((t, index, arr) => {
		var n = noise(t.x/100, t.y/100+time, time/10);
		var size = RADI + pow((pow(n, 5)) * RADI, 2) * config.intensity + 0.6;
		arr[index] = customTriangle(t.x, t.y, size, t.startAngle, t.startNoise, t.color);
	});
	}
	
	noStroke();
	triangles.forEach((t, index) => {
	fill(t.color);
	beginShape();
	vertex(t.coords[0].x, t.coords[0].y);
	vertex(t.coords[1].x, t.coords[1].y);
	vertex(t.coords[2].x, t.coords[2].y);
	endShape(CLOSE);
	});
	
	// stroke(255);
	// line(0, mouseY, RADI + altitude/2, mouseY);
	
	//LOGO
	if(config.logo){
	const altitude = Math.sqrt(3)/2 * RADI;
	strokeWeight(1);
	
	var showMaxLetter = map(frameCount, 0, 100, 0, totalWordTriangles);
	var letterCount = 0;
	word.forEach(letter => {
		letter[0].forEach(t => {
		if(triangleTween[letterCount].size > 0){
			var c = getCoord(t[0]+letter[1], t[1]+letter[2], RADI);
			var col = color(255);
			if(t[2]==1){
			col = color("#1AC7C4");
			}
			var x = c.x + (t[2]==1 ? RADI : 0);
			x += altitude/2 + RADI + 1;

			var y = c.y + (letter[3]==1 ? altitude : 0);
			y += altitude*config.logoY*2;

			var s = triangleTween[letterCount].size;
			var tri = customTriangle(x, y, RADI * s, c.angle, 0, col);
			fill(tri.color);
			stroke(tri.color);
			beginShape();
			vertex(tri.coords[0].x, tri.coords[0].y);
			vertex(tri.coords[1].x, tri.coords[1].y);
			vertex(tri.coords[2].x, tri.coords[2].y);
			endShape(CLOSE);
		}
		letterCount++;
		});
	});
	}
}

function getCoord(indexX, indexY, radius){
	const altitude = Math.sqrt(3)/2 * radius;
	var countX = indexY%2+indexX;
	var x = indexY%2==1
		? radius/2 + countX%2*radius/2 + radius*indexX + radius*floor(indexX/2) + (countX+1)%2*radius/2
		: countX%2*radius/2 + radius*indexX + radius*floor(indexX/2) + (countX+1)%2*radius/2 + countX%2*radius;
	var y = indexY * altitude + altitude;
	var angle = countX%2*PI;
	return {x, y, angle};
}

function customTriangle(x, y, size, startAngle, startNoise, color){
	var coords = [];
	for(var a = 0; a < TWO_PI; a += TWO_PI/3){
		var xx = sin(a + startAngle + HALF_PI) * size + x;
		var yy = cos(a + startAngle + HALF_PI) * size + y;
		coords.push({x: xx, y: yy});
	}
	return {coords, x, y, size, startAngle, startNoise, color};
}

function reset(){
	frameCount = 0;
	triangles = [];
	triangleTween.forEach(c => c.size = 0);
	const altitude = Math.sqrt(3)/2 * RADI;
	var countY = 0;
	for(var y = 0; y < height+RADI+300; y += altitude){
		var countX = countY%2;
		for(var x = RADI/2 + countX%2*RADI/2; x < width; x += RADI+countX%2*RADI){
			var startNoise = random(100);
			triangles.push(customTriangle(x, y, RADI+0.6, countX%2*PI, startNoise, random(colors)));
			countX++;
		}
		countY++;
	}
}