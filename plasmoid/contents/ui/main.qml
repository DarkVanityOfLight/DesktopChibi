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

        AnimatedImage{
            id: walking_pose
            visible: false
            paused: true
            height: chibi.height; width: chibi.width;
            source: "../images/walking.gif"
        }


    Component.onCompleted:{
        ChibiAnimation.init();
    }
}

