Sniphr Chrome Extension
=======================

Wishlist
--------

* Save "instance number" if selected text occurs multiple times on the page?
* Allow users to manually check for sniphs on the current page
* Add more links to options.html
* Handle icon style at load time and per-page
* Set up auto-updating: http://code.google.com/chrome/extensions/autoupdate.html

Development
-----------

Leave this running while developing:

```bash
coffee --watch --compile --output lib/ src/
```

* Set `config.debug.enabled` to `true`
* Update options.html's CSS path

Releases
--------

A few things to remember when preparing a release:

* Increment the version number
* Set `config.debug.enabled` to `false`
* Update options.html's CSS path


Gotchas
-------

* Google Chrome caches JS files, so the extension's HTML files that refer to 
	local js files might not notice updates. Dump the cache to resolve this.