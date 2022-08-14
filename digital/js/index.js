const sketchFrame = document.getElementById("sketchFrame");
const overlayEl = document.getElementById("overlay");
const metaEl = document.getElementById("meta");
const progressEl = document.getElementById("progress");

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
var id = urlParams.get('id');
if(!id)
    id = 0;

var offset = urlParams.get('offset');
if(!offset)
    offset = 0;
else
    offset = parseInt(offset)

var DEBUG = urlParams.get('debug');
if(!DEBUG)
    DEBUG = false;
else
    DEBUG = DEBUG == 'true';


const transitionSpeed = 1200;

var qrcode = new QRCode("qrcode", {
    text: "vamoss.com.br",
    width: 128,
    height: 128
});

var current = -1;
var sync = new Sync();
sync.addEventListener("on_1s_tick", function(e){
    var counter = Math.floor(Math.floor(e.detail.millis/1000+offset)/changeDuration)%sketches.length;
    if(counter != current){
        current = counter;
        overlayEl.classList.add("active");
        setTimeout(function(){
            var sketchInfo = sketches[current][id];
            console.log("change", current);
            sketchFrame.src = "sketches/" + sketchInfo.url;

            var title = sketchInfo.title;
            var message = "Arte gerativa<br/>"+sketchInfo.year;
            if(DEBUG)
                message += "<br/>Sketch " + current + ", Display: " + id + ", Offset: " + offset + ", Counter: " + counter;

            showMeta(title, message);

            qrcode.clear();
            qrcode.makeCode(sketchInfo.link);

            progressEl.style.transition = "none";
            progressEl.style.width = "100%";
            progressEl.offsetHeight;
            progressEl.style.transition = "width "+(changeDuration-transitionSpeed/1000)+"s linear";// restore animation
            progressEl.style.width = "0%";

            overlayEl.classList.remove("active");
        }, transitionSpeed);        
    }
    if(DEBUG){
        progressEl.innerHTML = changeDuration - Math.floor((e.detail.millis/1000+offset)%changeDuration);
    }
});
sync.start();

function showMeta(title, message){
    metaEl.innerHTML =
        "<h1>" + title + "</h1>" + 
        message;
}