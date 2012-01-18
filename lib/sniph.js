function Sniph(sniph_json) {

	this.url = sniph_json.url;
	this.content = sniph_json.content;
	this.title = sniph_json.title;
	this.publique = sniph_json.publique;
	this.words = this.content.split(' ');
	// this.content_plain = this.content.replace(/<\/?[^>]+(>|$)/g, "");
	this.content_plain = $(this.content).text();
	
	this.highlight = function() {
		log('highlight: ' + this.content);

		var regex = new RegExp(this.content, 'g');
		// var new_body = $("body").html().replace(regex, 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
		// log(new_body);
		
		// $("body").html(new_body);
	
		// $("body").replaceWith(function() {
		// 	return $(this).html().replace(this.content, "<span style='background-color:yellow;'>" + this.content + "</span>");
		// });
		
		// $("p:contains('" + this.content_plain + "')").css({
		// 	backgroundColor: 'yellow'
		// });
		
		// $("p:contains('" + this.content_plain + "')").html(
		// 	$(this).html.replace(regex, 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
		// );
		
	};
	
	return this;
}
