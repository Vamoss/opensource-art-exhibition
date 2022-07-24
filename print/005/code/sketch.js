/******************
Código por Vamoss
Link original:
https://openprocessing.org/sketch/1418547

Links do autor:
http://vamoss.com.br
http://twitter.com/vamoss
http://github.com/vamoss
******************/

const DEBUG = true;

const SHAPES = [["all",1/10], ["circle",2/10], ["triangles",3/10], ["leafs",1/10], ["bars",2/10], ["direction",1/10]]
const BEHAVIORS = [["circular",1/6], ["symmetry",5/6]]
const RENDERS = [["solid",3/8], ["gradient",1/8], ["noise",4/8]]
const STYLES = [["filled",3/4], ["stroked",1/4]]
const PALLETES = [["vamoss",6/7], ["pb",1/7]]
const SIZES = [["big", 1/10], ["small", 9/10]]

var iniLife, life, minSize

var blocks, points, totalPoints, colors, border

var config = {randomify}, gui

//noise
var defX, defY, defZ

var bgColor

function Point(){
	this.pos = {x: random(border, width-border*2), y: random(border, height-border*2)}	
	this.prev = {x: this.pos.x, y: this.pos.y}
	
	var dir = 1,
			radius = 5,
			angle = 0
	
  this.update = function(){
		angle += 1/radius*dir

		this.prev.x = this.pos.x
		this.prev.y = this.pos.y

		this.pos.x += cos(angle) * radius
		this.pos.y += sin(angle) * radius

		//change direction
		const m = 15+border
		if(this.pos.x < m || this.pos.x > width-m || this.pos.y < m || this.pos.y > height-m){
			angle += PI * dir;
		}else{
			if(random() < 0.05) dir *= -1;
			if(random() < 0.05) radius = random(5, 8);
		}
	}
}

function setup() {
	var closestSize = min(windowWidth, windowHeight)
	
	//create a power of 2 resolution
	var power = 512
	while(power < closestSize)
    power *= 2
	
	border = power/32
	var size = power + border * 2
	
  var renderer = createCanvas(size, size)
	renderer.canvas.style.width = closestSize + "px"
	renderer.canvas.style.height = closestSize + "px"
	
	noStroke()
	background(255)
	pixelDensity(8)
	randomify()
	initGui()
	init()
}

function draw(){
	//blendMode(DIFFERENCE);
	//blendMode(EXCLUSION);
	
	if(frameCount > life)
		noLoop()

	switch (config.behavior) {
			case 'circular':
				points.forEach(p => {
					p.update()
				})
				break;
			case 'symmetry':
				points[0].update()
				for(var i = 1; i < points.length; i++){
					var r = rotate2d(width/2, height/2, points[0].pos.x, points[0].pos.y, i/points.length*TWO_PI)
					points[i].prev.x = points[i].pos.x
					points[i].prev.y = points[i].pos.y
					points[i].pos.x = r[0]
					points[i].pos.y = r[1]
				}
				break;
	}
	
	moved()
	//stroke(255, 0, 0);
	//line(x, y, px, py);
	//noStroke();
}

function desenhaBloco(x, y, size, p) {
  blocks.push(createVector(x, y, size))
	
	if(size > 100)
		console.log(x, y, size)

	drawingContext.shadowBlur = 0;
	
	noStroke()
  fill(bgColor)
  rect(x, y, size, size)
	for(let i = 0; i < pow(size, 2)/10; i++){
		const xx = x + random(size)
		const yy = y + random(size)
		var c = random(colors)
		c.setAlpha(random(20, 60))
		stroke(c)
		point(xx, yy)
	}
	
	//grid color
	//*
	var c1 = lerpColors((noise(x/defX, size/defZ)-0.2)*3, colors)
	var c2 = lerpColors((noise(y/defY, size/defZ)-0.2)*3, colors)
	/**/
	
	//noise colors
	/*
	var c1 = lerpColors((noise(x/defX, y/defY, size/defZ)-0.2)*3, colors)
	var c2 = lerpColors(random(), colors)
	*/
	
	push()
	
	if(config.render == "gradient"){
		drawingContext.shadowBlur = 30;
		drawingContext.shadowColor = bgColor;
		
		//fill(255)
		//var grd = drawingContext.createLinearGradient(0, 0, size, 0);

		//centered
		//var grd = drawingContext.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);

		//random position gradient
		//*
		var grd = drawingContext.createRadialGradient(
			size/2+random(-size/5, size/5), size/2+random(-size/5, size/5), 0,
			size/2+random(-size/5, size/5), size/2+random(-size/5, size/5), size/2
		);
		/**/

		grd.addColorStop(0, c1.toString())
		grd.addColorStop(1, c2.toString())
		
		if(config.style == "filled")
			drawingContext.fillStyle = grd
		else {
			stroke(255)
			drawingContext.strokeStyle = grd
		}
	}else if(config.render == "solid"){
		if(config.style == "filled"){
			noStroke()
			fill(c1)
		}else
			stroke(c1)
	}
	
	if(config.style == "stroked"){
			noFill()
			strokeWeight(size/5)
			strokeJoin(ROUND)
			x += size/10
			y += size/10
			size -= size/5
	}
	
	if(config.render == "noise"){
		drawingContext.save()
	}
	
  translate(x, y)
	
	var shape = config.shape
	if(shape == "all")
		shape = random(["circle", "triangles", "leafs", "bars"])
	
  if(shape == "circle") {
    circle(size/2, size/2, size)
  } else if(shape == "triangles") {
    if(random()<0.5) {
      triangle(size/2, 0, size, size, 0, size)
    } else {
      triangle(0, 0, size, 0, size / 2, size)
		}
  } else if(shape == "leafs") {
		rect(0, 0, size, size, size/2, 0, size/2, 0)
	} else if(shape == "bars"){
		if(random()<0.5) {
			rect(0, 0, size / 2, size)
		} else {
			rect(0, 0, size, size / 2)
		}
  } else if(shape == "direction"){
		var angle = atan2(p.pos.y - p.prev.y, p.pos.x - p.prev.x)
		beginShape()
		for(var i = 0; i < 3; i++){
			var a = i / 3 * TWO_PI
			var r = size * (i == 0 ? 0.5 : 0.3)
			var xx = cos(a + angle) * r + size/2
			var yy = sin(a + angle) * r + size/2
			vertex(xx, yy)
		}
		endShape(CLOSE)
  }
	
	if(config.render == "noise"){
		drawingContext.clip()
		customNoiseGrad(size, size, c1)
		drawingContext.restore()
	}
	
  pop()
}

function moved(){
	points.forEach((p, j) => {
		blocks.every((space, index, arr) => {
			var size = space.z
			if(
				p.pos.x > space.x &&
				p.pos.x < space.x + size &&
				p.pos.y > space.y &&
				p.pos.y < space.y + size &&
				size > width / minSize
			) {
				arr.splice(index, 1)
				//size1 = floor(size/2)
				//size2 = ceil(size/2)
				size /= 2
				desenhaBloco(space.x, space.y, size, p)
				desenhaBloco(space.x + size, space.y, size, p)
				desenhaBloco(space.x, space.y + size, size, p)
				desenhaBloco(space.x + size, space.y + size, size, p)
				return false
			}
			return true
			})
	})
}

function keyPressed() {
	if(key == 's'){
		saveCanvas();
	}else{
		//randomify()
	}
}

const customNoiseGrad = function(_w, _h, _c)
{
	const num = min(_w * _h * 2, 6000)
	
	strokeWeight(1)
	noStroke()
	fill(_c)
	rect(0, 0, _w, _h)

	for(let i = 0; i < num; i++){
		const x = abs(randomGaussian()) / 4 * _w
		const y = random(_h)
		stroke(random(colors))
		point(x, y)
	}
}

function randomify(){
	//TODO
	//noiseSeed(0)
	//randomSeed(0)
	
  config.shape = weightedRandom(SHAPES)
	config.behavior = weightedRandom(BEHAVIORS)
	config.render = weightedRandom(RENDERS)
	config.style = weightedRandom(STYLES)
	config.pallet = weightedRandom(PALLETES)
	
	//stroked cannot have noise
	while(config.style == "stroked" && config.render == "noise")
		config.render = weightedRandom(RENDERS)
	
	//filled cannot have gradient
	while(config.style == "filled" && config.render == "gradient")
		config.render = weightedRandom(RENDERS)
	
	config.frameRate = random(5, 30)
	config.iniLife = random(30, 200)
	config.totalPoints = random(1, 5)
	config.size = weightedRandom(SIZES)
	
	defX = random(10, 100)
	defY = random(10, 100)
	defZ = random(10, 100)
	
	if(DEBUG && gui)
		updateGui();
}

function init(){
	frameCount = 0
	life = config.iniLife
	minSize = config.size == "big" ? 10 : 50
	
	frameRate(config.frameRate)
	loop()
	
	points = []
	for(var i = 0; i < config.totalPoints; i++){
		points.push(new Point());
	}
	
	if(config.pallet == "vamoss")
		colors = "2B2244,581845,900C3F,C70039,E32C36,FF5733,FFC30F".split(",").map(c => color("#"+c))
	else
		colors = "888888,AAAAAA,FFFFFF,888888,AAAAAA,FFFFFF".split(",").map(c => color("#"+c))
	//shuffle(colors, true)
	var t = random(2, colors.length-1)
	while(colors.length > t){
		colors.splice(floor(random(colors.length)), 1);
	}
	
	bgColor = "black"
	if(config.shape == "direction") bgColor = "white"
	
	//maker direction colors darkers
	if(config.shape == "direction" && config.pallet == "pb")
		colors.map(c => color(red(c)*0.5));
	
	blocks = []
	
	fill(bgColor)
	rect(0, 0, width, height)
	
  desenhaBloco(border, border, min(width-border*2, height-border*2), points[0])
}

function initGui() {
	gui = new dat.GUI();
	gui.add(config, 'shape', SHAPES.map(x => x[0]));
	gui.add(config, 'behavior', BEHAVIORS.map(x => x[0]));
	gui.add(config, 'render', RENDERS.map(x => x[0]));
	gui.add(config, 'style', STYLES.map(x => x[0]));
	gui.add(config, 'pallet', PALLETES.map(x => x[0]));
	gui.add(config, 'size', SIZES.map(x => x[0]));
	
	
	gui.add(config, 'frameRate', 5, 30, 1);
	gui.add(config, 'iniLife', 30, 200, 1);
	gui.add(config, 'totalPoints', 1, 4, 1);
	
	gui.add(config, 'randomify');
	
	for (var i in gui.__controllers) {
		gui.__controllers[i].onChange(init);
	}
}

function updateGui(){
	for (var i in gui.__controllers) {
		gui.__controllers[i].updateDisplay();
	}
}

function weightedRandom(prob) {
  let i, sum=0;
  for (i in prob) {
    sum += prob[i][1];
    if (Math.random() <= sum) return prob[i][0];
  }
}

function mod(m, n) {
  return ((m % n) + n) % n
}

function rotate2d(cx, cy, x, y, radians) {
    var cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
        ny = (cos * (y - cy)) - (sin * (x - cx)) + cy
    return [nx, ny];
}


/**
 * lerp color from multiple color array
 * param {Integer} [t] lerp factor from 0 to 1
 * param {Array} [[color, color]] colors to lerp, minimum 2 colors in array
 */
function lerpColors(t, colors)
{
	var total = colors.length-1
	var i = constrain(floor(t*(total)), 0, total-1)

	var percent = (t - i / (total)) * (total)
	var c1 = colors[i],
			c2 = colors[i+1],
			r = c1._getRed(),
			g = c1._getGreen(),
			b = c1._getBlue()
	return color(
		r + percent*(c2._getRed()-r),
		g + percent*(c2._getGreen()-g),
		b + percent*(c2._getBlue()-b)
	)
}

function keyPressed() {
	saveCanvas();
}