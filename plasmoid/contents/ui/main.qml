import QtQuick 2.0
import "../scripts/animation.js" as ChibiAnimation
import org.kde.plasma.plasmoid 2.0

Item{
    Plasmoid.backgroundHints: "NoBackground";
    id: root;

    Item{
        id: chibi;
        height: 200
        width: 275
        x: 200
        y: 400
    
        Image{
            id: defaultPose
            height: chibi.height; width: chibi.width;
            visible: true
            source: "../images/default.png"
        }

        AnimatedImage{
            id: blinkPose
            visible: false
            paused: true
            height: chibi.height; width: chibi.width;
            source: "../images/idle.gif"

        }

        AnimatedImage{
            id: walkingPose
            visible: false
            paused: true
            height: chibi.height; width: chibi.width;
            source: "../images/walking.gif"
        }


        ParallelAnimation{
            id: movementAnimation

            NumberAnimation{
                id: xAnimation
                target: chibi
                property: 'x'
                to: 0
                duration: 1000
            }

            NumberAnimation{
                id: yAnimation
                target: chibi
                property: 'y'
                to: 0
                duration: xAnimation.duration
            }

        }


        Component.onCompleted:{
            ChibiAnimation.init();
            ChibiAnimation.animator();
        }
    }
}

