(function() {
  var config;

  config = {
    host: "http://sniphr.com/",
    sniph: {
      min_length: 3,
      notification_timeout: 3000,
      find_sniphs_for_url_delay: 2500
    },
    debug: {
      enabled: false,
      prepense: "sniphr: "
    },
    options: {
      width: 400,
      height: 300
    },
    context_menu: {
      title: "Sniph"
    }
  };

  config.debug.enabled = true;

  window.config = config;

}).call(this);
