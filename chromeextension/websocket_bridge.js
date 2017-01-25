
// sleep function
V.sleep = function(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

V.createWebSocket = function(controller, url, channels, width, height) {
	var BSON = bson().BSON;
	var ws = new WebSocket(url);
	ws.binaryType = "arraybuffer"; // alternative: "blob"
	var contexts = [];
	for(var i in channels)
		contexts.push(channels[i].getContext("2d"));

	// scaled canvas
	var outputCanvas = document.createElement("canvas");
	outputCanvas.width = width;
	outputCanvas.height = height;
	var outputContext = outputCanvas.getContext("2d");
	
	// draw image on scaled canvas and return byte-array
	var get_img = function(canvas) {
		outputContext.drawImage(canvas, 0, 0, width, height);
		var pixelArray = outputContext.getImageData(0,0, width, height).data;
		var pixellen = pixelArray.length;
		var byteArray = new Uint8Array(pixellen);
		for(var i=0; i<pixellen; i++)
			byteArray[i] = pixelArray[i];
	}

	// finally ready (not before, and can cause error, as canvas is not ready yet)
	ws.onopen = function() {
		console.log('BotIO: Connected to Controller-Server.');
		ws.send(BSON.serialize({"state":"game_start", "width":width, "height":height, "numkeys":controller.numkeys, "numchannels": controller.numchannels}));
	}

	// reconnect (once per second)
	ws.onclose = function() {
		console.log('BotIO: Connection Closed!');
		setTimeout(createWebSocket, 1*1000, controller, url, channels, width, height);
	}

	ws.onerror = function(error) {
		console.log('BotIO: OMG! WebSocket Error ' + error);
		console.log(error);
	}

	ws.onmessage = async function(e) {
		var msg;
		try {
			uint8Array  = new Uint8Array(e.data);
			msg = BSON.deserialize(uint8Array);
		}
		catch(err) {
			console.log('Failed to deserialize: ', err);
			return;
		}

		while(!controller.playing())
			await sleep(50);
			

		// apply control for last image
		used_keys = controller.applyKeys(msg.keys)
		
		// receive current score
		var current_score = controller.getScore();

		// send image (on request)
		imgs = [];
		for(var i in channels)
			imgs.push(get_img(channels[i]));

		var response = {
			"state": "game_running",
			"score": current_score,
            "used_keys" : used_keys,
            "userinput" : controller.userinput
		};

		ws.send(BSON.serialize(response));
		for(var i in channels)
			ws.send(imgs[i]);
	}

}
