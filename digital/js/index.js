const sketchFrame = document.getElementById("sketchFrame");

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
var id = urlParams.get('id');
if(!id)
    id = 0;

var current = -1;
var sync = new Sync();
sync.addEventListener("on_1s_tick", function(e){
    var counter = Math.floor(Math.floor(e.detail.millis/1000)/changeDuration)%sketches.length;
    if(counter != current){
        current = counter;
        console.log("change", current);
        sketchFrame.src = "sketches/" + sketches[current][id];
    }
});
sync.start();