onSniphSave = (data) ->
  unless data?
    log "sniph not saved (empty/bad response)"
  else
    log data.msg
    if data.msg.toLowerCase() is "success"
      chrome.extension.sendRequest
        action: "notifySniphSaved"
        sniph: data.sniph
      , ->
        
highlightSniphs = (data) ->
  unless data?
    log "no sniphs found for this URL"
  else
    for i of data
      sniph = new Sniph(data[i].sniph)
      sniph.highlight()
      
whiff = (force) ->
  log "whiff"
  selection = getSelectionHtml()
  
  # Skip out if the selection is too short..
  return false if selection.length < config.sniph.min_length and not holdingShift
  
  # Skip out if this sniph was recently saved..
  if recentSniphs.indexOf(selection) isnt -1 and not holdingShift and not force
    log "duplicate sniph (skip)"
    return false
  else
    recentSniphs.push selection
    
  # There's something sniphable here. 
  # Tell background.html to add a context menu so user can force a sniph..
  unless alreadyCreatedContextMenu
    alreadyCreatedContextMenu = true
    chrome.extension.sendRequest
      action: "createContextMenu"
    , ->
      
  # Construct what will become the query string
  data = sniph:
    url: document.URL
    title: document.title
    content: selection

  # Pass a 'force' param if holding down shift (or if called by context menu)
  data.force = true if holdingShift or force

  # Send the request off to background.html, which can make Ajax requests..
  chrome.extension.sendRequest
    action: "saveSniph"
    data: data
  , onSniphSave
  
findSniphsForCurrentPage = ->
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
      
getCurrentTab = ->
  chrome.extension.sendRequest
    action: "getCurrentTab"
  , (tab) ->

# Keep track of recents so as not to re-save
recentSniphs = []
holdingShift = false
alreadyCreatedContextMenu = false

$(window).keydown (e) ->
  holdingShift = true  if e.keyCode is 16

$(window).keyup (e) ->
  holdingShift = false  if e.keyCode is 16

chrome.extension.onRequest.addListener (request, sender, sendResponse) ->
  switch request.action
    when "whiff_forcefully"
      whiff true
  sendResponse {}

# Bind the whiff action to mouseup
window.addEventListener "mouseup", ->
  whiff()

# Get the current tab any time one takes focus
window.addEventListener "focus", ->
  getCurrentTab()

# Get the current tab on page load
getCurrentTab()

findSniphsForCurrentPage()

# Check session status
# (Kick it off a little later so the request doesn't conflict with findSniphsForURL)
# TODO: Figure out why two overlapping Ajax requests fuck each other up.
setTimeout "chrome.extension.sendRequest({'action':'getSessionStatus'}, function(){});", config.sniph.find_sniphs_for_url_delay

# TODO: Insert a node into to page so the site can determine if the extension is installed