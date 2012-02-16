(function() {
  var Sniph;

  Sniph = (function() {

    function Sniph(url, content, title, publique) {
      this.url = url;
      this.content = content;
      this.title = title;
      this.publique = publique;
    }

    Sniph.prototype.words = function() {
      return this.content.split(" ");
    };

    Sniph.prototype.contentPlain = function() {
      return $(this.content).text();
    };

    Sniph.prototype.highlight = function() {
      var regex;
      log("highlight: " + this.content);
      return regex = new RegExp(this.content, "g");
    };

    return Sniph;

  })();

  window.Sniph = Sniph;

}).call(this);
