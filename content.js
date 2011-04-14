//  Keep track of recents so as not to re-save
recentSniphs = [];

function onSniphSave(data) {
	if (data == null) {
		console.log('error: bad response from sniphr.com');
	} else {
		console.log('Sniph saved!');
		console.log(data);		
	}
}


$(window).mouseup(function() {
	
	var selection = window.getSelection().toString();

	if (selection.length > 2) {
		
		// Skip out if this sniph was recently saved..
		if (recentSniphs.indexOf(selection) != -1) {
			console.log('Detected duplicate Sniph (Not saving)');
			return false;
		} else {
			recentSniphs.push(selection);
		}

		var data = {
			sniph: {
				url: document.URL,
				content: selection
			}
		};
		
		chrome.extension.sendRequest({'action':'saveSniph', 'data':data}, onSniphSave);
	}

});

console.log('Sniphr loaded');