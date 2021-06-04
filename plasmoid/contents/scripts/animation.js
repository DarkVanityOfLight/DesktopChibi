var config;
var currentState;
var bodyRotation = new Object({'forward': 0, 'backward': 180, 'up': 90, 'down': 270});
var poses = [blink, walk, stand]
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

function stand(){
	defaultPose();
	delay(Math.random() * 2000, animator);
}

function blink(){
		changeState(blink_pose);
		blink_pose.paused = false;
		delay(1600, endBlink)
}

function endBlink(){
		blink_pose.paused = true;
		blink_pose.currentFrame = 0;
		animator();
} 

function defaultPose(){
	chibi.rotation = 0
	walking_pose.mirror = false
	changeState(default_pose);
}

function get_direction(){

	function get_random_direction(){
		return ['forward', 'backward', 'left_up', 'left_down', 'right_up', 'right_down'][Math.floor(Math.random() * 6)];
	}


	var direction = get_random_direction();

	if (chibi.x >= rightBorder){
		direction = "backward";
	}else if(chibi.x <= leftBorder){
		direction = "forward";
	}else if(chibi.y >= topBorder){
		if ((chibi.x - rightBorder) <= (chibi.x - leftBorder)){
			direction = "left_up";
		}else{
			direction = "right_up";
		}
	}else if(chibi.y <= bottomBorder){
		if( (chibi.x - rightBorder) <= (chibi.x - leftBorder)){
			direction = "left_down";
		}else{
			direction = "right_down";
		}
	}


	return direction

}


function walk(){
	changeState(walking_pose);
	walking_pose.paused = false;

	var direction = get_direction();
	take_step(direction);
	delay(2500, animator);

}


function take_step(direction){
	let speed = 250

	switch(direction){
		case 'forward':
			chibi.rotation = bodyRotation['forward'];
			chibi.x += speed;
			break;
		case 'backward':
			walking_pose.mirror = true;
			chibi.x -= speed;
			break;
		case 'left_up':
			walking_pose.mirror = true;
			chibi.y -= speed;
			chibi.x -= speed;
			break;
		case 'left_down':
			walking_pose.mirror = true;
			chibi.y += speed;
			chibi.x -= speed;
			break;
		case 'right_up':
			chibi.y -= speed;
			chibi.x += speed;
			break;
		case 'right_down':
			chibi.y += speed;
			chibi.x += speed;
	}

}

function nextPose(){
	return poses[Math.floor(Math.random() * poses.length)]
}

// Should be called when an action ended
function animator(){
		defaultPose();
		// Get the next pose
		var n = nextPose();
		//Run the next pose
		n()
}
