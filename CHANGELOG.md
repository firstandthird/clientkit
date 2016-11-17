
1.0.0-alpha.4 / 2016-11-16
==================

  * updated tests
  * updated to use separate clientkit-task repo

1.0.0-alpha.3 / 2016-11-16
==================

  * eslint error
  * create dist directory

1.0.0-alpha.2 / 2016-11-16
==================

  * fixed error logging

1.0.0-alpha.1 / 2016-11-16
==================

  * refactor into generic task runner
    * update ck env to use watcher
    * added option to pass in ignore to watcher
    * added body font weight to vars
    * moved changed font-light to font-weight-light and updated vars
    * removed secondary color
    * updated color variables to use accent1, accent2 and removed primary
    * update snapshot
    * added ck env for creating snapshots
    * refactored config so it wasn't so nested, tweaked to eslint task
    * added demo folder for testing
    * specific versions for each dep
    * added dist to npmignore
    * remove .vscode
    * Merge pull request #150 from firstandthird/refactor_css_source_maps
    * update conf files, integrate into new app
    * update runtask dep
    * add 'use strict' for node 4/5 compatibility
    * comment out outdated tests for now
    * eslint ClientKitTask
    * fixed dev mode
    * synced with latest master branch
    * unit tests
    * better log
    * fixed script building
    * updates to config
    * better check for legacy config
    * throw error if using old style config
    * move all logging to base task
    * cleaned up commented code
    * updated config for scripts and watcher
    * auto load tasks from the config file, refactored config
    * renamed js.js to scripts.js
    * removed commands directory
    * remove workaround code for watcher
    * remove old watcher task
    * increase rebuild delay
    * removed write by default, added to css and js
    * added watcher
    * added js task
    * added auto prefixer config
    * Merge branch 'master' into refactor
    * check in clientkit.css so we can easily see changes from version to version
    * initial work on task running refactor

0.21.0 / 2016-11-06
==================

  * make size optional
  * use mobile only media query for mobile typography size
  * use native font stack by default
  * Add text cursor to read only input
  * Add easing config
  * Add new breakpoints

0.20.0 / 2016-10-07
==================

  * fixes for icon mixin
  * Add style for disable buttons

0.19.0 / 2016-10-03
==================

  * fixed spacing mixin for other breakpoints
  * update depedencies
  * remove ^ in deps. we'll just manually upgrade deps regularly
  * mobile font sizes
  * flex grid fixes

0.18.0 / 2016-09-22
==================

  * mental mqpacker sort

0.17.0 / 2016-09-20
==================

  * relative path for watcher
  * only shows relative path to cwd() when logging process css/js files
  * updated to always use basename for js files

0.16.0 / 2016-09-19
==================

  * modal fixes
  * switching menu-slide to be an opt in - so the site can wrap in a media query if it wants
  * linting fixes
  * added browserify-shim to allow for legacy libraries to be added

0.15.0 / 2016-09-16
==================

  * added option for setting autoprefixer browsers. added ios 8,9 by default
  * shows file size in bytes for output files

0.14.0 / 2016-09-13
==================

  * updated theme to 4.0.0
  * added some text so clientkit doesn't output warnings
  * splits eslint process into its own task
  * added modal helper
  * added heights to examples
  * Move transitions to vars
  * Create mobile menu helper/mixin
  * update postcss-mixins, make mixins/*.css global
  * watch files in dev
  * backwards compatible for dev
  * Update mixin docs for buttons
  * Update to fix tooltip animations
  * uses --watch or core.watchActive to determine whether to use 'watch' mode
  * add --env option for loading env
  * Create a text color mixin
  * Create button sizes
  * Create dropdown helper
  * Create input group
  * Update to fix the heading sizes, add in a new one
  * Creating flex-grid

0.13.0 / 2016-09-06
==================

  * update doc order
  * updated mdcss theme
  * moved typography last
  * hashes output urls
  * Create default style helper for <hr />
  * supports 'sectionOrder' for docs
  * Create triangle mixin and helper
  * Update grid to include docs
  * Create color helpers for text
  * Update to add spacing docs
  * Update; add in docs for print
  * notifies user of any new updates to clientkit

0.12.0 / 2016-09-02
==================

  * update hide/show helper classes to be important

0.11.0 / 2016-09-02
==================

  * updated mdcss theme
  * update variable names
  * css task now passes npm version info to styleguide
  * line height doesn't need to be nested
  * lets config.vars be recursively nested and joins the nested keys with '-'
  * removes 'styleguide' from being generated
  * reorganized docs
  * up'd theme
  * border helpers

0.10.0 / 2016-08-30
==================

  * reset h tags to 0 margin

0.9.1 / 2016-08-30
==================

  * updated eslint config
  * fixed ghpages script

0.9.0 / 2016-08-24
==================

  * added helper for font-body
  * added variable for heading font weight
  * fixed section name for message mixin
  * removed example from message mixin
  * check if message.text before logging
  * fixed warning
  * Update to use new helpers style
  * Update to change to px
  * Add 100% width to select
  * removed old examples
  * use message.type for log tag
  * added plugin name to message log
  * fixed some errors
  * added bottom element to clearfix example to show that it works
  * added requirement to add a screenshot of docs in PR template
  * added message helpers and mixins
  * Remove failing button test
  * Remove failing link test
  * Remove broken input test
  * Convert input mixin
  * Update; convert row-carousel mixin to use helper
  * Update gitignore to add test/.dist
  * Delete broken tests for old font-styles mixin
  * Delete unneeded tests
  * Update; convert list mixin to helper
  * Shows errors and warnings.
  * Update with new vars and docs
  * Convert link mixin
  * Convert button mixin
  * updated heading line height
  * Create; helper for table with various properties
  * Switch clearfix helper to be css
  * removed typography from examples (now in styleguide)
  * updated mdcss theme
  * updates to get rid of typography.yaml
  * separated headings mixin to separate file
  * Update all examples to use new dist dir
  * Update all tasks to point to new dist dir
  * Update; change configs to use new dist dir
  * updated ugc to use new mixin
  * fixed mobile variable in headings
  * added mobile size for headings
  * initial work on migrating away from font-styles
  * Update; order of col-plain matters
  * Update; add unit tests
  * Update; set up col-plain to be responsive
  * Update to include exmaple
  * Update; convert helper to all mixin based
  * Update; fix the small spacing on arrow
  * Update; fix to show the triangle correctly
  * Update to add in missing styles
  * Update; checked in wrong file previously
  * Create; initial version of triangles

0.8.0 / 2016-08-22
==================

  * option for running babel globally
  * better error messages for scripts
  * Add !important to hide class

0.7.0 / 2016-08-19
==================

  * add local clientkit folder to import path
  * added a way to disable docs/styleguide. moved input filename to docs conf
  * full variable list
  * better grouping for typography
  * updated mdcss theme
  * updated ghpages script
  * switch mdcss theme to custom clientkit theme
  * ugc docs
  * updated run scripts to use new docs
  * typography docs
  * updated ghpages scripts
  * ghpages publish dist instead of examples
  * update to output styleguide into dist folder
  * initial work on auto documentation/styleguide with mdcss
  * updated out-of-date unit tests

0.6.0 / 2016-08-17
==================

  * docker push script
  * updated dockerfile to use node 6

0.5.0 / 2016-08-17
==================

  * css.map files are written to their correct output name
  * updated print helper class names to match other hide/show classes
  * support for local files
  * added vertical align middle to icons mixin
  * changed print-stacked class
  * added print helpers
  * added icon mixin
  * ugc - fixed padding on ol and ul
  * ugc - added spacing on bottom of ul, ol
  * ugc - table headers align left
  * updated ugc example
  * ugc - only disc for ul
  * changed ugc spacing for h tags to md
  * Update; fix tests and config properties
  * Merge branch 'master' into text-stretch
  * Update; allow the text-stretch to be passed in
  * Create; mixin and helper for text-stretch
