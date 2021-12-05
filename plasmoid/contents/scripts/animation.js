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
	let steps = 100
	var steps_taken = 0;


	let end_pos = get_new_pos(direction, steps*2)
	xAnimation.to = end_pos[0]
	yAnimation.to = end_pos[1]
	movement_animation.running = true


	delay(xAnimation.duration, stop_animation)

	function stop_animation(){
		walking_pose.paused = true;
		walking_pose.currentFrame = 0;
		movement_animation.running = false;
		animator();
	}


//	walk_one();

	function walk_one(){
			take_step(direction);
			if (steps_taken != steps){
				delay(150, walk_one);
				steps_taken++;
			}else{
				walking_pose.paused = true;
				walking_pose.currentFrame = 0;
				animator();
			}

	}
}

function get_new_pos(direction, speed){

		switch(direction){
			case 'forward':
				chibi.rotation = bodyRotation['forward'];
				return [chibi.x + speed, chibi.y]
			case 'backward':
				walking_pose.mirror = true;
				return [chibi.x - speed, chibi.y]
			case 'left_up':
				walking_pose.mirror = true;
				return [chibi.x - speed, chibi.y - speed]
			case 'left_down':
				walking_pose.mirror = true;
				return [chibi.x - speed, chibi.y + speed]
			case 'right_up':
				return [chibi.x + speed, chibi.y - speed]
			case 'right_down':
				return [chibi.x + speed, chibi.y + speed]

		}

}


function take_step(direction){
	let speed = 2

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
