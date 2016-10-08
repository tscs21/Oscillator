var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function audioFileLoader(fileDirectory) {
    var soundObj = {};

    var panner = audioCtx.createPanner();
    var listener = audioCtx.listener;

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

    soundObj.setPannerPos = function (x, y, z) {
        panner.setPosition(x,y,z);
    };

    soundObj.setListenerPos = function (x, y, z) {
        listener.setPosition(x,y,z);
    };

    soundObj.setPannerVelocity = function (x, y, z) {
        panner.setVelocity(x,y,z);
    };

    soundObj.play = function () {

        var playSound = audioCtx.createBufferSource();
        
        playSound.buffer = soundObj.soundToPlay;
        playSound.connect(panner);
        panner.connect(audioCtx.destination);
        playSound.start(audioCtx.currentTime);
    };

    soundObj.stop = function () {
        playSound.stop(audioCtx.currentTime);
    };

    return soundObj;
}
