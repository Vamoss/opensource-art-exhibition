const total = 10000;
const relaxInterations = 80;
var img;
var delaunay;
var voronoi;
var cachedBrightness;

var points = new Float64Array(total * 2);
const closest = new Float64Array(total * 2);
const weights = new Float64Array(total);

var TSP;
var solution;
var done = false;

function preload() {
	img = loadImage('profile.jpg');
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	stroke(255);
	noFill();
	
	cachedBrightness = new Float64Array(img.width * img.height);
	for (var y = 0, i = 0; y < height; y++) {
		for (var x = 0; x < img.width; x++) {
			var index = y * img.width + x;
			cachedBrightness[index] = brightness(img.get(x, y)) / 254;
		}
	}
	
	var i = 0;
	while(i < total){
		var x = round(random(img.width));
		var y = round(random(img.height));
		var index = y * img.width + x;
		if(Math.random() < cachedBrightness[index]){
			points[i * 2 + 0] = x;
			points[i * 2 + 1] = y;
			i++;
		}
	}
	
	delaunay = new Delaunay(points);
	voronoi = delaunay.voronoi([0, 0, img.width, img.height]);
}

function draw() {
	background(0);

  var displayWidth = width - 100;
  const s = displayWidth/img.width;
  scale(s);
  translate((width-img.width*s)/2/s, (height-img.height*s)/2/s);
  
	if(frameCount < relaxInterations){
		/*
		this.drawingContext.beginPath();
		voronoi.render(this.drawingContext);
		this.drawingContext.strokeStyle = "red";
		this.drawingContext.stroke();
		/**/
		
		// Compute the weighted centroid for each Voronoi cell.
		closest.fill(0);
		weights.fill(0);
		for (let y = 0, i = 0; y < img.height; ++y) {
			for (let x = 0; x < img.width; ++x) {
				const w = cachedBrightness[y * img.width + x];
				i = delaunay.find(x + 0.5, y + 0.5, i);
				weights[i] += w;
				closest[i * 2] += w * (x + 0.5);
				closest[i * 2 + 1] += w * (y + 0.5);
			}
		}

		// Relax the diagram by moving points to the weighted centroid.
		// Wiggle the points a little bit so they don’t get stuck.
		const w = Math.pow(frameCount + 1, -0.8) * 10;
		for (let i = 0; i < total; ++i) {
			const x0 = points[i * 2];
			const y0 = points[i * 2 + 1];
			const x1 = weights[i] ? closest[i * 2] / weights[i] : x0;
			const y1 = weights[i] ? closest[i * 2 + 1] / weights[i] : y0;
			points[i * 2] = x0 + (x1 - x0) * 1.8 + (Math.random() - 0.5) * w;
			points[i * 2 + 1] = y0 + (y1 - y0) * 1.8 + (Math.random() - 0.5) * w;
		}
		
		voronoi.update();

		//draw points
    strokeWeight(2);
		for(var i = 0; i < total; i++){
			point(points[i * 2], points[i * 2 + 1]);
		}
	}else if(frameCount == relaxInterations){
		
		//convert monodimensional interger array[x,y,x,y...]
		//to an array of objects [{x,y},{x,y}...]
		//and calculate the hilbert value
		var arrayOfObjects = [];
		const curveSize = pow(2, ceil(Math.log2(max(img.width, img.height))))
		for(var i = 0; i < total; i++){
			const x = points[i * 2];
			const y = points[i * 2 + 1];
			const h = hilbert(x, y, curveSize);
			
			arrayOfObjects.push({
				x: x,
				y: y,
				h: h
			});
		}
		points = arrayOfObjects.sort((a, b) => a.h - b.h);
		
		//start TSP
		TSP = solveTSP(points);
	}else{
		if(!done){
			var result = TSP.next();
			done = result.done;
			if(!done){
				solution = result.value;
			}
		}

    strokeWeight(0.5);
		beginShape();
		for (var i = 0; i < solution.length+3; i++) {
      var index = i % solution.length;
			curveVertex(points[solution[index]].x, points[solution[index]].y);
		}
		endShape(CLOSE);
	}
}