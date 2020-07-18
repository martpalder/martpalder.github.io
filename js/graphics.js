function Color(r, g, b) {
	this.r = r;
	this.g = g;
	this.b = b;
}

function clearScreen(ctx, w, h) {
	ctx.clearRect(0, 0, w, h);
}

function drawScene(ctx, player, w, h, map) {	
	for (x = 0; x < w; ++x) {
		// Calculate ray position and direction
		const cameraX = 2 * x / w - 1;	// x-coordinate in camera space
		const rayDirX = player.dir.x + player.plane.x * cameraX;
		const rayDirY = player.dir.y + player.plane.y * cameraX;
		
		// Which box of the map we're in
		var mapX = Math.round(player.pos.x);
		var mapY = Math.round(player.pos.y);
		
		// Length of ray from one x or y-side to next x or y-side
		const deltaDistX = rayDirY == 0 ? 0 : (rayDirX == 0 ? 1 : Math.abs(1 / rayDirX));
		const deltaDistY = rayDirX == 0 ? 0 : (rayDirY == 0 ? 1 : Math.abs(1 / rayDirY));
		
		var side = 0;	// Was a NS or a EW wall hit?
		
		// Calculate step and initial sideDist
		// step: What direction to step in x or y-direction (either +1 or -1)
		// sideDist: Length of ray from current position to next x or y-side
		if (rayDirX < 0) {
			var stepX = -1;
			var sideDistX = (player.pos.x - mapX) * deltaDistX;
		} else {
			var stepX = 1;
			var sideDistX = (mapX + 1.0 - player.pos.x) * deltaDistX;
		}
		if (rayDirY < 0) {
			var stepY = -1;
			var sideDistY = (player.pos.y - mapY) * deltaDistY;
		} else {
			var stepY = 1;
			var sideDistY = (mapY + 1.0 - player.pos.y) * deltaDistY;
		}
		
		// Perform DDA(Digital Differential Analysis)
		while (1) {
			// Jump to next map square, OR in x-direction, OR in y-direction
			if (sideDistX < sideDistY) {
				sideDistX += deltaDistX;
				mapX += stepX;
				side = 0;
			} else {
				sideDistY += deltaDistY;
				mapY += stepY;
				side = 1;
			}
			// Check if ray has hit a wall
			if (map[mapX][mapY] > 0) break; // Break the loop
		}
		
		// Calculate distance projected on camera direction (Euclidean distance will give fisheye effect!)
		const perpWallDist = !side ? (mapX - player.pos.x + (1 - stepX) / 2) / rayDirX : (mapY - player.pos.y + (1 - stepY) / 2) / rayDirY
		
		// Calculate height of line to draw on screen
		const lineHeight = h / perpWallDist;
		
		// Calculate lowest and highest pixel to fill in current stripe
		var drawStart = -lineHeight / 2 + h / 2;
		if (drawStart < 0) drawStart = 0;
		var drawEnd = lineHeight / 2 + h / 2;
		if (drawEnd >= h) drawEnd = h - 1;
		
		// Check the stripe's color
		if (map[mapX][mapY] == 1) var color = new Color(0, 0, 255);
		else if (map[mapX][mapY] == 2) var color = new Color(255, 255, 0);
		
		// Give x and y sides different brightness
		if (side) {
			color.r = Math.round(color.r / 2);
			color.g = Math.round(color.g / 2);
			color.b = Math.round(color.b / 2);
		}
		
		// The stripe
		ctx.beginPath();	// Begin the path
		ctx.strokeStyle = rgbToHex(color);	// Set the stripe's color
		ctx.moveTo(x, drawStart);	// Set start position
		ctx.lineTo(x, drawEnd);	// Set end position
		ctx.closePath();	// Close the path
		ctx.stroke();	// Draw the stripe
	}
}

function rgbToHex(color) {
	return "#" + componentToHex(color.r) + componentToHex(color.g) + componentToHex(color.b);
}

function componentToHex(c) {
	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
}
