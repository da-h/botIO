// Saves options to chrome.storage
var bool_vars = ["redirect_javascript","autostart","autorestart",
	
	"worm_detail","worm_round_head", "worm_blink_on_death", "worm_speed_stroke_blurred", "worm_speed_stroke_fade", 
	"worm_eyes","worm_antenna","worm_name",
	
	"game_background","game_background_move","complex_colors","food_shadow"];
var text_vars = ["nickname","game_background_color","websocket_url"];
var int_vars = ["window_width", "window_height",
	"worm_speed_stroke_width"
];
var all_vars = bool_vars.concat(text_vars,int_vars);





// =========== //
// global code //
// =========== //
var V = {};

// array-copy
var arraycpy = function(A) { return [].slice.call(A); }

// inject string into page (adds <script> *code* </script>)
inject = function(s) {
	var script = document.createElement('script');
	script.textContent = s;
	(document.head||document.documentElement).appendChild(script);
	script.remove();
}

// inject file into page
injectFile = function(local_url) {
	var s = document.createElement('script');
	s.src = chrome.extension.getURL(local_url);
	s.onload = function() {
		this.remove();
	};
	(document.head || document.documentElement).appendChild(s);
}

// export variables into page
var exportVar = function(name) {
	var r = (typeof V[name] !== "string") ? V[name] : '"'+V[name]+'"';
	return "var "+name+" = "+r+";\n"
}

var exportVars = function() {
	return Object.keys(V).map(exportVar).join("")+"\n\n";
}




// ======== //
// learning //
// ======== //

// open new window with canvas
V.createWindow = function(width, height) {
	var win = window.open("", "Deep Learning Window", "height="+height+",width="+width+",toolbar=0,location=0,menubar=0");
	win.document.body.innerHTML = `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<title>Deep-Learning Control Windew</title>
		</head>
		<body>
			<canvas width="${width}" height="${height}" style="position:absolute; top:0; left:0"></canvas>
		</body>
		</html>
	`;
	return win;
}

