# Keep track of recents so as not to re-save
recentSniphs = [] unless recentSniphs?

# Remember the last image that was click on.
lastImageClicked = null unless lastImageClicked?
holdingShift = false unless holdingShift?

onSniphSave = (data) ->
  unless data?
    log "sniph not saved (empty/bad response)"
  else
    if data.msg.toLowerCase() is "success"
      chrome.extension.sendRequest
        action: "notifySniphSaved"
        sniph: data.sniph
        
highlightSniphs = (data) ->
  unless data?
    log "no sniphs found for this URL"
  else
    for i of data
      sniph = new Sniph(data[i].sniph)
      sniph.highlight()

whiff = (event) ->
  # log "whiff event: %o", event
  selection = getSelectionHtml() or lastImageClicked
  
  log "lastImageClicked: %s", lastImageClicked
  log "selection: %s", selection
  
  # Skip out if the selection is too short..
  return false if selection.length < config.sniph.min_length
  
  # Skip out if this sniph was recently saved..
  if (selection in recentSniphs)
    log "duplicate sniph (skip)"
    return false
  else
    recentSniphs.push selection
      
  # Construct what will become the query string
  data = sniph:
    url: document.URL
    title: document.title
    content: selection

  # Send the request off to background.html, which can make Ajax requests..
  chrome.extension.sendRequest
    action: "saveSniph"
    data: data
  , onSniphSave
  
findSniphsForCurrentPage = ->
  log 'findSniphsForCurrentPage()'
  chrome.extension.sendRequest
    action: "getCurrentTab"
  , (tab) ->
    
    url = tab.url.split("#")[0]
    
    # Find sniphs that match the current URL
    if url.indexOf("sniphr.") is -1
      chrome.extension.sendRequest
        action: "findSniphsForURL"
        url: url
      , highlightSniphs
    else
      log "not going to findSniphsForURL because the url is on the sniphr domain"

# Proxy this over to background, which can get the current tab
getCurrentTab = (callback) ->
  chrome.extension.sendRequest
    action: "getCurrentTab"
    , callback

# Prevent certain code from running repeatedly in all the page's iframes..
getCurrentTab (tab) ->
  
  if document.URL == tab.url

    $(window).keydown (e) ->
      holdingShift = true if e.keyCode is 16

    $(window).keyup (e) ->
      holdingShift = false if e.keyCode is 16
    
    chrome.extension.onRequest.addListener (request, sender, sendResponse) ->
      switch request.action
        when "whiffFromContextMenu"
          whiff(request.event)
      sendResponse {}
  
    # Bind the whiff action to mouseup
    $(window).mouseup (event) ->
      whiff(event) if holdingShift
  
    # Peep images:
    $('img').mousedown (e) ->
      lastImageClicked = e.target.src
      log "lastImageClicked: #{lastImageClicked}"

    # Tell background.html to add a context menu
    chrome.extension.sendRequest
      action: "createContextMenu"

    # findSniphsForCurrentPage()
    
    # Get the current tab any time one takes focus
    window.addEventListener "focus", ->
      getCurrentTab (tab) ->
        # Don't do anything.

    # Check session status
    # (Kick it off a little later so the request doesn't conflict with findSniphsForURL)
    # TODO: Figure out why two overlapping Ajax requests fuck each other up.
    setTimeout "chrome.extension.sendRequest({'action':'getSessionStatus'}, function(){});", config.sniph.find_sniphs_for_url_delay
