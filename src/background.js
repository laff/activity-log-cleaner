
function Options() {

	this.activated = false;

	this.breakmin = 400;
	this.breakmax = 2600;

}

Options.prototype.updateinfo = function(objectus) {

	this.activated = false;

	// break variables
	this.breakmin = parseInt(objectus.minbr);
	this.breakmax = parseInt(objectus.maxbr);

	// tell the popup whats up
	chrome.extension.sendMessage({opts: Options.activated, name: 'activated'});

}

var Options = new Options();

/**
 *	Listener
 *
 *
**/
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {

	console.log("request: " + request);

	var typ = request.type;

    switch(typ) {


    	case "updatepopup":

    		chrome.extension.sendMessage({options: Options, name: 'options'});

    		break;

        case "activate":

        	// Changing options boolean
        	Options.activated = (!Options.activated);

        	
        	// Telling the popup the new active status
        	chrome.extension.sendMessage({active: Options.activated, name: 'activated'});

        	// Telling the content script what up too
        	communicate(Options, typ);

        	break;

        case "update": 

        	Options.updateinfo(request);
        	communicate(Options, typ)

        	break;

        case "options":

        	communicate(Options, typ);

        	console.log("background was sent options, calling communication");

        	break;
    }

    return true;
});


var communicate = function (order, variable) {

	console.log("Ensuring that the page is actually the activity log");

	chrome.tabs.query({url: 'https://www.facebook.com/*/allactivity'}, function(resultArr) {

		console.log("seems like the page was the activity log!");

		var tab = (resultArr.length > 0) ? resultArr[0] : null;

		console.log("communicate-tab on the following line:");
		console.log(tab);
		console.log("proceeding to doing osmething currently irrelevant if i am not mistakign");

		// This is just some stupid test to prevent fuckups.
		// I dont need it, do you? geez...
		if (tab != null) {

		    var port = chrome.tabs.connect(tab.id, {name: "knockknock"});

		    // initial message sent
		    console.log("posting message to content.js");
		    port.postMessage({order: order, variable: variable});

		}
	});
}