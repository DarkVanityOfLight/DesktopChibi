var config;
var currentState;
var bodyRotation = new Object({'foreward': 0, 'backward': 180, 'up': 270, 'down': 90});

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
		changeState(default_pose);

		blink_pose.paused = true;
		blink_pose.currentFrame = 0;
		activate_blink_animation.running = true;
	}
	
} 

function walk(direction){
	var speed = 100

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