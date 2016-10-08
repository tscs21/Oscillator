//var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function audioFileLoader(fileDirectory) {
    var soundObj = {};
    soundObj.fileDirectory = fileDirectory;

    var compressor = audioCtx.createDynamicsCompressor();

    function compReductionMeter() {
        var reduction = compressor.reduction.value;
        var bar = $(".compression-meter");
        bar.height((-1 * reduction) + "%");
        requestAnimationFrame(compReductionMeter);
    }

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

    //-------------------------------------------------------------------------


    soundObj.play = function () {

        $(".compression-meter").css("display", "block");

        compressor.threshold.value = -50;
        compressor.ratio.value = 3;

        var playSound = audioCtx.createBufferSource();
        playSound.buffer = soundObj.soundToPlay;

        playSound.connect(compressor);
        compressor.connect(audioCtx.destination);
        playSound.start(audioCtx.currentTime);

        console.log(compressor.reduction.value);
        compReductionMeter();
    };

    return soundObj;
}

var snare = audioFileLoader("snare.wav");

function keyPressed() {
    snare.play();
}

window.addEventListener("keydown", keyPressed, false);