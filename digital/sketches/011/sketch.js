/******************
Code by Vamoss
Original code link:
https://www.openprocessing.org/sketch/1101148

Author links:
http://vamoss.com.br
http://twitter.com/vamoss
http://github.com/vamoss
******************/

let img;
const vSpace = 10;
const precision = 1;

var cachedBrightness = [];

function preload(){
  img = loadImage("photo_vertical.jpg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noFill();
  stroke(0);

  img.loadPixels();
  for (let y = vSpace; y < img.height-vSpace*2; y+=vSpace) {
    let x = 0;
    while (x < img.width) {
      const i = floor(y * img.width + x) * 4;
      const r = img.pixels[i];
      const g = img.pixels[i + 1];
      const b = img.pixels[i + 2];
      const maxColor = 255 * 3;
      let intensity = (r + g + b) / maxColor;
      cachedBrightness.push(intensity);
      x += precision / (intensity + 0.01) / 20;
    }
  }
} 

function draw() {
  background(255);  

  var displayWidth = width;
  const s = displayWidth/img.width;
  scale(s);
  translate((width-img.width*s)/2/s, (height-img.height*s)/2/s+2);

  let time = millis()/1000;
  let i = 0;
  for (let y = vSpace; y < img.height-vSpace*2; y+=vSpace) {
    beginShape();
    let x = 0;
    let phase = 0;
    while (x < img.width) {
      let intensity = cachedBrightness[i];
      i++;
      phase += 0.1;
      vertex(x, y + sin(phase - time) * vSpace / 2);
      x += precision / (intensity + 0.01) / 20;
    }
    endShape();
  }
}