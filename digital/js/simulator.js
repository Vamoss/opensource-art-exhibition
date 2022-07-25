const sketchFrame1 = document.getElementById("sketchFrame1");
const sketchFrame2 = document.getElementById("sketchFrame2");
const sketchFrame3 = document.getElementById("sketchFrame3");

var current = -1;
var sync = new Sync();
sync.addEventListener("on_1s_tick", function(e){
    var counter = Math.floor(Math.floor(e.detail.millis/1000)/changeDuration)%sketches.length;
    if(counter != current){
        current = counter;
        console.log("change", current);
        sketchFrame1.src = "sketches/" + sketches[current][0];
        sketchFrame2.src = "sketches/" + sketches[current][1];
        sketchFrame3.src = "sketches/" + sketches[current][2];
    }
});
sync.start();