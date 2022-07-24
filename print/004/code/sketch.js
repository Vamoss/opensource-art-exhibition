/******************
Code by Vamoss
Original code link:
https://openprocessing.org/sketch/1616492

Original Processing version:
https://www.openprocessing.org/sketch/399000

Author links:
http://vamoss.com.br
http://twitter.com/vamoss
http://github.com/vamoss
******************/

var chars = [
	{
		lineSpace: -4,
		separator: "",
		chars: ["┌", "┐", "└", "┘", "├", "┤", "┬", "┴", "┼"]
	},
	{
		lineSpace: -4,
		separator: "",
		chars: ["║", "╔", "╗", "╚", "╝", "╠", "╣", "╦", "╩", "╬"]
	},
	{
		lineSpace: 4,
		separator: "",
		chars: ["░", "▒", "▓"]
	},
	{
		lineSpace: -3,
		separator: "",
		chars: ["☰", "☱", "☲", "☳", "☴", "☵", "☶", "☷"]
	},
	{
		lineSpace: 5,
		separator: "|",
		chars: ["_", "‾"]
	},
	{
		lineSpace: 5,
		separator: "|",
		chars: ["◀", "▶"]
	},
	{
		lineSpace: -5,
		separator: "",
		chars: ["◢", "◣", "◥", "◤"]
	},
	{
		lineSpace: -6,
		separator: "",
		chars: ["▴", "▾", "◂", "▸"]
	},
	{
		lineSpace: -12,
		separator: "",
		chars: ["⧖", "⧗"]
	},
	{
		lineSpace: -10,
		separator: "",
		chars: ["⁖", "⸪", "⸬", "⸫", "⸭", "⁛", "⁘", "⁙"]
	}
];

var currentSet = 0;
var lines = [];

const FONT_SIZE = 32;

function setup() {
	createCanvas(800, 800); 
	background(0);
	frameRate(5);

	textFont("monospace");
	textSize(FONT_SIZE);
	fill(255);
	pixelDensity(8)
}

function generate(){
lines = [];

const totalLines = floor(height/(FONT_SIZE+chars[currentSet].lineSpace))
for(var l=0; l<totalLines; l++){
var line = chars[currentSet].separator;
while(textWidth(line)<width-20){
line += random(chars[currentSet].chars) + chars[currentSet].separator;
}
lines.push(line);
}
}

function draw() {
background(0);
generate();
var y = FONT_SIZE;
for(var l=0; l<lines.length; l++){
text(lines[l], 0, y);
y += FONT_SIZE + chars[currentSet].lineSpace;
}
}

function mousePressed(){
	currentSet++;
	if(currentSet>=chars.length) currentSet = 0;
}

function keyPressed() {
	saveCanvas();
}