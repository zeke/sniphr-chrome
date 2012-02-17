(function() {
  var findSniphsForCurrentPage, getCurrentTab, highlightSniphs, holdingShift, lastImageClicked, onSniphSave, recentSniphs, whiff,
    __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  if (typeof recentSniphs === "undefined" || recentSniphs === null) {
    recentSniphs = [];
  }

  if (typeof lastImageClicked === "undefined" || lastImageClicked === null) {
    lastImageClicked = null;
  }

  if (typeof holdingShift === "undefined" || holdingShift === null) {
    holdingShift = false;
  }

  onSniphSave = function(data) {
    if (data == null) {
      return log("sniph not saved (empty/bad response)");
    } else {
      if (data.msg.toLowerCase() === "success") {
        return chrome.extension.sendRequest({
          action: "notifySniphSaved",
          sniph: data.sniph
        });
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

  whiff = function(event) {
    var data, selection;
    log('whiff');
    selection = getSelectionHtml() || lastImageClicked;
    if (!((selection != null) && selection.length >= config.sniph.min_length)) {
      return false;
    }
    if ((__indexOf.call(recentSniphs, selection) >= 0)) {
      log("duplicate sniph (skip)");
      return false;
    } else {
      recentSniphs.push(selection);
    }
    event.preventDefault();
    event.stopPropagation();
    data = {
      sniph: {
        url: document.URL,
        title: document.title,
        content: selection
      }
    };
    return chrome.extension.sendRequest({
      action: "saveSniph",
      data: data
    }, onSniphSave);
  };

  findSniphsForCurrentPage = function() {
    log('findSniphsForCurrentPage()');
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

  getCurrentTab = function(callback) {
    return chrome.extension.sendRequest({
      action: "getCurrentTab"
    }, callback);
  };

  getCurrentTab(function(tab) {
    if (document.URL === tab.url) {
      $(window).keydown(function(e) {
        if (e.keyCode === 16) return holdingShift = true;
      });
      $(window).keyup(function(e) {
        if (e.keyCode === 16) return holdingShift = false;
      });
      chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
        switch (request.action) {
          case "whiffFromContextMenu":
            whiff(request.event);
        }
        return sendResponse({});
      });
      $('img').mousedown(function(e) {
        lastImageClicked = e.target.src;
        return log("lastImageClicked: " + lastImageClicked);
      });
      $(window).mouseup(function(event) {
        if (holdingShift) return whiff(event);
      });
      $(window).click(function(event) {
        if (holdingShift) return whiff(event);
      });
      chrome.extension.sendRequest({
        action: "createContextMenu"
      });
      window.addEventListener("focus", function() {
        return getCurrentTab(function(tab) {});
      });
      return setTimeout("chrome.extension.sendRequest({'action':'getSessionStatus'}, function(){});", config.sniph.find_sniphs_for_url_delay);
    }
  });

}).call(this);
