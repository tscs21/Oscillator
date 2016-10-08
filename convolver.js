//var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function audioFileLoader(fileDirectory, impulseFileDirectory) {
    var soundObj = {};
    soundObj.fileDirectory = fileDirectory;
    soundObj.impulseFileDirectory = impulseFileDirectory;

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
    var impulseBuffer;

    var getImpulse = new XMLHttpRequest();
    getImpulse.open("GET", soundObj.impulseFileDirectory, true);
    getImpulse.responseType = "arraybuffer";
    getImpulse.onload = function () {
        audioCtx.decodeAudioData(getImpulse.response, function (bufferImpls) {
            impulseBuffer = bufferImpls;
        });
    };

    getImpulse.send();

    //-------------------------------------------------------------------------

    soundObj.play = function () {

        var playSound = audioCtx.createBufferSource();
        playSound.buffer = soundObj.soundToPlay;
        var playSoundWet = audioCtx.createGain();
        var playSoundDry = audioCtx.createGain();
        var mixGain = audioCtx.createGain();
        var convolver = audioCtx.createConvolver();
        convolver.buffer = impulseBuffer;

        //gain control parameters
        
        playSoundDry.gain.value = .1;
        playSoundWet.gain.value = .9;

        /*-----------------Routing diagram-----------------------------------------
         playSound - > convolver - > playSoundWet----mixGain-- > destination
         playSound - > playSoundDry ----------------- ^
         ------------------------------------------------------------------------*/
        playSound.connect(convolver);
        convolver.connect(playSoundWet);
        playSound.connect(playSoundDry);
        playSoundDry.connect(mixGain);
        playSoundWet.connect(mixGain);
        mixGain.connect(audioCtx.destination);

        playSound.start();
    };

    return soundObj;
}

var snare = audioFileLoader("snare.wav", "irBedroom.wav");

function keyPressed() {
    snare.play();
}

window.addEventListener("keydown", keyPressed, false);