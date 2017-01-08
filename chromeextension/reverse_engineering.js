// load settings
var redirect = false;

// helper for reverse engineering
var redirect = {
	"slither.io": {
		"url" : "http://slither.io/s/game144000.js",
		"replaced_script" : "slither_game_RE.js"
	}
};
if(redirect)
chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        if( details.url == redirect["slither.io"].url )
            return {redirectUrl: chrome.extension.getURL(redirect["slither.io"].replaced_script ) };
    },
    {urls: [redirect["slither.io"].url]},
    ["blocking"]
);
