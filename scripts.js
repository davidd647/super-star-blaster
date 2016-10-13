var CONST_TO_RADIANS = Math.PI / 180;

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




//this constructs a new Sprite!
//var img = new Sprite("wall.png", false);

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
		var bgImageObj = {
			src : "img/bg.jpg",
			posX : 0,
			posY : 0
		}
		var bgImage = new Sprite(bgImageObj.src, true);

		//main character
		var bananaObj = {
			src : "img/banana.png",
			accel : 0.001,
			speedHyp : 0.1,
			speedX : 1,
			speedY : 0,
			posX : 100,
			posY : 100,
			deg : 0
		}
		var banana = new Sprite(bananaObj.src, false);

		function whereAmIGoing(arcX, arcY){
			Context.context.beginPath();
			Context.context.moveTo(arcX, arcY);
			Context.context.lineTo(
					arcX + Math.floor(Math.sin(bananaObj.deg * CONST_TO_RADIANS) * 10), 
					arcY - Math.floor(Math.cos(bananaObj.deg * CONST_TO_RADIANS) * 10)
					);
			Context.context.strokeStyle="red";
			Context.context.stroke();
		}
//dev tools and keylogger
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
				//bananaObj.speedHyp = bananaObj.speedHyp + bananaObj.accel;

				var playerRads = bananaObj.deg * CONST_TO_RADIANS;

				//check if the hypoteneus is greater than 5
				if ((Math.abs(bananaObj.speedX) + Math.abs(bananaObj.speedY) > 5) && (
					(Math.abs(bananaObj.speedX) + Math.abs(bananaObj.speedY)) <=
						(
							Math.abs(bananaObj.speedX + Math.sin(playerRads) * bananaObj.speedHyp) +
							Math.abs(bananaObj.speedY - Math.cos(playerRads) * bananaObj.speedHyp)
						)
					))
					{
					//then don't add any speed to the banana

				} else {
					bananaObj.speedX = bananaObj.speedX + Math.sin(playerRads) * bananaObj.speedHyp;
					bananaObj.speedY = bananaObj.speedY - Math.cos(playerRads) * bananaObj.speedHyp;
				}

				console.log("bananaObj.speedHyp: " + bananaObj.speedHyp);
				console.log("bananaObj.speedX: " + bananaObj.speedX);
				// arcX = arcX + Math.floor(Math.sin(bananaObj.deg * CONST_TO_RADIANS) * 10);
				// arcY = arcY - Math.floor(Math.cos(bananaObj.deg * CONST_TO_RADIANS) * 10);
				// console.log(arcX, arcY);
				
			}
			var moveShipX = bananaObj.speedX;
			var moveShipY = bananaObj.speedY;

			bananaObj.posX += moveShipX;
			bananaObj.posY += moveShipY;

			if (keyIsDown[65] === true){
				bananaObj.deg -= 3;
				console.log('Rotation: ' + bananaObj.deg + 'deg');
			}
			if (keyIsDown[68] === true){
				bananaObj.deg += 3;
				console.log('Rotation: ' + bananaObj.deg + 'deg');
			}
			if(counter === endTime){
			   clearInterval(sleepyAlert);
			}
		
		timeDisplay.html(Math.floor((counter / 100)) + ' of ' + (endTime / 100) + 'ms have elapsed.');

	    //clear the screen
	    	Context.context.clearRect(0, 0, myCanvas.width, myCanvas.height);
	    	//I wonder what's faster...
	    	//should I just fill in the canvas rect with a colour like this? 
	    		//Context.context.fillStyle = "#000000";
	    		//Context.context.fillRect(0,0,myCanvas.width, myCanvas.height);
	    	
		//draw
			//background
			bgImage.draw(0, 0, myCanvas.width, myCanvas.height);

			//an arc
			Context.context.beginPath();
			Context.context.arc(arcX,arcY,40,0,2*Math.PI);
			Context.context.stroke();

			//make sure the player stays on the page
			if (bananaObj.posX > myCanvas.width){
				bananaObj.posX = 0;
			} else if (bananaObj.posX < 0){
				bananaObj.posX = myCanvas.width;
			}
			if (bananaObj.posY > myCanvas.height){
				bananaObj.posY = 0;
			} else if (bananaObj.posY < 0){
				bananaObj.posY = myCanvas.height;
			}
			// Context.context.drawImage(banana, arcX, arcY);
			banana.rotate(bananaObj.posX, bananaObj.posY, bananaObj.deg);

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