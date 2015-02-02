/**
 *	Constructor for the navigation class.
 *
**/
function Navigation() {

	this.scrolled = false;

	this.activated = false;

	this.nextAction = null;

	this.doc = document;

	this.pageName = this.doc.title;
	this.url = this.doc.URL.split("/")[3].split(".")[0];

	this.comments = [];

	// Find bottom of page?
	//this.scrollDown();


	console.log("pagename: " + this.pageName);
	console.log("url postfix: " + this.url);

	chrome.extension.sendMessage({
    	type: 'options'
	});

}

/**
 *	Initial function
**/
Navigation.prototype.doWhat = function () {
	
	var that = this;

	// delete all available shit, then reload page?
	setTimeout(
		function() {
			that.anyShit();
		}, that.randomBreak()*5
	);

}

/**
 *	This is a function that scrolls down until there is no more scrolling left in the world
 *
**/
Navigation.prototype.scrollDown = function () {

	var that = this;

	setTimeout(
		function() {

			console.log('we be scrollin');
			window.scrollTo(0, document.body.scrollHeight);

			setTimeout(
				function() {

					if ($(window).scrollTop() + $(window).height() == $(document).height()) {
						console.log('Bottom of activity log!!! WHAT TO DO?!');

						if (!that.scrolled) {
							that.scrolled = true;
							that.scrollDown();
						}

					} else {
						nav.anyShit();
					}

				},
				// Then add a timeout
				that.randomBreak()
			);

		},
		// Then add a timeout
		that.randomBreak()
	);
}

/**
 *	Function that finds any comment on your activity page!
 *
**/
Navigation.prototype.anyShit = function () {

	// <a>
	var that = this,
		hrefs = document.getElementsByTagName('a'),
		i = 0,
		passed = 0,
		pass = 0,
		found = false;

	// first finding all the shit & putting it in an array
	for (i; i < hrefs.length; i++) {

		var tmpStr = hrefs[i].getAttribute("aria-label");

		// Checking if we find stuff worth deleting
		// OBS! This is v1, should delete more than this yeah?
		if (tmpStr == "Allowed on Timeline" || tmpStr == "Hidden from Timeline") {

			if (pass == passed) {
				this.decideShit(hrefs[i]);
				found = true;
				i = hrefs.length;
			} else {
				passed++;
			}
		}
	}

	if (!found) {
		console.log("no comments for you, scroll down!");
		that.scrollDown();
	}
}

/**
 *	Getting an element from the activity log, decide what to do with it =)
 *	
 *	Decide if its an unlike, delete or hide.
**/
Navigation.prototype.decideShit = function(shit) {

	console.log("deciding");

	// Stop the show if extension is not active
	if (!this.activated) {
		console.log("extension inactive!");
		return;
	}

	var that = this;

	// time out for the committing of action.
	setTimeout(
		function() {
			// clicking the timeline-event-edit
			shit.click();

			// INCEPTION THIS SHIT
			setTimeout(
				function() {

					var negatives = document.getElementsByClassName('_54nc'),
						negative = null,
						found = false,
						i = 0;


					// if the element contains something to delete!!!
					// CHECK!
					for (i; i < negatives.length; i++) {

						if (negatives[i].children[0].children[0].innerHTML == 'Delete') {
							negative = negatives[i];
							found = true;
							i = negatives.length;
						}

					}


					// if a post that can be deleted is found, click that shit
					if (found) {
						console.log('deleting!');
						console.log(negative);
						negative.click();

						setTimeout(
							function() {
								
								var submits = document.getElementsByTagName('button'),
									submit = null,
									k = 0;

								for (k; k < submits.length; k++) {

									if (submits[k].textContent == 'Delete Post' || submits[k].textContent == 'Remove Search' || submits[k].textContent == "Remove Post") {
										submit = submits[k];
										k = submits.length;

									}
								}

								// If no "DELETE POST" popup was found, continue to next.
								if (submit == null) {
									that.anyShit();
								} else {

									// if "delete post" popup was found, click it and wait for next action
									submit.click();

									setTimeout(
										function() {

											nav.anyShit();

										}, that.randomBreak() + 6000
									);
								}

							}, that.randomBreak() + 2000
						);
					} else {
						console.log("nothing found?");
					}
				}, 
				that.randomBreak()
			);
		}, 
		that.randomBreak() / 10
	);

}


/** 
 *	Function that returns a random number based on options.
 * 	ment to be used as milliseconds.
 *
**/
Navigation.prototype.randomBreak = function(type) {

	return Math.floor((Math.random()*2700)+300);
}

/**
 *	Functionality that communicates with background.js continuosly.
 *
**/
var port = chrome.runtime.connect();

chrome.runtime.onConnect.addListener(function(port) {
	console.assert(port.name == "knockknock");
	port.onMessage.addListener(function(msg) {

		console.log("this is the message:");
		console.log(msg);

		var active = msg.order.activated;
		nav.activated = active;

		switch (msg.variable) {

			case "options":

				console.log("got me some options");

				// set options, then do
				if (active) {
					nav.doWhat();
				} else {
					console.log("extension not active though");
				}

				break;

			case "activate":

				console.log("got me some activity?");

				//do!
				if (active) {
					nav.doWhat();
				} else {
					console.log("no i dont!");
				}

				break;

			case "update":

				consol.log("got me some update");

				break;
		}

	});
});


var nav = new Navigation();