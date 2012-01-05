function $LOG(msg) { 
	//try{console.log(msg);} catch(e) {}
}
Movement = function(curLoc, prevMovement) {

	this.timestamp = new Date().getTime();
	this.currentLocation = curLoc;
	this.previousLocation = prevMovement ? prevMovement.currentLocation : null;


	this.velocity = {x:0, y:0};
	//this.acceleration = {x:0, y:0};


	//$LOG(this.previousLocation);
	//$LOG(this.currentLocation);
	if (this.previousLocation) {


		var timeDiff = this.timestamp - prevMovement.timestamp;
		var xDiff = this.currentLocation.x - this.previousLocation.x;
		var yDiff = this.currentLocation.y - this.previousLocation.y;

		//TODO: handle zeroes
		try {
			//px/ms
			this.velocity = {
					x: (xDiff / timeDiff),
					y: (yDiff / timeDiff)
			};
		}
		catch(e) {
			$LOG(e);
		}


		//var velocityDiff = this.velocity - prevMovement.velocity;


		//px/ms2
		//this.acceleration = { }; //[(this.velocity - prevMovement.velocity) / timeDiff;


	}   	
};

Movement.prototype.clone = function() {
	var returnObj = {};
	for (var prop in this) {
		if (this.hasOwnProperty(prop)) {
			returnObj[prop] = this[prop];
		}
	}
	return returnObj;
};

Location = function(centerX, centerY) {
	this.x = centerX;
	this.y = centerY;
};

CameraController = function() {
	//this.locations = new Array(5);
	this.mostRecentMovement = null;
	this.velocity = {x:0,y:0};
	this.INTERVAL = 50;
	this.DECELERATION = 5 / this.INTERVAL;
	this.MULTIPLIER = 80;
	this.timer = null;
};

CameraController.prototype.isMoving = function() {
	return (this.velocity.x !== 0) || (this.velocity.y !== 0);
};

CameraController.prototype.recordMove = function(pos) {
	var curLoc = new Location(pos[0], pos[1]);


	var prevMovement = (this.mostRecentMovement) ? this.mostRecentMovement.clone() : null;

	//$LOG("Previous Movement: " + prevMovement);

	var newMove = new Movement(curLoc, prevMovement);
	//$LOG("New Movement: " + newMove);

	this.mostRecentMovement = newMove;
	$LOG(this.mostRecentMovement);
	
	
	this.move(this.mostRecentMovement);
	
	/*
	var position = new Movement(pos[0], pos[1]);
	this.locations.unshift(position);
	this.locations.pop();
	$LOG(this.locations);
	 */
};


CameraController.prototype.decelerate = function() {
	var xMultiplier = (this.velocity.x < 0) ? -1 : 1;
	var yMultiplier = (this.velocity.y < 0) ? -1 : 1;
	
	this.velocity.x -= (Math.abs(this.velocity.x) < this.DECELERATION) ? this.velocity.x : this.DECELERATION * xMultiplier;
	this.velocity.y -= (Math.abs(this.velocity.y) < this.DECELERATION) ? this.velocity.y : this.DECELERATION * yMultiplier;
};

CameraController.prototype.move = function(movement) {
	$LOG("velocity before move: " + this.velocity.x + ", " + this.velocity.y);
	//do move
	this.velocity.x += movement.velocity.x;
	this.velocity.y += movement.velocity.y;
	
	if (this.timer == null) {
		this.animate();
	}
};

CameraController.prototype.animate = function() {
	$LOG("current velocity: " + this.velocity.x + ", " + this.velocity.y);
	//TODO: move object
	
	window.scrollBy (Math.round(this.velocity.x * this.MULTIPLIER), Math.round(this.velocity.y * this.MULTIPLIER));
	
	
	this.decelerate();

	$LOG("decelerated to: " + this.velocity.x + ", " + this.velocity.y);
	
	if (this.isMoving()) {
		var _self = this;
		this.timer = setTimeout(function() {_self.animate(); } , this.INTERVAL);
	}
	else {
		clearTimeout(this.timer);
		this.timer = null;
	}
}

//This will look at the previous "moves" and determine how much to moveBy
CameraController.prototype.getVelocity = function() {

};

var _cc = new CameraController();


function sendToJavaScript(val) {
	_cc.recordMove(val);
}



