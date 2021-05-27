var config;
var currentState;
var bodyRotation = new Object({'foreward': 0, 'backward': 180, 'up': 270, 'down': 90});
var poses = [blink, walk, ]

function init(){
	currentState = default_pose;
}

function Timer() {
    return Qt.createQmlObject("import QtQuick 2.0; Timer {}", root);
}

function delay(delayTime, cb){
	timer = new Timer();
	timer.interval = delayTime;
	timer.repeat = true;
	timer.triggered.connect(function () {
		cb()
	})

	timer.start();
}

function changeState(state){
	state.visible = true;
	currentState.visible = false;

	currentState = state;

}

function blink(){

		if (currentState == default_pose){
			changeState(blink_pose);
			blink_pose.paused = false;
			wait_one_blink.running = true;
			activate_blink_animation.running = false;
			delay(1600, endBlink)
			return 1600
		}

		return 0
}

function endBlink(){

	if(currentState == blink){
		defaultPose()
		blink_pose.paused = true;
		blink_pose.currentFrame = 0;
	}
	
} 

function defaultPose(){
	changeState(default_pose);
}


function walk(){
	changeState(walking_pose)

	// Len of items plus one because random will never be one
	let direction = ['foreward', 'backward', 'up', 'down'][Math.floor(Math.random() *(4 + 1))];
	let steps = Math.floor(Math.random() * 100);
	var steps_taken = 0;

	function walk_one(){
			take_step(direction);
			if (steps_taken != steps){
				delay(100, walk_one);
				steps_taken++;
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