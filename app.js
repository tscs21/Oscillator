$(function () {
    var sound = audioFileLoader("siren.wav");
    
    sound.setPannerPos(0,0,0);
    sound.setListenerPos(0,0,5);
 //   sound.setPannerVelocity(0,0,1);

    var leftButton = $(".left");
    var rightButton = $(".right");
    var zoomInButton = $(".zoomIn");
    var zoomOutButton = $(".zoomOut");

    var play = $(".play");
    var stop = $(".stop");
    var xPos = 0;
    var zPos = 0;
    var rightLoop;
    var leftLoop;
    var zoomOutLoop;
    var zoomInLoop;

    play.on("click",function () {
        sound.play();
        play.attr("disabled", "disabled");
    });

    stop.on("click",function () {
        sound.stop();
        play.removeAttr("disabled");
        sound = audioFileLoader("siren.wav");
    });

    //-----------event listeners------------------
    //-------------Zoom in/out--------------------
    function zoomOut() {
        zPos += 0.66;
        sound.setPannerPos(xPos, 0,zPos);
        zoomOutLoop = requestAnimationFrame(zoomOut);
        return zoomOutLoop;
    }


    zoomOutButton.on("mousedown", function () {
        zoomOut();
    });

    zoomOutButton.on("mouseup", function () {
        window.cancelAnimationFrame(zoomOutLoop);
    });

    function zoomIn() {
        zPos += -0.66;
        sound.setPannerPos(xPos,0,zPos);
        zoomInLoop = requestAnimationFrame(zoomIn);
        return zoomInLoop;
    }

    zoomInButton.on("mousedown", function () {
        zoomIn();
    });

    zoomInButton.on("mouseup", function () {
        window.cancelAnimationFrame(zoomInLoop);
    });


    //-------------move left/right----------------
    function moveLeft() {
        xPos += -0.66;
        sound.setPannerPos(xPos, 0,0);
        leftLoop = requestAnimationFrame(moveLeft);
        return leftLoop;
    }


    leftButton.on("mousedown", function () {
        moveLeft();
    });

    leftButton.on("mouseup", function () {
        window.cancelAnimationFrame(leftLoop);
    });

    function moveRight() {
        xPos += 0.66;
        sound.setPannerPos(xPos, 0,0);
        rightLoop = requestAnimationFrame(moveRight);
        return rightLoop;
    }

    rightButton.on("mousedown", function () {
        moveRight();
    });

    rightButton.on("mouseup", function () {
        window.cancelAnimationFrame(rightLoop);
    });

});
