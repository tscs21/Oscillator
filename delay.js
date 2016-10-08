//var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

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

    //-------------------------------------------------------------------------

    soundObj.play = function () {

        var playSound = audioCtx.createBufferSource();
        playSound.buffer = soundObj.soundToPlay;

        var delay = audioCtx.createDelay(1);
        delay.delayTime.value = .3;

        var playSoundWet = audioCtx.createGain();
        var playSoundDry = audioCtx.createGain();
        var playSoundMix = audioCtx.createGain();
        var filter = audioCtx.createBiquadFilter();

        //gain control parameters
        
        playSoundDry.gain.value = 1;
        playSoundWet.gain.value = .6;
        filter.frequency.value = 1400;
        filter.type = "highpass";

        /*-----------------Routing diagram-----------------------------------------
         playSound - > delay - > playSoundWet---> filter ---> playSoundMix-- > destination
         playSound - > playSoundDry -------------------------- ^
         ------------------------------------------------------------------------*/
        playSound.connect(delay);
        delay.connect(playSoundWet);
        playSoundWet.connect(filter);
        filter.connect(delay);

        playSound.connect(playSoundDry);
        playSoundDry.connect(playSoundMix);
        playSoundWet.connect(playSoundMix);

        playSoundMix.connect(audioCtx.destination);

        playSound.start();
    };

    return soundObj;
}

var snare = audioFileLoader("snare.wav");

function keyPressed() {
    snare.play();
}

window.addEventListener("keydown", keyPressed, false);