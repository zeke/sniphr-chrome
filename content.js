console.log('s n i p h');

function injectJs(link) {
	var scr = document.createElement("script");
	scr.type="text/javascript";
	scr.src=link;
	(document.head || document.body || document.documentElement).appendChild(scr);
}

injectJs('http://ajax.googleapis.com/ajax/libs/jquery/1.5.1/jquery.min.js');
injectJs(chrome.extension.getURL("inject.js"));


