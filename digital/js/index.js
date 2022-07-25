const DEBUG = true;

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
        var sketchUrl = sketches[current][id];
        console.log("change", current);
        sketchFrame.src = "sketches/" + sketchUrl;

        if(DEBUG){
            showDebug(sketchUrl, "Sketch " + current + ", Display: " + id);
        }
    }
});
sync.start();

const debugEl = document.getElementById("debug");
function showDebug(title, message){
    debugEl.style.display = "block";
    debugEl.style.right = Math.floor(Math.random() * 800) + "px";
    debugEl.innerHTML =
        "<h1>" + title + "</h1>" + 
        message;
}