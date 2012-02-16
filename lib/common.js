(function() {

  window.log = function() {
    if (window.console && config.debug.enabled) {
      return console.log.apply(console, arguments);
    }
  };

  window.AjaxRequest = function(url, callback) {
    this.xhr = new XMLHttpRequest();
    this.url = url;
    this.callback = callback;
    this.xhr.onreadystatechange = function(data) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          data = JSON.parse(xhr.responseText);
          return callback(data);
        } else {
          return callback(null);
        }
      }
    };
    this.xhr.open("GET", this.url, true);
    return this.xhr.send();
  };

  window.getSelectionHtml = function() {
    var container, html, i, len, sel;
    html = "";
    if (typeof window.getSelection !== "undefined") {
      sel = window.getSelection();
      if (sel.rangeCount) {
        container = document.createElement("div");
        i = 0;
        len = sel.rangeCount;
        while (i < len) {
          container.appendChild(sel.getRangeAt(i).cloneContents());
          ++i;
        }
        html = container.innerHTML;
      }
    } else {
      if (typeof document.selection !== "undefined" ? document.selection.type === "Text" : void 0) {
        html = document.selection.createRange().htmlText;
      }
    }
    return html;
  };

  window.Sniphr = {};

}).call(this);
