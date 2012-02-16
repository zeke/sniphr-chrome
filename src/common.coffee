window.log = ->
  console.log.apply console, arguments  if window.console and config.debug.enabled
  
window.AjaxRequest = (url, callback) ->
  @xhr = new XMLHttpRequest()
  @url = url
  @callback = callback
  @xhr.onreadystatechange = (data) ->
    if xhr.readyState is 4
      if xhr.status is 200
        data = JSON.parse(xhr.responseText)
        callback data
      else
        callback null

  @xhr.open "GET", @url, true
  @xhr.send()

# A cross-browser compatible function to fetch the HTML (not just the text) of the current selection..
# http://stackoverflow.com/questions/4176923/html-of-selected-text
window.getSelectionHtml = ->
  html = ""
  unless typeof window.getSelection is "undefined"
    sel = window.getSelection()
    if sel.rangeCount
      container = document.createElement("div")
      i = 0
      len = sel.rangeCount

      while i < len
        container.appendChild sel.getRangeAt(i).cloneContents()
        ++i
      html = container.innerHTML
  else html = document.selection.createRange().htmlText  if document.selection.type is "Text"  unless typeof document.selection is "undefined"
  html
  
window.Sniphr = {}