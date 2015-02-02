window.onload = function() {

	chrome.extension.sendMessage({
		type: 'updatepopup'
	});


	document.getElementById("activate").onclick = function() {
		chrome.extension.sendMessage({
	        type: "activate"
	    });

	}

	document.getElementById("update").onclick = function() {

		var minbr = document.getElementById('breakmin').value,
			maxbr = document.getElementById('breakmax').value;

		chrome.extension.sendMessage({
	        type: "update",
	        minbr: minbr,
	        maxbr: maxbr
	    });

	}	

	// message listener
	chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {

		// if the message is "options" update the optionshit
		if (request.name == 'activated') {

			var active = request.active,
				// Activate button shit
				activeText = (active) ? 'Extension is active' : 'Extension is inactive';
				activeColor = (active) ? 'Chartreuse' : 'red';

				// Change activate button look
				var activeButton = document.getElementById('activate');
				activeButton.innerHTML = activeText;
				activeButton.style.background = activeColor;


		} else if (request.name == 'options') {
			
			var options = request.options,
				active = options.activated,
				activeButton = document.getElementById('activate');
				// Activate button shit
				activeText = (active) ? 'Extension is active' : 'Extension is inactive';
				activeColor = (active) ? 'Chartreuse' : 'red';

			// Change activate button look
			activeButton.innerHTML = activeText;
			activeButton.style.background = activeColor;

			document.getElementById('breakmin').value = options.breakmin;
			document.getElementById('breakmax').value = options.breakmax;


		}

	});

	
}