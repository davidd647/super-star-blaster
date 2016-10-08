//configure graphics processing
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");


//set up stuff to be animated
	//arc variables
		var arcX = 100;
		var arcY = 50;
	//draw arc itself
		ctx.beginPath();
		ctx.arc(arcX,arcY,40,0,2*Math.PI);
		ctx.stroke();

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
	var period = 100; // ms
	var endTime = 10000;  // 10,000ms
	var counter = 0;
	var sleepyAlert = setInterval(function(){
	//react when keys are pressed
		if (keyIsDown[65] === true){
			arcX-=3;
		}
		if (keyIsDown[68] === true){
			arcX+=3;
		}
		if (keyIsDown[87] === true){
			arcY-=3;
		}
		if (keyIsDown[83]){
			arcY+=3;
		}
		if(counter === endTime){
		   clearInterval(sleepyAlert);
		}
	
	timeDisplay.html((counter / 100) + ' of ' + (endTime / 100) + 'ms have elapsed.');

    //clear the screen
    	ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
    	
	//draw
		ctx.beginPath();
		ctx.arc(arcX,arcY,40,0,2*Math.PI);
		ctx.stroke();

    counter += period;
	}, period);