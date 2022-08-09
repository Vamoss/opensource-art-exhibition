var blocos = []
var modo = 0

function setup() {
  //createCanvas(windowWidth/2, windowHeight)
  createCanvas(1080, 1920)
  background(0)
  noStroke()
  inicia()
  mouseX = width/2
  mouseY = height/2
}

function draw(){
  mouseX += random([-5, 5])
  mouseY += random([-5, 5])
  mouseX = constrain(mouseX, 0, width)
  mouseY = constrain(mouseY, 0, height)
  mouseMoved()
}

function inicia(){
  blocos = []

  var borda = 120
  var tamanho = min(width, height) - borda*2
  desenhaBloco(borda, borda, tamanho)
  desenhaBloco(borda, tamanho+borda, tamanho)
}

function desenhaBloco(x, y, tamanho) {
  blocos.push(createVector(x, y, tamanho))

  fill(0)
  rect(x, y, tamanho, tamanho)
  textSize(tamanho)

  fill(255)
  push()
  translate(x, y)

  if(modo == 0){
    //circulos
    circle(tamanho/2, tamanho/2, tamanho)
  }else if(modo == 1){
    //triangulos
    if(random()<0.5) {
      triangle(tamanho/2, 0, tamanho, tamanho, 0, tamanho)
    } else {
      triangle(0, 0, tamanho, 0, tamanho / 2, tamanho)
		}
  } else if(modo == 2) {
		//folhas
		rect(0, 0, tamanho, tamanho, tamanho/2, 0, tamanho/2, 0)
	} else if(modo == 3){
		//barras
		if(random()<0.5) {
			rect(0, 0, tamanho / 2, tamanho)
		} else {
			rect(0, 0, tamanho, tamanho / 2)
		}
  }
  pop()
}

function mouseMoved(){
  blocos.every((bloco, indice, lista) => {
    var tamanho = bloco.z
    if(
      mouseX > bloco.x &&
      mouseX < bloco.x + tamanho &&
      mouseY > bloco.y &&
      mouseY < bloco.y + tamanho
    ) {
      lista.splice(indice, 1)
      tamanho /= 2
      desenhaBloco(bloco.x, bloco.y, tamanho)
      desenhaBloco(bloco.x + tamanho, bloco.y, tamanho)
      desenhaBloco(bloco.x, bloco.y + tamanho, tamanho)
      desenhaBloco(bloco.x + tamanho, bloco.y + tamanho, tamanho)
      return false
    }
    return true
    })
}

function mousePressed() {
  modo++
  if(modo > 3) modo = 0
  inicia()
}