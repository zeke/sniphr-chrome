Sniphr Chrome Extension
=======================

This is the source code for the sniphr.com chrome extension.

* Check out [sniphr.com](http://sniphr.com).
* Report bugs on the [pivotal](https://www.pivotaltracker.com/projects/473843) project.

Development
-----------

The only development dependency is the CoffeeScript compiler. To install it, 
check out [coffeescript.org/#installation](http://coffeescript.org/#installation)

```bash
# Watch the /src dir for changes and autocompile them to /lib
coffee -o lib/ -cw src/
```

* Set `config.debug.enabled` to `true`

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