var player;
var upPressed = false;
var downPressed = false;
var leftPressed = false;
var rightPressed = false;
var spacePressed = false;
var currentDirection = 'right';  // Direction of the player when the game first loads
var enemiesCount = 9; // Counter for the enemies

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function setPlayerDirection(dir) {
	//Display the walk animation for the correct direction, remove the other directions
	//to ensure the player does not have both "left" and "right" applied at the same time
	player.classList.remove('up');
	player.classList.remove('left');
	player.classList.remove('right');
	player.classList.remove('down');
	player.classList.add(dir);
	
	// Saving the current direction globally so it is easier to access this data 
	// it is used for arrow direction
	currentDirection = dir;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function keyUp(event) {
	if (event.keyCode == 37) {
		leftPressed = false;
	}

	if (event.keyCode == 39) {
		rightPressed = false;
	}

	if (event.keyCode == 38) {
		upPressed = false;
	}

	if (event.keyCode == 40) {
		downPressed = false;
	}

	if (event.keyCode == 32) {
		spacePressed = false;
		
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// copy pasted the code from "move()" function here
function isBlocking(top, left) {

	//Get the the element at the coordinates for where the player will move to
	//All 4 corners of the player are required to check there is no collision on any side
	var playerTopLeft = document.elementFromPoint(left, top);
	var playerTopRight = document.elementFromPoint(left + 32, top);
	var playerBottomLeft = document.elementFromPoint(left, top + 48);
	var playerBottomRight = document.elementFromPoint(left + 32, top + 48);

	// some changes here
	return playerTopLeft.classList.contains('blocking') || playerTopRight.classList.contains('blocking')
	 || playerBottomLeft.classList.contains('blocking') || playerBottomRight.classList.contains('blocking');
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Used to check if there is an enemy on this position
function enemyAtPosition(top, left) {
	
	// the +30 is necessary because without it, the element would be the arrow
	var element = document.elementFromPoint(left + 30, top);
	
	//If there is an element and it is an enemy, return it
	//An element at the specified position.
	if (element && element.classList.contains('enemy')) {
		return element;
	// Otherwise return false
	} else {
		return false;
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function move() {
	var left = player.offsetLeft;
	var top = player.offsetTop;

	if (downPressed) {
		setPlayerDirection('down');
		top = top + 1;
		console.log('player moving down');
	}

	if (upPressed) {
		setPlayerDirection('up');
		top = top - 1;
		console.log('player moving up');
	}

	if (leftPressed) {
		setPlayerDirection('left');
		left = left - 1;
		console.log('player moving left');
	}

	if (rightPressed) {
		setPlayerDirection('right');
		left = left + 1;
		console.log('player moving right');
	}

	// If the element that the player is about to walk over contains the class "blocking" then
	// the player is not moved.
	// The player will only be moved to coordinates "top" and "left" if the element in that position is not blocking
	if (!isBlocking(top, left)) {
		player.style.left = left + 'px';
		player.style.top = top + 'px';
	}

	//If any of the keys are being pressed, display the walk animation
	if (leftPressed || rightPressed || upPressed || downPressed) {
		player.classList.add('walk');
		player.classList.remove('stand');
	}
	//Otherwise, no keys are being pressed, display stand
	else {
		player.classList.add('stand');
		player.classList.remove('walk');
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function arrow() {
	var myArrow = document.createElement('div'); // creates a new element
	myArrow.className = "arrow"; // connects css with myArrow
	document.body.appendChild(myArrow); // appends

	var element = document.getElementById('player');
    var top = element.offsetTop;
	var left = element.offsetLeft;

	// currentDirection is a global variable so it changes when the player direction changes
	var dir = currentDirection; 
   
  
	   // Create a new interval for the arrow animation
	  // Also, saves this interval in a variable so it can be stopped/cleared later
	var interval = setInterval(function() {

		// Depending on the arrow direction, changes the left or top position
		// and loads rotation class from css file
		if (dir == 'right') {
			myArrow.classList.add('right'); // rotation 
			left = left + 5; 
		}
		if (dir == 'down') {
			myArrow.classList.add('down');//arrow class
			top = top + 5;
		}
		if (dir == 'left') {
			myArrow.classList.add('left');// arrow class
			left = left - 5; 
		}
		if (dir == 'up') {
			myArrow.classList.add('up');// arrow class
			top = top - 5;
		}

    // enemyAtPosition returns an enemy if any on this position (top and left) or false if there is no enemy there
		var enemy = enemyAtPosition(top, left); 

    // if Enemy found should be killed
		if (enemy) {
			enemy.classList.add('dead'); //display the dead animation
			console.log('enemy 0 hp');

			clearInterval(interval); // Removes this animation
			console.log('arrow stuck in the enemy');

			// Remove the enemy and the arrow after 1.5 seconds
			setTimeout(function () {
				enemy.remove();
				console.log('enemy removed');

				myArrow.remove();
				console.log('arrow removed');
				
			}, 1500);

					
			// Testing it i found a bug here, while the enemy is dying 
			// you can still "kill" him, so there is a bug here 
			enemiesCount--;
			
			if(enemiesCount == 0) {
				
				// Won
				alert('You won!');
				// there is another bug with this 
				// if the player is moving just before the alert is fired, player keeps moving after it
				
			// a prompt to capture users input and show the play again message
			var	userInput = prompt('\t play again ? \n Type "play" for restarting the game. \n if you are lazy leave it blank and click ok \n For quiting type "bye" or click cancel. \n Note: It is case sensitive.');
				
				//if user types "play"
				if(userInput == 'play') {
					// The bug above gets fixed with a refresh :P
					location.reload(); // page refresh F5
			
				//if user types "bye"
				} else if(userInput == 'bye') {
					close(); // quit the game
					
				//restart the game in case there is no input
				} else if (userInput == ''){
					location.reload();// page refresh F5
					
				//quit the game in any other action that the user may take
				} else {
					close(); 
				}
				
			}

		// Keeps moving the arrow if no blocking
		} else if (!isBlocking(top, left)) {
			console.log('arrow spawned');
			myArrow.style.top = top + 'px';
			myArrow.style.left = left + 'px';	
		} else {
			clearInterval(interval); // Removes this animation
			console.log('arrow stuck in the tree');
		}

	}, 5);
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function keyDown(event) {
	if (event.keyCode == 37) {
		leftPressed = true;
	}

	if (event.keyCode == 39) {
		rightPressed = true;
	}

	if (event.keyCode == 38) {
		upPressed = true;
	}

	if (event.keyCode == 40) {
		downPressed = true;
	}

	if (event.keyCode == 32) {
		spacePressed = true;
		arrow();

		// add bow animation
		player.classList.add('fire');
	} else{ 
		// removes bow animation
		player.classList.remove('fire'); 
	
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function gameStart() {
	player = document.getElementById('player');
	setInterval(move, 10);

	document.addEventListener('keydown', keyDown);
	document.addEventListener('keyup', keyUp);
}


document.addEventListener('DOMContentLoaded', gameStart);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
