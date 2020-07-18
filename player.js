function Player(posX, posY, moveSpeed, rotSpeed) {
	this.pos = {
		x: posX,
		y: posY
	};
	this.dir = {
		x: -1,
		y: 0
	};
	this.plane = {
		x: 0,
		y: 0.66
	};
	this.moveSpeed = moveSpeed;
	this.rotSpeed = rotSpeed;
}
