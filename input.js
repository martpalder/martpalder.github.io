document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);

var forwardPressed = false;
var backwardPressed = false;
var leftPressed = false;
var rightPressed = false;
var mouseX;
var mouseY;

function keyDownHandler(event) {
	if (event.keyCode == 87) forwardPressed = true;
	else if (event.keyCode == 83) backwardPressed = true;
	else if (event.keyCode == 65) leftPressed = true;
	else if (event.keyCode == 68) rightPressed = true;
}

function keyUpHandler(event) {
	if (event.keyCode == 87) forwardPressed = false;
	else if (event.keyCode == 83) backwardPressed = false;
	else if (event.keyCode == 65) leftPressed = false;
	else if (event.keyCode == 68) rightPressed = false;
}

function mouseMoveHandler(event) {
	const canvas = document.querySelector('canvas');
	const rect = canvas.getBoundingClientRect();
	
	// Get mouse position
	mouseX = event.clientX - rect.left;
	mouseY = event.clientY - rect.top;
	
	// Mouse constraints
	if (mouseX < 0) mouseX = 0;
	else if (mouseX > canvas.width) mouseX = canvas.width;
	if (mouseY < 0) mouseY = 0;
	else if (mouseY > canvas.height) mouseY = canvas.height;
}
