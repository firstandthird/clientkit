# Print

Printing with Clientkit takes some basic reset from [HTML5 Boilerplate](https://github.com/h5bp/html5-boilerplate/blob/master/src/css/main.css).
All elements are stripped of color styling, while text links and abbr have their
attributes printed alongside. Other than a few more elements that get reset,
there are a few helpers added to allow you to chose which elements are printed
and which are not.

#### Example
```html
<p class="show-print-block">print only as block level, won't show on any other media type</p>
<p class="show-print-inline">print only as inline level, won't show on any other media type</p>
<p class="show-print-inline-block">print only as inline-block level, won't show on any other media type</p>
<p class="hide-print">hides print only, will show on any other media type</p>
```
