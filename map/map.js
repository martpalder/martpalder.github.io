function loadMap(url) {
	const request = new XMLHttpRequest();
	var contents;
	
	request.onload = function() {contents = request.response;}	
	request.open('GET', url, false);
	request.overrideMimeType("text/plain");
	request.send();
	if (request.status != 200)
		console.log("Error " + request.status + ": '" + url + "' was not loaded!");
	
	const lines = contents.split('\n');	// Separate the lines
	const map = new Array();	// Create a 2-dimensionial map array
	
	// Check every line
	for (line = 0; line < lines.length; ++line) {
		// Create a number array for the curent line
		const numArray = new Array();
		// If it's a comment or an empty line: read next line
		if (lines[line][0] == '#' || !lines[line].length) continue;
		// Otherwise
		else for (num = 0; num < lines[line].split(',').length; ++num) {
			numArray.push(lines[line].split(',')[num]);	// Push the numbers to the number array
		}
		// Push the number array to the map array
		map.push(numArray);
	}
	
	return map;
}
