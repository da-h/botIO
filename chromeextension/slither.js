
// ========== //
// Slither.io //
// ========== //
for(var i in all_vars)
	V[all_vars[i]] = all_vars[i];



// Read settings
// TODO: read settings from python (overwrites this settings)
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
	
	// channels
	canvas_ids = ["player", "points", "snakes"]

	// create control window for deep learning
	var win2 = createWindow(window_width,window_height,canvas_ids);

	// controls
	//		(0) left arrow  = kd_l=1  : left turn
	//		(1) right arrow = kd_r=1  : right turn
	//		(2) space 		= setAcceleration(1)  : speedup
	var controller = {
		"userinput" : false,
		"numkeys": 6,
		"numchannels": 3,
		"applyKeys": function(keys) {

			// standard keypress
			if(keys.length != controller.numkeys)
				return 0;

			// no userinput
			if(!controller.userinput) {

				// nothing
				switch(keys) {
					case 1:
						kd_l = 1;
						kd_r = 0;
						kd_u = 0;
						break;
					case 2:
						kd_l = 0;
						kd_r = 1;
						kd_u = 0;
						break;
					case 3:
						kd_l = 0;
						kd_r = 0;
						kd_u = 1;
						break;
					case 4:
						kd_l = 1;
						kd_r = 0;
						kd_u = 1;
						break;
					case 5:
						kd_l = 0;
						kd_r = 1;
						kd_u = 1;
						break;
					//case 0:
					default:
						kd_l = 0;
						kd_r = 0;
						kd_u = 0;

				}
			
				// speedup
				setAcceleration( kd_u );

			}

			// return real pressed key-array:
			if(kd_l==0 && kd_r==0 && kd_u==0) {
				return 0;
			} else if(kd_l==1 && kd_r==0 && kd_u==0) {
				return 1;
			} else if(kd_l==0 && kd_r==1 && kd_u==0) {
				return 2;
			} else if(kd_l==0 && kd_r==0 && kd_u==1) {
				return 3;
			} else if(kd_l==1 && kd_r==0 && kd_u==1) {
				return 4;
			} else if(kd_l==0 && kd_r==1 && kd_u==1) {
				return 5;
			}
		},
		"getScore" : function() {
			if(snake == null)
				return 0;
			return Math.floor(15 * (fpsls[snake.sct] + snake.fam / fmlts[snake.sct] - 1) - 5) / 1;
		},
		"playing" : function() {
			return snake && (!"dead" in snake || !snake.dead);
		}
	}

	// disable mouse-input
	// TODO

	// cope with user-controls
	var onkeydown_old = document.onkeydown;
	document.onkeydown = function(b0) {
		b = b0 || window.event;
		var e = b.keyCode;
		if(e == 113) {
			controller.userinput = !controller.userinput;

			// reset keys
			if(controller.userinput) {
				kd_l = 0;
				kd_r = 0;
				kd_u = 0;
			}
		}
		
		// let user do his commands
		if(controller.userinput)
			onkeydown_old(b0);
	};


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
						mc_ = [];
						for(var i in canvas_ids) {
							mc_.push(win2.document.getElementById(canvas_ids[i]))

							// init vars
							resize_(window_width, window_height, mc_[i]);

							// readjust position
							mc_[i].style.left = parseInt(mc_[i].style.left.slice(0,-2)) + window_width*i + "px";
						}


						// init websocket (learning_window/canvas <-> server <-> controller)
						createWebSocket( controller, websocket_url, mc_, window_width, window_height );
					}

		// draw also on new canvas
		else
			redraw_(mc_[0],mc_[1],mc_[2]);
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
