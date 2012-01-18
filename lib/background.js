(function() {
  var createContextMenu, findSniphsForURL, getCurrentTab, getSessionStatus, notifySniphSaved, onRequest, saveSniph, updateIcon;

  saveSniph = function(data, callback) {
    var url;
    log("saveSniph");
    url = config.host + "sniphs/save.json?" + $.param(data);
    url = url.replace(/'/g, "%27");
    return AjaxRequest(url, callback);
  };

  notifySniphSaved = function(sniph) {
    var notification;
    notification = webkitNotifications.createNotification("images/icon_48.png", "Sniph!", $("<div>" + sniph.content + "</div>").text());
    notification.show();
    return setTimeout((function() {
      return notification.cancel();
    }), config.sniph.notification_timeout);
  };

  getSessionStatus = function() {
    var url;
    url = config.host + "session_status.json";
    return AjaxRequest(url, updateIcon);
  };

  updateIcon = function(data) {
    var path;
    if (data.user) {
      path = "images/icon_" + data.user.mode + ".png";
    } else {
      path = "images/icon_disabled.png";
    }
    return chrome.browserAction.setIcon({
      path: path
    });
  };

  getCurrentTab = function(callback) {
    return chrome.tabs.getSelected(null, function(tab) {
      var url;
      url = tab.url.split("#")[0];
      if (url.indexOf("chrome_options") === -1) localStorage["last_url"] = url;
      return callback(tab);
    });
  };

  createContextMenu = function() {
    log("createContextMenu()");
    chrome.contextMenus.removeAll();
    return chrome.contextMenus.create({
      title: config.context_menu.title,
      contexts: ["all"],
      onclick: function() {
        return chrome.tabs.getSelected(null, function(tab) {
          return chrome.tabs.sendRequest(tab.id, {
            action: "whiff_forcefully"
          }, function(response) {});
        });
      }
    });
  };

  findSniphsForURL = function(url, callback) {
    var query;
    log("findSniphsForURL " + url);
    query = {
      q: url
    };
    url = config.host + "sniphs.json?" + $.param(query);
    return AjaxRequest(url, callback);
  };

  onRequest = function(request, sender, callback) {
    switch (request.action) {
      case "saveSniph":
        return saveSniph(request.data, callback);
      case "createContextMenu":
        return createContextMenu();
      case "getCurrentTab":
        return getCurrentTab(callback);
      case "findSniphsForURL":
        return findSniphsForURL(request.url, callback);
      case "notifySniphSaved":
        return notifySniphSaved(request.sniph);
      case "getSessionStatus":
        return getSessionStatus();
    }
  };

  chrome.extension.onRequest.addListener(onRequest);

}).call(this);
