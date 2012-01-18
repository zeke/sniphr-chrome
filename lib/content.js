(function() {
  var alreadyCreatedContextMenu, findSniphsForCurrentPage, getCurrentTab, highlightSniphs, holdingShift, onSniphSave, recentSniphs, whiff;

  onSniphSave = function(data) {
    if (data == null) {
      return log("sniph not saved (empty/bad response)");
    } else {
      log(data.msg);
      if (data.msg.toLowerCase() === "success") {
        return chrome.extension.sendRequest({
          action: "notifySniphSaved",
          sniph: data.sniph
        }, function() {});
      }
    }
  };

  highlightSniphs = function(data) {
    var i, sniph, _results;
    if (data == null) {
      return log("no sniphs found for this URL");
    } else {
      _results = [];
      for (i in data) {
        sniph = new Sniph(data[i].sniph);
        _results.push(sniph.highlight());
      }
      return _results;
    }
  };

  whiff = function(force) {
    var alreadyCreatedContextMenu, data, selection;
    log("whiff");
    selection = getSelectionHtml();
    if (selection.length < config.sniph.min_length && !holdingShift) return false;
    if (recentSniphs.indexOf(selection) !== -1 && !holdingShift && !force) {
      log("duplicate sniph (skip)");
      return false;
    } else {
      recentSniphs.push(selection);
    }
    if (!alreadyCreatedContextMenu) {
      alreadyCreatedContextMenu = true;
      chrome.extension.sendRequest({
        action: "createContextMenu"
      }, function() {});
    }
    data = {
      sniph: {
        url: document.URL,
        title: document.title,
        content: selection
      }
    };
    if (holdingShift || force) data.force = true;
    return chrome.extension.sendRequest({
      action: "saveSniph",
      data: data
    }, onSniphSave);
  };

  findSniphsForCurrentPage = function() {
    return chrome.extension.sendRequest({
      action: "getCurrentTab"
    }, function(tab) {
      var url;
      url = tab.url.split("#")[0];
      if (url.indexOf("sniphr.") === -1) {
        return chrome.extension.sendRequest({
          action: "findSniphsForURL",
          url: url
        }, highlightSniphs);
      } else {
        return log("not going to findSniphsForURL because the url is on the sniphr domain");
      }
    });
  };

  getCurrentTab = function() {
    return chrome.extension.sendRequest({
      action: "getCurrentTab"
    }, function(tab) {});
  };

  recentSniphs = [];

  holdingShift = false;

  alreadyCreatedContextMenu = false;

  $(window).keydown(function(e) {
    if (e.keyCode === 16) return holdingShift = true;
  });

  $(window).keyup(function(e) {
    if (e.keyCode === 16) return holdingShift = false;
  });

  chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    switch (request.action) {
      case "whiff_forcefully":
        whiff(true);
    }
    return sendResponse({});
  });

  window.addEventListener("mouseup", function() {
    return whiff();
  });

  window.addEventListener("focus", function() {
    return getCurrentTab();
  });

  getCurrentTab();

  findSniphsForCurrentPage();

  setTimeout("chrome.extension.sendRequest({'action':'getSessionStatus'}, function(){});", config.sniph.find_sniphs_for_url_delay);

}).call(this);
