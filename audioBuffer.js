//var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

var audioBuffer;

var getSound = new XMLHttpRequest();
getSound.open("GET", "snare.wav", true);
getSound.responseType = "arraybuffer";

getSound.onload = function () {
    audioCtx.decodeAudioData(getSound.response, function (buffer) {
        audioBuffer = buffer;
    });
};

getSound.send();

window.addEventListener("mousedown", playback);

function playback() {
    var playSound = audioCtx.createBufferSource();
    playSound.buffer = audioBuffer;
    playSound.connect(audioCtx.destination);
    playSound.start();
    
}
