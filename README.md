
Wishlist
--------

* Elephant trunk?
* Highlight sniphs, differentiating user's from the rest
* If username is not configured, prompt user for it
* Improve description text
* *.sniphr.com should be sniph-exempt
* Add public/private/disabled modes
* Save "instance number" if selected text occurs multiple times on the page?
* Allow users to manually check for sniphs on the current page
* Add a 'cancel' link to options
* Handle icon style at load time (in case mode is not public)
* Add a domain blacklist feature
* OmniAuth?

* Set up auto-updating: http://code.google.com/chrome/extensions/autoupdate.html

Before Releasing
----------------

* Set `config.debug.enabled` to `false`
* Update options.html's CSS path

Gotchas
-------

* Google Chrome caches JS files, so the extension's HTML files that refer to 
	local js files might not notice updates. Dump the cache to resolve this.

