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
  log 'whiff'
  
  # Look for selected text. If none is found use the URL 
  # of the most recently clicked image.
  selection = getSelectionHtml() or lastImageClicked
  
  # Skip out if the selection missing or too short..
  return false unless selection? and selection.length >= config.sniph.min_length
  
  # Skip out if this sniph was recently saved..
  if (selection in recentSniphs)
    log "duplicate sniph (skip)"
    return false
  else
    recentSniphs.push selection

  # If an IMG inside an A was SHIFT-clicked, prevent the click event from firing.
  if event.cancelable
    event.preventDefault()
    event.stopPropagation()

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
      
    # Take note of image URLs before the 'mouseup' and 'click' events.
    $('img').mousedown (e) ->
      lastImageClicked = e.target.src
      log "lastImageClicked: #{lastImageClicked}"
  
    # The 'click' event is not fired upon text selection, so detect mouseup.
    $(window).mouseup (event) ->
      whiff(event) if holdingShift
      
    # In some cases this is a superfluous whiff, as the whiffing done by the
    # preceding 'mouseup' saves the sniph. But we still need to capture
    # 'click' events so as to stop event propagation of links with images in 
    # them that have been shift-clicked.
    $(window).click (event) ->
      whiff(event) if holdingShift
  
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
