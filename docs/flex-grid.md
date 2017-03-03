# Flex Grid

#### Quick Start
```html
<div class="container">
  <div class="flex-row">
    <div class="flex-4">1/3 column</div>
    <div class="flex-4">1/3 column</div>
    <div class="flex-4">1/3 column</div>
  </div>
</div>
```

#### Auto Sizing

Add as many to this example and they will size accordingly
```html
<div class="container">
  <div class="flex-row">
    <div class="flex-grow flex-no-shrink">1/3 column</div>
    <div class="flex-grow flex-no-shrink">1/3 column</div>
    <div class="flex-grow flex-no-shrink">1/3 column</div>
  </div>
</div>
```

#### Grid Options

 | | Default | Small | Medium | Large | Extra large |
 | --- | --- | --- | --- | --- | --- |
 | Container width | None (auto) | 320px - 767px  | 768px - 1023px | 1024px - 1439px | 1440px - 100vw |
 | Class prefix | `.flex-` | `.flex-sm-` | `.flex-md-` | `.flex-lg-` | `.flex-xl-` |
 | # of columns | 12 | 12 | 12 | 12 | 12 |
 | Gutter width | 15px on each side | 15px on each side | 15px on each side | 15px on each side | 15px on each side |
 | Nestable | Yes | Yes | Yes | Yes | Yes |
 | Offsets | Yes | Yes | Yes | Yes | Yes |
 | Column ordering | Yes | Yes | Yes | Yes | Yes |
