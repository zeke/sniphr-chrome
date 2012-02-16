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

Git Pivotal
-----------

[git-pivotal](https://github.com/trydionel/git-pivotal) is a collection of git utilities 
to ease integration with Pivotal Tracker.
  
```bash

gem install git-pivotal

# https://www.pivotaltracker.com/help/api?version=v3#retrieve_token_basic_auth
curl -u YOUR_USERNAME:YOUR_PASSWORD -X GET https://www.pivotaltracker.com/services/v3/tokens/active
git config --global pivotal.api-token YOUR_API_TOKEN
git config --global pivotal.full-name "Joe Blow"
git config --global pivotal.only-mine true

cd path/to/sniphr-chrome
git config -f .git/config pivotal.project-id 473843 # <-- sniphr-chrome project id
```

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