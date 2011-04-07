// Logging function that accounts for browsers that don't have window.console
function log(m) {
	if (window.console) console.log(m);
}

log('sniffff');

// $.ajaxSetup({
// 	'beforeSend': function(xhr) { xhr.setRequestHeader("Accept", "text/javascript"); }
// });

$(window).mouseup(function() {
	
	$.ajaxSetup({
		'beforeSend': function(xhr) { xhr.setRequestHeader("Accept", "text/javascript"); }
	});

	var selection = window.getSelection().toString();
	
	log('mouseup: ' + selection);
	
	if (selection.length > 1) {

		// Construct params
		var data = {
			snip: {
				url: document.URL,
				content: selection,
				user: "zeke"
			},
			callback: '?'
		};
		
		// Save
		$.getJSON(
			"http://sniph.heroku.com/snips/save.json?" + $.param(data),
		  function(data) {
		    alert(data);
		  }
		);

	}



});

