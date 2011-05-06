//  Keep track of recents so as not to re-save
recentSniphs = [];
holdingShift = false;
alreadyCreatedContextMenu = false;

function onSniphSave(data) {
  if (data == null) {
    log('sniph not saved (empty/bad response)');
  } else {
    log(data.msg);
    if (data.msg.toLowerCase() == "success") {
      chrome.extension.sendRequest({'action':'notifySniphSaved', 'sniph':data.sniph}, function(){});
    }
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

$(window).keydown(function(e) {
  if (e.keyCode == 16) {
    holdingShift = true;
  }
});

$(window).keyup(function(e) {
  if (e.keyCode == 16) {
    holdingShift = false;
  }
});

chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    switch (request.action) {
      case 'whiff_forcefully':
      whiff(true);
      break;
    }
    sendResponse({});
  }
);

function whiff(force) {
  log('whiff');
  
  var selection = getSelectionHtml();
  
  // Skip out if the selection is too short..
  if (selection.length < config.sniph.min_length && !holdingShift) return false;
    
  // Skip out if this sniph was recently saved..
  if (recentSniphs.indexOf(selection) != -1 && !holdingShift && !force) {
    log('duplicate sniph (skip)');
    return false;
  } else {
    recentSniphs.push(selection);
  }
  
  // There's something sniphable here. 
  // Tell background.html to add a context menu so user can force a sniph..
  if (!alreadyCreatedContextMenu) {
    alreadyCreatedContextMenu = true;
    chrome.extension.sendRequest({'action':'createContextMenu'}, function() {} ); 
  }  

  // Construct what will become the query string
  var data = {
    sniph: {
      url: document.URL,
      title: document.title,
      content: selection
    }
  };
  
  // Pass a 'force' param if holding down shift (or if called by context menu)
  if (holdingShift || force) data.force = true;
  
  // Send the request off to background.html, which can make Ajax requests..
  chrome.extension.sendRequest({'action':'saveSniph', 'data':data}, onSniphSave);
  
}

// Bind the whiff action to mouseup
window.addEventListener("mouseup", function(){ whiff(); });

// Get the current URL (minues the fragment)
var url = document.URL.split("#")[0];

// Unless current URL is the Chrome options page, pass it right away so it will be 
// available in localStorage whenever the options page is opened.
if (url.indexOf('chrome_options') == -1) {
  chrome.extension.sendRequest({'action':'logCurrentURL', url:url}, function(){} );
}

// Find sniphs that match the current URL
if (url.indexOf('sniphr.') == -1) {
  chrome.extension.sendRequest({'action':'findSniphsForURL', url:url}, highlightSniphs);
} else {
  log('not going to findSniphsForURL because the url is on the sniphr domain');
}

// Check session status
// (Kick it off a little later so the request doesn't conflict with findSniphsForURL)
// TODO: Figure out why two overlapping Ajax requests fuck each other up.
setTimeout(
  "chrome.extension.sendRequest({'action':'getSessionStatus'}, function(){});",
  config.sniph.find_sniphs_for_url_delay
);

// TODO: Insert a node into to page so the site can determine if the extension is installed
log('content.js loaded');