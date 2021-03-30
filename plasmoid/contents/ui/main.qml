import QtQuick 2.0
import "../scripts/animation.js" as ChibiAnimation

Item{

    Item{
        id: chibi;
        height: 200
        width: 275
    
        Image{
            id: default_pose
            height: chibi.height; width: chibi.width;
            visible: true
            source: "../images/default.png"
        }

        AnimatedImage{
            id: blink_pose
            visible: false
            paused: true
            height: chibi.height; width: chibi.width;
            source: "../images/idle.gif"

        }
    }

    Timer{
        id: activate_blink_animation;
        interval: 10000;
        repeat: true;
        running: true;
        onTriggered:{
            ChibiAnimation.blink();
        }
    }

    Timer{
        id: wait_one_blink
        interval: 1600
        repeat: false
        running: false
        onTriggered:{
            ChibiAnimation.endBlink();
        }
    }



}
