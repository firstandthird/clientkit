# Grid

#### Variables

```yaml
  grid-columns: 12
  grid-gutters: 15px
```

#### Breakpoints

```yaml
  desktop-wide:
    max-width: 100vw
    min-width: 1440px
    content: 1440px
    col: xl
    default: '{{!core.mobileFirst}}'
    bleed: 1600px
  desktop:
    max-width: 1439px
    min-width: 1024px
    content: 1024px
    col: lg
  tablet:
    max-width: 1023px
    min-width: 768px
    content: 768px
    col: md
  mobile:
    max-width: 767px
    min-width: 320px
    content: 100%
    col: sm
```

#### Quick Start

```html
<div class="container">
  <div class="row">
    <div class="col-4">1/3 column</div>
    <div class="col-4">1/3 column</div>
    <div class="col-4">1/3 column</div>
  </div>
</div>
```

#### Grid Options

 | | Default | Small | Medium | Large | Extra large |
 | --- | --- | --- | --- | --- | --- |
 | Container width | None (auto) | 320px - 767px  | 768px - 1023px | 1024px - 1439px | 1440px - 100vw |
 | Class prefix | `.col-` | `.col-sm-` | `.col-md-` | `.col-lg-` | `.col-xl-` |
 | # of columns | 12 | 12 | 12 | 12 | 12 |
 | Gutter width | 15px on each side | 15px on each side | 15px on each side | 15px on each side | 15px on each side |
 | Nestable | Yes | Yes | Yes | Yes | Yes |
 | Offsets | Yes | Yes | Yes | Yes | Yes |
 | Column ordering | Yes | Yes | Yes | Yes | Yes |
