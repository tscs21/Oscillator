$(function(){

    var isPlaying = false;
    var tempo =120.0;
    var current16thNote = 1;
    var futureTickTime = 0.0;
    var timerID = 0;

    /*load sounds*/
    var kick = audioFileLoader("kick.wav");
    var snare = audioFileLoader("snare.wav");
    var hihat = audioFileLoader("hihat.wav");
    var shaker = audioFileLoader("shaker.wav");

    /*end load sounds*/
    /*track arrays*/
    var track1 = [];
    var track2 = [];
    var track3 = [];
    var track4 = [];

    /*end track arrays*/

    function futureTick() {
        var secondsPerBeat = 60.0/ tempo;
        futureTickTime += 0.25 * secondsPerBeat;
        current16thNote++;
        if (current16thNote>16){
            current16thNote = 1;
        }
    }

    function checkIfRecordedAndPlay(trackArray, sndToPlay, gridBeat, timeVal){
        for(var i=0; i<trackArray.length; i+=1){
            if (gridBeat === trackArray[i]){
                sndToPlay.play(timeVal)
            }
        }
    }

    function scheduleNote(beatDivisionNumber, time) {
        checkIfRecordedAndPlay(track1,kick,beatDivisionNumber,time);
        checkIfRecordedAndPlay(track2,snare,beatDivisionNumber,time);
        checkIfRecordedAndPlay(track3,hihat,beatDivisionNumber,time);
        checkIfRecordedAndPlay(track4,shaker,beatDivisionNumber,time);

        removeDuplicates(track1);
        removeDuplicates(track2);
        removeDuplicates(track3);
        removeDuplicates(track4);

        var osc = audioCtx.createOscillator();
        osc.connect(audioCtx.destination);
        osc.start(time);
        osc.stop(time + 0.1)
    }

    function scheduler() {
        while (futureTickTime<audioCtx.currentTime + 0.1){
            scheduleNote(current16thNote, futureTickTime);
            futureTick();
        }
        timerID = window.setTimeout(scheduler, 50.0)
    }

    scheduler();
    /*transport controls*/
    function play() {
        isPlaying = !isPlaying;

        if (isPlaying){
            current16thNote = 1;
            futureTickTime = audioCtx.currentTime;
            console.log(futureTickTime);
            scheduler();
            return "stop";
        }else{
            window.clearTimeout(timerID);
            return "play";
        }
    }

    $("#play-button").on("click",function () {
        play();
    });
    /*end transport controls*/
    function removeDuplicates(arr) {
        for (var i=0; i<arr.length-1; i+=1){
            for (var j=i+1; j<arr.length; j+=1){
                if(arr[i] === arr[j]){
                    arr.splice(i, 1);
                }
            }
        }
    }
    /*drumpad events*/
    function drumpadAction(domElementDrumpad, arrayTrack, sound){
        $(domElementDrumpad).on("mousedown", function () {
            if (!isPlaying){
                sound.play(audioCtx.currentTime);
            };
            arrayTrack.push(current16thNote)
        });
    }

    drumpadAction("#drumpad-track1",track1,kick);
    drumpadAction("#drumpad-track2",track2,snare);
    drumpadAction("#drumpad-track3",track3,hihat);
    drumpadAction("#drumpad-track4",track4,shaker);

    $("#drumpad-track1").on("mousedown", function () {
        console.log(current16thNote);
        track1.push(current16thNote);
        snare.play(audioCtx.currentTime);
    })
});