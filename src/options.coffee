$ ->
  $("<iframe />",
    name: "mothership_iframe"
    id: "mothership_iframe"
    src: config.host + "chrome_options?" + $.param(localStorage)
    width: config.options.width + "px"
    height: config.options.height + "px"
  ).appendTo "body"