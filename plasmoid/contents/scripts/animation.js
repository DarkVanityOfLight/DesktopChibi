var config;
var currentState;

function init(){
	currentState = default_pose;
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
		}
}

function endBlink(){

	if(currentState = blink){
		changeState(default_pose);

		blink_pose.paused = true;
		blink_pose.currentFrame = 0;
		activate_blink_animation.running = true;
	}
	
} 
