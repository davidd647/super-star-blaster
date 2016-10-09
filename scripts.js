var Context = {
	canvas : null,
	context : null,
	create: function(canvas_tag_id) {
		this.canvas = document.getElementById(canvas_tag_id);
		this.context = this.canvas.getContext('2d');
		return this.context;
	}
}

var Sprite = function(filename, is_pattern) {

	//construct the object
	this.image = null;
	this.pattern = null;
	this.TO_RADIANS = Math.PI/180;

	if (filename != undefined && filename != "" && filename != null){
		this.image = new Image();
		this.image.src = filename;

		if (is_pattern){
			this.pattern = Context.context.createPattern(this.image, 'repeat');
		} 
	} else {
		console.log("Unable to load sprite.");
	}

	this.draw = function(x, y, w, h){
		//Pattern?
		if (this.pattern != null){
			Context.context.fillStyle = this.pattern;
			Context.context.fillRect(x, y, w, h);
		} else {
			//image
			if (w != undefined || h != undefined){
				Context.context.drawImage(this.image, x, y, 
										this.image.width,
										this.image.height);
			} else {
				//stretches
				Context.context.drawImage(this.image, x, y, w, h);
			}

		}
	}
	
	this.rotate = function(x, y, angle){
		Context.context.save();

		Context.context.translate(x, y);
		Context.context.rotate(angle * this.TO_RADIANS);

		Context.context.drawImage(this.image,
								-(this.image.width/2),
								-(this.image.height/2));

		Context.context.restore();
	}

}


var bananaObj = {
	src : "img/banana.png",
	deg : 0,
	accel : 1, //1 px per frame per frame
	moveX : 0,
	moveY : 0
}

//this constructs a new Sprite!
//var img = new Sprite("wall.png", false);

function whereAmIGoing(arcX, arcY){
	Context.context.beginPath();
	Context.context.moveTo(arcX, arcY);
	Context.context.lineTo(
			arcX + Math.sin(bananaObj.deg / 180) * 10, 
			arcY + Math.cos(bananaObj.deg / 180) * 10 );
	Context.context.strokeStyle="red";
	Context.context.stroke();
}

function startGame(){

//set up stuff to be animated
	//arc variables
		var arcX = 100;
		var arcY = 50;
	//draw arc itself
		Context.context.beginPath();
		Context.context.arc(arcX,arcY,40,0,2*Math.PI);
		Context.context.stroke();

	//assign image variables
		var banana = new Sprite(bananaObj.src, false);

//dev tools 
	//timelft visualization
		//main var for display
			var timeDisplay = $('#time-left');

	//keylogger visualization
		//main var for keylogger visualization
			var log = $('#log')[0], pressedKeys = [];
		//main var for keylogger interaction
			var keyIsDown = [];


		$(document.body).keydown(function (evt) {
		    //keylogger visualization
				var li = pressedKeys[evt.keyCode];
				if (!li) {
				    li = log.appendChild(document.createElement('li'));
				    pressedKeys[evt.keyCode] = li;
				}
				$(li).text('Down: ' + evt.keyCode);
				$(li).removeClass('key-up');
			//keylogger interaction
				var tempKey = evt.keyCode;
				keyIsDown[tempKey] = true;
		});
		$(document.body).keyup(function (evt) {
			//keylogger visualization
				var li = pressedKeys[evt.keyCode];
				if (!li) {
				   li = log.appendChild(document.createElement('li'));
				}
				$(li).text('Up: ' + evt.keyCode);
				$(li).addClass('key-up');
			//keylogger interaction
				var tempKey = evt.keyCode;
				keyIsDown[evt.keyCode] = false;
		});

//the loop
	var period = 30; // ms
	var endTime = 30000;  // 10,000ms
	var counter = 0;
	var sleepyAlert = setInterval(function(){
	//react when keys are pressed
		if (keyIsDown[87] === true){
			//this is the 'up' key, so change the way we're moving
			//deg, current motion X and current motion Y
			arcX = arcX + Math.sin(bananaObj.deg / 180) * 10;
			arcY = arcY + Math.cos(bananaObj.deg / 180) * 10;
			console.log(arcX, arcY);
			
		}
		if (keyIsDown[65] === true){
			bananaObj.deg -= 3;
		}
		if (keyIsDown[68] === true){
			bananaObj.deg += 3;
		}
		if(counter === endTime){
		   clearInterval(sleepyAlert);
		}
	
	timeDisplay.html((counter / 100) + ' of ' + (endTime / 100) + 'ms have elapsed.');

    //clear the screen
    	Context.context.clearRect(0, 0, myCanvas.width, myCanvas.height);
    	//I wonder what's faster...
    	//should I just fill in the canvas rect with a colour like this? 
    		//Context.context.fillStyle = "#000000";
    		//Context.context.fillRect(0,0,myCanvas.width, myCanvas.height);
    	
	//draw
		Context.context.beginPath();
		Context.context.arc(arcX,arcY,40,0,2*Math.PI);
		Context.context.stroke();
		// Context.context.drawImage(banana, arcX, arcY);
		banana.rotate(arcX, arcY, bananaObj.deg);

	//game directional indicator (gamedev tool)
		whereAmIGoing(arcX, arcY);

    counter += period;
	}, period);
}

$( document ).ready(function(){
	//initialize canvas
		Context.create("myCanvas");

	startGame();
});