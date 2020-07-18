main();

//
// Start the game
//
function main() {
	// Get rendering context
	const canvas = document.querySelector('canvas');
	const ctx = canvas.getContext('2d');
	
	// Set screen size
	canvas.width = 640;
	canvas.height = 480;
	
	// Load the map from a CSV file
	const map = loadMap('./maps/map1.csv');
	
	// Add a player
	const player = new Player(4.5, 4.5, 8, 6);
	
	// Get paragraph elements
	const fps = document.querySelector('#fps');
	const frameTime = document.querySelector('#frameTime');
	const pos = document.querySelector('#pos');
	const mouse = document.querySelector('#mouse');
	
	// Create text nodes
	const fpsText = document.createTextNode("");
	const frameTimeText = document.createTextNode("");
	const posText = document.createTextNode("");
	const mouseText = document.createTextNode("");
	
	// Add text nodes to paragraph elements
	fps.appendChild(fpsText);
	frameTime.appendChild(frameTimeText);
	pos.appendChild(posText);
	mouse.appendChild(mouseText);
	
	var then = 0;
	var secondCount = 0.0;
	
	// Game loop
	function render(now) {
		now *= 0.001;	// Convert to seconds
		const deltaTime = now - then;
		then = now;
		
		// Add delta time to speeds
		const moveSpeed = player.moveSpeed * deltaTime;
		const rotSpeed = player.rotSpeed * deltaTime;
		
		// Player controls
		// Move forward if no wall in front of you
		if (forwardPressed) {
			if (map[Math.round(player.pos.x + player.dir.x * moveSpeed)][Math.round(player.pos.y)] == 0)
				player.pos.x += player.dir.x * moveSpeed;
			if (map[Math.round(player.pos.x)][Math.round(player.pos.y + player.dir.y * moveSpeed)] == 0)
				player.pos.y += player.dir.y * moveSpeed;
		}
		// Move backwards if no wall behind you
		else if (backwardPressed) {
			if (map[Math.round(player.pos.x - player.dir.x * moveSpeed)][Math.round(player.pos.y)] == 0)
				player.pos.x -= player.dir.x * moveSpeed;
			if (map[Math.round(player.pos.x)][Math.round(player.pos.y - player.dir.y * moveSpeed)] == 0)
				player.pos.y -= player.dir.y * moveSpeed;
		}
		// Rotate to the right
		if (rightPressed) {
			// Both camera direction and camera plane must be rotated
			const oldDirX = player.dir.x;
			player.dir.x = player.dir.x * Math.cos(-rotSpeed) - player.dir.y * Math.sin(-rotSpeed);
			player.dir.y = oldDirX * Math.sin(-rotSpeed) + player.dir.y * Math.cos(-rotSpeed);
			const oldPlaneX = player.plane.x;
			player.plane.x = player.plane.x * Math.cos(-rotSpeed) - player.plane.y * Math.sin(-rotSpeed);
			player.plane.y = oldPlaneX * Math.sin(-rotSpeed) + player.plane.y * Math.cos(-rotSpeed);
		}
		// Rotate to the left
		else if (leftPressed) {
			// Both camera direction and camera plane must be rotated
			const oldDirX = player.dir.x;
			player.dir.x = player.dir.x * Math.cos(rotSpeed) - player.dir.y * Math.sin(rotSpeed);
			player.dir.y = oldDirX * Math.sin(rotSpeed) + player.dir.y * Math.cos(rotSpeed);
			const oldPlaneX = player.plane.x;
			player.plane.x = player.plane.x * Math.cos(rotSpeed) - player.plane.y * Math.sin(rotSpeed);
			player.plane.y = oldPlaneX * Math.sin(rotSpeed) + player.plane.y * Math.cos(rotSpeed);
		}
		
		// Clear screen
		clearScreen(ctx, canvas.width, canvas.height);
		
		// Draw the scene
		drawScene(ctx, player, canvas.width, canvas.height, map);
		requestAnimationFrame(render);
		
		secondCount += deltaTime;	// Increase second count
		// DEBUGGING: print stats every 1/5th of a second
		if (secondCount > 0.2) {
			fpsText.nodeValue = (1 / deltaTime).toFixed(1);				// Print FPS
			frameTimeText.nodeValue = (deltaTime * 1000).toFixed(1);	// Print Frame Time
			posText.nodeValue = "X: " + player.pos.x.toFixed(1) + " Y: " + player.pos.y.toFixed(1);	// Print Player Position
			mouseText.nodeValue = "X: " + mouseX + " Y: " + mouseY;	// Print Mouse Position
			secondCount = 0;	// Reset second count
		}
	}
	requestAnimationFrame(render);
}
