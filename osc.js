// create web audio api context
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// create Oscillator node
var oscillator = audioCtx.createOscillator();
oscillator.type = "triangle";
oscillator.frequency.value = 300;// value in hertz
oscillator.detune.value = 50;

//oscillator 2
var osc2 = audioCtx.createOscillator();
osc2.type = "square";
osc2.frequency.value = 300;

//node creations
var gainNode = audioCtx.createGain();
var gainNode2 = audioCtx.createGain();
var gainMix = audioCtx.createGain();

var distortion = audioCtx.createWaveShaper();
var biquadFilter = audioCtx.createBiquadFilter();

//distortion curve algorithm
function makeDistortionCurve(amount) {
    var k = typeof amount === 'number' ? amount : 50,
        n_samples = 44100,
        curve = new Float32Array(n_samples),
        deg = Math.PI / 180,
        i = 0,
        x;
    for ( ; i < n_samples; ++i ) {
        x = i * 2 / n_samples - 1;
        curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
    }
    return curve;
};

//node connections
//oscillator 1
oscillator.connect(distortion);
distortion.connect(biquadFilter);
biquadFilter.connect(gainNode);
gainNode.connect(gainMix);
//oscillator 2
osc2.connect(gainNode2);
gainNode2.connect(gainMix);
//both oscillators connected to gainmix which is connected to destination(speakers)
gainMix.connect(audioCtx.destination);

//node modifications
gainNode.gain.value = 0.05;
gainNode2.gain.value = 0.05;

biquadFilter.type = "lowshelf";
biquadFilter.frequency.value = 500;
biquadFilter.Q.value = 100;
biquadFilter.gain.value = 25;

distortion.curve = makeDistortionCurve(400);

/*start oscillators
oscillator.start();
osc2.start();
*/