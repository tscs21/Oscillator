var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function audioFileLoader(fileDirectory) {
    var soundObj = {};
    soundObj.fileDirectory = fileDirectory;

    var getSound = new XMLHttpRequest();
    getSound.open("GET", soundObj.fileDirectory, true);
    getSound.responseType = "arraybuffer";
    getSound.onload = function () {
        audioCtx.decodeAudioData(getSound.response, function (buffer) {
            soundObj.soundToPlay = buffer;
        });
    };

    getSound.send();

    //-------------------------------------------------------------------------

    soundObj.play = function () {
        var playSound = audioCtx.createBufferSource();
        playSound.buffer = soundObj.soundToPlay;

        playSound.connect(audioCtx.destination);
        playSound.start(audioCtx.currentTime);
    };

    return soundObj;
}

var snare = audioFileLoader("snare.wav");

function keyPressed() {
    snare.play();
}

window.addEventListener("keydown", keyPressed, false);