
// ========== //
// Slither.io //
// ========== //
for(var i in all_vars)
	V[all_vars[i]] = all_vars[i];



// Read settings
chrome.storage.sync.get(all_vars, function(localVars) {
	for(i in localVars) V[i] = localVars[i];

	// no options saved
	if(V.nickname == "nickname") {
		alert("no options saved. please go to settings and click ‘save‘");
		exit();
	}



// ----------------------
// remove buttons and ads (selectors given)
// ----------------------
document.onreadystatechange = function () {

	// remove ads
	[
		"iframe",
		"#smh"
	].forEach(function(name) {
		var nodes = arraycpy(window.document.querySelectorAll(name));
		for(var i in nodes) nodes[i].remove();
	});

};




// ----------------- //
// Possible Commands //
// ----------------- //
// V.possible_keys = [{"name":"degree","range":[0,2*Math.pi]},"space"];



// ------------------------
// inject code into webpage (so we can manipulate site-content from this encapsulated plugin)
// ------------------------
injectFile("bson.js");
var slither_injection = "" 
	+ exportVars()
	+ "("+function() {
	document.onreadystatechange = function () {



	// ---------------- //
	// Learning Related
	// ---------------- //

	// create control window for deep learning
	var win2 = createWindow(window_width,window_height);

	// controls
	var controller = function(o) {
		console.log(o);
		var degree = o.degree, 	// [0..2π]
			speedup= o.speedup; // true/false
		// setAcceleration(1) // or 0 for off
		// kd_l = 1; // 0 for off
		// kd_r = 1; // 0 for off
	}


	// ------------ //
	// Game Related //
	// ------------ //
		
	// set quality (to low)
	want_quality = 0;
	localStorage.qual = "0";
		
	if(!complex_colors || !food_shadow)
		gen_colors_();

	// set nickname
	nick.value = nickname;


	// bind new redraw-method to old one
	window.mc_ = null;
	var redraw_old = redraw;
	redraw = function() {
		redraw_old();

		// get canvas of new window if not found yet
		if(!mc_) if(!win2.document) return;
					else {
						mc_ = win2.document.getElementsByTagName("canvas")[0]

						// init vars
						resize_(window_width, window_height);

						// init websocket (learning_window/canvas <-> server <-> controller)
						createWebSocket( controller, websocket_url, mc_, window_width, window_height );
					}

		// draw also on new canvas
		else
			redraw_();
	}

	
	// Autostart Game (on startup)
	if(autostart)
		connect();

	// Autostart Game (on death)
	resetGame_old = resetGame;
	resetGame = function() {
		resetGame_old();
		// death happened
		
		if(autorestart) {
			var resetGame_tmp = resetGame;
			resetGame = function() {};
			connect();
			resetGame = resetGame_tmp;
		}
	}
	
}
} + ")();";
inject(slither_injection);



});
