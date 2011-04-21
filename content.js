//  Keep track of recents so as not to re-save
recentSniphs = [];

function onSniphSave(data) {
	if (data == null) {
		log('sniph not saved (empty/bad response)');
	} else {
		log(data.msg);
	}
}

function highlightSniphs(data) {
	if (data == null) {
		log('no sniphs found for this URL');
	} else {
		for (i in data) {
			var sniph = new Sniph(data[i].sniph);
			sniph.highlight();
		}
	}
}

// Each time the mouse is clicked, check for the presence of selected text
$(window).mouseup(function() {
	
	var selection = getSelectionHtml();
	
	// Skip out if the selection is too short..
	if (selection.length < config.sniph.min_length) return false;
		
	// Skip out if this sniph was recently saved..
	if (recentSniphs.indexOf(selection) != -1) {
		log('duplicate sniph (skip)');
		return false;
	} else {
		recentSniphs.push(selection);
	}

	// Construct what will become the query string
	var data = {
		sniph: {
			url: document.URL,
			title: document.title,
			content: selection
		}
	};
	
	// Send the request off to background.html, which can make Ajax requests..
	chrome.extension.sendRequest({'action':'saveSniph', 'data':data}, onSniphSave);
});


// Get the current URL (minues the fragment) and find sniphs that match it..
var url = document.URL.split("#")[0];
chrome.extension.sendRequest({'action':'findSniphsForURL', url:url}, highlightSniphs);

// TODO: Insert a node into to page so the site can determine if the extension is installed
log('content.js loaded');