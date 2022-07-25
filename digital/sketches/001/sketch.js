/******************
Code by Vamoss
Original code link:
https://openprocessing.org/sketch/1433484

Author links:
http://vamoss.com.br
http://twitter.com/vamoss
http://github.com/vamoss
******************/

var data;
var people = [];
var colors;

function preload() {
  data = loadJSON('data-1-413567.json');
  //data = loadJSON('data-2-486307.json');
  //data = loadJSON('data-3-453716.json');
  //data = loadJSON('data-4-494102.json');
  //data = loadJSON('data-5-492096.json');	
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	background("#2B2244");
	noStroke();
	noLoop();
	
	addPeople(data.userID, data.fullname, "author");
	data.forks.forEach(e => addPeople(e.userID, e.fullname, "fork"));
	data.comments.forEach(e => addPeople(e.userID, e.fullname, "comment"));
	data.hearts.forEach(e => addPeople(e.userID, e.fullname, "like"));
	data.user.followers.forEach(e => addPeople(e.userID, e.fullname, "follower"));
	
	colors = {
		author: color("#FFFFFF"),
		fork: color("#24FFFB"),
		comment: color("#00FF00"),
		like: color("#C70039"),
		follower: color("#FFC30F")
	};
}

function draw() {	
	var total = people.length;
	const PHI = (1 + sqrt(5))/2;  //golden ratio
	for(var i = 0; i < total; i++){
		var radius = sqrt(i * PHI) * 5 + 5;
		var angle = i * PHI * TAU;
		var x = cos(angle) * radius + width / 2;
		var y = sin(angle) * radius + height / 2;
		var totalInteractions = people[i].interactions.length;
		var size = 8 + totalInteractions;
		people[i].interactions.forEach((interaction, i) => {
			fill(colors[interaction]);
			var pct = i / totalInteractions * TWO_PI;
			arc(x, y,size, size, pct, pct + TWO_PI/totalInteractions, PIE);
		});
	}
}

function addPeople(id, name, interaction){
	var person = people.find(p => p.id === id);
	if(person){
		person.interactions.push(interaction);
	}else{
		people.push({id, name, interactions:[interaction]});
	}
}