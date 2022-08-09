const tamanho = 100//tamanho do padrão
const altitude = Math.sqrt(3)/2 * tamanho//tamanho da diagonal do hexagodno
var hexagonos, padrao, rotacoes
var indiceAlterado = -1

function setup() {
	createCanvas(windowWidth, windowHeight)
	
	//cria a máscra do padrão hexagonal
	var mascara = createGraphics(tamanho*2, tamanho*2)
	mascara.beginShape()
	for(var a = 0; a < TWO_PI; a+=TWO_PI/6){
		var x = sin(a) * tamanho + tamanho
		var y = cos(a) * tamanho + tamanho
		mascara.vertex(x, y)
	}
	mascara.endShape()
	
	//desenha as linhas internas
	var linhas = createGraphics(tamanho*2, tamanho*2)

	//linha de fundo
	linhas.noFill()
	linhas.strokeWeight(20)
	linhas.ellipse(tamanho - altitude, tamanho - tamanho / 2, tamanho, tamanho)
	linhas.ellipse(tamanho + altitude * 2, tamanho, tamanho * 3, tamanho * 3)
	linhas.ellipse(tamanho + altitude, tamanho + tamanho * 1.5, tamanho * 3, tamanho * 3)

	//linha sobreposta
	linhas.strokeWeight(16)
	linhas.stroke(255)
	linhas.ellipse(tamanho - altitude, tamanho - tamanho / 2, tamanho, tamanho)
	linhas.ellipse(tamanho + altitude * 2, tamanho, tamanho * 3, tamanho * 3)
	linhas.ellipse(tamanho + altitude, tamanho + tamanho * 1.5, tamanho * 3, tamanho * 3)
	
	//combina as linhas com a máscara
	padrao = createGraphics(tamanho*2, tamanho*2)
	padrao.image(mascara, 0, 0)
	padrao.drawingContext.globalCompositeOperation="source-in"
	padrao.image(linhas, 0, 0)
	
	//cria os hexagonos em suas posições e rotações
	rotacoes = []
	hexagonos = []
	for(var x = - tamanho; x < width; x += altitude * 2){
		var contaLinha = 0
		for(var y = - tamanho; y < height; y += tamanho * 1.5){
			hexagonos.push({
				x: x + (contaLinha%2==0 ? 0 : altitude),
				y: y,
				rotacao: 0
			})
			rotacoes.push(TWO_PI / 6 * floor(random(6)))
			contaLinha++
		}
	}
}

function draw() {
	background(255)

	//desenha cada hexagono
	hexagonos.forEach((hexagono, indice) => {
		//faz uma transição suave entre a rotação anterior e a nova rotação
		hexagono.rotacao += (rotacoes[indice] - hexagono.rotacao) * 0.09 
		push()
			translate(hexagono.x + tamanho, hexagono.y + tamanho)
			rotate(hexagono.rotacao)
			translate(- (hexagono.x + tamanho), - (hexagono.y + tamanho))
			image(padrao, hexagono.x, hexagono.y)
		pop()
	})

	if(frameCount % 30 == 0){
		rotacoes[floor(random(rotacoes.length))] += TWO_PI/6
	}
}

function encontraMaisProximo(){
	var encontrado = 0
	var menorDistancia = 9999
	hexagonos.forEach((hexagono, indice) => {
		var d = dist(mouseX, mouseY, hexagono.x + tamanho, hexagono.y + tamanho)
		if(d < menorDistancia) {
			menorDistancia = d
			encontrado = indice
		}
	})
	return encontrado
}

function mousePressed() {
	indiceAlterado = encontraMaisProximo()
	rotacoes[indiceAlterado] += TWO_PI/6
}

function mouseMoved() {
	var maisProximo = encontraMaisProximo()
	if(indiceAlterado != maisProximo){
		indiceAlterado = maisProximo
		rotacoes[indiceAlterado] += TWO_PI/6
	}
}