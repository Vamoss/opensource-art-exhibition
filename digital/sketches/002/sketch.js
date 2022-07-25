/******************
Code by Vamoss
Original code link:
https://openprocessing.org/sketch/1593074

Author links:
http://vamoss.com.br
http://twitter.com/vamoss
http://github.com/vamoss
******************/

var data;
var colors;
var people = [];
const acceleration = 3;
const maxAcceleration = 5;
const maxDist = 100;
const maxLength = 20;

function preload() {
  data = loadJSON('data-1-413567.json');
	//data = loadJSON('data-2-486307.json');
  //data = loadJSON('data-3-453716.json');
  //data = loadJSON('data-4-494102.json');
  //data = loadJSON('data-5-492096.json');	
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	strokeJoin(ROUND);
	
	colors = [color("#900C3F"), color("#C70039"), color("#e32c36"), color("#FF5733"), color("#FFC30F"), color("#24fffb")];
	
	//people.push(new Person(random(width), random(height), data.hits, data.hearts.length/100, data.forks.length));
	data.forks.forEach(e => {
		//console.log(e.comments.length);//0-2
		people.push(new Person(
			random(width),
			random(height),
			e.hits,//0-2000
			e.hearts ? e.hearts.length : 0,//0-1-20
			e.forks.length//0-1-6
		));
	});
}

function draw() {
	background("#2B2244");
	
	for(var i = 0; i < people.length; i++){
		var accumX = 0;
		var accumY = 0;
		for(var j = 0; j < people.length; j++){
			var distX = (people[j].lastPos.x - people[i].lastPos.x);
			var distY = (people[j].lastPos.y - people[i].lastPos.y);
			var d = distX*distX+distY*distY;
			if(d > 0 && d < maxDist*maxDist){
				accumX += distX;
				accumY += distY;
			}
		}
		var d = sqrt(accumX*accumX+accumY*accumY);
		if(d>0){
			people[i].acc.x += accumX/d * 0.52;
			people[i].acc.y += accumY/d * 0.52;
			
			var xAccell = people[i].acc.x * (acceleration/2) * (20 / people[i].radius);
			var yAccell = people[i].acc.y * (acceleration/2) * (20 / people[i].radius);
			people[i].v.add(xAccell, yAccell);
			people[i].v.limit(maxAcceleration);
		}else{
			people[i].acc.x *= 0.8;
			people[i].acc.y *= 0.8;
			if(people[i].v.mag()>2)
				people[i].v.mult(0.8);
		}
		
		people[i].draw();
	}
}

class Person {
	constructor(px, py, length, radius, heads) {
		this.pos = [{x:px, y:py}, {x:px, y:py}];
		this.lastPos = {x: px, y: py};
		this.acc = createVector(0, 0);
		this.v = createVector(random(-2, 2), random(-2, 2));
		this.color = random(colors);
		this.radius = !radius || radius < 2 ? 4 : radius;
		this.length = !length || length < 2 ? 2 : length / 4 + 2;
		this.heads = !heads || heads < 1 ? 1 : heads+1;
	}
	
	draw() {
		/*var tempX = this.pos[this.pos.length-1].x + this.v.x;
		var tempY = this.pos[this.pos.length-1].y + this.v.y;
		if(tempX < 0 || tempX > width)
			this.v.x *= -1;
		if(tempY < 0 || tempY > height)
			this.v.y *= -1;
		*/
		this.lastPos.x = mod(this.pos[this.pos.length-1].x + this.v.x, width);
		this.lastPos.y = mod(this.pos[this.pos.length-1].y + this.v.y, height);
		this.pos.push({x:this.lastPos.x, y:this.lastPos.y});
		while(this.pos.length>this.length) this.pos.shift();
		
		
		if(dist(
			this.pos[this.pos.length-1].x, this.pos[this.pos.length-1].y,
			this.pos[this.pos.length-2].x, this.pos[this.pos.length-2].y
		 ) > 100){
			this.pos[this.pos.length-1].z = 1;
		}

		noFill();
		stroke(this.color);
		strokeWeight(this.radius*1.5);
		beginShape();
		for(var i = 0; i < this.pos.length; i++){
			if(this.pos[i].z == 1){
				endShape();
				beginShape();
			}
			vertex(this.pos[i].x, this.pos[i].y);
		}
		endShape();
		
		stroke("#2B2244AA");
		strokeWeight(this.radius);
		beginShape();
		for(var i = 0; i < this.pos.length; i++){
			if(this.pos[i].z == 1){
				endShape();
				beginShape();
			}
			vertex(this.pos[i].x, this.pos[i].y);			
		}
		endShape();
		
		fill(this.color);
		noStroke();
		for(var i = 0; i < this.heads && i*20 < this.pos.length; i++){
			var index = this.pos.length - i*20 - 1;
			circle(this.pos[index].x, this.pos[index].y, this.radius);
		}
		
		//debug
		/*
		noStroke();
		fill(0);
		text("x: "+ this.v.x.toFixed(2) + ", y: " + this.v.y.toFixed(2), this.lastPos.x, this.lastPos.y);
		/**/
	}
}

function mod(n, m) {
  return ((n % m) + m) % m;
}