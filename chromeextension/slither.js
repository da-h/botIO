
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
	//		(0) left arrow  = kd_l=1  : left turn
	//		(1) right arrow = kd_r=1  : right turn
	//		(2) space 		= setAcceleration(1)  : speedup
	// TODO: user-controls: timeout for userinput
	var controller = {
		"numkeys": 3,
		"applyKeys": function(keys) {

			// left/right turn
			kd_l = keys[0] >= 0.5 ? 1 : 0;
			kd_r = keys[1] >= 0.5 ? 1 : 0;

			// speedup
			setAcceleration( keys[2] >= 0.5 ? 1 : 0 );
			kd_u = keys[2] >= 0.5 ? 1 : 0;
		},
		"getScore" : function() {
			if(snake == null)
				return 0;
			return Math.floor(15 * (fpsls[snake.sct] + snake.fam / fmlts[snake.sct] - 1) - 5) / 1;
		}
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
