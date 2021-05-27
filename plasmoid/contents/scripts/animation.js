var config;
var currentState;
var bodyRotation = new Object({'foreward': 0, 'backward': 180, 'up': 270, 'down': 90});
var poses = [blink, walk, ]
var rightBorder;
var leftBorder;
var topBorder;
var bottomBorder;


function init(){
	currentState = default_pose;
	config = readConfigurationFile()
	rightBorder = config.screenWidth - 100;
  leftBorder = 100;
  topBorder = config.screenHeight - 100;
  bottomBorder = 100;
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
	timer.repeat = true;
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

function blink(){
		changeState(blink_pose);
		blink_pose.paused = false;
		delay(1600, endBlink)
}

function endBlink(){
		defaultPose()
		blink_pose.paused = true;
		blink_pose.currentFrame = 0;
		animator();
} 

function defaultPose(){
	changeState(default_pose);
}

function get_direction(){

	function get_random_direction(){
		return ['foreward', 'backward', 'up', 'down'][Math.floor(Math.random() *(3))];
	}


	var direction = get_random_direction();

	if (chibi.x >= rightBorder){
		direction = "backward";
	}else if(chibi.x <= leftBorder){
		direction = "forward";
	}else if(chibi.y >= topBorder){
		direction = "down";
	}else if(chibi.y <= bottomBorder){
		direction = "up";
	}


	return direction

}


function walk(){
	changeState(walking_pose);
	walking_pose.paused = false;

	var direction = get_direction();
	let steps = 10
	var steps_taken = 0;

	walk_one();

	function walk_one(){
			take_step(direction);
			if (steps_taken != steps){
				delay(100, walk_one);
				steps_taken++;
			}else{
				changeState(default_pose);
				animator();
			}

	}
}


function take_step(direction){
	let speed = 1

	switch(direction){
		case 'foreward':
			chibi.rotation = bodyRotation['foreward'];
			chibi.x += speed;
			break;
		case 'backward':
			chibi.rotation = bodyRotation['backward'];
			chibi.x -= speed;
			break;
		case 'up':
			chibi.rotation = bodyRotation['up'];
			chibi.y -= speed;
			break;
		case 'down':
			chibi.rotation = bodyRotation['down'];
			chibi.y += speed;
			break;
	}

}

function nextPose(){

}

// Will recursively call itself
function animator(){
	// Get the next pose
	var n = nextPose();
	// Check how long we have to wait till the next pose
	var to_wait = n();
	// Call this function again after the delay time
	delay(to_wait, animator)

}
