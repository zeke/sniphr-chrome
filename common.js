function log(data) {
	if (config.debug.enabled) {
		if (typeof data == 'string') {
			data = config.debug.prepense + data;
		}
		console.log(data);
	}
}

function AjaxRequest(url, callback) {
	log(url);
  this.xhr = new XMLHttpRequest();
	this.url = url;
	this.callback = callback;

  this.xhr.onreadystatechange = function(data) {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        var data = JSON.parse(xhr.responseText);
        callback(data);
      } else {
        callback(null);
      }
    }
  };

 this.xhr.open('GET', this.url, true);
 this.xhr.send();
};

// A cross-browser compatible function to fetch the HTML (not just the text)
// of the current selection..
// http://stackoverflow.com/questions/4176923/html-of-selected-text
function getSelectionHtml() {
	var html = "";
	if (typeof window.getSelection != "undefined") {
		var sel = window.getSelection();
		if (sel.rangeCount) {
			var container = document.createElement("div");
			for (var i = 0, len = sel.rangeCount; i < len; ++i) {
				container.appendChild(sel.getRangeAt(i).cloneContents());
			}
			html = container.innerHTML;
		}
	} else if (typeof document.selection != "undefined") {
		if (document.selection.type == "Text") {
			html = document.selection.createRange().htmlText;
		}
	}
	return html;
}

var Sniphr = {
	
};

