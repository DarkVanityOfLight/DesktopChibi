var config;
var currentState;
var bodyRotation = new Object({'forward': 0, 'backward': 180, 'up': 90, 'down': 270});
var poses = [blink, walk, stand]
var rightBorder;
var leftBorder;
var topBorder;
var bottomBorder;


function init(){
	currentState = defaultPose;
	config = readConfigurationFile()
	rightBorder = config.screenWidth - 100;
  leftBorder = 100;
  topBorder = 100;
  bottomBorder = config.screenHeight - 100;

}

function readConfigurationFile(){
   var configEntry = {};
   configEntry.screenWidth = plasmoid.configuration.availableWidth;
   configEntry.screenHeight = plasmoid.configuration.availableHeight;
   return configEntry;
}

function Timer() {
    return Qt.createQmlObject("import QtQuick 2.0; Timer {}", root);
}

function delay(delayTime, cb){
	var timer = Timer();
	timer.interval = delayTime;
	timer.repeat = false;
	timer.triggered.connect(function () {
		cb();
		timer.destroy();
	})

	timer.start();
}

function changeState(state){
	if(state != currentState){
		currentState.visible = false;
		state.visible = true

		currentState = state;
	}

}

function stand(){
	resetTodefaultPose();
	delay(Math.random() * 2000, animator);
}

function blink(){
		changeState(blinkPose);
		blinkPose.paused = false;
		delay(1600, endBlink)
}

function endBlink(){
		blinkPose.paused = true;
		blinkPose.currentFrame = 0;
		animator();
} 

function resetTodefaultPose(){
	chibi.rotation = 0
	walkingPose.mirror = false
	changeState(defaultPose);
}

const DIRECTIONS = ['forward', 'backward', 'leftUp', 'leftDown', 'rightUp', 'rightDown']

function getDirection(directions=DIRECTIONS){

	var direction = directions[Math.floor(Math.random() * directions.length)]

	let chibiX = chibi.x
	let chibiY = chibi.y

	if(chibiY >= bottomBorder){
		if ((rightBorder - chibiX) <= (chibiX - leftBorder)){
			direction = "leftUp";
		}else{
			direction = "rightUp";
		}

	}else if(chibi.y <= topBorder){
		if( (rightBorder - chibiX) <= (chibiX - leftBorder)){
			direction = "leftDown";
		}else{
			direction = "rightDown";
		}
	}else if(chibiX >= rightBorder){
		direction = "backward"
	}else if(chibiX <= leftBorder){
		direction = "forward"
	}


	return direction

}

// Returns true if the new position is on screen
// and false if outside of the borders
function evalDirection(direction, steps){

	let newPos = getNewPos(direction, speed)

	let leftOverstep = newPos[0] <= leftBorder
	let rightOverstep = newPos[0] >= rigtBorder
	let topOverstep = newPos[1] <= topBorder
	let bottomOverstep = newPos[1] >= bottomBorder

	return !(leftOverstep || rightOverstep || topOverstep || bottomOverstep)

}


function walk(){
	changeState(walkingPose);
	walkingPose.paused = false;

	var direction = getDirection();
	let steps = Math.floor(Math.random() * 500)
	let time = steps * 4


	let endPos = getNewPos(direction, steps)
	xAnimation.to = endPos[0]
	yAnimation.to = endPos[1]

	xAnimation.duration = time
	yAnimation.duration = time

	movementAnimation.running = true


	delay(xAnimation.duration, stopAnimation)

	function stopAnimation(){
		walkingPose.paused = true;
		walkingPose.currentFrame = 0;
		movementAnimation.running = false;
		animator();
	}

}

function getNewPos(direction, speed){

		switch(direction){
			case 'forward':
				chibi.rotation = bodyRotation['forward'];
				return [chibi.x + speed, chibi.y]
			case 'backward':
				walkingPose.mirror = true;
				return [chibi.x - speed, chibi.y]
			case 'leftUp':
				walkingPose.mirror = true;
				return [chibi.x - speed, chibi.y - speed]
			case 'leftDown':
				walkingPose.mirror = true;
				return [chibi.x - speed, chibi.y + speed]
			case 'rightUp':
				return [chibi.x + speed, chibi.y - speed]
			case 'rightDown':
				return [chibi.x + speed, chibi.y + speed]

		}

}

function nextPose(){
	return poses[Math.floor(Math.random() * poses.length)]
}

// Should be called when an action ended
function animator(){
		resetTodefaultPose();
		// Get the next pose
		var n = nextPose();
		//Run the next pose
		n()
}
