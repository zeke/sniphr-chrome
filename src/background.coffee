saveSniph = (data, callback) ->
  url = config.host + "sniphs/save.json?" + $.param(data)
  
  # Not sure why, but apostrophes don't get URL-encoded by $.param
  url = url.replace(/'/g, "%27")

  log "saveSniph: #{url}"
    
  AjaxRequest url, callback
  
# Show a notification when sniphs are saved
notifySniphSaved = (sniph) ->
  notification = webkitNotifications.createNotification("images/icon_48.png", "Sniph!", $("<div>#{sniph.content}</div>").text())
  notification.show()
  setTimeout (->
    notification.cancel()
  ), config.sniph.notification_timeout

getSessionStatus = ->
  url = config.host + "session_status.json"
  AjaxRequest url, updateIcon

# If session status Ajax response contains a user,
# use user.mode to set icon path. Otherwise show disabled icon.
updateIcon = (data) ->
  if data.user
    path = "images/icon_" + data.user.mode + ".png"
  else
    path = "images/icon_disabled.png"
  chrome.browserAction.setIcon path: path

getCurrentTab = (callback) ->
  chrome.tabs.getSelected null, (tab) ->

    # Get the current URL (minus the fragment)
    url = tab.url.split("#")[0]
    
    # Store current URL in localStorage so the options page can access it
    # (Unless current URL is the Chrome options page)
    localStorage["last_url"] = url  if url.indexOf("chrome_options") is -1
    callback(tab)

createContextMenu = ->
  chrome.contextMenus.removeAll()
  chrome.contextMenus.create
    title: config.context_menu.title
    contexts: [ "all" ]
    onclick: (event) ->
      # This is the only way to get the message across to the content script
      chrome.tabs.getSelected null, (tab) ->
        chrome.tabs.sendRequest tab.id, {action: "whiffFromContextMenu", event:event}, (response) ->

findSniphsForURL = (url, callback) ->
  log "findSniphsForURL " + url

  # e.g. 'q=http://example.com/foo
  query = q: url
  url = config.host + "sniphs.json?" + $.param(query)
  AjaxRequest url, callback

# Handles data sent via chrome.extension.sendRequest().
onRequest = (request, sender, callback) ->
  switch request.action
    when "saveSniph"
      saveSniph(request.data, callback)
    when "createContextMenu"
      createContextMenu()
    when "getCurrentTab"
      log 'bout to get that current tab'
      getCurrentTab(callback)
    when "findSniphsForURL"
      findSniphsForURL(request.url, callback)
    when "notifySniphSaved"
      notifySniphSaved(request.sniph)
    when "getSessionStatus"
      getSessionStatus()

chrome.extension.onRequest.addListener onRequest