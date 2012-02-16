# This is not currently used, but will become relevant when we start implementing 
# a "highlight sniphs on this page" feature

class Sniph

  constructor: (@url, @content, @title, @publique) ->

  words: ->
    @content.split(" ")
    
  contentPlain: ->
    $(@content).text()

  highlight: ->
    log "highlight: " + @content
    regex = new RegExp(@content, "g")
    
    # var new_body = $("body").html().replace(regex, 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
    # log(new_body);
		
    # $("body").html(new_body);
	
    # $("body").replaceWith(function() {
    # 	return $(this).html().replace(this.content, "<span style='background-color:yellow;'>" + this.content + "</span>");
    # });
		
    # $("p:contains('" + this.content_plain + "')").css({
    # 	backgroundColor: 'yellow'
    # });
		
    # $("p:contains('" + this.content_plain + "')").html(
    # 	$(this).html.replace(regex, 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
    # );
    
window.Sniph = Sniph