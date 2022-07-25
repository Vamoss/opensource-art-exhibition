/******************
Code by Vamoss
Original code link:
https://openprocessing.org/sketch/1617307

Author links:
http://vamoss.com.br
http://twitter.com/vamoss
http://github.com/vamoss
******************/

//Concept from the book:
//Walkscapes - O caminhar como Prática Estética

//words from page 28
const words1 = ["Agradeça", "Altere", "Anexe", "Atualize", "Cante", "Comente", "Compartilhe", "Compre", "Construa", "Copie", "Crie", "Criptografe", "Debugue", "Defina", "Delete", "Deseje", "Destrua", "Envie", "Erre", "Escreva", "Escute", "Faça", "Imprima", "Informe", "Invente", "Leia", "Navegue", "Perca", "Pinte", "Preencha", "Resgate", "Salve", "Sonhe", "Tire", "Use", "Veja", "Vista"]
const words2 = ["a criatividade", "a imaginação", "um algoritmo", "um aplicativo", "um componente", "uma condição", "um código", "um disco rígido", "um email", "um gif", "um link", "uma lógica", "um looping infinito", "um módulo", "um programa", "um site", "uma aleatoriedade", "uma constante", "uma função", "uma inteligência artificial", "uma realidade aumentada", "uma sintaxe", "uma variável"]
const words3 = ["para abolir", "para abrir", "para aceitar", "para acessar", "para aderir", "para apropriar", "para arruinar", "para arrumar", "para bloquear", "para brincar com", "para colorir", "para conectar", "para contribuir com", "para corrigir", "para criar", "para depurar", "para estar com", "para expandir", "para ferir", "para guardar", "para hackear", "para iniciar", "para inspirar", "para invadir", "para melhorar", "para mudar", "para opor", "para penetrar", "para quebrar", "para reaver", "para reinicializar", "para restartar", "para salvar", "para sentir", "para talvez mudar", "para tomar", "para transitar"]
const words4 = ["a criatividade.", "a internet.", "a liberdade.", "a nuvem.", "a rede.", "a sua mente.", "a sua vida.", "a utopia.", "a vida dos outros.", "as nossas vidas.", "as redes sociais.", "o algoritmo.", "o servidor.", "o sistema.", "a base de dados."]

//text
var message, font, mappedSize, textY, fadeIn, colors, counter, currentColor

//noise particles
var intensity, timeSum
var particles = []

function preload() {
	font = loadFont("OpenSans-ExtraBold.ttf");
}

function setup() {
	var size = min(windowWidth, windowHeight)*0.9;
	createCanvas(size, size);
	background("#2B2244");
	
	colors = [color("#900C3F"), color("#C70039"), color("#e32c36"), color("#FF5733"), color("#FFC30F"), color("#24fffb")];
	
	for(var i = 0; i < 500; i++){
		particles.push({
			x: random(width),
			y: random(height),
			v: random(5, 20),//vel
		})
	}
	
	counter = 0;
	
	mappedSize = map(width, 400, 900, 50, 110);
	textSize(mappedSize);
  textLeading(mappedSize*1.05);
	textFont(font);
	newMessage();
}

function newMessage(){
	message = random(words1) + " " + random(words2) + " " + random(words3) + " " + random(words4);
	message = wrapText(message, width-40);
	
	var textHeight = textLeading() * (message.split("\n").length-1);
	textY = random(textLeading(), height - textHeight - textLeading());
	
	setTimeout(newMessage, 7000);
	fadeIn = 0;
	
	counter++;
	currentColor = colors[counter % colors.length];
}

function draw() {
	intensity = noise(frameCount/50);	
	timeSum -= intensity;
	
	strokeWeight(2);
	particles.forEach((p, i) => {
			var pX = p.x;
			var pY = p.y;
			p.x -= intensity * p.v;
			p.y += (noise(p.x/100, intensity*5+frameCount/50)-0.447) * 10;
			stroke(i < 250 ? currentColor : "#2B2244");
			line(p.x, p.y, pX, pY);
			if(p.x < 0){
				p.x = width;
				p.y = random(height);
			}
	})
	
	noStroke();
	fill(255, fadeIn < 255 ? ++fadeIn : fadeIn);
  text(message, 20, textY);
}

// wraps text to a specified width (will flow to any height necessary to fit
// all the text), can optionally indent first/other lines and will hyphenate
// very large words (can also specify a particular hyphen character if desired)
// via: https://stackoverflow.com/a/45614206/1167783
function wrapText(s, w) {	
  // if short enough, just send it back as is
  var outputLines = "";
  if (textWidth(s) <= w) {
    outputLines = s;
  }

  // otherwise, split it!
  else {
    var words = s.split(" ");
    var currentLine = "";
    for (var i=0; i<words.length; i++) {
      var word = words[i];

      // check width, if not too long yet then add the current word
      // and keep going through the string
      var lineWidth = textWidth(currentLine + " " + word);
      if (lineWidth < w) {
        currentLine += word + " ";
      }
      // if too long, end current line and start a new one
      else {
				outputLines += currentLine+"\n";
				currentLine = word + " ";
			}
		}
		outputLines += currentLine;
	}
  return outputLines;
}