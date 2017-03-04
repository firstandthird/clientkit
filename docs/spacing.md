# Spacing

The spacing defaults below allow for the various combinations listed below. Essentially every possible combination of `margin` and `padding` can be combined with `top`, `right`, `bottom` or `left` and the defaults to acheive anything. There are special keywords (`xaxis` and `yaxis`) you can use, in lieu of individual directional attributes when you want spacing options on two different sizes.

#### Defaults

```yaml
  none: 0
  xl: 80px
  lg: 50px
  md: 30px
  sm: 20px
  xs: 10px
```

#### Example
```css
.margin-none { margin: 0; }
.margin-xl { margin: 80px; }
.margin-lg { margin: 50px; }
.margin-md { margin: 30px; }
.margin-sm { margin: 20px; }
.margin-xs { margin: 10px; }

.margin-top-none { margin-top: 0; }
.margin-top-xl { margin-top: 80px; }
.margin-top-lg { margin-top: 50px; }
.margin-top-md { margin-top: 30px; }
.margin-top-sm { margin-top: 20px; }
.margin-top-xs { margin-top: 10px; }

.margin-left-none { margin-left: 0; }
.margin-left-xl { margin-left: 80px; }
.margin-left-lg { margin-left: 50px; }
.margin-left-md { margin-left: 30px; }
.margin-left-sm { margin-left: 20px; }
.margin-left-xs { margin-left: 10px; }

.margin-right-none { margin-right: 0; }
.margin-right-xl { margin-right: 80px; }
.margin-right-lg { margin-right: 50px; }
.margin-right-md { margin-right: 30px; }
.margin-right-sm { margin-right: 20px; }
.margin-right-xs { margin-right: 10px; }

.margin-bottom-none { margin-bottom: 0; }
.margin-bottom-xl { margin-bottom: 80px; }
.margin-bottom-lg { margin-bottom: 50px; }
.margin-bottom-md { margin-bottom: 30px; }
.margin-bottom-sm { margin-bottom: 20px; }
.margin-bottom-xs { margin-bottom: 10px; }

.margin-xaxis-none { margin-left: 0; margin-right: 0; }
.margin-xaxis-xl { margin-left: 80px; margin-right: 80px; }
.margin-xaxis-lg { margin-left: 50px; margin-right: 50px; }
.margin-xaxis-md { margin-left: 30px; margin-right: 30px; }
.margin-xaxis-sm { margin-left: 20px; margin-right: 20px; }
.margin-xaxis-xs { margin-left: 10px; margin-right: 10px; }

.margin-yaxis-none { margin-top: 0; margin-bottom: 0; }
.margin-yaxis-xl { margin-top: 80px; margin-bottom: 80px; }
.margin-yaxis-lg { margin-top: 50px; margin-bottom: 50px; }
.margin-yaxis-md { margin-top: 30px; margin-bottom: 30px; }
.margin-yaxis-sm { margin-top: 20px; margin-bottom: 20px; }
.margin-yaxis-xs { margin-top: 10px; margin-bottom: 10px; }

.padding-none { padding: 0; }
.padding-xl { padding: 80px; }
.padding-lg { padding: 50px; }
.padding-md { padding: 30px; }
.padding-sm { padding: 20px; }
.padding-xs { padding: 10px; }

.padding-top-none { padding-top: 0; }
.padding-top-xl { padding-top: 80px; }
.padding-top-lg { padding-top: 50px; }
.padding-top-md { padding-top: 30px; }
.padding-top-sm { padding-top: 20px; }
.padding-top-xs { padding-top: 10px; }

.padding-left-none { padding-left: 0; }
.padding-left-xl { padding-left: 80px; }
.padding-left-lg { padding-left: 50px; }
.padding-left-md { padding-left: 30px; }
.padding-left-sm { padding-left: 20px; }
.padding-left-xs { padding-left: 10px; }

.padding-right-none { padding-right: 0; }
.padding-right-xl { padding-right: 80px; }
.padding-right-lg { padding-right: 50px; }
.padding-right-md { padding-right: 30px; }
.padding-right-sm { padding-right: 20px; }
.padding-right-xs { padding-right: 10px; }

.padding-bottom-none { padding-bottom: 0; }
.padding-bottom-xl { padding-bottom: 80px; }
.padding-bottom-lg { padding-bottom: 50px; }
.padding-bottom-md { padding-bottom: 30px; }
.padding-bottom-sm { padding-bottom: 20px; }
.padding-bottom-xs { padding-bottom: 10px; }

.padding-xaxis-none { padding-left: 0; padding-right: 0; }
.padding-xaxis-xl { padding-left: 80px; padding-right: 80px; }
.padding-xaxis-lg { padding-left: 50px; padding-right: 50px; }
.padding-xaxis-md { padding-left: 30px; padding-right: 30px; }
.padding-xaxis-sm { padding-left: 20px; padding-right: 20px; }
.padding-xaxis-xs { padding-left: 10px; padding-right: 10px; }

.padding-yaxis-none { padding-top: 0; padding-bottom: 0; }
.padding-yaxis-xl { padding-top: 80px; padding-bottom: 80px; }
.padding-yaxis-lg { padding-top: 50px; padding-bottom: 50px; }
.padding-yaxis-md { padding-top: 30px; padding-bottom: 30px; }
.padding-yaxis-sm { padding-top: 20px; padding-bottom: 20px; }
.padding-yaxis-xs { padding-top: 10px; padding-bottom: 10px; }

.spacing-xl { margin-bottom: 80px; }
.spacing-lg { margin-bottom: 50px; }
.spacing-md { margin-bottom: 30px; }
.spacing-sm { margin-bottom: 20px; }
.spacing-xs { margin-bottom: 10px; }
```
